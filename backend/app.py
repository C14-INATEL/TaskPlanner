from routes.task_routes import task
from database.database import db
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

os.environ.setdefault(
    'DATABASE_URL', 'postgresql+pg8000://postgres:admin@localhost:5432/tasks_db')


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')

db.init_app(app)
CORS(app, origins=["http://localhost:3000"])
migrate = Migrate(app, db)

app.register_blueprint(task)

if __name__ == "__main__":
    app.run(debug=True)
