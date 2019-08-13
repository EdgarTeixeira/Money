"""create core tables: investments, transactions, transaction_types

Revision ID: 3c5fa9838e12
Revises: 
Create Date: 2019-07-17 02:23:55.768774+00:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3c5fa9838e12'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('assets',
                    sa.Column('assets_id', sa.Integer, primary_key=True),
                    sa.Column('symbol', sa.String(10), nullable=False, unique=True),
                    sa.Column('name', sa.String(256), nullable=False))

    op.create_table('transactions',
                    sa.Column('transaction_id', sa.Integer, primary_key=True),
                    sa.Column('when', sa.TIMESTAMP(timezone=True), nullable=False),
                    sa.Column('quotas', sa.Integer, nullable=False),
                    sa.Column('price', sa.BIGINT(), nullable=False),
                    sa.Column('transaction_type', sa.String(1), nullable=False),
                    sa.Column('assets_id', sa.Integer, sa.ForeignKey('assets.assets_id', ondelete='RESTRICT', onupdate='CASCADE'), nullable=False))


def downgrade():
    op.drop_table('transactions')
    op.drop_table('assets')
