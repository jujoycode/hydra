# Hydra ERD

## Overview Diagram

```mermaid
erDiagram
"users" {
  String user_id PK
  String user_name "nullable"
  String user_email "nullable"
  DateTime user_created_at "nullable"
  DateTime user_updated_at "nullable"
  String user_avatar_key "nullable"
}
"projects" {
  String project_id PK
  String project_name
  String project_desc "nullable"
  String project_created_by "nullable"
  String project_modified_by "nullable"
  DateTime project_start_date "nullable"
  DateTime project_end_date "nullable"
}
"users_projects_link" {
  String user_project_link_id PK
  String user_id FK
  String project_id FK
}
"issues" {
  String issue_id PK
  String project_id FK
  String issue_title
  String issue_key
  String issue_desc "nullable"
  String issue_created_by "nullable"
  String issue_modified_by "nullable"
  DateTime issue_created_at "nullable"
  DateTime issue_updated_at "nullable"
}
"files" {
  String file_id PK
  String file_name
  String file_path
  String file_type
  Int file_size
  DateTime file_created_at "nullable"
  DateTime file_updated_at "nullable"
}
"issues_files_link" {
  String issue_file_link_id PK
  String issue_id FK
  String file_id FK
}
"users_projects_link" }o--|| "projects" : project
"users_projects_link" }o--|| "users" : user
"issues" }o--|| "projects" : project
"issues_files_link" }o--|| "issues" : issue
"issues_files_link" }o--|| "files" : file
```

## 1. Auth

```mermaid
erDiagram
"users" {
  String user_id PK
  String user_name "nullable"
  String user_email "nullable"
  DateTime user_created_at "nullable"
  DateTime user_updated_at "nullable"
  String user_avatar_key "nullable"
}
"auth_users" {
  String instance_id "nullable"
  String id PK
  String aud "nullable"
  String role "nullable"
  String email "nullable"
  String encrypted_password "nullable"
  DateTime email_confirmed_at "nullable"
  DateTime invited_at "nullable"
  String confirmation_token "nullable"
  DateTime confirmation_sent_at "nullable"
  String recovery_token "nullable"
  DateTime recovery_sent_at "nullable"
  String email_change_token_new "nullable"
  String email_change "nullable"
  DateTime email_change_sent_at "nullable"
  DateTime last_sign_in_at "nullable"
  Json raw_app_meta_data "nullable"
  Json raw_user_meta_data "nullable"
  Boolean is_super_admin "nullable"
  DateTime created_at "nullable"
  DateTime updated_at "nullable"
  String phone UK "nullable"
  DateTime phone_confirmed_at "nullable"
  String phone_change "nullable"
  String phone_change_token "nullable"
  DateTime phone_change_sent_at "nullable"
  DateTime confirmed_at "nullable"
  String email_change_token_current "nullable"
  Int email_change_confirm_status "nullable"
  DateTime banned_until "nullable"
  String reauthentication_token "nullable"
  DateTime reauthentication_sent_at "nullable"
  Boolean is_sso_user
  DateTime deleted_at "nullable"
  Boolean is_anonymous
}
"users" ||--|| "auth_users" : users
```

### `users`

[auth_users](#auth_users)의 확장 정보를 저장합니다.

**Properties**

- `user_id`:
- `user_name`:
- `user_email`:
- `user_created_at`:
- `user_updated_at`:
- `user_avatar_key`:

## 2. Project Management

```mermaid
erDiagram
"projects" {
  String project_id PK
  String project_name
  String project_desc "nullable"
  String project_created_by "nullable"
  String project_modified_by "nullable"
  DateTime project_start_date "nullable"
  DateTime project_end_date "nullable"
}
"users_projects_link" {
  String user_project_link_id PK
  String user_id FK
  String project_id FK
}
"issues" {
  String issue_id PK
  String project_id FK
  String issue_title
  String issue_key
  String issue_desc "nullable"
  String issue_created_by "nullable"
  String issue_modified_by "nullable"
  DateTime issue_created_at "nullable"
  DateTime issue_updated_at "nullable"
}
"users_projects_link" }o--|| "projects" : project
"issues" }o--|| "projects" : project
```

### `projects`

[users](#users)들이 참여하여 [issues](#issues)들을 관리합니다.

**Properties**

- `project_id`:
- `project_name`:
- `project_desc`:
- `project_created_by`:
- `project_modified_by`:
- `project_start_date`:
- `project_end_date`:

### `users_projects_link`

**Properties**

- `user_project_link_id`:
- `user_id`:
- `project_id`:

### `issues`

[projects](#projects)에 속한 이슈들을 관리합니다.

**Properties**

- `issue_id`:
- `project_id`:
- `issue_title`:
- `issue_key`:
- `issue_desc`:
- `issue_created_by`:
- `issue_modified_by`:
- `issue_created_at`:
- `issue_updated_at`:

## 3. File Management

```mermaid
erDiagram
"files" {
  String file_id PK
  String file_name
  String file_path
  String file_type
  Int file_size
  DateTime file_created_at "nullable"
  DateTime file_updated_at "nullable"
}
"issues_files_link" {
  String issue_file_link_id PK
  String issue_id FK
  String file_id FK
}
"issues_files_link" }o--|| "files" : file
```

### `files`

**Properties**

- `file_id`:
- `file_name`:
- `file_path`:
- `file_type`:
- `file_size`:
- `file_created_at`:
- `file_updated_at`:

### `issues_files_link`

**Properties**

- `issue_file_link_id`:
- `issue_id`:
- `file_id`:
