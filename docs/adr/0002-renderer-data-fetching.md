# 0002. 렌더러 IPC 데이터 패칭 패턴

- Status: Accepted
- Date: 2026-06-13

## Context

렌더러의 데이터 접근이 일관되지 않았다(2026-06-13 감사):

- `window.callApi` 직접 호출 + `useState`/`useEffect`: 12개 파일. 캐싱·로딩·재요청 수동, 에러 처리 제각각.
- `useQuery` + `window.callApi` 인라인: 일부(MyIssuesPage 등). queryKey 문자열·언랩·매핑 보일러플레이트가 컴포넌트마다 반복.
- `useIpcHandler`(`hooks/use-ipc.ts`): 타입 안전 + 중앙 토스트 에러 처리를 의도했으나 거의 사용되지 않음.
- 게다가 `useQuery` 경로는 `useIpcHandler`의 에러 처리를 우회 — 두 패턴이 합쳐지지 않았다.

라이브러리(TanStack Query) 자체가 문제가 아니라, **반복 보일러플레이트 + 패턴 불일치 + 에러 처리 분산**이 문제다.

## Decision

**TanStack Query 위에 얇은 타입 래퍼 + 도메인 훅으로 표준화한다.**

1. **`invokeApi(channel, request)`** (`hooks/use-api.ts`): 타입 안전한 IPC 호출. 핸들러/통신 에러를
   토스트로 알리고 throw, 성공 시 `data`를 언랩해 반환. (`IpcData<T>`로 응답 data 타입 추론.)
2. **`useApiQuery(queryKey, channel, request, options?)`**: `useQuery` 래핑. `select`로 매핑.
3. **`useApiMutation(channel, options?)`**: `useMutation` 래핑.
4. **`lib/queryKeys.ts`**: queryKey 팩토리 — 문자열 드리프트 방지, 무효화 키 일원화.
5. **도메인 훅**(`hooks/use-issues.ts`, `hooks/use-members.ts`, …): 컴포넌트는 `useProjectIssues(projectId)`
   처럼 도메인 훅만 import한다. `useQuery`/`IpcChannel`/`callApi`/queryKey를 컴포넌트에서 직접 다루지 않는다.

### 규칙
- **조회는 도메인 훅 + `useApiQuery`(또는 합성 패칭 시 `invokeApi`)** 를 통한다.
- **변경(생성/수정/삭제)은 `useApiMutation`** 을 통하고, 성공 시 관련 queryKey를 무효화한다.
- queryKey는 반드시 `queryKeys` 팩토리에서 가져온다.
- 컴포넌트에서 `window.callApi`를 직접 호출하지 않는다(스토어 bootstrap 등 비-React 경로는 예외).

### 마이그레이션
- 첫 적용: `IssuePage`, `MyIssuesPage`(조회), `CreateIssueDialog`(담당자 멤버 조회).
- 기존 `window.callApi` 직접 호출 12곳은 점진 마이그레이션(파일을 건드릴 때 함께 전환).
- 기존 `useIpcHandler`는 `invokeApi`로 대체되며, 잔여 사용처 정리 후 제거 예정.
- 변경(mutation) 경로 + Zustand 이슈 스토어와 React Query 캐시의 단일화는 후속 작업.

## Consequences

**좋은 점**
- 컴포넌트가 얇아지고(도메인 훅만), 캐싱·로딩·재요청을 React Query가 일괄 제공.
- 에러 처리/언랩/queryKey가 한 곳에 모여 일관성·테스트 용이성 향상(M2 테스트 아키텍처와 직결).
- 채널 타입에서 요청/응답 타입을 추론 → 타입 안전.

**유의할 점**
- 당분간 신(도메인 훅)·구(직접 callApi) 패턴이 공존한다(점진 마이그레이션).
- React Query 캐시와 Zustand 스토어가 일부 중복으로 데이터를 들고 있어, 단일화 전까지 무효화 누락에 주의.
