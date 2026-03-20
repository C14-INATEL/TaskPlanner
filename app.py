from flask import Flask
from routes.task_routes import task

app = Flask(__name__)
app.register_blueprint(task)

if __name__ == "__main__":
    app.run(debug=True)