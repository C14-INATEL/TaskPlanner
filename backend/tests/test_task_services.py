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