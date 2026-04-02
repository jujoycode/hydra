-- Hydra v3 Initial Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY,
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  user_db_role VARCHAR(255),
  user_avatar_path VARCHAR(1024),
  user_role VARCHAR(50) DEFAULT 'member',
  user_created_at TIMESTAMP,
  user_updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  project_id UUID PRIMARY KEY,
  project_name TEXT NOT NULL,
  project_key TEXT NOT NULL UNIQUE,
  project_desc TEXT,
  project_created_by UUID,
  project_modified_by UUID,
  project_start_date TIMESTAMP,
  project_end_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_projects_link (
  user_project_link_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(user_id),
  project_id UUID REFERENCES projects(project_id)
);

CREATE TABLE IF NOT EXISTS issues (
  issue_id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(project_id),
  issue_title TEXT NOT NULL,
  issue_key TEXT NOT NULL,
  issue_desc TEXT,
  issue_status VARCHAR(50),
  issue_priority VARCHAR(50),
  issue_category VARCHAR(100),
  issue_created_by UUID,
  issue_modified_by UUID,
  issue_assigned_to UUID,
  issue_created_at TIMESTAMP DEFAULT NOW(),
  issue_updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS files (
  file_id UUID PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  file_created_at TIMESTAMP DEFAULT NOW(),
  file_updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issues_files_link (
  issue_file_link_id UUID PRIMARY KEY,
  issue_id UUID REFERENCES issues(issue_id),
  file_id UUID REFERENCES files(file_id)
);

CREATE TABLE IF NOT EXISTS invite_codes (
  invite_code_id UUID PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  workspace_name TEXT NOT NULL,
  host TEXT NOT NULL,
  port INTEGER NOT NULL,
  db_name TEXT NOT NULL,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
