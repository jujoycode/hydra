# Architecture Decision Records (ADR)

이 디렉터리는 Hydra의 **아키텍처/프로세스 결정 기록**을 담는다. 한 번 내린 결정의 *맥락(Context)* 과
*결과(Consequences)* 를 남겨, 나중에 "왜 이렇게 했나"를 다시 묻지 않도록 한다.

## 형식

[Michael Nygard 형식](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)을 따른다.

```
# NNNN. <제목>
- Status: Proposed | Accepted | Deprecated | Superseded by NNNN
- Date: YYYY-MM-DD
## Context
## Decision
## Consequences
```

## 규칙

- 파일명: `NNNN-kebab-case-title.md` (4자리 순번).
- 결정을 바꿀 때는 기존 ADR을 수정하지 말고, **새 ADR로 supersede** 한다 (기존 ADR의 Status를 `Superseded by NNNN`으로 갱신).
- ADR은 불변 기록에 가깝게 다룬다 — 오탈자/링크 외의 내용 변경은 새 ADR로.

## 목록

| # | 제목 | 상태 |
|---|------|------|
| [0001](./0001-adopt-github-flow.md) | GitHub Flow 채택 (브랜치 & Git 워크플로) | Accepted |
| [0002](./0002-renderer-data-fetching.md) | 렌더러 IPC 데이터 패칭 패턴 | Accepted |
