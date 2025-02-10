## Diagrama de Entidade Relacionamento

```mermaid
erDiagram
    PROJECT ||--o{ USER_STORY : contains
    USER_STORY ||--o{ COMMENT : has
    USER ||--o{ COMMENT : creates
    USER ||--o{ USER_STORY : assigned_to
    USER_STORY }|--|| STATUS : has

    PROJECT {
        int id PK
        string name
        string slug
        datetime created_date
    }

    USER_STORY {
        int id PK
        string subject
        string status FK
        datetime created_date
        int assigned_to FK
        boolean is_closed
        json points
        int priority
    }

    COMMENT {
        int id PK
        int user_story_id FK
        int user_id FK
        string comment
        datetime created_at
        datetime modified_at
        datetime delete_comment_date
        boolean is_hidden
    }

    USER {
        int id PK
        string username
        string full_name
        string email
        string photo
    }

    STATUS {
        string id PK
        string name
        string color
        boolean is_closed
    }
```

### Relacionamentos

1. **Project - UserStory** (1:N)
   - Um projeto pode ter várias histórias de usuário
   - Cada história pertence a um único projeto

2. **UserStory - Comment** (1:N)
   - Uma história pode ter vários comentários
   - Cada comentário pertence a uma única história

3. **User - Comment** (1:N)
   - Um usuário pode criar vários comentários
   - Cada comentário é criado por um único usuário

4. **User - UserStory** (1:N)
   - Um usuário pode ser designado para várias histórias
   - Cada história pode ser designada a um único usuário

5. **UserStory - Status** (N:1)
   - Várias histórias podem ter o mesmo status
   - Cada história tem um único status

### Restrições

1. **Chaves Primárias**
   - PROJECT: id
   - USER_STORY: id
   - COMMENT: id
   - USER: id
   - STATUS: id

2. **Chaves Estrangeiras**
   - USER_STORY.status -> STATUS.id
   - USER_STORY.assigned_to -> USER.id
   - COMMENT.user_story_id -> USER_STORY.id
   - COMMENT.user_id -> USER.id

3. **Integridade Referencial**
   - Exclusão de PROJECT: Cascade para USER_STORY
   - Exclusão de USER_STORY: Cascade para COMMENT
   - Exclusão de USER: Set null para USER_STORY.assigned_to
   - Exclusão de STATUS: Restrict

4. **Validações**
   - Datas não podem ser futuras
   - Comentários excluídos mantêm registro (soft delete)
   - Status "fechado" implica em USER_STORY.is_closed = true