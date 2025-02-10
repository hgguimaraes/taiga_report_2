## Documentação da API

### Endpoints Utilizados

#### Autenticação

```typescript
POST /api/v1/auth
Content-Type: application/json

Requisição:
{
  "type": "normal",     // Tipo de autenticação (sempre "normal" para autenticação básica)
  "username": string,   // Nome de usuário registrado no Taiga
  "password": string    // Senha do usuário
}

Resposta:
{
  "auth_token": string, // Token JWT para autenticação em requisições subsequentes
  "refresh": string     // Token para renovar a autenticação quando expirada
}
```

#### Histórias de Usuário

```typescript
GET /api/v1/userstories
Headers:
  Authorization: Bearer ${token}  // Token JWT obtido na autenticação
Query Parameters:
  project: number                 // ID numérico do projeto no Taiga

Resposta:
[{
  id: number,                    // Identificador único da história
  subject: string,              // Título/descrição da história
  status_extra_info: {
    name: string,               // Nome do status (ex: "Novo", "Em Progresso", "Concluído")
    color: string               // Código de cor hexadecimal do status (ex: "#FF0000")
  },
  created_date: string,         // Data de criação no formato ISO 8601 (ex: "2024-03-15T10:30:00Z")
  status: string,               // Identificador do status
  assigned_to: number | null,   // ID do usuário designado (null se não atribuído)
  is_closed: boolean,           // Indica se a história está fechada/concluída
  points: {                     // Pontos estimados por função
    role: number               // Quantidade de pontos por papel (ex: desenvolvedor, tester)
  },
  priority: number             // Nível de prioridade (1-4, sendo 4 o mais prioritário)
}]
```

#### Comentários

```typescript
GET /api/v1/history/userstory/${id}
Headers:
  Authorization: Bearer ${token}  // Token JWT obtido na autenticação
Parameters:
  id: number                      // ID da história de usuário

Resposta:
[{
  user: {
    username: string,            // Nome de usuário que fez o comentário
    full_name: string,          // Nome completo do usuário
    photo: string | null        // URL da foto do perfil (null se não houver)
  },
  comment: string,              // Texto do comentário
  created_at: string,          // Data e hora do comentário (ISO 8601)
  delete_comment_date: string | null,  // Data de exclusão, se aplicável
  edit_comment_date: string | null,    // Data da última edição, se aplicável
  is_hidden: boolean           // Indica se o comentário está oculto
}]
```

### Tipos de Dados

```typescript
// Resposta da autenticação
interface TaigaAuth {
  auth_token: string;    // Token JWT para autenticação
  refresh: string;       // Token para renovação da sessão
  expires_in?: number;   // Tempo em segundos até a expiração do token
}

// História de usuário
interface TaigaUserStory {
  id: number;            // ID único da história
  ref: number;          // Número de referência no projeto
  subject: string;      // Título da história
  description: string;  // Descrição detalhada
  status: string;       // ID do status atual
  status_extra_info: {
    name: string;       // Nome do status
    color: string;      // Cor do status em hexadecimal
    is_closed: boolean; // Indica se é um status final
  };
  created_date: string; // Data de criação (ISO 8601)
  modified_date: string; // Data da última modificação
  finish_date: string | null; // Data de conclusão, se finalizada
  project: number;     // ID do projeto
  sprint: number | null; // ID do sprint, se atribuído
  watchers: number[];   // IDs dos usuários observando a história
}

// Comentário em história
interface TaigaComment {
  user: {
    username: string;   // Nome de usuário
    full_name: string;  // Nome completo
    email: string;      // Email do usuário
    photo: string | null; // URL da foto de perfil
  };
  comment: string;      // Texto do comentário
  created_at: string;   // Data de criação (ISO 8601)
  modified_at: string | null; // Data da última modificação
  delete_comment_date: string | null; // Data de exclusão
  is_hidden: boolean;   // Status de visibilidade
  attachments: Array<{  // Arquivos anexados
    id: number;         // ID do anexo
    name: string;       // Nome do arquivo
    size: number;       // Tamanho em bytes
    url: string;        // URL para download
  }>;
}
```

### Tratamento de Erros

A API implementa os seguintes códigos de status HTTP:

- 200: Sucesso
  - Requisição processada com sucesso
  - Retorna os dados solicitados

- 400: Requisição inválida
  - Parâmetros ausentes ou inválidos
  - Formato de dados incorreto
  - Validação falhou

- 401: Não autorizado
  - Token ausente
  - Token expirado
  - Credenciais inválidas

- 403: Proibido
  - Usuário sem permissão para o recurso
  - Projeto privado ou inacessível
  - Ação não permitida para o usuário

- 404: Não encontrado
  - Recurso não existe
  - História deletada
  - Projeto não encontrado

- 500: Erro interno do servidor
  - Falha no processamento
  - Erro de banco de dados
  - Serviço indisponível

### Limitações e Boas Práticas

1. **Rate Limiting**
   - Máximo de 100 requisições por minuto
   - Implementar exponential backoff em caso de erro 429 (Too Many Requests)
   - Agrupar requisições quando possível
   - Monitorar headers de rate limit:
     - X-RateLimit-Limit
     - X-RateLimit-Remaining
     - X-RateLimit-Reset

2. **Autenticação**
   - Renovar token quando faltar 10% do tempo de expiração
   - Armazenar tokens de forma segura (não em localStorage)
   - Implementar refresh token automaticamente
   - Limpar tokens ao fazer logout

3. **Dados**
   - Validar todos os inputs antes do envio
   - Sanitizar dados HTML em comentários
   - Formatar datas consistentemente (ISO 8601)
   - Implementar paginação para grandes conjuntos de dados
   - Usar compressão GZIP para respostas grandes
   - Cachear respostas quando apropriado

4. **Segurança**
   - Usar HTTPS para todas as requisições
   - Não expor tokens em URLs
   - Validar tipos de dados
   - Implementar timeout em requisições
   - Tratar informações sensíveis adequadamente