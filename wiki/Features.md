# Features

## 핵심

- **프로젝트 / 이슈 관리** — CRUD, 목록/상세, 상태·우선순위·담당자, TanStack Table 기반 목록.
- **마일스톤** — 일정 단위로 이슈를 묶어 관리 (`milestones` 테이블 + CRUD).
- **라벨** — 색상 포함 다중 라벨. `labels` + `issues_labels_link` 조인, 라벨 부착/필터.
- **Tasks(체크리스트)** — 이슈별 체크리스트 항목 CRUD.
- **이슈 관계** — `issue_relations`로 `blocks` / `is_blocked_by` / `relates_to` 표현.
- **댓글** — 이슈별 스레드 댓글 전체 CRUD.
- **파일 첨부** — `files` + `issues_files_link`, 업로드/다운로드.

## 협업 & 알림

- **인앱 알림** — `notifications` 테이블 + 읽음 상태 + 미읽음 카운트 배지.
- **서비스 인테그레이션** — Slack 웹훅(테스트 전송 포함)과 GitHub 토큰을 `integrations` 테이블에 저장,
  `/settings/integrations`에서 관리.
  - 후속: 이슈 이벤트의 Slack 전송, GitHub OAuth/양방향 동기화는 백로그 항목.

## 에디터 & UI

- **리치 텍스트 에디터** — Tiptap 기반. 이슈 설명/댓글에서 서식 편집.
- **다크모드** — next-themes + CSS 변수 기반 토글 (전 컴포넌트 다크모드 감사는 진행 중 항목).
- **i18n** — i18next + react-i18next (ko/en).
- **토스트** — sonner. **리사이즈 패널** — react-resizable-panels.

## 데이터/인증 관련

- **멀티 DBMS** — PostgreSQL / MySQL 8 선택 연결. [Database & Multi-DBMS](./Database-and-Multi-DBMS.md) 참고.
- **2단계 인증** — 워크스페이스 연결 + 개인 로그인. [Authentication](./Authentication.md) 참고.
- **초대 시스템** — 비민감 워크스페이스 정보 기반 초대 코드.

## 상태 메모

일부 라우트는 아직 placeholder이거나 백로그에 남아 있습니다 (예: 홈 실데이터 연동, 일부 상세 페이지,
서버사이드 필터링, /my-issues 등). 최신 우선순위는 `docs/project/backlog.md`를 참고하세요.
