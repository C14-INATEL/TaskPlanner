def test_get_tasks(client): #testa a rota GET /tasks, o que deve retornar um status 200 e uma lista (mesmo que vazia)
    response = client.get('/tasks')
    assert response.status_code == 200
    assert isinstance(response.get_json(), list) # Verifica se o retorno é uma lista (espera algo como [])
    
def test_post_task(client): #testa criar uma nova tarefa, o que deve retornar um status 201 (Created)
    new_task = {
        "title": "Estudar cybersecurity",
        "description": "Aprender sobre segurança cibernética e práticas recomendadas",
        "status": "A Fazer"
    }
    response = client.post('/tasks', json=new_task)
    assert response.status_code == 201
    
def test_post_task_without_title(client): #testa criar tarefa sem título, o que deve retornar um erro
    new_task = {
        "description": "Aprender sobre segurança cibernética e práticas recomendadas",
        "status": "A Fazer"
    }
    response = client.post('/tasks', json=new_task)
    assert response.status_code == 400
    assert response.get_json()['message'] == "O campo 'título' é obrigatório"

    
def test_delete_task(client): #testa deletar uma tarefa, o que deve retornar um status 200 (OK)
   
    new_task = {
        "title": "Tarefa para deletar",
        "description": "Esta tarefa será deletada no teste",
        "status": "A Fazer"
    }
    post_response = client.post('/tasks', json=new_task)
    task_id = post_response.get_json()['id']
    
    # Agora, tenta deletar a tarefa criada
    delete_response = client.delete(f'/tasks/{task_id}')
    assert delete_response.status_code == 200
    assert delete_response.get_json()['message'] == "Tarefa deletada com sucesso"
    
def test_update_task(client): #testa atualizar uma tarefa, o que deve retornar um status 200 (OK)
   
    new_task = {
        "title": "Tarefa para atualizar",
        "description": "Esta tarefa será atualizada no teste",
        "status": "A Fazer"
    }
    post_response = client.post('/tasks', json=new_task)
    task_id = post_response.get_json()['id']
    
    # Agora, tenta atualizar a tarefa criada
    updated_data = {
        "title": "Tarefa atualizada",
        "description": "A descrição foi atualizada",
        "status": "Em Progresso"
    }
    update_response = client.put(f'/tasks/{task_id}', json=updated_data)
    assert update_response.status_code == 200
    assert update_response.get_json()['message'] == "Tarefa atualizada com sucesso"