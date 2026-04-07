erDiagram
    USER {
        uuid id PK
        varchar email UK
        varchar password
        enum role "creator | editor"
        varchar name "nullable"
        timestamp created_at
        timestamp updated_at
    }

    JOB_OFFER {
        uuid id PK
        uuid creator_id FK
        text description "nullable"
        timestamp created_at
        timestamp updated_at
    }

    MATERIAL {
        uuid id PK
        uuid job_offer_id FK
        varchar url
        varchar type
        text description "nullable"
    }

    VIDEO_FORMAT {
        uuid id PK
        uuid job_offer_id FK
        enum orientation "vertical | horizontal"
        enum length "short | long"
        varchar technical_format "nullable"
    }

    EDIT_LEVEL {
        uuid id PK
        uuid job_offer_id FK
        enum level "basic | intermediate | advanced"
    }

    COMPENSATION {
        uuid id PK
        uuid job_offer_id FK
        enum type "negotiable | per_minute | per_video"
        int duration_in_minutes "nullable"
        decimal amount "nullable"
        varchar currency "nullable"
    }

    USER ||--o{ JOB_OFFER : "creates"
    JOB_OFFER ||--o{ MATERIAL : "has"
    JOB_OFFER ||--|| VIDEO_FORMAT : "has"
    JOB_OFFER ||--|| EDIT_LEVEL : "has"
    JOB_OFFER ||--|| COMPENSATION : "has"