from flask import Blueprint, request, jsonify
from services.task_services import (create_task, get_tasks, get_task_by_id, update_task, delete_task)

@app.route('/tasks', methods=['POST'])
def create_task_route():
    data = request.get_json()
    task = create_task(data)
    return jsonify(task), 201