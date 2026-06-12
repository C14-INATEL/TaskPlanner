# 📝 Histórias de Usuário e Rastreabilidade (NP2)

Este documento apresenta as histórias de usuário centrais que guiaram o desenvolvimento do **TaskPlanner**, estabelecendo os critérios de aceitação e a rastreabilidade ponta a ponta entre o requisito, as issues/PRs e os testes automatizados do sistema.

---

### 1. Criação de Tarefas

* **História:** Como um membro da equipe, eu quero criar uma nova tarefa especificando título e descrição para que eu possa registrar um novo trabalho a ser feito.
* **Prioridade:** Alta
* **Status:** Entregue
* **Critérios de Aceitação:**
  * **Given (Dado que)** estou na tela principal do quadro Kanban.
  * **When (Quando)** eu clico em "Nova Tarefa", preencho o título e a descrição válidos e confirmo.
  * **Then (Então)** a tarefa deve ser salva no banco de dados e exibida imediatamente na coluna "A Fazer" (To Do).
* **Rastreabilidade:**
  * **Issue/PR:** #01 - Implementação do endpoint de criação de tasks e modal no frontend.
  * **Teste Automatizado:** `backend/tests/test_task_services.py` (função responsável por testar a persistência da criação) e `frontend/__tests__/Board.test.tsx`.

---

### 2. Movimentação de Tarefas (Kanban)

* **História:** Como um desenvolvedor, eu quero arrastar uma tarefa de uma coluna para outra (ex: "Em Progresso" para "Concluído") para que o status visual reflita o progresso real do trabalho.
* **Prioridade:** Alta
* **Status:** Entregue
* **Critérios de Aceitação:**
  * **Given (Dado que)** existe uma tarefa na coluna "Em Progresso".
  * **When (Quando)** eu arrasto e solto essa tarefa na coluna "Concluído".
  * **Then (Então)** o sistema deve atualizar o status da tarefa no backend para "Concluído" e renderizar o card na nova coluna.
* **Rastreabilidade:**
  * **Issue/PR:** #04 - Integração de estado de colunas e rota de atualização.
  * **Teste Automatizado:** `frontend/__tests__/InteracaoEstado.test.tsx` (valida a mudança visual do estado do board) e `backend/tests/test_task_routes.py` (valida a rota PUT/PATCH do status).

---

### 3. Exclusão de Tarefas

* **História:** Como um organizador do projeto, eu quero excluir uma tarefa obsoleta ou duplicada para que o quadro Kanban permaneça limpo e focado no que é relevante.
* **Prioridade:** Média
* **Status:** Entregue
* **Critérios de Aceitação:**
  * **Given (Dado que)** estou visualizando um card de tarefa existente no quadro.
  * **When (Quando)** eu clico no botão de exclusão e confirmo a operação na caixa de diálogo.
  * **Then (Então)** a tarefa deve ser removida permanentemente do banco de dados e sumir da interface de usuário.
* **Rastreabilidade:**
  * **Issue/PR:** #07 - Fluxo de deleção de registros no banco e atualização reativa do layout.
  * **Teste Automatizado:** `backend/tests/test_task_routes.py` (valida a requisição DELETE do endpoint de tasks).

---

### 4. Visualização de Detalhes da Tarefa

* **História:** Como um revisor de código, eu quero clicar em uma tarefa para expandir seus detalhes e ler a descrição completa para que eu entenda o contexto sem poluir o layout geral do Kanban.
* **Prioridade:** Média
* **Status:** Entregue
* **Critérios de Aceitação:**
  * **Given (Dado que)** há cards populados no quadro com descrições longas.
  * **When (Quando)** eu clico sobre o card da tarefa desejada.
  * **Then (Então)** um modal ou painel lateral deve ser aberto exibindo o título, a descrição completa e a data de criação.
* **Rastreabilidade:**
  * **Issue/PR:** #09 - Criação do componente Card e Modal de visualização detalhada.
  * **Teste Automatizado:** `frontend/__tests__/Board.test.tsx` (valida o comportamento de clique e exibição das propriedades do componente Card).

---

### 5. Atribuição de Prioridades às Tarefas

* **História:** Como um Product Owner, eu quero definir níveis de prioridade (Alta, Média, Baixa) para cada tarefa criada para que a equipe saiba quais itens devem ser atacados primeiro.
* **Prioridade:** Alta
* **Status:** Parcial
* **Critérios de Aceitação:**
  * **Given (Dado que)** estou criando ou editando uma tarefa no sistema.
  * **When (Quando)** eu seleciono uma tag de prioridade ("Alta") e salvo.
  * **Then (Então)** o card no Kanban deve exibir um indicador visual colorido correspondente à prioridade selecionada.
* **Rastreabilidade:**
  * **Issue/PR:** #12 - Adição do campo de prioridade no modelo de dados do backend e estilização no frontend.
  * **Teste Automatizado:** `backend/tests/test_task_services.py` (valida se o modelo aceita e salva o campo de prioridade conforme as regras do domínio).
