from datetime import datetime

from dateutil.tz import tzlocal, tzutc
from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from scipy.optimize import minimize_scalar
from sqlalchemy.exc import SQLAlchemyError

from utils import HistoricalCalculator, Prices

app = Flask(__name__, static_folder='build/static', template_folder='build')
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://postgres:postgres@localhost/money'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
db = SQLAlchemy(app)


# https://pt.stackoverflow.com/questions/188910/api-banco-central-ipca-e-selic


class Assets(db.Model):
    __tablename__ = 'assets'

    assets_id = db.Column(db.Integer, primary_key=True)
    _symbol = db.Column('symbol', db.String(10))
    _name = db.Column('name', db.String(256))

    transactions = db.relationship('Transactions', back_populates='asset')

    def __init__(self, symbol: str, name: str) -> None:
        self.symbol = symbol
        self.name = name

    @property
    def symbol(self) -> str:
        return self._symbol

    @symbol.setter
    def symbol(self, value: str) -> None:
        self._symbol = value.strip().upper()

    @property
    def name(self) -> str:
        return self._name

    @name.setter
    def name(self, value: str) -> None:
        self._name = value.strip()

    def __repr__(self) -> str:
        return f"Assets(id={self.id},\
            symbol={self._symbol},\
            name={self._name})"

    def to_dict(self):
        return {
            'asset_id': self.assets_id,
            'symbol': self._symbol,
            'name': self._name
        }


# TODO: Add relationships between this model and the Assets' model
class Transactions(db.Model):
    __tablename__ = 'transactions'

    transaction_id = db.Column(db.Integer, primary_key=True)
    _when = db.Column('when', db.TIMESTAMP(), nullable=False)
    quotas = db.Column(db.Integer, nullable=False)
    _price = db.Column('price', db.BIGINT(), nullable=False)
    _transaction_type = db.Column(
        'transaction_type', db.String(1), nullable=False)
    assets_id = db.Column(db.Integer, db.ForeignKey(
        'assets.assets_id'), nullable=False)

    asset = db.relationship('Assets', back_populates='transactions')

    def __init__(self, when: str, quotas: int, price: float, transaction_type: str, asset_id: int) -> None:
        self.when = when
        self.quotas = quotas
        self.price = price
        self.transaction_type = transaction_type
        self.assets_id = asset_id

    def __repr__(self) -> str:
        return f"Transactions(id={self.transaction_id},\
            when={self.when},\
            quotas={self.quotas},\
            price={self.price},\
            transaction_type={self.transaction_type},\
            asset_id={self.assets_id})"

    @property
    def price(self) -> float:
        return round(self._price / 1e9, 2)

    @price.setter
    def price(self, value: float) -> None:
        self._price = int(value * 100) * 10_000_000

    @property
    def when(self) -> str:
        if self._when.tzinfo is None:
            return self._when.replace(tzinfo=tzutc()).isoformat(timespec='seconds')
        return self._when.astimezone(tzutc()).isoformat(timespec='seconds')

    @when.setter
    def when(self, value: str) -> None:
        timestamp = datetime.fromisoformat(value)
        if timestamp.tzinfo is None:
            self._when = timestamp.replace(tzinfo=tzutc())
        self._when = timestamp.astimezone(tzutc())

    @property
    def transaction_type(self) -> str:
        return self._transaction_type

    @transaction_type.setter
    def transaction_type(self, value: str) -> None:
        value = value.strip().upper()

        if value not in "BS":
            raise ValueError(
                "TransactionType must be B (for BUY) or S (for SELL)")
        self._transaction_type = value

    def to_dict(self):
        return {
            'transaction_id': self.transaction_id,
            'when': self.when,
            'quotas': self.quotas,
            'price': self.price,
            'transaction_type': self.transaction_type,
            'asset': self.asset.to_dict()
        }


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

    invested = db.func.round(db.func.sum(Transactions._price / 1e9 * Transactions.quotas), 2)
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
    asset_id = Transactions.assets_id
    quotas = db.func.sum(Transactions.quotas).label('quotas')

    avg_price = db.func.round(db.func.avg(Transactions._price / 1e9), 2)
    avg_price = db.cast(avg_price, db.Float).label('avgPrice')

    max_price = db.func.round(db.func.max(Transactions._price / 1e9), 2)
    max_price = db.cast(max_price, db.Float).label('maxPrice')

    invested = db.func.round(db.func.sum(Transactions._price / 1e9 * Transactions.quotas), 2)
    invested = db.cast(invested, db.Float).label('invested')

    subquery = db.session.query(asset_id, quotas, avg_price, max_price, invested)\
        .group_by(Transactions.assets_id)\
        .subquery()
    
    name = Assets._name.label('name')
    symbol = Assets._symbol.label('symbol')
    assets = db.session.query(subquery, name, symbol)\
                       .filter(subquery.c.assets_id == asset_id)\
                       .one_or_none()

    if asset is None:
        return "", 404
    return jsonify(asset.to_dict()), 200


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
    except SQLAlchemy:
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
    except SQLAlchemy:
        db.session.rollback()
        app.logger.error("Unknown SQLAlchemy error", exc_info=True)
        raise

    return jsonify(asset.to_dict()), 200


@app.route('/wallet/transactions', methods=['POST'])
def insert_transaction():
    transaction = Transactions(**request.get_json(silent=True))

    try:
        db.session.add(transaction)
        db.session.commit()
    except SQLAlchemy:
        db.session.rollback()
        app.logger.error('Unknow SQLAlchemy error.', exc_info=True)
        raise

    return jsonify(transaction.to_dict()), 201


@app.route('/wallet/transactions', methods=['GET'])
def list_transactions():
    transactions = [item.to_dict() for item in Transactions.query.all()]

    return jsonify(transactions), 200


@app.route('/wallet/transactions/<int:transaction_id>', methods=['GET'])
def get_transaction_by_id(transaction_id: int):
    transaction = Transactions.query.get(transaction_id)

    if transaction is None:
        return "", 404
    return jsonify(transaction.to_dict()), 200


@app.route('/wallet/transactions/<int:transaction_id>', methods=['PUT', 'PATCH'])
def update_transaction(transaction_id: int):
    transaction = Transactions.query.get(transaction_id)
    body = request.get_json(silent=True)

    if transaction is None:
        return "", 404

    if 'when' in body:
        transaction.when = body['when']
    if 'quotas' in body:
        transaction.quotas = body['quotas']
    if 'price' in body:
        transaction.price = body['price']
    if 'transaction_type' in body:
        transaction.transaction_type = body['transaction_type']

    try:
        db.session.add(transaction)
        db.session.commit()
    except SQLAlchemy:
        db.session.rollback()
        app.logger.error('Unknown SQLAlchemy error.', exc_info=True)
        raise

    return jsonify(transaction.to_dict()), 200


@app.route('/wallet/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id: int):
    try:
        transaction = Transactions.query.get(transaction_id)
        if transaction is None:
            return "", 404

        db.session.delete(transaction)
        db.session.commit()
    except SQLAlchemy:
        db.session.rollback()
        app.logger.error('Unknown SQLAlchemy error.', exc_info=True)
        raise

    return jsonify(transaction.to_dict()), 200


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
    app.run(debug=True)
