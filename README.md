# Memora 🧠

Assistente pessoal de anotações com IA. Salve suas notas e converse com a IA sobre o conteúdo que você anotou.

## Tecnologias

- **Frontend**: React + Tailwind CSS
- **Backend**: PHP 8.3 + Apache
- **Banco de dados**: PostgreSQL
- **IA**: GPT-4 via RapidAPI
- **Infraestrutura**: Docker + Docker Compose

## Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado
- Chave de API da RapidAPI (chatgpt-42)

## Como rodar

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd memora
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com sua chave de API:

```bash
cp src/.env.example src/.env
```

Edite o `src/.env` e adicione sua chave:

```
APIKEY=sua_chave_aqui
```

### 3. Suba os containers

```bash
docker compose up --build
```

As tabelas do banco de dados são criadas automaticamente na primeira vez que o container do PostgreSQL sobe.

### 4. Acesse o projeto

| Serviço | URL |
|---|---|
| Frontend (React) | http://localhost:3000 |
| Backend (PHP) | http://localhost:85 |
| Banco de dados | localhost:5433 |

## Estrutura do projeto

```
memora/
├── src/                    # Backend PHP
│   ├── index.php           # Roteador da API
│   ├── connection.php      # Conexão com o banco
│   ├── controllers/
│   │   ├── NoteController.php
│   │   └── ChatController.php
│   └── services/
│       └── AIService.php   # Integração com a IA
├── frontend/               # Frontend React
│   └── src/
│       ├── pages/
│       │   ├── Vault.js    # Listagem de notas
│       │   ├── NoteEditor.js # Criar/editar nota
│       │   └── Chat.js     # Chat com a IA
│       └── services/
│           └── api.js      # Chamadas à API
├── init.sql                # Script de criação das tabelas
├── docker-compose.yml
└── Dockerfile
```

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | /notes | Lista todas as notas |
| GET | /notes/:id | Busca nota por ID |
| POST | /notes | Cria nova nota |
| PUT | /notes/:id | Atualiza nota |
| DELETE | /notes/:id | Remove nota |
| POST | /chat | Envia mensagem pra IA |
| GET | /chat/history | Histórico de conversas |
