## Dicionário de Dados

### Entidades

#### UserStory (História de Usuário)
| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| id | number | Identificador único da história | 123 |
| subject | string | Título/descrição da história | "Implementar login" |
| status | string | Identificador do status atual | "in_progress" |
| created_date | string | Data de criação (ISO 8601) | "2024-03-15T10:30:00Z" |
| status_extra_info | object | Informações adicionais do status | Ver StatusInfo |
| assigned_to | number \| null | ID do usuário designado | 456 |
| is_closed | boolean | Indica se a história está fechada | false |
| points | object | Pontos estimados por função | { "dev": 5 } |
| priority | number | Nível de prioridade (1-4) | 3 |

#### Comment (Comentário)
| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| user | object | Informações do usuário | Ver User |
| comment | string | Texto do comentário | "Iniciando desenvolvimento" |
| created_at | string | Data de criação (ISO 8601) | "2024-03-15T14:30:00Z" |
| modified_at | string \| null | Data da última modificação | "2024-03-15T15:00:00Z" |
| delete_comment_date | string \| null | Data de exclusão | null |
| is_hidden | boolean | Status de visibilidade | false |

#### User (Usuário)
| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| username | string | Nome de usuário | "joao.silva" |
| full_name | string | Nome completo | "João Silva" |
| email | string | Email do usuário | "joao@exemplo.com" |
| photo | string \| null | URL da foto de perfil | "https://..." |

#### StatusInfo (Informações de Status)
| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| name | string | Nome do status | "Em Progresso" |
| color | string | Cor em hexadecimal | "#FF9900" |
| is_closed | boolean | Indica status final | false |

#### ReportData (Dados do Relatório)
| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| id | number | ID da história | 123 |
| subject | string | Título da história | "Implementar login" |
| status | string | Nome do status | "Em Progresso" |
| comments | string | Comentários formatados | "[15/03/2024 - João]: Iniciando..." |
| date | string | Data de criação formatada | "15/03/2024" |

### Tipos de Dados

#### Datas
- Formato ISO 8601 para armazenamento: `YYYY-MM-DDTHH:mm:ssZ`
- Formato de exibição: `DD/MM/YYYY`
- Formato de exibição com hora: `DD/MM/YYYY HH:mm`

#### Status
- Novo: História recém-criada
- Em Progresso: Desenvolvimento iniciado
- Em Revisão: Aguardando revisão
- Concluído: Desenvolvimento finalizado

#### Prioridades
1. Baixa
2. Média
3. Alta
4. Urgente

### Validações

#### Histórias de Usuário
- ID: Número positivo
- Título: Obrigatório, máximo 500 caracteres
- Status: Valor válido da lista de status
- Data de Criação: Data válida no formato ISO 8601

#### Comentários
- Texto: Obrigatório, máximo 2000 caracteres
- Data de Criação: Data válida no formato ISO 8601
- Usuário: Objeto usuário válido

#### Relatório
- Data Inicial: Data válida, não posterior à data final
- Data Final: Data válida, não anterior à data inicial
- Projeto: URL válida do Taiga