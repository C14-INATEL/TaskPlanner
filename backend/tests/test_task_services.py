import pytest


def test_create_task_default_status(mocker):
    mock_task = mocker.Mock()
    mock_task.to_dict.return_value = {"status": "todo"}
    mocker.patch("services.task_services.Task", return_value=mock_task)
    mocker.patch("services.task_services.db.session.add")
    mocker.patch("services.task_services.db.session.commit")
    from services.task_services import create_task
    result = create_task({"title": "Teste"})
    assert result is not None
    assert result["status"] == "todo"


def test_create_task_invalid_title():
    from services.task_services import create_task
    with pytest.raises(ValueError):
        create_task({"title": ""})


def test_create_task_title_only_spaces():
    from services.task_services import create_task
    with pytest.raises(ValueError, match="apenas espacos"):
        create_task({"title": "   "})


def test_create_task_title_too_long():
    from services.task_services import create_task
    with pytest.raises(ValueError, match="100 caracteres"):
        create_task({"title": "a" * 101})


def test_create_task_invalid_priority():
    from services.task_services import create_task
    with pytest.raises(ValueError, match="Priority invalida"):
        create_task({"title": "Tarefa", "priority": "urgente"})


def test_create_task_valid_priorities(mocker):
    mocker.patch("services.task_services.db.session.add")
    mocker.patch("services.task_services.db.session.commit")
    from services.task_services import create_task

    for priority in ["low", "medium", "high"]:
        mock_task = mocker.Mock()
        mock_task.to_dict.return_value = {"priority": priority}
        mocker.patch("services.task_services.Task", return_value=mock_task)
        result = create_task({"title": "Tarefa", "priority": priority})
        assert result["priority"] == priority


def test_update_status_transition(mocker):
    mock_task = mocker.Mock()
    mock_task.to_dict.return_value = {"status": "done"}
    mocker.patch("services.task_services.db.session.get", return_value=mock_task)
    mocker.patch("services.task_services.db.session.commit")
    from services.task_services import update_task
    result = update_task(1, {"status": "done"})
    assert result["status"] == "done"


def test_update_task_invalid_status(mocker):
    mock_task = mocker.Mock()
    mocker.patch("services.task_services.db.session.get", return_value=mock_task)
    from services.task_services import update_task
    with pytest.raises(ValueError, match="Status invalido"):
        update_task(1, {"status": "fazendo"})


def test_update_task_invalid_priority(mocker):
    mock_task = mocker.Mock()
    mocker.patch("services.task_services.db.session.get", return_value=mock_task)
    from services.task_services import update_task
    with pytest.raises(ValueError, match="Priority invalida"):
        update_task(1, {"priority": "urgente"})


def test_update_task_title_too_long(mocker):
    mock_task = mocker.Mock()
    mocker.patch("services.task_services.db.session.get", return_value=mock_task)
    from services.task_services import update_task
    with pytest.raises(ValueError, match="100 caracteres"):
        update_task(1, {"title": "a" * 101})


def test_update_task_title_only_spaces(mocker):
    mock_task = mocker.Mock()
    mocker.patch("services.task_services.db.session.get", return_value=mock_task)
    from services.task_services import update_task
    with pytest.raises(ValueError):
        update_task(1, {"title": "   "})


def test_get_task_not_found(mocker):
    mocker.patch("services.task_services.db.session.get", return_value=None)
    from services.task_services import get_task_by_id, TaskNotFound
    with pytest.raises(TaskNotFound):
        get_task_by_id(999)


def test_update_task_changes_status(mocker):
    mock_task = mocker.Mock()
    mock_task.status = "todo"
    mock_task.to_dict.return_value = {"status": "done"}
    mocker.patch("services.task_services.db.session.get", return_value=mock_task)
    mock_commit = mocker.patch("services.task_services.db.session.commit")
    from services.task_services import update_task
    result = update_task(1, {"status": "done"})
    assert mock_task.status == "done"
    assert result["status"] == "done"
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