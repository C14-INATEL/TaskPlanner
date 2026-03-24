from database.database import db
from models.task import Task


def create_task(data):
    task = Task()
    task.title = data.get("title")
    task.description = data.get("description")

    db.session.add(task)
    db.session.commit()
    return task.to_dict()

def get_tasks():
    tasks = Task.query.all()
    return [t.to_dict() for t in tasks]
    
def get_task_by_id(task_id):
    task = Task.query.get(task_id)
    if task:
        return task.to_dict()
    return None

def update_task(task_id, data):
    task = Task.query.get(task_id)
    if task:
        if "title" in data:
            task.title = data["title"]
        if "description" in data:
            task.description = data["description"]
        if "completed" in data:
            task.completed = data["completed"]
        db.session.commit()
        return task.to_dict()
    return None

def delete_task(task_id):
    task = Task.query.get(task_id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return True
    return False