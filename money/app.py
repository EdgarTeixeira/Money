from datetime import datetime

from dateutil.tz import tzlocal
from flask import Flask, jsonify, render_template, request
from scipy.optimize import minimize_scalar
from sqlalchemy.exc import SQLAlchemyError

from models import Assets, Transactions, db
from utils import HistoricalCalculator, Prices


def create_application():
    from models import db
    from controllers import api

    app = Flask(__name__, static_folder='build/static',
                template_folder='build')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://postgres:postgres@localhost/money'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = False

    db.init_app(app)
    api.init_app(app)

    return app


app = create_application()


# https://pt.stackoverflow.com/questions/188910/api-banco-central-ipca-e-selic


# TODO: Add taxes to calculations
# TODO: Add inflation to calculations
@app.route('/calculator/returns', methods=['POST'])
def calculate_returns():
    body = request.get_json(silent=True)

    if body is None:
        return "Error", 400

    current_value = body['initial_value']
    time = [0]
    returns = [0]
    balance = [current_value]
    total_invested = [current_value]

    for i in range(body['months']):
        current_value *= 1 + body['returns'] / 100
        current_value += body['monthly_income']

        time.append(i + 1)
        balance.append(round(current_value, 2))
        total_invested.append(
            round(body['monthly_income'] + total_invested[-1], 2))

        ret = 1 - total_invested[-1] / balance[-1]
        returns.append(round(ret * 100, 4))

    output = {
        'time': time,
        'balance': balance,
        'total_invested': total_invested,
        'returns': returns
    }

    return jsonify(output)


# TODO: Add taxes to calculations
# TODO: Add inflation to calculations
@app.route('/calculator/planning', methods=['POST'])
def get_plan():
    body = request.get_json(silent=True)

    if body is None:
        return "Error", 400

    goal = body['goal']

    if 'returns' not in body:
        initial_value = body['initial_value']
        months = body['months']
        monthly_income = body['monthly_income']

        def loss_func(r):
            r = 1 + r / 100
            a1 = initial_value * pow(r, months - 1)

            k = (1 - pow(r, months - 1)) / (1 - r)
            a2 = monthly_income * k

            res = a1 + a2
            return abs(res - goal)

        result = minimize_scalar(loss_func,
                                 bounds=[1e-4, 1000],
                                 method='bounded',
                                 options={'maxiter': 1000})

        if result.success:
            return jsonify({'returns': round(result.x, 4)})
        return jsonify({'failure': True})

    elif 'months' not in body:
        current_value = body['initial_value']

        if goal <= current_value:
            return jsonify({'months': 0})

        months = 1
        while current_value < goal:
            current_value *= 1 + body['returns'] / 100
            current_value += body['monthly_income']
            months += 1
        return jsonify({'months': months - 1})

    elif 'monthly_income' not in body:
        returns = 1 + body['returns'] / 100
        months = body['months']

        first_component = body['initial_value'] * pow(returns, months - 1)
        second_component = (1 - pow(returns, months - 1)) / (1 - returns)
        monthly_income = (goal - first_component) / second_component

        return jsonify({'monthly_income': round(monthly_income, 2)})

    elif 'initial_value' not in body:
        returns = 1 + body['returns'] / 100
        months = body['months']

        first_component = (1 - pow(returns, months - 1)) / (1 - returns)
        second_component = pow(returns, months - 1)
        third_component = body['monthly_income'] * first_component
        initial_value = (goal - third_component) / second_component

        return jsonify({'initial_value': round(initial_value, 2)})

    return "SUCCESS"


@app.route('/wallet/assets', methods=['POST'])
def insert_assets():
    asset = Assets(**request.get_json(silent=True))

    try:
        db.session.add(asset)
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        app.logger.error("Unknown SQLAlchemy error.", exc_info=True)
        raise

    return jsonify(asset.to_dict()), 201


@app.route('/wallet/assets', methods=['GET'])
def list_assets():
    asset_id = Transactions.assets_id
    quotas = db.func.sum(Transactions.quotas).label('quotas')

    avg_price = db.func.round(db.func.avg(Transactions._price / 1e9), 2)
    avg_price = db.cast(avg_price, db.Float).label('avgPrice')

    max_price = db.func.round(db.func.max(Transactions._price / 1e9), 2)
    max_price = db.cast(max_price, db.Float).label('maxPrice')

    invested = db.func.round(db.func.sum(
        Transactions._price / 1e9 * Transactions.quotas), 2)
    invested = db.cast(invested, db.Float).label('invested')

    subquery = db.session.query(asset_id, quotas, avg_price, max_price, invested)\
        .group_by(Transactions.assets_id)\
        .subquery()

    name = Assets._name.label('name')
    symbol = Assets._symbol.label('symbol')
    assets = db.session.query(subquery, name, symbol)\
                       .filter(subquery.c.assets_id == Assets.assets_id)\
                       .all()

    prices = Prices.current_asset([asset.symbol for asset in assets])
    assets = [asset._asdict() for asset in assets]

    for idx in range(len(assets)):
        ticker = assets[idx]['symbol']
        assets[idx]['price'] = prices[ticker]

    return jsonify(assets), 200


@app.route('/wallet/assets/<int:asset_id>', methods=['GET'])
def get_asset_by_id(asset_id: int):
    assets_id = Transactions.assets_id
    quotas = db.func.sum(Transactions.quotas).label('quotas')

    avg_price = db.func.round(db.func.avg(Transactions._price / 1e9), 2)
    avg_price = db.cast(avg_price, db.Float).label('avgPrice')

    max_price = db.func.round(db.func.max(Transactions._price / 1e9), 2)
    max_price = db.cast(max_price, db.Float).label('maxPrice')

    invested = db.func.round(db.func.sum(
        Transactions._price / 1e9 * Transactions.quotas), 2)
    invested = db.cast(invested, db.Float).label('invested')

    subquery = db.session.query(assets_id, quotas, avg_price, max_price, invested)\
        .group_by(Transactions.assets_id)\
        .having(Transactions.assets_id == asset_id)\
        .subquery()

    name = Assets._name.label('name')
    symbol = Assets._symbol.label('symbol')
    asset = db.session.query(subquery, name, symbol)\
                      .filter(subquery.c.assets_id == Assets.assets_id)\
                      .one_or_none()

    if asset is None:
        return "", 404

    price = Prices.current_asset(asset.symbol)
    asset = asset._asdict()
    asset['price'] = price[asset['symbol']]

    return jsonify(asset), 200


@app.route('/wallet/assets/<int:asset_id>', methods=['PUT', 'PATCH'])
def update_asset(asset_id: int):
    asset = Assets.query.get(asset_id)
    body = request.get_json(silent=True)

    if asset is None:
        return "", 404

    if 'symbol' in body:
        asset.symbol = body['symbol']
    if 'name' in body:
        asset.name = body['name']

    try:
        db.session.add(asset)
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        app.logger.error('Unknown SQLAlchemy error.', exc_info=True)
        raise

    return jsonify(asset.to_dict()), 200


@app.route('/wallet/assets/<int:asset_id>', methods=['DELETE'])
def delete_asset(asset_id: int):
    try:
        asset = Assets.query.get(asset_id)
        if asset is None:
            return "", 404

        db.session.delete(asset)
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        app.logger.error("Unknown SQLAlchemy error", exc_info=True)
        raise

    return jsonify(asset.to_dict()), 200


# TODO: Insert IOF + Taxes in Selic benchmark
@app.route('/wallet/assets/<int:asset_id>/analysis/benchmark', methods=['GET'])
def get_asset_benchmark(asset_id: int):
    asset = Assets.query.get(asset_id)
    if asset is None:
        return "", 404

    first_transaction = min(asset.transactions, key=lambda t: t.when)
    begin_date = first_transaction._when.astimezone(tzlocal())
    end_date = datetime.now().replace(tzinfo=tzlocal())

    selic = Prices.historical_selic(begin_date, end_date)
    ipca = Prices.historical_ipca(begin_date, end_date)

    asset_price = Prices.historical_asset(asset.symbol, begin_date, end_date)
    asset_pct = HistoricalCalculator.percent_change(asset_price)

    return jsonify(HistoricalCalculator.inflation_correction(asset_pct, ipca))


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=False)
