# Guia de Implementação — Categorias com Classificação Automática

## Visão geral

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  Frontend   │────▶│   PHP API    │────▶│ PostgreSQL │
│             │     │              │     │            │
│ - CRUD cats │     │ - /categories│     │ categories │
│ - Toggle IA │     │ - AIService  │     │ notes.cat  │
└─────────────┘     └──────┬───────┘     └────────────┘
                           │ (se auto-classificar)
                           ▼
                    ┌──────────────┐
                    │   GPT-4 API  │
                    └──────────────┘
```

---

## Etapa 1 — Banco de dados

Criar a tabela de categorias e adicionar a relação na tabela de notas.

**O que fazer:**
- Criar tabela `categories` com: `id`, `name`, `created_at`
- Adicionar coluna `category_id` na tabela `notes` (nullable, FK para categories)

**Dica:** Altere o `init.sql` e recrie o container do postgres, ou rode o SQL direto no banco.

---

## Etapa 2 — Backend: CRUD de categorias

Criar um `CategoryController.php` com as operações básicas.

**Rotas:**
| Método | Rota | Ação |
|--------|------|------|
| GET | /categories | Listar todas |
| POST | /categories | Criar nova |
| DELETE | /categories/:id | Remover |

**Dica:** Siga o mesmo padrão do `NoteController`. Valide que `name` não está vazio no POST.

---

## Etapa 3 — Backend: Associar categoria à nota

**O que fazer:**
- No `NoteController::create` e `update`, aceitar o campo `category_id` (opcional)
- No `NoteController::list` e `findById`, retornar o `category_id` junto

**Dica:** Adicione `category_id` no INSERT/UPDATE. Use LEFT JOIN se quiser retornar o nome da categoria junto.

---

## Etapa 4 — Backend: Classificação automática

**O que fazer:**
- Criar um método no `AIService` (ex: `classify`) que recebe o texto da nota + lista de categorias
- Retorna o nome da categoria escolhida
- No `NoteController::create`, se o frontend mandar `auto_classify: true`, chamar esse método

**Prompt sugerido:**
```
Classifique a seguinte nota em UMA das categorias: [cat1, cat2, cat3].
Responda APENAS o nome exato da categoria, nada mais.

Título: {titulo}
Conteúdo: {conteudo}
```

**Dica:** Depois de receber a resposta, faça um `trim()` e compare com as categorias existentes. Se não bater com nenhuma, salve sem categoria.

---

## Etapa 5 — Frontend: Tela de categorias

**O que fazer:**
- Criar uma página ou modal para gerenciar categorias (listar, criar, excluir)
- Adicionar botão "Categorias" no header do Vault

**Dica:** Pode ser uma página nova (`/categories`) ou um modal simples no Vault.

---

## Etapa 6 — Frontend: Selecionar categoria ao criar nota

**O que fazer:**
- No `NoteEditor`, adicionar um `<select>` com as categorias disponíveis
- Adicionar um checkbox "Classificar automaticamente"
- Se marcado, não mostrar o select — enviar `auto_classify: true` no POST

---

## Etapa 7 — Frontend: Mostrar e filtrar por categoria no Vault

**O que fazer:**
- Mostrar a categoria como badge no card da nota
- Adicionar filtro por categoria (dropdown ou botões)

---

## Ordem recomendada

1. Banco (etapa 1)
2. CRUD categorias no backend (etapa 2)
3. Associar à nota no backend (etapa 3)
4. Tela de categorias no frontend (etapa 5)
5. Select no editor de notas (etapa 6)
6. Mostrar/filtrar no Vault (etapa 7)
7. Classificação automática por último (etapa 4) — depende de tudo anterior

---

## Dúvidas comuns

**Como registrar a rota no index.php?**
Adicione um novo bloco `if ($route === 'categories')` seguindo o padrão de `notes`.

**Como passar auto_classify do frontend?**
Adicione no body do POST: `{ title, content, tags, category_id, auto_classify: true }`

**E se a IA retornar algo inesperado?**
Compare a resposta com as categorias do banco. Se não bater, salve a nota sem categoria.
