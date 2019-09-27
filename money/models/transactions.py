from dateutil.tz import tzutc

from . import db


class Transactions(db.Model):  # type: ignore
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

    def __init__(self,
                 when: str,
                 quotas: int,
                 price: float,
                 transaction_type: str,
                 assets_id: int) -> None:
        self.when = when
        self.quotas = quotas
        self.price = price
        self.transaction_type = transaction_type
        self.assets_id = assets_id

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
