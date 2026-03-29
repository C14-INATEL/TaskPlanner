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