# Task Planner

## 1) Projeto e Explicação

O **Task Planner** é um gerenciador de tarefas interativo baseado no método Kanban (quadro visual com colunas de status). O projeto foi construído utilizando uma arquitetura moderna e desacoplada, dividida em um backend que gerencia a persistência dos dados e regras de negócio, e um frontend interativo que provê a interface do usuário.

### Arquitetura do Projeto

- **Backend (Flask & SQLAlchemy)**: Fornece uma API RESTful para gerenciar o ciclo de vida das tarefas (CRUD). Utiliza o PostgreSQL como banco de dados e SQLAlchemy como ORM, além de ferramentas de migração com Flask-Migrate e testes automatizados com Pytest.
- **Frontend (Next.js, React & TailwindCSS)**: Interface web com design escuro moderno e responsivo. A dinâmica de movimentação de tarefas é gerenciada através de drag and drop utilizando a biblioteca `@dnd-kit/core`.

### Estrutura de Código

- [app.py](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/backend/app.py): Configura a aplicação Flask, CORS, conexão com o banco e inicializa os blueprints das rotas.
- [task.py (Model)](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/backend/models/task.py): Mapeia o esquema da tabela `tasks` no banco de dados.
- [task_routes.py](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/backend/routes/task_routes.py): Define os endpoints HTTP da API para as operações nas tarefas.
- [task_services.py](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/backend/services/task_services.py): Centraliza as regras de negócio e validações (ex: tamanho do título, prioridades e status válidos).
- [Board.tsx](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/frontend/src/components/Board.tsx): Componente principal do Kanban. Controla o estado de arrastar e soltar e os modais de inserção/edição.
- [Column.tsx](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/frontend/src/components/Column.tsx): Exibe a lista filtrada de tarefas de acordo com seu status.
- [Card.tsx](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/frontend/src/components/Card.tsx): Representação visual individual de cada tarefa com suas ações correspondentes.
- [api.ts](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/frontend/src/services/api.ts): Centraliza todas as chamadas de rede à API do backend usando `fetch`.

---

## 2) Funcionalidades e Como Usar

### 🛠️ Funcionalidades do Sistema
O **Task Planner** provê uma experiência interativa e robusta baseada nas seguintes funcionalidades de negócio:
- **Painel Kanban Visual**: Organização de tarefas em três raias de status: *A Fazer (To Do)*, *Em Progresso (Doing)* e *Concluído (Done)*.
- **Criação Dinâmica de Tarefas**: Cadastro de novas demandas contendo título (obrigatório, limite de 100 caracteres), descrição detalhada, data de entrega, hora de entrega e nível de prioridade.
- **Movimentação Reativa por Drag & Drop**: Transição de status arrastando os cards entre colunas através da biblioteca `@dnd-kit/core`.
- **Classificação por Prioridade**: Tags visuais coloridas que categorizam as tarefas em prioridade *Alta*, *Média* ou *Baixa*.
- **Edição Completa**: Alteração reativa de qualquer campo de tarefas existentes.
- **Remoção de Tarefas**: Deleção permanente de tarefas obsoletas com diálogo de confirmação.

### 🚀 Como Usar a Aplicação
Uma vez que a aplicação esteja rodando localmente (veja a seção de instalação abaixo):
1. **Adicionar Tarefas**: 
   - Clique no botão **"Nova Tarefa"** no canto superior direito.
   - Preencha o título, descrição, prazos e prioridade no modal.
   - Clique em **"Criar Tarefa"** para adicioná-la imediatamente na coluna *A Fazer*.
2. **Progredir Tarefas (Movimentação)**: 
   - Clique e segure no título do card da tarefa desejada.
   - Arraste-o para a coluna correspondente ao novo estado e solte. A atualização no banco de dados ocorre automaticamente de forma assíncrona.
3. **Editar Dados**: 
   - Clique no ícone de lápis de qualquer card para abrir o modal de edição.
   - Faça as modificações e clique em **"Salvar"**.
4. **Remover Registro**: 
   - Clique no ícone de lixeira no card e confirme o pop-up de segurança no navegador.

### 📝 Histórias de Usuário e Rastreabilidade
Para a entrega da NP2, as principais Histórias de Usuário, contendo critérios de aceitação no formato *Given/When/Then*, prioridades e a rastreabilidade entre requisitos, commits/PRs e testes automatizados, estão catalogadas no documento:
- 📖 [docs/historias_usuario.md](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/docs/historias_usuario.md)

---

### Débitos Técnicos Mapeados

Após a análise do código fonte nos diretórios do projeto, os seguintes débitos técnicos foram identificados e necessitam de atenção:

#### 1. Banco de Dados e Modelagem

- **Mapeamento Inadequado de Data e Hora**: Os campos `date` e `time` no modelo [task.py (Model)](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/backend/models/task.py) estão mapeados como `db.String(20)` e `db.String(10)`. Isso impossibilita consultas cronológicas performáticas, ordenações robustas nativas do banco e formatações de data no backend. Devem ser refatorados para os tipos nativos do SQLAlchemy (`db.Date` e `db.Time` ou `db.DateTime`).
- **Falta de Enums no Banco de Dados**: A validação das opções de prioridade (`low`, `medium`, `high`) e status (`todo`, `doing`, `done`) é feita apenas na camada de serviço em memória. O banco de dados aceita qualquer String, o que pode corromper a integridade física dos dados. O ideal é usar o tipo Enum do PostgreSQL/SQLAlchemy.

#### 2. Backend (Flask)

- **Acoplamento do Banco na Camada de Serviços**: As funções no arquivo [task_services.py](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/backend/services/task_services.py) manipulam a sessão do banco diretamente (`db.session`). Recomenda-se a implementação do Repository Pattern para isolar a persistência da lógica de negócio e simplificar testes unitários mockados.
- **Tratamento de Erros Duplicado nas Rotas**: Há blocos `try/except` repetidos para gerenciar `ValueError` e `TaskNotFound` em cada rota do arquivo [task_routes.py](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/backend/routes/task_routes.py). Isso deve ser simplificado usando manipuladores de erros globais (`@app.errorhandler`) no Flask.
- **Falta de Validação Declarativa**: As validações são manuais e imperativas. A utilização de bibliotecas de validação como Marshmallow ou Pydantic trará robustez e legibilidade ao código.
- **Falta de Logs**: A API não implementa um sistema de logs estruturado para registrar erros, acessos ou alterações críticas no banco.

#### 3. Frontend (Next.js / React)

- **Tipagem Duplicada**: O tipo `Task` está duplicado e sendo redefinido nos arquivos [api.ts](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/frontend/src/services/api.ts), [Column.tsx](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/frontend/src/components/Column.tsx) e [Card.tsx](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/frontend/src/components/Card.tsx). O tipo deve ser unificado em um arquivo de tipos centralizado (ex: `src/types/task.ts`).
- **Área de Clique para Arrastar Reduzida (Usabilidade)**: No [Card.tsx](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/frontend/src/components/Card.tsx), as propriedades do DnD (`attributes` e `listeners`) estão associadas apenas ao container de título. Isso significa que o usuário não pode arrastar o cartão clicando na descrição ou em espaços em branco do card, o que é contra-intuitivo.
- **Fallback de URL Hardcoded**: No arquivo [api.ts](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/frontend/src/services/api.ts), a URL `http://localhost:5000` está fixada no código. Esse fallback deveria ser configurado apenas nas variáveis de ambiente do ambiente local.
- **Falta de Feedback Visual de Erros**: O frontend não captura de forma amigável as falhas das chamadas na API. Se o backend estiver fora do ar, o frontend continuará inativo sem informar o usuário adequadamente. A inclusão de um sistema de Toast facilitará a comunicação.

---

## 3) Instruções de Instalação e Execução Local

### Pré-requisitos

- **Python 3.10 ou superior** (para o backend)
- **Node.js 18.x ou superior** com `npm` (para o frontend)
- **Docker e Docker Compose** instalados (opção recomendada para rodar o banco de dados PostgreSQL) ou **PostgreSQL** instalado localmente.

---

### Passo 1: Executando o Banco de Dados (PostgreSQL via Docker)

A maneira mais rápida e fácil de rodar o banco de dados é utilizando o Docker Compose já configurado no projeto:

1. Certifique-se de que o Docker Desktop está em execução.
2. Na raiz do projeto, execute o comando para iniciar apenas o banco de dados em segundo plano:
   ```bash
   docker compose up -d db
   ```
   *Isso criará um container chamado `postgres-taskplanner` rodando o PostgreSQL na porta `5432` com usuário `postgres`, senha `admin` e a base de dados `tasks_db` já criada.*

---

### Passo 2: Executando o Backend (Flask)

1. Navegue até a pasta raiz do projeto (se já não estiver nela):
   ```bash
   cd TaskPlanner
   ```
2. Crie um ambiente virtual do Python:
   ```bash
   python -m venv venv
   ```
3. Ative o ambiente virtual:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux/macOS**:
     ```bash
     source venv/bin/activate
     ```
4. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
5. Crie as tabelas necessárias no banco rodando o script auxiliar:
   ```bash
   python backend/criar_tabelas.py
   ```
   *Você deve ver a mensagem "Tabelas criadas com sucesso!".*
6. Execute o servidor de desenvolvimento do backend:
   ```bash
   python backend/app.py
   ```
   *O backend iniciará e escutará no endereço `http://localhost:5000`.*

---

### Passo 3: Executando o Frontend (Next.js)

1. Abra um **novo terminal** e navegue até a pasta do frontend:
   ```bash
   cd TaskPlanner/frontend
   ```
2. Crie um arquivo chamado `.env.local` dentro da pasta `frontend/` com o seguinte conteúdo para apontar para a API do backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
3. Instale as dependências do Node.js:
   ```bash
   npm install
   ```
4. Execute a aplicação em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   *O frontend estará disponível em `http://localhost:3000`.*

---

### 💡 Alternativa Sem Docker (SQLite)
Caso prefira não usar Docker ou PostgreSQL local, você pode alterar o projeto para usar SQLite (que grava os dados num arquivo local `.db` automaticamente):
1. No arquivo [backend/app.py](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/backend/app.py) e [backend/criar_tabelas.py](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/backend/criar_tabelas.py), substitua a URL do banco para `sqlite:///tasks.db`.
2. Delete o banco de dados anterior (se aplicável), rode `python backend/criar_tabelas.py` e inicie o backend normalmente.

---


## 4) Uso Transparente de IA

De acordo com as diretrizes do edital da NP2, esta seção detalha o uso ético, produtivo e transparente de inteligência artificial generativa durante o ciclo de desenvolvimento do **Task Planner**.

### Ferramentas Utilizadas e Dinâmica de Trabalho

Utilizou-se o **ChatGPT** (OpenAI) e o **Antigravity CLI** (Gemini - Google) no fluxo de trabalho com as seguintes abordagens:

- **Dinâmica Individual (Pesquisa e Documentação)**: Utilização do ChatGPT para tirar dúvidas sintáticas de bibliotecas específicas (como manipulação de estados do `@dnd-kit`), validação de queries SQLAlchemy e escrita de rascunhos de testes unitários.
- **Pair Programming (Programação em Par)**: Uso do Antigravity CLI (Gemini) como copiloto ativo no terminal, fornecendo auxílio em tempo real para análises estruturais da base de código, mapeamento automático de débitos técnicos e otimização pontual de rotas.

---

### Registro de Prompts por Integrante

Abaixo está o detalhamento dos prompts reais aplicados no projeto por cada um dos 4 integrantes do grupo.

#### [Nome do Integrante 1] (Desenvolvedor Backend & Banco de Dados)

| #   | Prompt Real Utilizado                                                                                         | Status         | Justificativa Técnica                                                                                                                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | "Como configurar o Flask-Migrate com uma instância do SQLAlchemy separada no arquivo `app.py`?"               | **Aceita**     | A estrutura de inicialização e vinculação sugerida funcionou perfeitamente no [app.py](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/backend/app.py) sem requerer modificações sintáticas adicionais.                        |
| 2   | "Refatore a função `create_task` para retornar um dicionário e salvar a tarefa no banco usando o SQLAlchemy." | **Ajustada**   | A IA propôs o salvamento direto no banco e o retorno correto do método `to_dict()`, mas foi necessário adicionar manualmente as validações `.strip()` e a checagem do limite de 100 caracteres exigido pelo edital.                               |
| 3   | "Como usar o pg8000 para se conectar a um banco de dados remoto sem precisar instalar bibliotecas C?"         | **Descartada** | A IA sugeriu alterar a string de conexão para utilizar drivers adicionais que exigiam dependências locais do psycopg2, o que causava falhas de compilação no Windows. Optou-se por configurar manualmente o driver `postgresql+pg8000://` nativo. |

#### [Nome do Integrante 2] (Desenvolvedor Frontend & UI/UX)

| #   | Prompt Real Utilizado                                                                                                           | Status         | Justificativa Técnica                                                                                                                                                                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | "Crie um layout moderno de quadro Kanban usando Tailwind CSS com fundo gradiente escuro e bordas translúcidas (glassmorphism)." | **Aceita**     | O design de cores (`bg-gradient-to-br from-gray-950 via-indigo-950...`) e a estilização dos cartões gerada pela IA foram incorporados diretamente no [Board.tsx](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/frontend/src/components/Board.tsx) atendendo perfeitamente à expectativa estética. |
| 2   | "Como implementar o DndContext do @dnd-kit/core no React para arrastar cards entre colunas?"                                    | **Ajustada**   | O código inicial gerado pela IA servia apenas para listas verticais simples de colunas únicas. Foi adaptado para lidar com três colunas Kanban paralelas e com a renderização dinâmica do `DragOverlay`.                                                                                                               |
| 3   | "Como fazer chamadas HTTP usando a biblioteca Axios no Next.js App Router."                                                     | **Descartada** | A resposta recomendava adicionar o pacote `axios` e configurar interceptores redundantes para o escopo. Para manter a performance e a simplicidade de dependências, optou-se pela API nativa de `fetch` em [api.ts](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/frontend/src/services/api.ts).  |

#### [Nome do Integrante 3] (Engenheiro de QA / Testes)

| #   | Prompt Real Utilizado                                                                                          | Status         | Justificativa Técnica                                                                                                                                                                                                                      |
| --- | -------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | "Escreva uma fixture do Pytest para criar um banco de dados SQLite em memória para testes de rotas Flask."     | **Aceita**     | O código sugerido estruturou o fluxo de inicialização com `db.create_all()` e limpeza com `db.drop_all()` no [conftest.py](file:///C:/Users/lucas/Documents/INATEL/P8/C14/projeto/TaskPlanner/backend/conftest.py), funcionando no pytest. |
| 2   | "Como simular uma requisição PUT de JSON no cliente de teste do Flask com Pytest?"                             | **Ajustada**   | O exemplo sugeria o uso básico de `client.put()`, mas foi ajustado manualmente para serializar os dados via `json.dumps()` e definir o cabeçalho `"Content-Type": "application/json"` para evitar erros de leitura no endpoint.            |
| 3   | "Escreva testes de unidade para testar o DndContext e as interações de drag-and-drop do frontend com Cypress." | **Descartada** | O código gerado acoplava os seletores do Cypress a classes dinâmicas e randômicas do CSS, o que gerava falso-negativos frequentes nos testes. Decidiu-se cobrir a funcionalidade por testes exploratórios manuais.                         |

#### lucas David (DevOps & Documentação)

| #   | Prompt Real Utilizado                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Status         | Justificativa Técnica                                                                                                                                                                                            |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | agy "Crie a infraestrutura inicial de CI/CD para o nosso projeto Task Planner utilizando Jenkins com Docker, seguindo o padrão Docker-out-of-Docker (DooD). Para isso, crie dois arquivos na raiz do projeto: 1) Um arquivo 'docker-compose.yml' configurado para subir o serviço do Jenkins (imagem lts-jdk17) na porta 8080, mapeando o volume 'jenkins_home' e o socket do docker '/var/run/docker.sock' do host. 2) Um arquivo 'Jenkinsfile' contendo a estrutura base de uma pipeline declarativa (agent any) contendo apenas o primeiro estágio (stage) chamado 'Setup & Dependency Check'. Esse estágio deve conter os passos em shell (sh) para validar o ambiente e instalar as dependências do Python (ativando o venv e lendo o requirements.txt) e as dependências do Node.js dentro da pasta 'frontend'. Deixe placeholders claros no topo do Jenkinsfile indicando que este primeiro estágio foi desenvolvido e comitado por mim (Lucas, no papel de DevOps)." | **Aceita**     | A lista gerada cobriu eficientemente todas as dependências locais e caches de compilação, sendo salva diretamente no repositório.                                                                                |
| 2   | "Como configurar um script Python simples que limpa todas as migrações antigas do Flask-Migrate e recria o banco de dados PostgreSQL local."                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | **Ajustada**   | O script gerado tentava remover pastas do sistema operacional que geravam erros de permissão de escrita no Windows. O script foi ajustado para utilizar chamadas integradas do CLI do Flask de forma sequencial. |
| 3   | "Crie um workflow do GitHub Actions para rodar testes pytest e build do Nextjs em cada push para a branch main."                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | **Descartada** | A IA gerou uma esteira de CI/CD utilizando múltiplos containers Docker que ultrapassavam a cota gratuita do GitHub Actions. Decidiu-se automatizar localmente via hooks do git.                                  |

---

### O que NÃO foi feito por IA (Desenvolvido à Mão)

Apesar da IA atuar como acelerador de desenvolvimento, as seguintes tomadas de decisão e lógicas foram integralmente estruturadas à mão pelos integrantes do grupo:

1.  **Arquitetura de Banco de Dados**: A modelagem relacional lógica das tabelas e a decisão conceitual de não expor chaves estrangeiras complexas nesta fase inicial.
2.  **Políticas de CORS**: A configuração restritiva e de segurança da comunicação de origens cruzadas em `CORS(app, origins=["http://localhost:3000"])`.
3.  **UI/UX e Identidade Visual**: A conceituação da paleta de cores escura e o design de micro-interações do painel de tarefas que dão o aspecto premium da aplicação.
4.  **Regras de Negócio Críticas**: Os limites lógicos de tratamento de strings, sanitização manual de strings nos serviços do backend e tomadas de decisão de fluxos alternativos de erros.

---

## 5) Metodologia de Desenvolvimento

O processo de desenvolvimento do Task Planner foi conduzido de forma direta e simplificada pela equipe, adaptado para o escopo acadêmico do projeto.

### Organização e Ferramentas

- **Ausência de Metodologias Ágeis**: A equipe **não utilizou** metodologias ágeis formais (como Scrum, Kanban ou Sprints) para controle, planejamento e rastreamento de tarefas.
- **Comunicação Direta**: Não foram utilizadas ferramentas de gestão corporativas ou quadros de tarefas externos (como Jira, Trello ou GitHub Projects). Todo o alinhamento de tarefas, sincronização de progresso e resolução de dúvidas de desenvolvimento ocorreu de forma exclusiva através de um grupo de comunicação no **WhatsApp**.
- **Integração via Pull Requests (PRs)**: Para garantir a consistência e qualidade do código compartilhado, a equipe utilizou a prática de **Pull Requests obrigatórios** para cada push ou envio de código ao repositório central. Nenhuma modificação era integrada diretamente na branch principal sem antes passar pela aprovação e validação visual de outro integrante do grupo.

---

### Divisão de Papéis da Equipe

A equipe de 4 integrantes foi distribuída de acordo com seus respectivos papéis e áreas de foco no projeto:

- **`[Nome do Integrante 1]` (Desenvolvedor Backend)**: Focado na modelagem do banco de dados PostgreSQL, criação e otimização dos endpoints REST, conexões com banco e script de carga inicial.
- **`[Nome do Integrante 2]` (Desenvolvedor Frontend)**: Focado na arquitetura do Next.js, estruturação dos componentes reativos de interface (Kanban, Colunas, Cards) e na integração das APIs de Drag and Drop.
- **`[Nome do Integrante 3]` (Engenheiro de QA / Testes)**: Focado no desenvolvimento da suíte de testes unitários e de integração no backend, configuração das fixtures de banco em memória e garantia de estabilidade do código.
- **`Lucas David` (DevOps & Documentação)**: Focado no gerenciamento de versionamento do repositório, documentação do projeto, configurações ambientais locais de implantação e controle de PRs.

---

### Definição de Pronto (DoD - Definition of Done)

Para que uma atividade seja considerada como **Pronta (Concluída)** e integrada ao repositório, ela deve cumprir os seguintes critérios de aceitação básicos:

1.  **Revisão do Pull Request (PR)**: O código foi submetido via PR e aprovado por pelo menos outro integrante da equipe antes do merge final.
2.  **Testes Automatizados**: A suíte local de testes (`pytest`) deve rodar com 100% de sucesso.
3.  **Execução Sem Falhas**: A funcionalidade deve ser executada localmente sem gerar erros no console do Flask (backend) ou nas ferramentas do desenvolvedor do navegador (frontend).
