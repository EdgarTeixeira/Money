from flask import request
from flask_restful import Resource
from sqlalchemy.exc import SQLAlchemyError

from money.models import Assets, Transactions, db

from . import api


@api.resource('/wallet/transactions/<int:transaction_id>')
class TransactionsCRUD(Resource):
    """Transactions CRUD"""

    def get(self, transaction_id: int):
        id = Transactions.transaction_id
        symbol = Assets._symbol.label('assetSymbol')
        name = Assets._name.label('assetName')
        quotas = Transactions.quotas
        transaction_type = Transactions._transaction_type.label(
            'transactionType')
        price = db.cast(db.func.round(
            (Transactions._price / 1e9), 2), db.Float).label('price')

        transaction = db.session.query(id,
                                       symbol,
                                       name,
                                       quotas,
                                       transaction_type,
                                       price)\
            .filter(Transactions.transaction_id == transaction_id)\
            .one_or_none()

        if transaction is None:
            return "", 404
        return transaction._asdict(), 200

    def delete(self, transaction_id: int):
        try:
            transaction = Transactions.query.get(transaction_id)
            if transaction is None:
                return "", 404

            response = transaction.to_dict()

            db.session.delete(transaction)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            raise

        return response, 200

    def patch(self, transaction_id: int):
        self.update_transaction(transaction_id)

    def put(self, transaction_id: int):
        self.update_transaction(transaction_id)

    def update_transaction(self, transaction_id: int):
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
        except SQLAlchemyError:
            db.session.rollback()
            raise

        response = {
            "assetName": transaction.asset.name,
            "assetSymbol": transaction.asset.symbol,
            "price": transaction.price,
            "quotas": transaction.quotas,
            "transactionType": transaction.transaction_type,
            "transaction_id": transaction.transaction_id
        }

        return response, 200


@api.resource('/wallet/transactions')
class TransactionsController(Resource):
    def post(self):
        body = request.get_json(silent=True)

        # "Upsert" asset if name is available
        asset = db.session.query(Assets)\
            .filter(Assets._symbol == body['ticket'])\
            .one_or_none()

        if asset is None:
            name = body['ticket'] if body['asset_name'] == "" else body['asset_name']
            asset = Assets(body['ticket'], name)
            db.session.add(asset)
        elif body['asset_name'] != asset.name and body['asset_name'] != "":
            asset.name = body['asset_name']
            db.session.add(asset)

        transaction = Transactions(when=body['transaction_date'].replace(" ", ""),
                                   quotas=body['quantity'],
                                   price=body['price'],
                                   transaction_type=body['transaction_type'],
                                   assets_id=None)
        transaction.asset = asset
        db.session.add(transaction)

        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            raise

        response = {
            "assetName": transaction.asset.name,
            "assetSymbol": transaction.asset.symbol,
            "price": transaction.price,
            "quotas": transaction.quotas,
            "transactionType": transaction.transaction_type,
            "transaction_id": transaction.transaction_id
        }

        return response, 201

    def get(self):
        id = Transactions.transaction_id
        symbol = Assets._symbol.label('assetSymbol')
        name = Assets._name.label('assetName')
        quotas = Transactions.quotas
        transaction_type = Transactions._transaction_type.label(
            'transactionType')
        price = db.cast(db.func.round(
            (Transactions._price / 1e9), 2), db.Float).label('price')

        transactions = db.session.query(id,
                                        symbol,
                                        name,
                                        quotas,
                                        transaction_type,
                                        price)\
            .select_from(Assets)\
            .join(Transactions)\
            .all()

        return [t._asdict() for t in transactions], 200
