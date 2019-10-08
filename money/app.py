from flask import Flask, render_template


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


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=False)
