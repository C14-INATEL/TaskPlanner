from flask import Flask
from database.database import db
from routes.task_routes import task

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:admin@localhost:5432/tasks_db'

db.init_app(app)

app.register_blueprint(task)

if __name__ == "__main__":
    with app.app_context(): #gerencia o contexto e encerra automaticamente, garantindo que os recursos sejam liberados corretamente
        from models.task import Task #importa o modelo Task para criar a tabela no banco de dados
        db.create_all() #cria as tabelas no banco de dados com base nos modelos definidos, se elas ainda não existirem
    app.run(debug=True)