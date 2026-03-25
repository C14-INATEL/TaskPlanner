import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
import pytest
from app import app as flask_app
from database.database import db

@pytest.fixture(scope="function")
def application():
    flask_app.config["TESTING"] = True
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    
    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.session.remove()
        db.drop_all()

@pytest.fixture(scope="function")
def client(application):
    return application.test_client()