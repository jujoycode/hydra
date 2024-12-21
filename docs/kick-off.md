# [Hydra] Kick Off

## 1. Goal

- 경량화된 설치형 `프로젝트/이슈 관리 도구` 개발
- 무료이면서, 사용성을 갖춘 `프로젝트/이슈 관리 도구` 제공

## 2. Member

- 유주형 ([@jujoycode](https://github.com/jujoycode)) - Developer

  - 프로젝트 기획
  - Frontend 개발
  - Backend 개발

- 이연국 ([@abruption](https://github.com/abruption)) - Backend Developer

  - 프로젝트 기획
  - Backend 개발

### Communication

- Daily Standup: 매일 12:00
- Sprint Planning: 매주 월요일
- Tech Review: 매주 금요일

## 3. Tech Stack

### Frontend

- Framework: [`React`](https://react.dev/), [`Electron`](https://www.electronjs.org/)
- State Management: [`zustand`](https://zustand.docs.pmnd.rs/)
- UI Library: [`chakra-ui`](https://chakra-ui.com/)
- Router: [`react-router-dom`](https://reactrouter.com/)
- Icon: [`lucide-react`](https://lucide.dev/)

### Backend

- Platform: [`Supabase`](https://supabase.com/)
- Framework: [`Electron`](https://www.electronjs.org/)
- Database: [`PostgreSQL`](https://www.postgresql.org/)
- ORM: [`Prisma`](https://www.prisma.io/) (w. [supabase](https://supabase.com/docs/guides/database/prisma))
- MQTT: [`Supabase-realtime`](https://supabase.com/docs/guides/realtime)

## 4. Project Schedule

- Start Date: 2024-12-16
- End Date: 2025-02-01

### Main Milestones

1. 기획 및 설계 (3일)
2. 개발 (3주)
3. 테스트 및 배포 (1주)

## 5. Issue Handling Flow

1. Issue Creation

   - Title Format: `[Type] 간단한 설명`
   - Types: Feature, Bug, Hotfix, Docs, Refactor
   - Priority Labels: P0(Urgent), P1(High), P2(Medium), P3(Low)

2. Branch Strategy (GitHub Flow)

   - main (production)
   - develop (development)
   - feature/\* (새로운 기능)
   - bugfix/\* (버그 수정)
   - hotfix/\* (긴급 수정)

3. Development Flow

   1. Issue 생성 및 할당
   2. Branch 생성 (`bugfix/issue-number-description`)
   3. 작업 완료 후 PR 생성
   4. Code Review
   5. Merge to main
   6. Branch 삭제

4. PR Convention

   - Title: `[Type] #Issue번호 작업내용`
   - Description:

     ```md
     ## 작업 내용

     - 구현 내용 요약

     ## 테스트 방법

     1. 테스트 단계

     ## 스크린샷

     ## 참고 사항
     ```
