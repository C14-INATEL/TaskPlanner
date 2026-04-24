import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DndContext } from '@dnd-kit/core';

// Importando os seus componentes reais
import Board from '../src/components/Board';
import Card from '../src/components/Card';

// Limpa o localStorage antes de cada teste para não vazar dados de um teste para outro
beforeEach(() => {
    window.localStorage.clear();
});

describe('Testes de Renderização e Componentes Visuais do Kanban', () => {

    // Teste 1: O componente principal do Quadro
    it('deve renderizar o quadro Kanban principal na tela', () => {
        render(<Board />);

        // Procura por textos estáticos que você colocou no Board.tsx
        expect(screen.getByText('Seu painel de tarefas')).toBeInTheDocument();
        expect(screen.getByText(/Task Planner/i)).toBeInTheDocument();
    });

    // Teste 2: As três colunas
    it('deve exibir as três colunas padrão: A Fazer, Em Progresso e Concluído', () => {
        render(<Board />);

        expect(screen.getByText('A Fazer')).toBeInTheDocument();
        expect(screen.getByText('Em Progresso')).toBeInTheDocument();
        expect(screen.getByText('Concluído')).toBeInTheDocument();
    });

    // Teste 3: O componente do Cartão de Tarefa via props
    it('deve renderizar o título e a descrição de um cartão de tarefa passados via props', () => {
        // Montamos uma "tarefa falsa" com o tipo exato que o seu Card pede
        const mockTask = {
            id: 1,
            title: 'Estudar Engenharia de Software',
            description: 'Fazer a Tarefa 3 de testes unitários',
            date: '2026-04-03',
            time: '23:59',
            status: 'todo',
            priority: 'high' as const
        };

        // Criamos funções vazias (mocks) para simular as props de deletar e editar
        const mockDeleteTask = jest.fn();
        const mockOpenEditModal = jest.fn();

        // Renderizamos o Card envolto no DndContext para não dar erro de Drag and Drop
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
        expect(screen.getByText('🔴 Alta')).toBeInTheDocument(); // Verifica se a tag de prioridade renderizou
    });

    // Teste 4: O Formulário de Nova Tarefa
    it('deve renderizar os campos de texto do formulário após clicar em Nova Tarefa', () => {
        render(<Board />);

        // Primeiro, precisamos achar o botão e clicar nele (simulando o usuário)
        const btnNovaTarefa = screen.getByText(/Nova tarefa/i);
        fireEvent.click(btnNovaTarefa);

        // Agora sim, os inputs devem estar visíveis na tela
        const titleInput = screen.getByPlaceholderText('Título');
        const descInput = screen.getByPlaceholderText('Descrição');

        expect(titleInput).toBeInTheDocument();
        expect(descInput).toBeInTheDocument();
    });
});

describe('Testes de Lógica com Mocks (Tarefa 4)', () => {

    beforeEach(() => {
        window.localStorage.clear();
        jest.clearAllMocks(); // Limpa os mocks para um teste não sujar o outro
    });

    it('deve carregar as tarefas do LocalStorage ao iniciar o Board (Mock de Dependência)', () => {
        // Criamos um dado falso que simula o banco de dados
        const mockTasks = [
            {
                id: 123,
                title: 'Tarefa Mockada Inatel',
                description: 'Testando Mock C14',
                status: 'todo',
                priority: 'high'
            }
        ];

        // Aplicamos o Mock no método getItem do LocalStorage
        // O Board vai achar que o localStorage retornou esses dados
        const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockTasks));

        render(<Board />);

        // Verifica se o componente renderizou o que veio do nosso Mock
        expect(screen.getByText('Tarefa Mockada Inatel')).toBeInTheDocument();

        // Limpeza para não afetar outros testes
        getItemSpy.mockRestore();
    });

    it('deve simular a exclusão de uma tarefa mockando a confirmação do usuário', () => {
        // Mock do window.confirm (para não travar o teste esperando um clique real)
        const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);

        render(<Board />);

        // Abrindo o formulário e Adicionando uma tarefa para podermos deletar
        const btnNova = screen.getByText(/Nova tarefa/i);
        fireEvent.click(btnNova);
        fireEvent.change(screen.getByPlaceholderText('Título'), { target: { value: 'Tarefa para Deletar' } });
        fireEvent.click(screen.getByText('Adicionar'));

        // Encontrar o botão de deletar
        // Se o botão de deletar estiver no componente Card, procure por ele:
        // Encontra o botão pelo emoji de lixeira que aparece no log do Jest
        const deleteButton = screen.getByRole('button', { name: /🗑️/ });
        fireEvent.click(deleteButton);

        // Verificando se o Mock do confirm foi chamado
        expect(confirmSpy).toHaveBeenCalled();

        // Verificando se a tarefa sumiu da tela
        expect(screen.queryByText('Tarefa para Deletar')).not.toBeInTheDocument();

        confirmSpy.mockRestore();
    });

    it('deve gerar um ID único baseado no timestamp mockado ao adicionar tarefa', () => {
        // Mockando o Date.now para retornar um valor fixo
        const mockTimestamp = 123456789;
        const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

        render(<Board />);

        // Abre o formulário e adiciona
        fireEvent.click(screen.getByText(/Nova tarefa/i));
        fireEvent.change(screen.getByPlaceholderText('Título'), { target: { value: 'Tarefa com ID Fixo' } });
        fireEvent.click(screen.getByText('Adicionar'));

        // O ID da tarefa no estado interno agora deve ser 123456789
        // Podemos verificar isso indiretamente vendo se o localStorage salvou com esse ID
        const savedData = JSON.parse(localStorage.getItem('tasks') || '[]');
        expect(savedData[0].id).toBe(mockTimestamp);

        dateSpy.mockRestore();
    });

    it('deve chamar o localStorage.setItem com os dados corretos ao adicionar uma nova tarefa', () => {
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

        render(<Board />);

        fireEvent.click(screen.getByText(/Nova tarefa/i));
        fireEvent.change(screen.getByPlaceholderText('Título'), { target: { value: 'Persistir no Banco' } });
        fireEvent.click(screen.getByText('Adicionar'));

        // Verifica se o setItem foi chamado pelo menos uma vez
        expect(setItemSpy).toHaveBeenCalled();

        // Verifica se o último item salvo contém o título esperado
        const lastCallArgs = setItemSpy.mock.calls[setItemSpy.mock.calls.length - 1];
        expect(lastCallArgs[1]).toContain('Persistir no Banco');

        setItemSpy.mockRestore();
    });

    it('deve atualizar uma tarefa existente quando o Mock de salvamento for acionado', () => {
        // Injetamos uma tarefa inicial via localStorage
        const initialTask = [{ id: 1, title: 'Antigo', description: 'Velho', status: 'todo', priority: 'low' }];
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(initialTask));

        render(<Board />);

        // Simulamos a abertura do modal de edição
        // No seu código, o botão que abre o modal geralmente está no componente Card
        // Encontra o botão pelo emoji de lápis
        const editButton = screen.getByRole('button', { name: /✏️/ });
        fireEvent.click(editButton);

        // Alteramos o valor no input do modal
        const inputEdit = screen.getByDisplayValue('Antigo');
        fireEvent.change(inputEdit, { target: { value: 'Novo Título Atualizado' } });

        // Clicamos em Salvar
        fireEvent.click(screen.getByText('Salvar'));

        // Verificamos se o texto antigo sumiu e o novo apareceu
        expect(screen.getByText('Novo Título Atualizado')).toBeInTheDocument();
        expect(screen.queryByText('Antigo')).not.toBeInTheDocument();
    });
});