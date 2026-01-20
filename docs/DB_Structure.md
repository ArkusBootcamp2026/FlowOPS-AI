| table_name        | column_name      | data_type                |
| ----------------- | ---------------- | ------------------------ |
| Clients           | company          | text                     |
| Clients           | created_at       | timestamp with time zone |
| Clients           | id               | uuid                     |
| Clients           | name             | text                     |
| Opportunities     | ai_summary       | text                     |
| Opportunities     | assigned_user_id | uuid                     |
| Opportunities     | client_id        | uuid                     |
| Opportunities     | created_at       | timestamp with time zone |
| Opportunities     | id               | uuid                     |
| Opportunities     | original_message | text                     |
| Opportunities     | status           | text                     |
| Opportunities     | urgency          | text                     |
| Profiles          | created_at       | timestamp with time zone |
| Profiles          | email            | text                     |
| Profiles          | full_name        | text                     |
| Profiles          | id               | uuid                     |
| Profiles          | role             | text                     |
| Skills            | created_at       | timestamp with time zone |
| Skills            | id               | uuid                     |
| Skills            | name             | text                     |
| opportunity_skill | created_at       | timestamp with time zone |
| opportunity_skill | id               | bigint                   |
| opportunity_skill | opportunity_id   | uuid                     |
| opportunity_skill | skill_id         | uuid                     |
| user_skills       | created_at       | timestamp with time zone |
| user_skills       | id               | uuid                     |
| user_skills       | skill_id         | uuid                     |
| user_skills       | user_id          | uuid                     |