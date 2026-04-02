# Hydra ERD
> Based on Drizzle ORM schema (`src/main/core/database/schema/drizzle/schema.ts`)

- [Auth](#auth)
- [Project](#project)
- [Issue](#issue)
- [File](#file)
- [Invite](#invite)

## Auth
```mermaid
erDiagram
"users" {
  UUID user_id PK
  VARCHAR(255) user_name "nullable"
  VARCHAR(255) user_email "nullable"
  VARCHAR(255) user_db_role "nullable"
  VARCHAR(1024) user_avatar_path "nullable"
  VARCHAR(50) user_role "default: member"
  TIMESTAMP user_created_at "nullable"
  TIMESTAMP user_updated_at "nullable"
}
```

### `users`
사용자 정보를 저장합니다. DB 연결 시 PostgreSQL ROLE과 매핑됩니다.

**Properties**
  - `user_id`: UUID 기본키
  - `user_name`: 사용자 이름
  - `user_email`: 이메일
  - `user_db_role`: PostgreSQL 데이터베이스 역할명
  - `user_avatar_path`: 아바타 이미지 경로
  - `user_role`: 앱 내 역할 (admin / member)
  - `user_created_at`: 생성일시
  - `user_updated_at`: 수정일시


## Project
```mermaid
erDiagram
"projects" {
  UUID project_id PK
  TEXT project_name "not null"
  TEXT project_key "not null, unique"
  TEXT project_desc "nullable"
  UUID project_created_by "nullable"
  UUID project_modified_by "nullable"
  TIMESTAMP project_start_date "nullable"
  TIMESTAMP project_end_date "nullable"
}
"users_projects_link" {
  UUID user_project_link_id PK
  UUID user_id FK
  UUID project_id FK
}
"users" ||--o{ "users_projects_link" : members
"projects" ||--o{ "users_projects_link" : members
```

### `projects`
[users](#users)들이 참여하여 [issues](#issue)들을 관리합니다.

**Properties**
  - `project_id`: UUID 기본키
  - `project_name`: 프로젝트명
  - `project_key`: 프로젝트 고유 키 (3-5자 대문자, unique)
  - `project_desc`: 프로젝트 설명
  - `project_created_by`: 생성자 UUID
  - `project_modified_by`: 수정자 UUID
  - `project_start_date`: 시작일
  - `project_end_date`: 종료일

### `users_projects_link`
사용자-프로젝트 다대다 연결 테이블입니다.

**Properties**
  - `user_project_link_id`: UUID 기본키
  - `user_id`: 사용자 FK → users.user_id
  - `project_id`: 프로젝트 FK → projects.project_id


## Issue
```mermaid
erDiagram
"issues" {
  UUID issue_id PK
  UUID project_id FK "not null"
  TEXT issue_title "not null"
  TEXT issue_key "not null"
  TEXT issue_desc "nullable"
  VARCHAR(50) issue_status "nullable"
  VARCHAR(50) issue_priority "nullable"
  VARCHAR(100) issue_category "nullable"
  UUID issue_created_by "nullable"
  UUID issue_modified_by "nullable"
  UUID issue_assigned_to "nullable"
  TIMESTAMP issue_created_at "default: now()"
  TIMESTAMP issue_updated_at "default: now()"
}
"projects" ||--o{ "issues" : contains
```

### `issues`
[projects](#project)에 속한 이슈들을 관리합니다.

**Properties**
  - `issue_id`: UUID 기본키
  - `project_id`: 프로젝트 FK → projects.project_id
  - `issue_title`: 이슈 제목
  - `issue_key`: 이슈 키 (예: PROJ-1)
  - `issue_desc`: 이슈 설명
  - `issue_status`: 상태 (backlog, todo, in_progress, review, done)
  - `issue_priority`: 우선순위 (urgent, high, medium, low, none)
  - `issue_category`: 카테고리 (bug, feature, improvement, task)
  - `issue_created_by`: 생성자 UUID
  - `issue_modified_by`: 수정자 UUID
  - `issue_assigned_to`: 담당자 UUID
  - `issue_created_at`: 생성일시
  - `issue_updated_at`: 수정일시


## File
```mermaid
erDiagram
"files" {
  UUID file_id PK
  TEXT file_name "not null"
  TEXT file_path "not null"
  TEXT file_type "not null"
  INTEGER file_size "nullable"
  TIMESTAMP file_created_at "default: now()"
  TIMESTAMP file_updated_at "default: now()"
}
"issues_files_link" {
  UUID issue_file_link_id PK
  UUID issue_id FK
  UUID file_id FK
}
"issues" ||--o{ "issues_files_link" : attachments
"files" ||--o{ "issues_files_link" : attachments
```

### `files`
업로드된 파일 메타데이터를 저장합니다.

**Properties**
  - `file_id`: UUID 기본키
  - `file_name`: 파일명
  - `file_path`: 저장 경로
  - `file_type`: 파일 MIME 타입
  - `file_size`: 파일 크기 (bytes)
  - `file_created_at`: 생성일시
  - `file_updated_at`: 수정일시

### `issues_files_link`
이슈-파일 다대다 연결 테이블입니다.

**Properties**
  - `issue_file_link_id`: UUID 기본키
  - `issue_id`: 이슈 FK → issues.issue_id
  - `file_id`: 파일 FK → files.file_id


## Invite
```mermaid
erDiagram
"invite_codes" {
  UUID invite_code_id PK
  TEXT code "not null, unique"
  TEXT workspace_name "not null"
  TEXT host "not null"
  INTEGER port "not null"
  TEXT db_name "not null"
  TEXT created_by "nullable"
  TIMESTAMP created_at "default: now()"
  TIMESTAMP expires_at "nullable"
}
```

### `invite_codes`
워크스페이스 초대 코드를 저장합니다. 비민감 연결 정보를 포함합니다.

**Properties**
  - `invite_code_id`: UUID 기본키
  - `code`: 초대 코드 (unique)
  - `workspace_name`: 워크스페이스명
  - `host`: DB 호스트
  - `port`: DB 포트
  - `db_name`: DB명
  - `created_by`: 생성자
  - `created_at`: 생성일시
  - `expires_at`: 만료일시
