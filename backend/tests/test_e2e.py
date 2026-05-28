def test_e2e_criar_e_listar_tarefa(client):
    # Cria uma tarefa
    response = client.post('/tasks', json={
        "title": "Tarefa E2E",
        "description": "Testando fluxo completo",
        "priority": "high"
    })
    assert response.status_code == 201
    tarefa = response.get_json()
    assert tarefa['title'] == "Tarefa E2E"
    assert tarefa['status'] == "todo"
    assert tarefa['priority'] == "high"

    # Lista e confirma que está lá
    response = client.get('/tasks')
    assert response.status_code == 200
    tarefas = response.get_json()
    assert len(tarefas) == 1
    assert tarefas[0]['title'] == "Tarefa E2E"


def test_e2e_criar_e_atualizar_tarefa(client):
    # Cria
    response = client.post('/tasks', json={
        "title": "Tarefa para atualizar",
        "priority": "low"
    })
    assert response.status_code == 201
    tarefa_id = response.get_json()['id']

    # Atualiza status
    response = client.put(f'/tasks/{tarefa_id}', json={"status": "doing"})
    assert response.status_code == 200
    assert response.get_json()['status'] == "doing"

    # Atualiza título
    response = client.put(f'/tasks/{tarefa_id}', json={"title": "Título atualizado"})
    assert response.status_code == 200
    assert response.get_json()['title'] == "Título atualizado"


def test_e2e_criar_e_deletar_tarefa(client):
    # Cria
    response = client.post('/tasks', json={"title": "Tarefa para deletar"})
    assert response.status_code == 201
    tarefa_id = response.get_json()['id']

    # Deleta
    response = client.delete(f'/tasks/{tarefa_id}')
    assert response.status_code == 200

    # Confirma que sumiu
    response = client.get('/tasks')
    assert response.status_code == 200
    assert len(response.get_json()) == 0


def test_e2e_buscar_tarefa_por_id(client):
    # Cria
    response = client.post('/tasks', json={
        "title": "Tarefa por ID",
        "description": "Descrição teste",
        "priority": "medium"
    })
    assert response.status_code == 201
    tarefa_id = response.get_json()['id']

    # Busca por ID
    response = client.get(f'/tasks/{tarefa_id}')
    assert response.status_code == 200
    tarefa = response.get_json()
    assert tarefa['id'] == tarefa_id
    assert tarefa['title'] == "Tarefa por ID"
    assert tarefa['description'] == "Descrição teste"


def test_e2e_fluxo_kanban_completo(client):
    # Cria tarefa em "todo"
    response = client.post('/tasks', json={
        "title": "Tarefa Kanban",
        "priority": "medium"
    })
    assert response.status_code == 201
    tarefa = response.get_json()
    assert tarefa['status'] == "todo"
    tarefa_id = tarefa['id']

    # Move para "doing"
    response = client.put(f'/tasks/{tarefa_id}', json={"status": "doing"})
    assert response.status_code == 200
    assert response.get_json()['status'] == "doing"

    # Move para "done"
    response = client.put(f'/tasks/{tarefa_id}', json={"status": "done"})
    assert response.status_code == 200
    assert response.get_json()['status'] == "done"


def test_e2e_validacao_titulo_vazio(client):
    response = client.post('/tasks', json={"title": ""})
    assert response.status_code == 400


def test_e2e_validacao_priority_invalida(client):
    response = client.post('/tasks', json={"title": "Tarefa", "priority": "urgente"})
    assert response.status_code == 400


def test_e2e_validacao_status_invalido(client):
    # Cria tarefa
    response = client.post('/tasks', json={"title": "Tarefa"})
    tarefa_id = response.get_json()['id']

    # Tenta atualizar com status inválido
    response = client.put(f'/tasks/{tarefa_id}', json={"status": "fazendo"})
    assert response.status_code == 400


def test_e2e_buscar_tarefa_inexistente(client):
    response = client.get('/tasks/999')
    assert response.status_code == 404


def test_e2e_deletar_tarefa_inexistente(client):
    response = client.delete('/tasks/999')
    assert response.status_code == 404


def test_e2e_multiplas_tarefas(client):
    # Cria 3 tarefas
    for i in range(1, 4):
        response = client.post('/tasks', json={
            "title": f"Tarefa {i}",
            "priority": "low"
        })
        assert response.status_code == 201

    # Lista e confirma que tem 3
    response = client.get('/tasks')
    assert response.status_code == 200
    assert len(response.get_json()) == 3