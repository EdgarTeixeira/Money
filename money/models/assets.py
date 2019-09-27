from . import db


class Assets(db.Model):  # type: ignore
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
