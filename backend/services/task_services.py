from database.database import db
from models.task import Task


class TaskNotFound(Exception):
    pass


def create_task(data):
    if not data or not data.get("title"):
        raise ValueError("Titulo obrigatorio")

    task = Task(
        title=data.get("title"),
        description=data.get("description"),
        status="todo",
        date=data.get("date"),
        time=data.get("time"),
        priority=data.get("priority", "medium"),
    )
    db.session.add(task)
    db.session.commit()
    return task.to_dict()


def get_tasks():
    tasks = Task.query.all()
    return [t.to_dict() for t in tasks]


def get_task_by_id(task_id):
    task = db.session.get(Task, task_id)

    if not task:
        raise TaskNotFound("Tarefa nao encontrada")

    return task.to_dict()


def update_task(task_id, data):
    task = db.session.get(Task, task_id)

    if not task:
        raise TaskNotFound("Tarefa nao encontrada")

    if "title" in data:
        if not data["title"]:
            raise ValueError("Titulo obrigatorio")
        task.title = data["title"]

    for field in ("description", "status", "date", "time", "priority"):
        if field in data:
            setattr(task, field, data[field])

    db.session.commit()
    return task.to_dict()


def delete_task(task_id):
    task = db.session.get(Task, task_id)

    if not task:
        raise TaskNotFound("Tarefa não encontrada")

    db.session.delete(task)
    db.session.commit()
    return True