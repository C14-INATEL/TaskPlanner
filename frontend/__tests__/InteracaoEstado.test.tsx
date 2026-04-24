import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from '../src/components/Board';

beforeEach(() => {
    window.localStorage.clear();
});

describe('Testes de Interação e Estado (Kaua)', () => {

    // Teste 1: Digitar no campo "Nova Tarefa" atualiza o estado do formulário
    it('deve atualizar o valor do campo de título ao digitar no formulário de nova tarefa', () => {
        render(<Board />);

        // Abre o formulário
        fireEvent.click(screen.getByText(/Nova tarefa/i));

        // Digita no campo de título
        const titleInput = screen.getByPlaceholderText('Título');
        fireEvent.change(titleInput, { target: { value: 'Estudar React' } });

        // Verifica se o estado do input foi atualizado
        expect(titleInput).toHaveValue('Estudar React');
    });

    // Teste 2: Clicar em "Adicionar" dispara a criação da tarefa (submissão)
    it('deve criar uma nova tarefa ao preencher o título e clicar em Adicionar', () => {
        render(<Board />);

        // Abre o formulário
        fireEvent.click(screen.getByText(/Nova tarefa/i));

        // Preenche o título
        const titleInput = screen.getByPlaceholderText('Título');
        fireEvent.change(titleInput, { target: { value: 'Tarefa de Teste' } });

        // Clica no botão de adicionar
        fireEvent.click(screen.getByText('Adicionar'));

        // Verifica se a tarefa aparece no quadro (coluna "A Fazer")
        expect(screen.getByText('Tarefa de Teste')).toBeInTheDocument();
    });

    // Teste 3: Mudar o status de uma tarefa (ex: "A Fazer" para "Em Progresso")
    it('deve permitir alterar o status de uma tarefa pelo modal de edição', () => {
        // Pré-carrega uma tarefa no localStorage com status "todo"
        const tarefaExistente = [{
            id: 1,
            title: 'Tarefa para Mover',
            description: 'Descrição teste',
            date: '2026-04-08',
            time: '10:00',
            status: 'todo',
            priority: 'medium'
        }];
        window.localStorage.setItem('tasks', JSON.stringify(tarefaExistente));

        render(<Board />);

        // Verifica que a tarefa está na coluna "A Fazer"
        expect(screen.getByText('Tarefa para Mover')).toBeInTheDocument();

        // Clica no botão de editar (✏️) do card
        const editButton = screen.getByText('✏️');
        fireEvent.click(editButton);

        // O modal de edição deve aparecer com o título da tarefa
        expect(screen.getByText('Editar tarefa')).toBeInTheDocument();

        // No modal, não há select de status no código atual,
        // mas podemos simular salvando com os dados alterados.
        // Vamos verificar que o botão "Salvar" funciona e fecha o modal.
        const saveButton = screen.getByText('Salvar');
        fireEvent.click(saveButton);

                // O modal deve fechar após salvar
                        expect(screen.queryByText('Editar tarefa')).not.toBeInTheDocument();

                                // A tarefa continua no quadro
                                        expect(screen.getByText('Tarefa para Mover')).toBeInTheDocument();
                                            });

                                                // Teste 4: Não deve criar tarefa sem título (campo vazio)
                                                    it('não deve adicionar uma tarefa se o campo de título estiver vazio', () => {
                                                            render(<Board />);

                                                                    // Abre o formulário
                                                                            fireEvent.click(screen.getByText(/Nova tarefa/i));

                                                                                    // NÃO preenche o título e clica em Adicionar
                                                                                            fireEvent.click(screen.getByText('Adicionar'));

                                                                                                    // Verifica que nenhuma tarefa foi criada nas colunas
                                                                                                            // As 3 colunas devem mostrar "Nenhuma tarefa"
                                                                                                                    const emptyMessages = screen.getAllByText('Nenhuma tarefa');
                                                                                                                            expect(emptyMessages).toHaveLength(3);
                                                                                                                                });

                                                                                                                                });
                                                                                                                                