# Authentication

Hydra는 "DB 연결 = 인증"이라는 옛 모델을 버리고, **워크스페이스 연결**과 **앱 로그인**을 분리한
2단계 인증을 사용합니다. (이 모델은 멀티 DBMS 로드맵 Phase 3에서 도입되었습니다.)

## 1단계 — 워크스페이스 연결

- 공유 **서비스 계정**으로 DB에 접속합니다 (host/port/dbName/dbms + 자격증명).
- 서비스 계정은 **DML 권한만** 필요합니다. DB ROLE을 사용하지 않습니다.
- 연결 정보는 Electron safeStorage로 암호화되어 저장됩니다 (`WorkspaceManager`).
- 빈 DB에 처음 연결하면 핸들러가 `needsSetup`을 보고하여 관리자 셋업 화면으로 분기합니다.

## 2단계 — 앱 로그인

- 개인 계정으로 로그인: `user_sn`(로그인 아이디) + 비밀번호.
- 비밀번호는 **scrypt**로 해싱되어 저장됩니다 (자기기술 형식, 명시적 maxmem).
- IPC 채널: `AUTH_LOGIN` / `AUTH_LOGOUT` / `AUTH_SETUP_ADMIN` / `SESSION_STATUS`.
- 비밀번호 해시는 IPC로 노출되지 않습니다 — 렌더러에는 `SafeUser`만 전달됩니다.

## 첫 관리자 부트스트랩

- 빈 DB의 첫 연결에서 관리자 계정을 생성합니다.
- 동시 시드를 막기 위해 PostgreSQL `pg_advisory_xact_lock`(MySQL은 `GET_LOCK`)으로 직렬화합니다.
- 관리자 생성 후에는 앱 내 멤버 관리에서 멤버를 온보딩합니다 (`CreateMemberHandler` — DB ROLE 생성 없이 `users` 행만 삽입).

## 세션

- 세션은 safeStorage로 영속화됩니다 (`SessionManager`).
- 기본 TTL 1일, "remember me" 선택 시 30일로 연장됩니다.
- 앱 마운트 시 `bootstrap()`이 세션을 재검증합니다. 상태 조회 실패 시 fail-closed(로그아웃)로 처리합니다.
- 로그아웃 시 세션 레코드를 삭제합니다.

## 초대 시스템

- 초대 코드는 **자격증명을 포함하지 않는** 비민감 정보(`host/port/dbName/dbms`)를 base64로 인코딩한 값입니다.
- 초대를 받은 사용자는 같은 워크스페이스에 연결한 뒤, 관리자가 발급한 계정/초기 비밀번호로 로그인합니다.

## 최소 권한 서비스 계정 (GRANT 계약)

런타임 앱은 DDL을 실행하지 않습니다(마이그레이션은 별도 경로). 서비스 계정에는 DML만 부여하세요.

```sql
-- MySQL 8
CREATE USER 'hydra_app'@'%' IDENTIFIED BY '<password>';
GRANT SELECT, INSERT, UPDATE, DELETE ON hydra.* TO 'hydra_app'@'%';
```

마이그레이션 권한/흐름은 [Database & Multi-DBMS](./Database-and-Multi-DBMS.md)를 참고하세요.

## 알려진 후속 작업 (의도적 미구현)

- 최초 로그인 시 비밀번호 강제 변경 (스펙상 deferred)
- 사용자 자가 비밀번호 재설정 (관리자 개입 필요)
- `integrations` 테이블 시크릿 at-rest 암호화 (Non-Goal — Slack 웹훅/GitHub 토큰 평문 저장)
