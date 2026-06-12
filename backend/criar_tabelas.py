from models.task import Task
from app import app, db
import os
os.environ['DATABASE_URL'] = 'postgresql+pg8000://postgres:admin@localhost:5432/tasks_db'


with app.app_context():
    db.create_all()
    print("Tabelas criadas com sucesso!")
