# Memora — Ideias de Melhorias

## 1. Classificação automática por categoria

### Abordagem simples
- Ao criar/editar uma nota, enviar título + conteúdo para a IA pedindo apenas a categoria
- Prompt: `"Classifique em UMA categoria: Tecnologia, Pessoal, Trabalho, Estudos, Finanças, Saúde, Outro. Responda apenas a categoria."`
- Salvar a categoria no banco (nova coluna `category`)
- Mostrar no Vault como badge ou permitir filtrar por categoria

### Abordagem avançada
- Deixar o usuário criar categorias customizadas
- A IA sugere a categoria mas o usuário pode alterar antes de salvar

---

## 2. Chat escalável — não mandar todas as notas

### A) Busca por relevância (mais simples, recomendado)
- Antes de mandar para a IA, fazer uma busca textual (`ILIKE` no PostgreSQL) com palavras-chave da mensagem do usuário
- Mandar apenas as 3-5 notas mais relevantes como contexto
- Prompt: `"Baseado nestas notas do usuário: [notas filtradas], responda: [pergunta]"`

### B) Resumos pré-gerados (intermediário)
- Ao criar uma nota, gerar um resumo curto via IA (1-2 frases)
- No chat, mandar apenas os resumos de todas as notas (muito menos tokens)
- Se a IA precisar de mais detalhe, buscar a nota completa

### C) Embeddings + busca vetorial (avançado, forte para portfólio)
- Ao criar uma nota, gerar um embedding (vetor numérico) do conteúdo
- Salvar no banco (PostgreSQL com extensão `pgvector`)
- Quando o usuário pergunta algo no chat, gerar embedding da pergunta e buscar as notas mais similares por distância vetorial
- Mandar apenas as top 3 notas relevantes para a IA
- Isso é basicamente **RAG (Retrieval-Augmented Generation)** — buzzword forte no mercado

---

## 3. Outras ideias

### Streaming de respostas
- Em vez de esperar a IA terminar, mostrar a resposta sendo digitada em tempo real (Server-Sent Events)
- Dá uma sensação muito mais profissional ao chat

### Histórico de contexto no chat
- Mandar as últimas 3-5 mensagens da conversa junto com a nova pergunta
- Assim a IA mantém contexto ("como eu disse antes...")

### Limitar tokens
- Contar tokens antes de enviar e truncar se necessário
- Mostra que você pensa em custo e limites de API

---

## Prioridade recomendada

1. **Classificação automática** — fácil de implementar, visual imediato
2. **Busca por relevância (opção A)** — resolve o problema de escala sem complexidade
3. **Embeddings/RAG (opção C)** — diferencial forte para impressionar recrutadores
