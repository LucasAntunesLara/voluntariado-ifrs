# 🤝 Sistema de Gestão de Ações de Voluntariado — IFRS

## 📋 Descrição do Projeto

Aplicação web para conectar voluntários a eventos e ações sociais do IFRS Campus Bento Gonçalves. O sistema reúne uma interface em React e uma API REST em Node.js/Express, com persistência em MySQL.

Voluntários podem criar uma conta, consultar eventos e solicitar participação. Administradores gerenciam eventos e voluntários e analisam as solicitações de participação.

Este projeto foi desenvolvido para a **Prova P1** da disciplina de **Desenvolvimento de Aplicações Corporativas**, do curso superior de Análise e Desenvolvimento de Sistemas do IFRS Campus Bento Gonçalves.

## 🛠️ Tecnologias Utilizadas

- **Front-end:** React, Vite e JavaScript
- **Estilização e componentes:** Tailwind CSS, CSS e Base UI
- **Navegação e formulários:** React Router, React Hook Form
- **Comunicação com a API:** Axios
- **Back-end:** Node.js e Express
- **Banco de dados:** MySQL, acessado por `mysql2`
- **Autenticação:** JWT (`jsonwebtoken`) e hash de senhas com `bcryptjs`
- **Documentação da API:** Swagger/OpenAPI e JSDoc
- **Qualidade de código:** ESLint e Prettier

## 📂 Arquitetura da Aplicação

O repositório contém dois módulos independentes, `client` e `service`. A API separa rotas, controllers, services e models para organizar o encaminhamento das requisições, as regras de negócio e o acesso ao banco de dados.

```text
├── client/
│   ├── public/                 # Arquivos estáticos
│   └── src/
│       ├── components/         # Componentes reutilizáveis e layout
│       ├── contexts/           # Estado de autenticação
│       ├── pages/              # Início, login, cadastro, eventos e painel
│       └── services/           # Cliente HTTP da API
├── service/
│   ├── src/
│   │   ├── config/             # Conexão com o banco de dados
│   │   ├── controllers/        # Tratamento das requisições e respostas
│   │   ├── database/           # Schema e dados iniciais do MySQL
│   │   ├── middlewares/        # Autenticação JWT e autorização por perfil
│   │   ├── models/             # Consultas e persistência
│   │   ├── routes/             # Endpoints da API
│   │   └── services/           # Regras de negócio
│   ├── tests/                  # Exemplos de requisições REST Client
│   └── server.js               # Inicialização da API
└── README.md
```

## 🗄️ Estrutura do Banco de Dados

O script [`service/src/database/schema.sql`](service/src/database/schema.sql) cria o banco `ifrs_voluntariado`, suas tabelas e dados fictícios para desenvolvimento.

### `users`

| Campo        | Tipo         | Descrição                                             |
| ------------ | ------------ | ----------------------------------------------------- |
| `id`         | INT          | Identificador único, auto incremento                  |
| `name`       | VARCHAR(100) | Nome do usuário                                       |
| `email`      | VARCHAR(100) | E-mail único                                          |
| `password`   | VARCHAR(255) | Hash da senha                                         |
| `role`       | ENUM         | Perfil `admin` ou `volunteer`; o padrão é `volunteer` |
| `created_at` | TIMESTAMP    | Data de criação                                       |

### `events`

| Campo            | Tipo         | Descrição                               |
| ---------------- | ------------ | --------------------------------------- |
| `id`             | INT          | Identificador único, auto incremento    |
| `title`          | VARCHAR(150) | Título do evento                        |
| `description`    | TEXT         | Descrição da ação                       |
| `location`       | VARCHAR(150) | Local do evento                         |
| `date`           | DATETIME     | Data e horário                          |
| `max_volunteers` | INT          | Limite de participantes, maior que zero |
| `created_at`     | TIMESTAMP    | Data de criação                         |

### `volunteers`

| Campo                   | Tipo                  | Descrição                                     |
| ----------------------- | --------------------- | --------------------------------------------- |
| `id`                    | INT                   | Identificador único, auto incremento          |
| `name`                  | VARCHAR(100)          | Nome do voluntário                            |
| `email`                 | VARCHAR(100)          | E-mail único                                  |
| `user_id`               | INT, opcional         | Vínculo único com uma conta em `users`        |
| `phone`                 | VARCHAR(20), opcional | Telefone de contato                           |
| `course_or_affiliation` | VARCHAR(100)          | Curso ou vínculo; padrão `Comunidade Externa` |
| `created_at`            | TIMESTAMP             | Data de criação                               |

### `event_volunteers`

| Campo           | Tipo          | Descrição                                  |
| --------------- | ------------- | ------------------------------------------ |
| `id`            | INT           | Identificador único, auto incremento       |
| `event_id`      | INT           | Evento relacionado                         |
| `volunteer_id`  | INT, opcional | Voluntário cadastrado sem conta            |
| `user_id`       | INT, opcional | Conta de usuário voluntário                |
| `status`        | ENUM          | Estado `pending`, `approved` ou `rejected` |
| `registered_at` | TIMESTAMP     | Data da inscrição                          |

Cada inscrição relaciona um evento a um cadastro de voluntário ou a uma conta de usuário. As chaves estrangeiras e restrições do schema impedem duplicidade para o mesmo vínculo e removem inscrições dependentes quando o evento ou usuário relacionado é excluído.

## 🛑 Regras de Negócio

- As senhas são armazenadas com hash bcrypt e não são incluídas nos dados públicos do perfil.
- O cadastro cria uma conta com perfil `volunteer` e a associa a um cadastro de voluntário.
- O token JWT gerado no login tem validade de **8 horas** e identifica o usuário e seu perfil.
- Apenas administradores podem criar, alterar e remover eventos, além de consultar a lista completa de voluntários e analisar solicitações.
- Usuários autenticados com perfil `volunteer` podem solicitar participação em eventos.
- Uma nova solicitação começa como `pending`; o administrador pode aprová-la ou recusá-la.
- A lotação considera inscrições `approved`. Ao analisar uma solicitação, o sistema a recusa se as vagas já tiverem sido preenchidas.
- Um usuário não pode manter mais de uma solicitação ativa para o mesmo evento. Uma solicitação recusada pode ser enviada novamente.

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js e npm
- MySQL em execução
- (Opcional) Extensão **REST Client** no VS Code para executar os arquivos `.rest`

### 1. Configurar o banco de dados

Na raiz do repositório, execute o script do schema usando um usuário MySQL com permissão para criar o banco:

```bash
mysql -u root -p < service/src/database/schema.sql
```

> **Atenção:** o script recria as tabelas e remove dados anteriores. Use-o em uma instância de desenvolvimento sem dados que você queira preservar.

### 2. Configurar e iniciar a API

Crie `service/.env` com as credenciais da sua instalação MySQL e uma chave JWT própria:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_DATABASE=ifrs_voluntariado
PORT=3000
JWT_SECRET=substitua_por_uma_chave_aleatoria
```

No terminal:

```bash
cd service
npm install
npm run dev
```

A API ficará disponível em `http://localhost:3000`. A especificação interativa Swagger fica em `http://localhost:3000/api-docs`.

### 3. Iniciar a interface web

Em outro terminal, na raiz do repositório:

```bash
cd client
npm install
npm run dev
```

Abra o endereço indicado pelo Vite no terminal (normalmente `http://localhost:5173`). O cliente está configurado para chamar a API em `http://localhost:3000`.

### Conta inicial de desenvolvimento

O schema inclui a conta administrativa `admin@ifrs.edu.br` com senha `123456`, além de usuários e eventos fictícios. Use essas credenciais apenas localmente e altere ou remova as contas de exemplo em qualquer ambiente compartilhado.

### Scripts disponíveis

| Diretório | Comando           | Descrição                                   |
| --------- | ----------------- | ------------------------------------------- |
| `service` | `npm run dev`     | Inicia a API com reinicialização automática |
| `service` | `npm start`       | Inicia a API                                |
| `service` | `npm run lint`    | Executa o ESLint                            |
| `client`  | `npm run dev`     | Inicia o servidor de desenvolvimento Vite   |
| `client`  | `npm run build`   | Gera a versão de produção                   |
| `client`  | `npm run preview` | Serve localmente a versão de produção       |
| `client`  | `npm run lint`    | Executa o ESLint                            |

## 🛣️ Endpoints da API

Os endpoints abaixo refletem as rotas registradas atualmente no serviço. Quando indicado, envie o token no cabeçalho `Authorization: Bearer <token>`.

### Autenticação e perfil

| Método   | Rota             | Descrição                                | Acesso  |
| -------- | ---------------- | ---------------------------------------- | ------- |
| `POST`   | `/auth/login`    | Autentica e retorna token JWT e perfil   | Público |
| `POST`   | `/auth/register` | Cria conta de voluntário e inicia sessão | Público |
| `GET`    | `/auth/me`       | Consulta o perfil da conta autenticada   | JWT     |
| `PATCH`  | `/auth/me`       | Atualiza nome e e-mail da conta          | JWT     |
| `DELETE` | `/auth/me`       | Exclui a própria conta                   | JWT     |

### Eventos

| Método   | Rota          | Descrição                                           | Acesso  |
| -------- | ------------- | --------------------------------------------------- | ------- |
| `GET`    | `/events`     | Lista eventos e contagem de participantes aprovados | Público |
| `GET`    | `/events/:id` | Busca um evento pelo ID                             | Público |
| `POST`   | `/events`     | Cria um evento                                      | `admin` |
| `PUT`    | `/events/:id` | Atualiza um evento                                  | `admin` |
| `DELETE` | `/events/:id` | Remove um evento                                    | `admin` |

### Voluntários

| Método   | Rota              | Descrição                          | Acesso  |
| -------- | ----------------- | ---------------------------------- | ------- |
| `GET`    | `/volunteers`     | Lista os voluntários               | `admin` |
| `GET`    | `/volunteers/:id` | Busca um voluntário pelo ID        | `admin` |
| `POST`   | `/volunteers`     | Cria um cadastro de voluntário     | `admin` |
| `PUT`    | `/volunteers/:id` | Atualiza um cadastro de voluntário | `admin` |
| `DELETE` | `/volunteers/:id` | Remove um cadastro de voluntário   | `admin` |

### Inscrições em eventos

| Método   | Rota                                       | Descrição                               | Acesso      |
| -------- | ------------------------------------------ | --------------------------------------- | ----------- |
| `GET`    | `/events/:eventId/volunteers`              | Lista participantes aprovados no evento | Público     |
| `POST`   | `/events/:eventId/volunteers`              | Solicita participação no evento         | `volunteer` |
| `DELETE` | `/events/:eventId/volunteers/:volunteerId` | Remove uma inscrição de voluntário      | `admin`     |

### Painel e análise de solicitações

| Método  | Rota                                           | Descrição                                                               | Acesso  |
| ------- | ---------------------------------------------- | ----------------------------------------------------------------------- | ------- |
| `GET`   | `/dashboard`                                   | Retorna o painel do usuário autenticado                                 | JWT     |
| `POST`  | `/dashboard/admins`                            | Cria uma conta administrativa                                           | `admin` |
| `GET`   | `/dashboard/participation-requests`            | Lista solicitações para análise                                         | `admin` |
| `GET`   | `/dashboard/my-participation-requests`         | Lista solicitações do usuário autenticado                               | JWT     |
| `PATCH` | `/dashboard/participation-requests/:requestId` | Aprova ou recusa uma solicitação (`status: "approved"` ou `"rejected"`) | `admin` |

> O cadastro público de contas de voluntário é feito por `POST /auth/register`. As operações administrativas em `/volunteers` exigem token JWT de um usuário com perfil `admin`. Voluntários podem consultar e atualizar os próprios dados de conta por `/auth/me`.

## 🧪 Requisições de Exemplo

Os arquivos [`service/tests/events_routes.rest`](service/tests/events_routes.rest), [`service/tests/volunteers_routes.rest`](service/tests/volunteers_routes.rest) e [`service/tests/event_volunteers.rest`](service/tests/event_volunteers.rest) contêm exemplos de requisições para a extensão REST Client do VS Code.
