import pytest


def test_create_task_default_status(mocker):
    mock_task = mocker.Mock()
    mock_task.to_dict.return_value = {
        "title": "Teste",
        "status": "A Fazer"
    }

    mocker.patch("backend.services.task_services.Task", return_value=mock_task)
    mocker.patch("backend.services.task_services.db.session.add")
    mocker.patch("backend.services.task_services.db.session.commit")

    from backend.services.task_services import create_task

    result = create_task({"title": "Teste"})

    assert result["status"] == "A Fazer"


def test_create_task_empty_title():
    from backend.services.task_services import create_task

    with pytest.raises(ValueError):
        create_task({"title": ""})


def test_create_task_none_title():
    from backend.services.task_services import create_task

    with pytest.raises(ValueError):
        create_task({"title": None})


def test_create_task_missing_title():
    from backend.services.task_services import create_task

    with pytest.raises(ValueError):
        create_task({})


def test_get_task_by_id_success(mocker):
    mock_task = mocker.Mock()
    mock_task.to_dict.return_value = {
        "id": 1,
        "title": "Teste"
    }

    mocker.patch("backend.services.task_services.db.session.get", return_value=mock_task)

    from backend.services.task_services import get_task_by_id

    result = get_task_by_id(1)

    assert result["id"] == 1


def test_get_task_not_found(mocker):
    mocker.patch("backend.services.task_services.db.session.get", return_value=None)

    from backend.services.task_services import get_task_by_id, TaskNotFound

    with pytest.raises(TaskNotFound):
        get_task_by_id(999)


def test_update_status_transition(mocker):
    mock_task = mocker.Mock()

    mock_task.to_dict.return_value = {
        "status": "Concluído"
    }

    mocker.patch("backend.services.task_services.db.session.get", return_value=mock_task)
    mocker.patch("backend.services.task_services.db.session.commit")

    from backend.services.task_services import update_task

    result = update_task(1, {"status": "Concluído"})

    assert result["status"] == "Concluído"


def test_update_task_not_found(mocker):
    mocker.patch("backend.services.task_services.db.session.get", return_value=None)

    from backend.services.task_services import update_task, TaskNotFound

    with pytest.raises(TaskNotFound):
        update_task(999, {"status": "Concluído"})


def test_delete_task_success(mocker):
    mock_task = mocker.Mock()

    mocker.patch("backend.services.task_services.db.session.get", return_value=mock_task)
    mocker.patch("backend.services.task_services.db.session.delete")
    mocker.patch("backend.services.task_services.db.session.commit")

    from backend.services.task_services import delete_task

    result = delete_task(1)

    assert result is True


def test_delete_task_not_found(mocker):
    mocker.patch("backend.services.task_services.db.session.get", return_value=None)

    from backend.services.task_services import delete_task, TaskNotFound

    with pytest.raises(TaskNotFound):
        delete_task(999)