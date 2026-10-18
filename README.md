# Voluntariado IFRS

Aplicação monolítica para organizar eventos sociais e inscrições de
voluntários. O projeto contém uma API Express/MySQL em `service` e uma interface
React/Vite em `client`.

## Requisitos

- Node.js 20.19 ou superior (ou 22.12 ou superior)
- MySQL 8 ou superior
- npm

## Configuração do banco e da API

1. Execute [`service/src/database/schema.sql`](./service/src/database/schema.sql)
   no MySQL. O script cria as tabelas e insere dados fictícios.
2. Copie `service/.env.example` para `service/.env` e informe a configuração do
   MySQL. Defina `JWT_SECRET` como uma chave aleatória longa; não use o valor de
   exemplo em produção.
3. Instale as dependências e inicie o serviço:

   ```sh
   cd service
   npm install
   npm run dev
   ```

A API estará disponível em `http://localhost:3000`. A documentação OpenAPI/
Swagger está em `http://localhost:3000/api-docs`.

## Configuração do cliente

Em outro terminal:

```sh
cd client
npm install
npm run dev
```

O Vite mostra no terminal o endereço local da interface. O cliente usa a API em
`http://localhost:3000`.

## Acesso de demonstração

Após importar o SQL, use `admin@ifrs.edu.br` com a senha `123456` para testar
funções de administrador. O usuário fictício `user1@gmail.com`, também com senha
`123456`, permite testar o perfil de voluntário. Troque essas credenciais antes
de qualquer implantação real.

## API e arquitetura

O serviço separa responsabilidades em rotas, controllers, services e models.
As rotas `/auth`, `/events`, `/volunteers` e `/dashboard` cobrem autenticação,
gerenciamento de eventos e voluntários, e solicitações de participação.

- `GET /events` e `GET /events/:id` são públicos.
- `POST`, `PUT` e `DELETE /events` exigem JWT de administrador.
- `GET /dashboard` exige JWT válido.
- A inscrição de voluntários verifica a capacidade do evento; o administrador
  aprova ou recusa solicitações.

Consulte `tests.rest` para exemplos executáveis com a extensão REST Client do
VS Code.

## Verificações e padronização

Em `client` e `service`, estão disponíveis:

```sh
npm run lint
npm run format:check
npm run format
```

O serviço também oferece `npm test` para os testes unitários executáveis com o
runner nativo do Node.js.

## Pendências conhecidas

- A tela de voluntários lista e pesquisa os cadastros; o CRUD existe na API e
  há cadastro/edição/exclusão no fluxo da própria conta, mas não há controles
  para um administrador fazer todo o CRUD diretamente nessa tela.

## Entrega audiovisual

O link do vídeo de apresentação não foi incluído no código fornecido. Adicione
o link em um arquivo `.txt` antes de preparar o pacote final da prova.
