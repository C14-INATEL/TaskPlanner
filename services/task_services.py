tasks = []


def create_task(data):
    task = {
        "id": len(tasks) + 1,
        "title": data["title"],
        "done": False
    }

    tasks.append(task)
    return task


def get_tasks():
    return tasks


def get_task_by_id(task_id):
    for t in tasks:
        if t["id"] == task_id:
            return t
    return None

def update_task(task_id, data):
    for t in tasks:
        if t["id"] == task_id:
            if "title" in data:
                t["title"] = data["title"]

            if "done" in data:
                t["done"] = data["done"]

            return t

    return None

def delete_task(task_id):
    global tasks

    new_tasks = []

    for t in tasks:
        if t["id"] != task_id:
            new_tasks.append(t)

    tasks = new_tasks