# 0003. 테스트 아키텍처 (TDD 재정립)

- Status: Accepted
- Date: 2026-06-13

## Context

2026-06-13 감사 기준 테스트는 17개로 **전부 메인 프로세스/백엔드**(어댑터·마이그레이션·리포지토리·검증·인증)이며 소스에 co-located 되어 있다. 구조 자체는 양호하나 **핸들러·렌더러 UI·핵심 플로우 커버리지가 0**이고, 렌더러 테스트 하니스(jsdom + testing-library)가 아예 없다. 최근 추가된 코드(`findByProject`/`findByAssignee`/`findByUserProjects`, 멤버/대시보드 핸들러, `invokeApi`/도메인 훅)도 미커버다.

M2 목표는 "TDD를 위한 테스트 설계 후 품질 검토"다. 다만 기존 인프라 테스트(마이그레이션 멱등성, 어댑터 에러 매핑, 트랜잭션 원자성, 크로스 엔진 read-after-write, 스키마 패리티)는 **이미 출시된 인프라의 회귀 안전망**으로 가치가 높다.

## Decision

**레이어드 테스트 아키텍처를 채택하고, 기존 인프라 테스트는 보존·재배치하며, 빠진 레이어를 TDD로 채운다.**

> 브레인스토밍 단계의 "전체 삭제 후 재작성"에서 한 발 조정한다 — 가치 높은 인프라 테스트를 1:1로 재작성하는 것은 낭비이고 회귀 위험만 키운다. **중복·무가치한 것만 삭제**하고, 핵심은 레이어 규약에 맞게 유지하며, 없는 레이어를 신설한다. (리뷰어 `jujoycode` 확인 필요 — 이 deviation에 이견 있으면 조정.)

### 레이어 정의

| 레이어 | 대상 | 게이트 | 위치 규약 |
|--------|------|--------|-----------|
| **Unit** | 순수 로직: validator, util, mapper(`mapIssue`), `normalize`, `password`, portable LIKE 헬퍼, queryKeys | 항상 실행 | 소스 옆 `*.test.ts(x)` |
| **Integration (DB)** | 어댑터·마이그레이션·리포지토리·핸들러 (PG/MySQL 양 엔진) | `RUN_DB_TESTS=1` (CI에서 PG16+MySQL8) | 소스 옆 `*.integration.test.ts` |
| **Flow** | 워크스페이스 연결 → 인증/세션 → 이슈 CRUD end-to-end (메인 프로세스 IPC 핸들러 경유) | `RUN_DB_TESTS=1` | `src/main/**/__flows__/*.test.ts` |
| **UI/Component** | 렌더러 핵심 컴포넌트/페이지 렌더·상호작용, 도메인 훅(`useProjectIssues` 등) | 항상 실행 (jsdom) | 컴포넌트 옆 `*.test.tsx` |

### 하니스 / 설정

- **vitest projects 분리**: `node`(메인, 기존) + `jsdom`(렌더러, 신규). 렌더러용 `@testing-library/react` + `@testing-library/jest-dom` + jsdom 환경 추가.
- IPC 모킹: 렌더러 테스트에서 `window.callApi`를 모킹하는 공용 헬퍼(`__testutils__/mockCallApi`).
- DB 통합 하니스(`pgTestDb`/mysqlTestDb)는 유지.

### CI 커버리지 게이트

- `pnpm test:coverage`에 v8 임계치 추가. **초기 목표 40%대**(핸들러+핵심 플로우 우선), 단계적으로 상향. UI는 핵심 경로 위주.
- CI는 unit/UI(항상) + integration/flow(`RUN_DB_TESTS=1`, PG+MySQL 서비스) 실행.

### 재정비 플랜 (실행 순서)

1. **하니스 PR**: vitest projects(node+jsdom) + testing-library 추가 + mockCallApi 헬퍼 + 커버리지 게이트 스캐폴드. 기존 17개는 레이어 규약에 맞게 정리(대부분 그대로, 필요 시 `.integration.test.ts` 리네임).
2. **백엔드 갭 PR**: 미커버 신규 코드(repo 메서드 3종, 멤버/대시보드/할당 핸들러) 통합 테스트.
3. **Flow PR**: 연결→인증→이슈 CRUD 플로우 테스트.
4. **렌더러 UI PR**: 도메인 훅 + 핵심 페이지(Issue/MyIssues/Home/Login) 컴포넌트 테스트.
5. **게이트 상향 + 품질 검토**: 커버리지 임계치 확정.

## Consequences

**좋은 점**: 레이어가 명확해 어디에 무엇을 테스트할지 자명. 회귀 안전망(인프라) 유지하면서 빠진 핸들러/UI/플로우를 메움. 렌더러 하니스 확보로 ADR 0002 도메인 훅이 테스트 가능.

**비용/유의**: 렌더러 테스트 하니스 신규 도입(의존성·설정). 통합/플로우는 DB 게이트라 로컬에선 Docker 필요. 커버리지 임계치는 처음엔 낮게 잡고 올린다(초기에 과도하면 개발 마찰).
