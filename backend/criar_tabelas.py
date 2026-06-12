from app import app, db
from models.task import Task

with app.app_context():
    db.create_all()
    print("Tabelas criadas com sucesso!")