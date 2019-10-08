from datetime import datetime

from dateutil.tz import tzlocal
from flask import request
from flask_restful import Resource
from sqlalchemy.exc import SQLAlchemyError

from models import Assets, Transactions, db
from utils import HistoricalCalculator, Prices

from . import api


@api.resource('/wallet/assets/<int:asset_id>')
class AssetsCRUD(Resource):
    def get(self, asset_id: int):
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

        return asset, 200

    def put(self, asset_id: int):
        return self.update_asset(asset_id)

    def patch(self, asset_id: int):
        return self.update_asset(asset_id)

    def delete(self, asset_id: int):
        try:
            asset = Assets.query.get(asset_id)
            if asset is None:
                return "", 404

            db.session.delete(asset)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            # app.logger.error("Unknown SQLAlchemy error", exc_info=True)
            raise

        return asset.to_dict(), 200

    def update_asset(self, asset_id: int):
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
            # app.logger.error('Unknown SQLAlchemy error.', exc_info=True)
            raise

        return asset.to_dict(), 200


@api.resource('/wallet/assets')
class AssetsController(Resource):
    def get(self):
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

        return assets, 200

    def post(self):
        asset = Assets(**request.get_json(silent=True))

        try:
            db.session.add(asset)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            # app.logger.error("Unknown SQLAlchemy error.", exc_info=True)
            raise

        return asset.to_dict(), 201


# TODO: Insert IOF + Taxes in Selic benchmark
@api.resource('/wallet/assets/<int:asset_id>/analysis/benchmark')
class AssetsBenchmark(Resource):
    def get(asset_id: int):
        asset = Assets.query.get(asset_id)
        if asset is None:
            return "", 404

        first_transaction = min(asset.transactions, key=lambda t: t.when)
        begin_date = first_transaction._when.astimezone(tzlocal())
        end_date = datetime.now().replace(tzinfo=tzlocal())

        selic = Prices.historical_selic(begin_date, end_date)
        ipca = Prices.historical_ipca(begin_date, end_date)

        asset_price = Prices.historical_asset(
            asset.symbol, begin_date, end_date)
        asset_pct = HistoricalCalculator.percent_change(asset_price)

        return HistoricalCalculator.inflation_correction(asset_pct, ipca)
