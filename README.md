# Memora

Assistente pessoal de anotações com IA. Salve suas notas, organize por categorias e converse com a IA sobre o conteúdo que você anotou.

## Funcionalidades

- CRUD completo de notas com tags e categorias
- Classificação automática de notas por IA (opcional, ativável nas configurações)
- Filtro de notas por categoria
- Chat com IA que usa suas notas como contexto (busca por relevância)
- Histórico de conversas persistente com opção de limpar
- Categorias customizadas com cores
- Interface responsiva com tema dark
- Containerização completa com Docker

## Screenshots

<!-- Adicione screenshots aqui -->
<!-- ![Vault](./screenshots/vault.png) -->
<!-- ![Chat](./screenshots/chat.png) -->

## Arquitetura

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│   React     │───▶│   PHP API    │───▶ │ PostgreSQL │
│  (port 3000)│     │  (port 85)   │     │ (port 5433)│
└─────────────┘     └──────┬───────┘     └────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Groq API   │
                    │  (llama 3.1) │
                    └──────────────┘
```

## Tecnologias

- **Frontend**: React 18 + Tailwind CSS + React Router
- **Backend**: PHP 8.3 + Apache
- **Banco de dados**: PostgreSQL
- **IA**: Groq API (llama-3.1-8b-instant) — rápida e gratuita
- **Infraestrutura**: Docker + Docker Compose

## Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado
- Chave de API da [Groq](https://console.groq.com) (gratuita)

## Como rodar

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd memora
```

### 2. Configure a chave de API

Crie uma conta gratuita em [console.groq.com](https://console.groq.com), gere uma API key e adicione no arquivo `src/.env`:

```
APIKEY=sua_chave_groq_aqui
```

> Se o arquivo não existir, crie-o na pasta `src/` com esse conteúdo.

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
├── src/                         # Backend PHP
│   ├── index.php                # Roteador da API
│   ├── connection.php           # Conexão com o banco
│   ├── controllers/
│   │   ├── NoteController.php
│   │   ├── ChatController.php
│   │   ├── CategoriesController.php
│   │   └── SettingsController.php
│   └── services/
│       └── AIService.php        # Integração com a IA
├── frontend/                    # Frontend React
│   └── src/
│       ├── pages/
│       │   ├── Vault.js         # Listagem e filtro de notas
│       │   ├── NoteEditor.js    # Criar/editar nota
│       │   ├── Chat.js          # Chat com a IA
│       │   ├── Categories.js    # Gerenciar categorias
│       │   └── Settings.js      # Configurações do app
│       └── services/
│           └── api.js           # Chamadas à API
├── init.sql                     # Script de criação das tabelas
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
| POST | /chat | Envia mensagem para a IA |
| GET | /chat | Histórico de conversas |
| DELETE | /chat | Limpa histórico de conversas |
| GET | /categories | Lista categorias |
| POST | /categories | Cria categoria |
| DELETE | /categories/:id | Remove categoria |
| GET | /settings | Retorna configurações |
| PUT | /settings | Atualiza configuração |

## Aprendizados

- Integração com APIs de IA (Groq / OpenAI-compatible)
- RAG simplificado: busca por relevância com ILIKE antes de enviar contexto à IA
- Arquitetura MVC no backend PHP
- Gerenciamento de estado no React com hooks (useState, useEffect, useRef)
- Containerização multi-serviço com Docker Compose
- Tratamento de erros em aplicações full-stack
- CORS e comunicação frontend ↔ backend

## Melhorias futuras

- [ ] Autenticação de usuários (JWT)
- [ ] Markdown nas notas
- [ ] Streaming de respostas da IA
- [ ] Busca semântica com embeddings (RAG completo)
- [ ] Testes unitários e de integração
