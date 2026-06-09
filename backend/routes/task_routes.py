from flask import Blueprint, request, jsonify
from services.task_services import (create_task, get_tasks, get_task_by_id, update_task, delete_task, TaskNotFound)

task = Blueprint('task', __name__)


@task.route('/tasks', methods=['POST'])
def create():
    try:
        data = request.get_json()
        new_task = create_task(data)
        return jsonify(new_task), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@task.route('/tasks', methods=['GET'])
def get_all():
    tasks = get_tasks()
    return jsonify(tasks), 200


@task.route('/tasks/<int:task_id>', methods=['GET'])
def get_by_id(task_id):
    try:
        task_data = get_task_by_id(task_id)
        return jsonify(task_data), 200
    except TaskNotFound as e:
        return jsonify({'message': str(e)}), 404


@task.route('/tasks/<int:task_id>', methods=['PUT'])
def update(task_id):
    try:
        data = request.get_json()
        updated = update_task(task_id, data)
        return jsonify(updated), 200
    except TaskNotFound as e:
        return jsonify({'message': str(e)}), 404
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@task.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete(task_id):
    try:
        delete_task(task_id)
        return jsonify({'message': 'Tarefa deletada com sucesso'}), 200
    except TaskNotFound as e:
        return jsonify({'message': str(e)}), 404