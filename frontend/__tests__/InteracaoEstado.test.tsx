import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactElement } from 'react';

import Board from '../src/components/Board';
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

describe('Testes de Interação e Estado (Kaua)', () => {

    it('deve atualizar o valor do campo de título ao digitar no formulário de nova tarefa', async () => {
        renderBoard();
        await screen.findByText('Painel de Tarefas');

        fireEvent.click(screen.getByText('Nova Tarefa'));

        const titleInput = screen.getByPlaceholderText('Ex: Finalizar relatório');
        fireEvent.change(titleInput, { target: { value: 'Estudar React' } });

        expect(titleInput).toHaveValue('Estudar React');
    });

    it('deve criar uma nova tarefa ao preencher o título e clicar em Adicionar Tarefa', async () => {
        mockCreateTask.mockResolvedValue({
            id: 1,
            title: 'Tarefa de Teste',
            description: '',
            date: '',
            time: '',
            status: 'todo',
            priority: 'medium',
        });

        renderBoard();
        await screen.findByText('Painel de Tarefas');

        fireEvent.click(screen.getByText('Nova Tarefa'));

        const titleInput = screen.getByPlaceholderText('Ex: Finalizar relatório');
        fireEvent.change(titleInput, { target: { value: 'Tarefa de Teste' } });

        fireEvent.click(screen.getByText('Adicionar Tarefa'));

        expect(await screen.findByText('Tarefa de Teste')).toBeInTheDocument();
        expect(mockCreateTask).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Tarefa de Teste', status: 'todo' })
        );
    });

    it('deve permitir alterar o status de uma tarefa pelo modal de edição', async () => {
        const tarefaExistente = {
            id: 1,
            title: 'Tarefa para Mover',
            description: 'Descrição teste',
            date: '2026-04-08',
            time: '10:00',
            status: 'todo',
            priority: 'medium' as const,
        };
        mockFetchTasks.mockResolvedValue([tarefaExistente]);

        renderBoard();

        expect(await screen.findByText('Tarefa para Mover')).toBeInTheDocument();

        const editButton = screen.getByRole('button', { name: 'Editar tarefa' });
        fireEvent.click(editButton);

        expect(screen.getByText('Editar Tarefa')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() =>
            expect(screen.queryByText('Editar Tarefa')).not.toBeInTheDocument()
        );
        expect(mockUpdateTask).toHaveBeenCalled();
        expect(screen.getByText('Tarefa para Mover')).toBeInTheDocument();
    });

    it('não deve adicionar uma tarefa se o campo de título estiver vazio', async () => {
        renderBoard();
        await screen.findByText('Painel de Tarefas');

        fireEvent.click(screen.getByText('Nova Tarefa'));
        fireEvent.click(screen.getByText('Adicionar Tarefa'));

        // Dá um tempo curto para possíveis microtasks resolverem e o estado assentar
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(screen.getByText('Sem tarefas pendentes')).toBeInTheDocument();
        expect(screen.getByText('Nada em progresso')).toBeInTheDocument();
        expect(screen.getByText('Nenhuma tarefa concluída')).toBeInTheDocument();
        expect(mockCreateTask).not.toHaveBeenCalled();
    });
});
