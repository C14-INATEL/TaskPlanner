# Task Planner

## 1) Nome do Projeto e Explicação Detalhada

O **Task Planner** é um gerenciador de tarefas interativo baseado no método Kanban (quadro visual com colunas de status). O projeto foi construído utilizando uma arquitetura moderna e desacoplada, dividida em um backend que gerencia a persistência dos dados e regras de negócio, e um frontend interativo que provê a interface do usuário.

### Arquitetura do Projeto

- **Backend (Flask & SQLAlchemy)**: Fornece uma API RESTful para gerenciar o ciclo de vida das tarefas (CRUD). Utiliza o PostgreSQL como banco de dados e SQLAlchemy como ORM, além de ferramentas de migração com Flask-Migrate e testes automatizados com Pytest.
- **Frontend (Next.js, React & TailwindCSS)**: Interface web com design escuro moderno e responsivo. A dinâmica de movimentação de tarefas é gerenciada através de drag and drop utilizando a biblioteca `@dnd-kit/core`.

### Estrutura de Código Relevante

- [app.py](backend/app.py): Configura a aplicação Flask, CORS, conexão com o banco e inicializa os blueprints das rotas.
- [task.py (Model)](backend/models/task.py): Mapeia o esquema da tabela `tasks` no banco de dados.
- [task_routes.py](backend/routes/task_routes.py): Define os endpoints HTTP da API para as operações nas tarefas.
- [task_services.py](backend/services/task_services.py): Centraliza as regras de negócio e validações (ex: tamanho do título, prioridades e status válidos).
- [Board.tsx](frontend/src/components/Board.tsx): Componente principal do Kanban. Controla o estado de arrastar e soltar e os modais de inserção/edição.
- [Column.tsx](frontend/src/components/Column.tsx): Exibe a lista filtrada de tarefas de acordo com seu status.
- [Card.tsx](frontend/src/components/Card.tsx): Representação visual individual de cada tarefa com suas ações correspondentes.
- [api.ts](frontend/src/services/api.ts): Centraliza todas as chamadas de rede à API do backend usando `fetch`.

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

---

### Débitos Técnicos Mapeados

Após a análise do código fonte nos diretórios do projeto, os seguintes débitos técnicos foram identificados e necessitam de atenção:

#### 1. Banco de Dados e Modelagem

- **Mapeamento Inadequado de Data e Hora**: Os campos `date` e `time` no modelo [task.py (Model)](backend/models/task.py) estão mapeados como `db.String(20)` e `db.String(10)`. Isso impossibilita consultas cronológicas performáticas, ordenações robustas nativas do banco e formatações de data no backend. Devem ser refatorados para os tipos nativos do SQLAlchemy (`db.Date` e `db.Time` ou `db.DateTime`).
- **Falta de Enums no Banco de Dados**: A validação das opções de prioridade (`low`, `medium`, `high`) e status (`todo`, `doing`, `done`) é feita apenas na camada de serviço em memória. O banco de dados aceita qualquer String, o que pode corromper a integridade física dos dados. O ideal é usar o tipo Enum do PostgreSQL/SQLAlchemy.

#### 2. Backend (Flask)

- **Acoplamento do Banco na Camada de Serviços**: As funções no arquivo [task_services.py](backend/services/task_services.py) manipulam a sessão do banco diretamente (`db.session`). Recomenda-se a implementação do Repository Pattern para isolar a persistência da lógica de negócio e simplificar testes unitários mockados.
- **Tratamento de Erros Duplicado nas Rotas**: Há blocos `try/except` repetidos para gerenciar `ValueError` e `TaskNotFound` em cada rota do arquivo [task_routes.py](backend/routes/task_routes.py). Isso deve ser simplificado usando manipuladores de erros globais (`@app.errorhandler`) no Flask.
- **Falta de Validação Declarativa**: As validações são manuais e imperativas. A utilização de bibliotecas de validação como Marshmallow ou Pydantic trará robustez e legibilidade ao código.
- **Falta de Logs**: A API não implementa um sistema de logs estruturado para registrar erros, acessos ou alterações críticas no banco.

#### 3. Frontend (Next.js / React)

- **Tipagem Duplicada**: O tipo `Task` está duplicado e sendo redefinido nos arquivos [api.ts](frontend/src/services/api.ts), [Column.tsx](frontend/src/components/Column.tsx) e [Card.tsx](frontend/src/components/Card.tsx). O tipo deve ser unificado em um arquivo de tipos centralizado (ex: `src/types/task.ts`).
- **Área de Clique para Arrastar Reduzida (Usabilidade)**: No [Card.tsx](frontend/src/components/Card.tsx), as propriedades do DnD (`attributes` e `listeners`) estão associadas apenas ao container de título. Isso significa que o usuário não pode arrastar o cartão clicando na descrição ou em espaços em branco do card, o que é contra-intuitivo.
- **Fallback de URL Hardcoded**: No arquivo [api.ts](frontend/src/services/api.ts), a URL `http://localhost:5000` está fixada no código. Esse fallback deveria ser configurado apenas nas variáveis de ambiente do ambiente local.
- **Falta de Feedback Visual de Erros**: O frontend não captura de forma amigável as falhas das chamadas na API. Se o backend estiver fora do ar, o frontend continuará inativo sem informar o usuário adequadamente. A inclusão de um sistema de Toast facilitará a comunicação.

---

## 3) Instruções de Instalação e Execução Local

### Pré-requisitos

- **Python 3.10 ou superior**
- **Node.js 18.x ou superior** (com npm)
- **Docker e Docker Compose** instalados (Recomendado para o banco de dados)

---

### Passo 1: Executando o Banco de Dados (PostgreSQL via Docker)

1. Certifique-se de que o Docker está em execução.
2. Na raiz do projeto, execute:
   ```bash
   docker-compose up -d db
   ```
   *Isso iniciará o PostgreSQL na porta 5432 com as credenciais padrão.*

---

### Passo 2: Executando o Backend (Flask)

1. Navegue até a pasta raiz:
   ```bash
   cd TaskPlanner
   ```
2. Configure o ambiente virtual e instale dependências:
   ```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # Windows
   pip install -r requirements.txt
   ```
3. Crie as tabelas e inicie o servidor:
   ```bash
   python backend/criar_tabelas.py
   python backend/app.py
   ```

---

### Passo 3: Executando o Frontend (Next.js)

1. Em um novo terminal, entre na pasta frontend:
   ```bash
   cd TaskPlanner/frontend
   ```
2. Instale dependências e inicie:
   ```bash
   npm install
   npm run dev
   ```
   *Acesse em http://localhost:3000.*

---

## 4) Uso Transparente de IA

De acordo com as diretrizes do edital da NP2, esta seção detalha o uso ético, produtivo e transparente de inteligência artificial generativa durante o ciclo de desenvolvimento do **Task Planner**.

### Registro de Prompts por Integrante

Abaixo está o detalhamento dos prompts reais aplicados no projeto por cada um dos 4 integrantes do grupo.

#### Gustavo Silva Marques (Desenvolvedor Backend & Banco de Dados)

| #   | Prompt Real Utilizado | Status | Justificativa Técnica |
| --- | --- | --- | --- |
| 1   | "Eu tive um erro aqui: building 'psycopg2._psycopg' extension error: Microsoft Visual C++ 14.0 or greater is required" | **Aceita** | Sugestão de uso de versões binárias do driver para evitar compilação no Windows. |
| 2   | "Como corrigir o erro received warnings: LegacyAPIWarning: The Query.get() method is considered legacy..." | **Aceita** | Atualização para sintaxe moderna do SQLAlchemy 2.0 (`db.session.get`). |
| 3   | "Me ajuda a fazer o pyproject.toml no me projeto?" | **Descartada** | A IA sugeriu configurações obsoletas de setuptools que geraram erros de importação. |

#### [Nome do Integrante 2] (Desenvolvedor Frontend & UI/UX)

| #   | Prompt Real Utilizado | Status | Justificativa Técnica |
| --- | --- | --- | --- |
| 1   | "Crie um layout moderno de quadro Kanban usando Tailwind CSS com fundo gradiente escuro..." | **Aceita** | Design de cores e estilização visual dos cards. |
| 2   | "Como implementar o DndContext do @dnd-kit/core no React para arrastar cards entre colunas?" | **Ajustada** | Adaptação para múltiplas colunas e renderização de DragOverlay. |
| 3   | "Como fazer chamadas HTTP usando a biblioteca Axios no Next.js App Router." | **Descartada** | Optou-se pelo uso da API nativa `fetch` para simplificação. |

#### Marcus Vinícius de Faria Junho Filho (Engenheiro de QA / Testes)

| #   | Prompt Real Utilizado | Status | Justificativa Técnica |
| --- | --- | --- | --- |
| 1   | "Atualize os testes unitários das rotas Flask para usar mock.side_effect com exceções..." | **Aceita** | Alinhamento dos testes ao novo comportamento de tratamento de erros global. |
| 2   | "Crie testes unitários para validações de input no backend: título vazio, espaços, limite de caracteres..." | **Aceita** | Expansão da cobertura de testes para 27 casos de uso. |
| 3   | "Como criar um job de testes no Jenkins com um stage que rode pytest e jest dentro de um container Docker?" | **Ajustada** | Configuração do ambiente de CI com instalação dinâmica de ferramentas. |

#### Lucas David (DevOps & Documentação)

| #   | Prompt Real Utilizado | Status | Justificativa Técnica |
| --- | --- | --- | --- |
| 1   | "Crie a infraestrutura inicial de CI/CD para o nosso projeto Task Planner utilizando Jenkins com Docker (DooD)..." | **Aceita** | Configuração da pipeline Jenkins e suporte a containers. |
| 2   | "Verifique se o README está seguindo o padrão pedido no projeto, caso não liste o que deve ser alterado..." | **Aceita** | Auditoria de conformidade com o edital NP2. |
| 3   | "Com base no Jenkinsfile e no docker-compose.yml, escreva uma seção 'Processo de CI/CD' para o README.md..." | **Aceita** | Formalização da documentação técnica da automação. |

---

## 5) Metodologia de Desenvolvimento

O processo de desenvolvimento do Task Planner foi conduzido através de um fluxo focado em **Integração Contínua** e **Revisão por Pares**.

### Organização e Ferramentas

- **Comunicação Direta**: Alinhamentos diários via WhatsApp para sincronização de progresso.
- **Integração via Pull Requests (PRs)**: Uso obrigatório de PRs para cada envio de código, garantindo que nenhuma modificação fosse integrada sem a revisão de outro integrante.
- **Métricas**: Monitoramento de issues e Pull Requests para controle de entrega.

### Divisão de Papéis da Equipe

- **`Gustavo Silva Marques`**: Desenvolvedor Backend & Banco de Dados.
- **`[Nome do Integrante 2]`**: Desenvolvedor Frontend & UI/UX.
- **`Marcus Vinícius de Faria Junho Filho`**: Engenheiro de QA / Testes.
- **`Lucas David`**: DevOps & Documentação Lead.

### Definição de Pronto (DoD - Definition of Done)

1. **Revisão do Pull Request (PR)**: Código revisado e aprovado.
2. **Testes Automatizados**: Suíte local de testes rodando com 100% de sucesso.
3. **Execução Sem Falhas**: Funcionalidade testada localmente em ambiente Docker.

---

## 6) Processo de CI/CD (Servidor Jenkins)

### 🔧 Ferramenta Oficial
Atendendo ao requisito de **não utilizar o GitHub Actions**, adotamos o **Jenkins** como ferramenta oficial, rodando em container Docker (DooD).

### 🏃 Estágios da Pipeline
1. **Setup**: Validação de ambiente e instalação de dependências.
2. **Build Backend**: Geração de artefatos de distribuição do Python.
3. **Testes**: Execução de testes automatizados (Pytest e Jest).

---

## 7) Histórias de Usuário e Rastreabilidade
As histórias de usuário completas, contendo critérios de aceitação e matriz de rastreabilidade, estão disponíveis em:
- [docs/historias_usuario.md](docs/historias_usuario.md)
