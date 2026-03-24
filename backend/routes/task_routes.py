from flask import Blueprint, request, jsonify
from services.task_services import (create_task, get_tasks, get_task_by_id, update_task, delete_task)

task = Blueprint('task', __name__)

@task.route('/tasks', methods=['POST'])
def create():
    data = request.get_json()
    new_task = create_task(data)
    return jsonify(new_task), 201

@task.route('/tasks', methods=['GET'])
def get_all():
    tasks = get_tasks()
    return jsonify(tasks), 200

@task.route('/tasks/<int:task_id>', methods=['GET'])
def get_by_id(task_id):
    task = get_task_by_id(task_id)
    if task:
        return jsonify(task), 200
    return jsonify({'message': 'Tarefa não encontrada'}), 404

@task.route('/tasks/<int:task_id>', methods=['PUT'])
def update(task_id):
    data = request.get_json()
    updated_task = update_task(task_id, data)
    if updated_task:
        return jsonify(updated_task), 200
    return jsonify({'message': 'Tarefa não encontrada'}), 404

@task.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete(task_id):
    result = delete_task(task_id)
    if result:
        return jsonify({'message': 'Tarefa deletada com sucesso'}), 200
    return jsonify({'message': 'Tarefa não encontrada'}), 404