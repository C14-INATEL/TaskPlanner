from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv(Path(__file__).resolve().parent / ".env")

os.environ.setdefault('DATABASE_URL', 'postgresql+pg8000://postgres:admin@localhost:5432/tasks_db')

from database.database import db
from routes.task_routes import task

app = Flask(__name__, instance_path=str(Path(__file__).resolve().parent / "instance"))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')

db.init_app(app)
CORS(app, origins=["http://localhost:3000"])
migrate = Migrate(app, db)

app.register_blueprint(task)

if __name__ == "__main__":
    app.run(debug=True)