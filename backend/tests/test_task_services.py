import pytest

def test_create_task_default_status(mocker):
    mock_task = mocker.Mock()
    mock_task.to_dict.return_value = {
        "status": "A Fazer"
    }
    mocker.patch("services.task_services.Task", return_value=mock_task)
    mocker.patch("services.task_services.db.session.add")
    mocker.patch("services.task_services.db.session.commit")
    from services.task_services import create_task
    result = create_task({"title": "Teste"})
    assert result is not None
    assert result["status"] == "A Fazer"

def test_create_task_invalid_title():
    from services.task_services import create_task
    with pytest.raises(ValueError):
        create_task({"title": ""})

def test_update_status_transition(mocker):
    mock_task = mocker.Mock()
    mock_task.to_dict.return_value = {
        "status": "Concluído"
    }
    mocker.patch("services.task_services.db.session.get", return_value=mock_task)
    mocker.patch("services.task_services.db.session.commit")
    from services.task_services import update_task
    result = update_task(1, {"status": "Concluído"})
    assert result is not None
    assert result["status"] == "Concluído"

def test_get_task_not_found(mocker):
    mocker.patch("services.task_services.db.session.get", return_value=None)
    from services.task_services import get_task_by_id, TaskNotFound
    with pytest.raises(TaskNotFound):
        get_task_by_id(999)


# =========================
# NOVOS TESTES COM MOCK
# =========================

def test_update_task_changes_status(mocker):
    mock_task = mocker.Mock()
    mock_task.status = "A Fazer"
    mock_task.to_dict.return_value = {
        "status": "Concluído"
    }

    mocker.patch("services.task_services.db.session.get", return_value=mock_task)
    mock_commit = mocker.patch("services.task_services.db.session.commit")

    from services.task_services import update_task

    result = update_task(1, {"status": "Concluído"})

    assert mock_task.status == "Concluído"
    assert result["status"] == "Concluído"
    mock_commit.assert_called_once()


def test_delete_task_success(mocker):
    mock_task = mocker.Mock()

    mocker.patch("services.task_services.db.session.get", return_value=mock_task)
    mock_delete = mocker.patch("services.task_services.db.session.delete")
    mock_commit = mocker.patch("services.task_services.db.session.commit")

    from services.task_services import delete_task

    result = delete_task(1)

    assert result is True
    mock_delete.assert_called_once_with(mock_task)
    mock_commit.assert_called_once()
