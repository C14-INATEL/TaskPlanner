from unittest.mock import patch
from services.task_services import TaskNotFound


def test_get_tasks_unit(client):
    with patch('routes.task_routes.get_tasks') as mock:
        mock.return_value = [{"id": 1, "title": "Tarefa 1"}]

        response = client.get('/tasks')

        assert response.status_code == 200
        assert response.get_json() == [{"id": 1, "title": "Tarefa 1"}]


def test_post_task_unit(client):
    with patch('routes.task_routes.create_task') as mock:
        mock.return_value = {"id": 1, "title": "Estudar Flask"}

        response = client.post('/tasks', json={"title": "Estudar Flask"})

        assert response.status_code == 201


def test_post_task_without_title_unit(client):
    with patch('routes.task_routes.create_task') as mock:
        mock.side_effect = ValueError("Titulo obrigatorio")

        response = client.post('/tasks', json={})

        assert response.status_code == 400
        assert response.get_json()['message'] == "Titulo obrigatorio"


def test_post_task_title_too_long(client):
    with patch('routes.task_routes.create_task') as mock:
        mock.side_effect = ValueError("Titulo nao pode ter mais de 100 caracteres")

        response = client.post('/tasks', json={"title": "a" * 101})

        assert response.status_code == 400
        assert "100" in response.get_json()['message']


def test_post_task_invalid_priority(client):
    with patch('routes.task_routes.create_task') as mock:
        mock.side_effect = ValueError("Priority invalida. Use: low, medium, high")

        response = client.post('/tasks', json={"title": "Tarefa", "priority": "urgente"})

        assert response.status_code == 400
        assert "Priority invalida" in response.get_json()['message']


def test_post_empty_body(client):
    with patch('routes.task_routes.create_task') as mock:
        mock.side_effect = ValueError("Titulo obrigatorio")

        response = client.post('/tasks', json={})

        assert response.status_code == 400
        assert response.get_json()['message'] == "Titulo obrigatorio"


def test_post_title_only_spaces(client):
    with patch('routes.task_routes.create_task') as mock:
        mock.side_effect = ValueError("Titulo nao pode ser apenas espacos")

        response = client.post('/tasks', json={"title": "   "})

        assert response.status_code == 400
        assert "espacos" in response.get_json()['message']


def test_delete_task_unit(client):
    with patch('routes.task_routes.delete_task') as mock:
        mock.return_value = True

        response = client.delete('/tasks/1')

        assert response.status_code == 200


def test_delete_task_not_found_unit(client):
    with patch('routes.task_routes.delete_task') as mock:
        mock.side_effect = TaskNotFound("Tarefa não encontrada")

        response = client.delete('/tasks/999')

        assert response.status_code == 404


def test_get_tasks_empty(client):
    with patch('routes.task_routes.get_tasks') as mock:
        mock.return_value = []

        response = client.get('/tasks')

        assert response.status_code == 200
        assert response.get_json() == []


def test_put_task_invalid_status(client):
    with patch('routes.task_routes.update_task') as mock:
        mock.side_effect = ValueError("Status invalido. Use: todo, doing, done")

        response = client.put('/tasks/1', json={"status": "fazendo"})

        assert response.status_code == 400
        assert "Status invalido" in response.get_json()['message']


def test_put_task_invalid_priority(client):
    with patch('routes.task_routes.update_task') as mock:
        mock.side_effect = ValueError("Priority invalida. Use: low, medium, high")

        response = client.put('/tasks/1', json={"priority": "urgente"})

        assert response.status_code == 400
        assert "Priority invalida" in response.get_json()['message']


def test_put_task_title_too_long(client):
    with patch('routes.task_routes.update_task') as mock:
        mock.side_effect = ValueError("Titulo nao pode ter mais de 100 caracteres")

        response = client.put('/tasks/1', json={"title": "a" * 101})

        assert response.status_code == 400
        assert "100" in response.get_json()['message']