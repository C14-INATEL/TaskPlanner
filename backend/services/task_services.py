from database.database import db
from models.task import Task

VALID_PRIORITIES = {"low", "medium", "high"}
VALID_STATUSES = {"todo", "doing", "done"}


class TaskNotFound(Exception):
    pass


def create_task(data):
    if not data or not data.get("title"):
        raise ValueError("Titulo obrigatorio")

    title = data.get("title").strip()
    if not title:
        raise ValueError("Titulo nao pode ser apenas espacos")
    if len(title) > 100:
        raise ValueError("Titulo nao pode ter mais de 100 caracteres")

    priority = data.get("priority", "medium")
    if priority not in VALID_PRIORITIES:
        raise ValueError(f"Priority invalida. Use: {', '.join(VALID_PRIORITIES)}")

    task = Task(
        title=title,
        description=data.get("description"),
        status="todo",
        date=data.get("date"),
        time=data.get("time"),
        priority=priority,
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
        title = data["title"]
        if not title or not title.strip():
            raise ValueError("Titulo obrigatorio")
        if len(title) > 100:
            raise ValueError("Titulo nao pode ter mais de 100 caracteres")
        task.title = title.strip()

    if "status" in data:
        if data["status"] not in VALID_STATUSES:
            raise ValueError(f"Status invalido. Use: {', '.join(VALID_STATUSES)}")
        task.status = data["status"]

    if "priority" in data:
        if data["priority"] not in VALID_PRIORITIES:
            raise ValueError(f"Priority invalida. Use: {', '.join(VALID_PRIORITIES)}")
        task.priority = data["priority"]

    for field in ("description", "date", "time"):
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