# [Hydra] DB Naming Convention

## 1. Common
- 스네이크 표기법(`snake_case`)를 사용해야 합니다.
- 문자로 시작하되, 언더스코어(`_`)로 끝나지 않아야 합니다.
- 모두 소문자로 표기합니다.
- 공백이 들어갈 경우 공백 대신 언더스코어(`_`)를 사용해야 합니다.
- 약어는 일반적으로 통용되는 명칭을 사용해야 합니다.

## 2. Table
- 복수형 명사를 사용합니다. (Ex. users, orders)
- 관계 테이블일 경우 대상 테이블명을 언더스코어(`_`)로 잇고 Suffix로 `_link`를 추가합니다. (Ex. users, projects -> `users_projects_link`)

## 3. Column
- 단수형으로 사용합니다.
- 설명적이로 명확한 이름을 사용합니다.
- 테이블명을 컬럼명으로 사용하지 않아야 합니다.
- 외래 키의 경우 `referenced_table_singular_form_id` 형식으로 사용합니다. (Ex. `user_id`)
- 일반적으로 널리 알러진 약어(`id`, `url`)을 제외하고는 전체 단어를 사용합니다.
- 날짜/시간 컬럼에 대해서는 `_date`, `_time` 접미어 대신 구체적인 이름을 사용합니다. (Ex. `create_at`, `updated_at`, `last_login_time`)

## 4. Reserved Words
- SQL 예약어는 테이블/컬럼명으로 사용하지 않습니다.
- 예시: `ORDER`, `GROUP`, `WHERE` 등

## 5. Index
- 인덱스 명명 규칙은 `idx_table_name_column_name` 형식으로 사용합니다. (Ex. `idx_users_id`)

## 6. Reference
- [Abbreviations](https://www.abbreviations.com/abbreviation/Status)
- [PostgreSQL Coding Conventions](https://www.postgresql.org/docs/9.6/source.html)