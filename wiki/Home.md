# Hydra Wiki

Hydra는 Electron 기반의 경량 프로젝트/이슈 관리 데스크톱 앱입니다. 오프라인 우선이며, 사용자가 자신의
**PostgreSQL 또는 MySQL 8** 데이터베이스를 직접 연결해 사용하는 멀티 워크스페이스 오픈소스 도구입니다.

## 문서 색인

| 문서 | 내용 |
|------|------|
| [Getting Started](./Getting-Started.md) | 설치, 실행, 첫 워크스페이스 연결, 관리자 셋업 |
| [Architecture](./Architecture.md) | Electron 3-프로세스 모델, IPC, 디렉터리 구조 |
| [Authentication](./Authentication.md) | 2단계 인증(워크스페이스 연결 + 앱 로그인), 세션, 초대 |
| [Database & Multi-DBMS](./Database-and-Multi-DBMS.md) | 어댑터, 듀얼 스키마, 마이그레이션, GRANT 계약 |
| [Configuration](./Configuration.md) | 환경 변수, 워크스페이스 설정, 명령어 |
| [Features](./Features.md) | 이슈/프로젝트/마일스톤/라벨/Tasks/댓글/알림/인테그레이션 |
| [Branching & Releases](./Branching-and-Releases.md) | `main` 기준 브랜치, `legacy/*` 아카이브 |
| [Contributing](./Contributing.md) | 코드 스타일, 네이밍, DB/브랜치 컨벤션 |

## 빠른 링크

- 저장소 루트의 [`README.md`](../README.md) — 한눈에 보는 시작 가이드
- [`CLAUDE.md`](../CLAUDE.md) — 아키텍처/컨벤션 요약 (AI 어시스턴트 가이드 겸용)
- `docs/design/` — DB 컨벤션, ERD, UI 설계
- `docs/project/` — 백로그, 버그, 마일스톤

## 핵심 개념 한 줄 요약

- **BYO-Database**: 앱이 DB를 내장하지 않습니다. 사용자가 PostgreSQL/MySQL을 연결합니다.
- **2단계 인증**: 워크스페이스(공유 DB 연결) → 앱 로그인(개인 계정).
- **워크스페이스**: 하나의 DB 연결 = 하나의 워크스페이스. 여러 워크스페이스를 전환할 수 있습니다.
