from unittest.mock import patch

def test_get_tasks_unit(client):
    with patch('routes.task_routes.get_tasks') as mock:
        mock.return_value = [{"id": 1, "title": "Tarefa 1"}]
        
        response = client.get('/tasks')
        
        assert response.status_code == 200
        assert response.get_json() == [{"id": 1, "title": "Tarefa 1"}]

def test_post_task_unit(client):
    with patch('routes.task_routes.create_task') as mock:
        mock.return_value = ({"id": 1, "title": "Estudar Flask"}, None)
        
        response = client.post('/tasks', json={"title": "Estudar Flask"})
        
        assert response.status_code == 201

def test_post_task_without_title_unit(client):
    with patch('routes.task_routes.create_task') as mock:
        mock.return_value = (None, "O campo 'título' é obrigatório")
        
        response = client.post('/tasks', json={})
        
        assert response.status_code == 400
        assert response.get_json()['message'] == "O campo 'título' é obrigatório"

def test_delete_task_unit(client):
    with patch('routes.task_routes.delete_task') as mock:
        mock.return_value = True
        
        response = client.delete('/tasks/1')
        
        assert response.status_code == 200

def test_delete_task_not_found_unit(client):
    with patch('routes.task_routes.delete_task') as mock:
        mock.return_value = None
        
        response = client.delete('/tasks/999')
        
        assert response.status_code == 404
        
        
def test_get_tasks_empty(client):
    with patch('routes.task_routes.get_tasks') as mock:
        mock.return_value = []
        
        response = client.get('/tasks')
        
        assert response.status_code == 200
        assert response.get_json() == []
        

def test_post_empty_body(client):
    with patch('routes.task_routes.create_task') as mock:
        mock.return_value = (None, "O campo 'título' é obrigatório")
        
        response = client.post('/tasks', json={})
        
        assert response.status_code == 400
        assert response.get_json()['message'] == "O campo 'título' é obrigatório"