from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .assets import *
from .transactions import *