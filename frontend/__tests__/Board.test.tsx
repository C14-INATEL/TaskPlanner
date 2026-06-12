import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DndContext } from '@dnd-kit/core';
import { ReactElement } from 'react';

import Board from '../src/components/Board';
import Card from '../src/components/Card';
import { ToastProvider } from '../src/components/Toast';

// O Board persiste via API (services/api). Mockamos o serviço para
// não depender de rede / fetch real no ambiente de testes.
jest.mock('@/services/api', () => ({
    fetchTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
}));

import { fetchTasks, createTask, updateTask, deleteTask } from '@/services/api';

const mockFetchTasks = fetchTasks as jest.Mock;
const mockCreateTask = createTask as jest.Mock;
const mockUpdateTask = updateTask as jest.Mock;
const mockDeleteTask = deleteTask as jest.Mock;

// O Board usa useToast(), que exige o ToastProvider na árvore.
function renderBoard(ui: ReactElement = <Board />) {
    return render(<ToastProvider>{ui}</ToastProvider>);
}

beforeEach(() => {
    mockFetchTasks.mockReset().mockResolvedValue([]);
    mockCreateTask.mockReset().mockImplementation((data) =>
        Promise.resolve({ id: Date.now(), ...data })
    );
    mockUpdateTask.mockReset().mockResolvedValue({});
    mockDeleteTask.mockReset().mockResolvedValue(undefined);
});

describe('Testes de Renderização e Componentes Visuais do Kanban', () => {

    it('deve renderizar o quadro Kanban principal na tela', async () => {
        renderBoard();

        expect(await screen.findByText('Painel de Tarefas')).toBeInTheDocument();
        expect(screen.getByText(/Task Planner/i)).toBeInTheDocument();
    });

    it('deve exibir as três colunas padrão: A Fazer, Em Progresso e Concluído', async () => {
        renderBoard();
        await screen.findByText('Painel de Tarefas');

        expect(screen.getByText('A Fazer')).toBeInTheDocument();
        expect(screen.getByText('Em Progresso')).toBeInTheDocument();
        expect(screen.getByText('Concluído')).toBeInTheDocument();
    });

    it('deve renderizar o título e a descrição de um cartão de tarefa passados via props', () => {
        const mockTask = {
            id: 1,
            title: 'Estudar Engenharia de Software',
            description: 'Fazer a Tarefa 3 de testes unitários',
            date: '2026-04-03',
            time: '23:59',
            status: 'todo',
            priority: 'high' as const
        };

        const mockDeleteTask = jest.fn();
        const mockOpenEditModal = jest.fn();

        render(
            <DndContext>
                <Card
                    task={mockTask}
                    deleteTask={mockDeleteTask}
                    openEditModal={mockOpenEditModal}
                />
            </DndContext>
        );

        expect(screen.getByText('Estudar Engenharia de Software')).toBeInTheDocument();
        expect(screen.getByText('Fazer a Tarefa 3 de testes unitários')).toBeInTheDocument();
        expect(screen.getByText('Alta')).toBeInTheDocument();
    });

    it('deve renderizar os campos de texto do formulário após clicar em Nova Tarefa', async () => {
        renderBoard();
        await screen.findByText('Painel de Tarefas');

        fireEvent.click(screen.getByText('Nova Tarefa'));

        expect(screen.getByPlaceholderText('Ex: Finalizar relatório')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Detalhes da tarefa...')).toBeInTheDocument();
    });
});

describe('Testes de Lógica com Mocks (Tarefa 4)', () => {

    it('deve carregar as tarefas da API ao iniciar o Board (Mock de Dependência)', async () => {
        mockFetchTasks.mockResolvedValue([
            {
                id: 123,
                title: 'Tarefa Mockada Inatel',
                description: 'Testando Mock C14',
                date: '',
                time: '',
                status: 'todo',
                priority: 'high'
            }
        ]);

        renderBoard();

        expect(await screen.findByText('Tarefa Mockada Inatel')).toBeInTheDocument();
        expect(mockFetchTasks).toHaveBeenCalled();
    });

    it('deve simular a exclusão de uma tarefa mockando a confirmação do usuário', async () => {
        const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
        mockFetchTasks.mockResolvedValue([
            {
                id: 7,
                title: 'Tarefa para Deletar',
                description: '',
                date: '',
                time: '',
                status: 'todo',
                priority: 'medium'
            }
        ]);

        renderBoard();

        expect(await screen.findByText('Tarefa para Deletar')).toBeInTheDocument();

        const deleteButton = screen.getByRole('button', { name: 'Excluir tarefa' });
        fireEvent.click(deleteButton);

        expect(confirmSpy).toHaveBeenCalled();
        await waitFor(() =>
            expect(screen.queryByText('Tarefa para Deletar')).not.toBeInTheDocument()
        );
        expect(mockDeleteTask).toHaveBeenCalledWith(7);

        confirmSpy.mockRestore();
    });

    it('deve enviar a nova tarefa para a API (createTask) com os dados corretos ao adicionar', async () => {
        renderBoard();
        await screen.findByText('Painel de Tarefas');

        fireEvent.click(screen.getByText('Nova Tarefa'));
        fireEvent.change(screen.getByPlaceholderText('Ex: Finalizar relatório'), {
            target: { value: 'Persistir no Banco' }
        });
        fireEvent.click(screen.getByText('Adicionar Tarefa'));

        await waitFor(() => expect(mockCreateTask).toHaveBeenCalled());
        expect(mockCreateTask).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Persistir no Banco', status: 'todo' })
        );
    });

    it('deve atualizar uma tarefa existente quando o Mock de salvamento for acionado', async () => {
        mockFetchTasks.mockResolvedValue([
            {
                id: 1,
                title: 'Antigo',
                description: 'Velho',
                date: '',
                time: '',
                status: 'todo',
                priority: 'low'
            }
        ]);

        renderBoard();

        const editButton = await screen.findByRole('button', { name: 'Editar tarefa' });
        fireEvent.click(editButton);

        const inputEdit = screen.getByDisplayValue('Antigo');
        fireEvent.change(inputEdit, { target: { value: 'Novo Título Atualizado' } });

        fireEvent.click(screen.getByText('Salvar'));

        expect(await screen.findByText('Novo Título Atualizado')).toBeInTheDocument();
        expect(screen.queryByText('Antigo')).not.toBeInTheDocument();
        expect(mockUpdateTask).toHaveBeenCalled();
    });
});

describe('Novos Testes Mock', () => {

    // confirm(false) → tarefa NÃO deve ser excluída
    it('não deve excluir a tarefa quando o usuário cancelar a confirmação (confirm = false)', async () => {
        const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => false);
        mockFetchTasks.mockResolvedValue([
            {
                id: 9,
                title: 'Tarefa para Manter',
                description: '',
                date: '',
                time: '',
                status: 'todo',
                priority: 'medium'
            }
        ]);

        renderBoard();

        expect(await screen.findByText('Tarefa para Manter')).toBeInTheDocument();

        const deleteButton = screen.getByRole('button', { name: 'Excluir tarefa' });
        fireEvent.click(deleteButton);

        expect(confirmSpy).toHaveBeenCalled();
        expect(screen.getByText('Tarefa para Manter')).toBeInTheDocument();
        expect(mockDeleteTask).not.toHaveBeenCalled();

        confirmSpy.mockRestore();
    });

    // callback openEditModal do Card chamado com a tarefa correta
    it('deve chamar openEditModal com a tarefa correta ao clicar no botão de editar do Card', () => {
        const mockTask = {
            id: 42,
            title: 'Tarefa Callback Test',
            description: 'Verificando callback',
            date: '2026-05-01',
            time: '10:00',
            status: 'todo',
            priority: 'medium' as const
        };

        const mockDeleteTaskFn = jest.fn();
        const mockOpenEditModal = jest.fn();

        render(
            <DndContext>
                <Card
                    task={mockTask}
                    deleteTask={mockDeleteTaskFn}
                    openEditModal={mockOpenEditModal}
                />
            </DndContext>
        );

        const editButton = screen.getByRole('button', { name: 'Editar tarefa' });
        fireEvent.click(editButton);

        expect(mockOpenEditModal).toHaveBeenCalledTimes(1);
        expect(mockOpenEditModal).toHaveBeenCalledWith(mockTask);
    });
});
