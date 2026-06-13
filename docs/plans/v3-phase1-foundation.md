# Hydra v3 Phase 1: Foundation Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Header+Content layout with a Linear-style Full Sidebar + Content + Detail Panel (Type C) architecture, collapsible sidebar, restructured routes, CSS-only dark mode, and Korean typography.

**Architecture:** MainLayout을 3-panel 구조(Sidebar + Content + Detail Panel)로 교체한다. 기존 shadcn Sidebar 컴포넌트를 활용하고, ResizablePanel로 Detail Panel을 구현한다. Header는 제거하고 사이드바가 네비게이션을 담당한다. 다크모드는 CSS 변수만으로 처리한다.

**Tech Stack:** shadcn/ui Sidebar + ResizablePanelGroup, Tailwind CSS v4 dark: variant, Lucide React, Pretendard font, next-themes (테마 토글만)

**Design spec:** `docs/superpowers/specs/2026-04-02-v3-ui-design.md`

---

## File Structure

### New files
- `src/renderer/src/components/organisms/sidebars/AppSidebar.tsx` — v3 메인 사이드바 (워크스페이스, 네비게이션, 프로젝트 목록, 유저)
- `src/renderer/src/components/atoms/ResizablePanel.tsx` — shadcn resizable panel (설치 필요)
- `src/renderer/src/components/organisms/panels/DetailPanel.tsx` — 이슈 디테일 패널 (Phase 1에서는 빈 껍데기)
- `src/renderer/src/stores/sidebar.ts` — 사이드바 상태 (expanded/collapsed)
- `src/renderer/src/stores/panel.ts` — 디테일 패널 상태 (open/closed, selected issue)

### Modified files
- `src/renderer/src/components/layouts/MainLayout.tsx` — Header 제거, SidebarProvider + AppSidebar + SidebarInset 구조로 교체
- `src/renderer/src/components/layouts/ProjectLayout.tsx` — ProjectSidebar 제거 (AppSidebar의 서브메뉴로 흡수), Tabs(목록/보드/타임라인) 추가
- `src/renderer/src/components/layouts/SettingsLayout.tsx` — SettingsSidebar 제거 (AppSidebar 서브메뉴로 흡수)
- `src/renderer/src/routers/routes.tsx` — v3 라우트 구조 반영 (/my-issues, /notifications, /members, /settings/members, /settings/notifications)
- `src/renderer/src/index.css` — 다크모드 CSS 변수 확장, Pretendard 폰트, 커스텀 상태 색상 변수

### Deleted files
- `src/renderer/src/components/organisms/headers/Header.tsx` — 사이드바로 대체
- `src/renderer/src/components/organisms/headers/HeaderUserMenu.tsx` — 사이드바 하단으로 이동
- `src/renderer/src/components/organisms/sidebars/ProjectSidebar.tsx` — AppSidebar로 통합
- `src/renderer/src/components/organisms/sidebars/SettingsSidebar.tsx` — AppSidebar로 통합

---

## Task 1: CSS 기반 확장 — 다크모드 변수 + 한글 타이포그래피

**Files:**
- Modify: `src/renderer/src/index.css`
- Modify: `package.json` (Pretendard 폰트 추가)

- [ ] **Step 1: Pretendard 폰트 패키지 설치**

```bash
pnpm add pretendard
```

- [ ] **Step 2: index.css에 Pretendard import 및 한글 타이포그래피 적용**

`src/renderer/src/index.css` 파일의 상단에 Pretendard import를 추가하고, `@layer base`에서 body에 한글 최적화 스타일을 적용한다.

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css";
```

`@layer base` 블록의 body 규칙을 수정:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    font-family: 'Pretendard Variable', 'Pretendard', -apple-system, 'Noto Sans KR', sans-serif;
    letter-spacing: -0.2px;
    line-height: 1.5;
  }
}
```

- [ ] **Step 3: 커스텀 상태/화살표 CSS 변수 추가**

`:root` 블록 안에 이슈 상태, 우선순위, 의존관계 화살표 색상 변수를 추가한다:

```css
:root {
  /* ... 기존 변수 유지 ... */

  /* Issue status colors */
  --status-backlog: oklch(0.87 0.01 260);
  --status-todo: oklch(0.62 0.19 250);
  --status-in-progress: oklch(0.77 0.15 85);
  --status-review: oklch(0.59 0.2 293);
  --status-done: oklch(0.65 0.17 162);

  /* Priority colors */
  --priority-urgent: oklch(0.58 0.22 27);
  --priority-high: oklch(0.58 0.22 27);
  --priority-medium: oklch(0.77 0.15 85);
  --priority-low: oklch(0.55 0.02 260);

  /* Dependency arrow colors */
  --arrow-blocks: oklch(0.58 0.22 27);
  --arrow-blocked-by: oklch(0.7 0.18 55);
  --arrow-related: oklch(0.55 0.19 255);
  --arrow-duplicate: oklch(0.55 0.02 260);
  --arrow-parent: oklch(0.55 0.2 293);
}
```

- [ ] **Step 4: .dark 블록에 다크모드 대응 변수 추가**

`.dark` 블록 안에 동일한 커스텀 변수의 다크모드 값을 추가:

```css
.dark {
  /* ... 기존 다크모드 변수 유지 ... */

  /* Issue status colors (dark) */
  --status-backlog: oklch(0.55 0.02 260);
  --status-todo: oklch(0.7 0.15 250);
  --status-in-progress: oklch(0.82 0.12 85);
  --status-done: oklch(0.72 0.14 162);
  --status-review: oklch(0.68 0.17 293);

  /* Priority colors (dark) */
  --priority-urgent: oklch(0.7 0.18 27);
  --priority-high: oklch(0.7 0.18 27);
  --priority-medium: oklch(0.82 0.12 85);
  --priority-low: oklch(0.62 0.02 260);

  /* Dependency arrow colors (dark) */
  --arrow-blocks: oklch(0.7 0.18 27);
  --arrow-blocked-by: oklch(0.78 0.14 55);
  --arrow-related: oklch(0.65 0.15 255);
  --arrow-duplicate: oklch(0.62 0.02 260);
  --arrow-parent: oklch(0.68 0.17 293);
}
```

- [ ] **Step 5: 타입체크 및 빌드 확인**

```bash
pnpm typecheck
```

Expected: 에러 없이 통과

- [ ] **Step 6: Commit**

```bash
git add src/renderer/src/index.css package.json pnpm-lock.yaml
git commit -m "style: Pretendard 폰트 + 한글 타이포그래피 + 다크모드 커스텀 CSS 변수 추가"
```

---

## Task 2: shadcn Resizable Panel 설치

**Files:**
- Create: `src/renderer/src/components/atoms/ResizablePanel.tsx`

- [ ] **Step 1: react-resizable-panels 패키지 설치**

```bash
pnpm add react-resizable-panels
```

- [ ] **Step 2: ResizablePanel atom 컴포넌트 생성**

`src/renderer/src/components/atoms/ResizablePanel.tsx`:

```tsx
import { GripVertical } from 'lucide-react'
import * as ResizablePrimitive from 'react-resizable-panels'

import { cn } from '@/lib/utils'

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
```

- [ ] **Step 3: 타입체크 확인**

```bash
pnpm typecheck:web
```

Expected: 에러 없이 통과

- [ ] **Step 4: Commit**

```bash
git add src/renderer/src/components/atoms/ResizablePanel.tsx package.json pnpm-lock.yaml
git commit -m "feat: shadcn ResizablePanel 컴포넌트 추가"
```

---

## Task 3: 사이드바 상태 Store + 패널 상태 Store 생성

**Files:**
- Create: `src/renderer/src/stores/sidebar.ts`
- Create: `src/renderer/src/stores/panel.ts`

- [ ] **Step 1: 사이드바 상태 Store 생성**

`src/renderer/src/stores/sidebar.ts`:

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isExpanded: boolean
  toggleSidebar: () => void
  setSidebarExpanded: (expanded: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isExpanded: true,
      toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
      setSidebarExpanded: (expanded) => set({ isExpanded: expanded }),
    }),
    { name: 'hydra-sidebar-storage' },
  ),
)
```

- [ ] **Step 2: 패널 상태 Store 생성**

`src/renderer/src/stores/panel.ts`:

```tsx
import { create } from 'zustand'

interface PanelState {
  isDetailOpen: boolean
  selectedIssueId: string | null
  openDetail: (issueId: string) => void
  closeDetail: () => void
}

export const usePanelStore = create<PanelState>()((set) => ({
  isDetailOpen: false,
  selectedIssueId: null,
  openDetail: (issueId) => set({ isDetailOpen: true, selectedIssueId: issueId }),
  closeDetail: () => set({ isDetailOpen: false, selectedIssueId: null }),
}))
```

- [ ] **Step 3: 타입체크 확인**

```bash
pnpm typecheck:web
```

Expected: 에러 없이 통과

- [ ] **Step 4: Commit**

```bash
git add src/renderer/src/stores/sidebar.ts src/renderer/src/stores/panel.ts
git commit -m "feat: 사이드바 + 디테일 패널 상태 Store 추가"
```

---

## Task 4: AppSidebar 컴포넌트 생성

**Files:**
- Create: `src/renderer/src/components/organisms/sidebars/AppSidebar.tsx`

- [ ] **Step 1: AppSidebar 컴포넌트 작성**

기존 `Sidebar.tsx`의 shadcn Sidebar 컴포넌트(SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarSeparator)를 활용한다.

`src/renderer/src/components/organisms/sidebars/AppSidebar.tsx`:

```tsx
import { Link, useLocation, useNavigate, useParams } from '@tanstack/react-router'
import {
  Bell,
  ChevronDown,
  Home,
  ListChecks,
  Plus,
  Settings,
  Users,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/atoms/Avatar'
import { Badge } from '@/atoms/Badge'
import { Button } from '@/atoms/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/atoms/DropdownMenu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/organisms/sidebars/Sidebar'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/project'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: '홈' },
  { to: '/my-issues', icon: ListChecks, label: '내 이슈' },
  { to: '/notifications', icon: Bell, label: '알림' },
] as const

const BOTTOM_ITEMS = [
  { to: '/members', icon: Users, label: '멤버' },
  { to: '/settings', icon: Settings, label: '설정' },
] as const

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = useSidebar()
  const user = useAuthStore((s) => s.user)
  const currentWorkspace = useAuthStore((s) => s.currentWorkspace)
  const disconnect = useAuthStore((s) => s.disconnect)
  const projects = useProjectStore((s) => s.projects)
  const params = useParams({ strict: false }) as { projectId?: string }

  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar collapsible="icon">
      {/* Workspace header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
                    {currentWorkspace?.name?.charAt(0)?.toUpperCase() ?? 'H'}
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="truncate font-semibold text-sm">
                        {currentWorkspace?.name ?? 'Hydra'}
                      </span>
                      <ChevronDown className="ml-auto size-4" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => { disconnect(); navigate({ to: '/workspace' }) }}>
                  워크스페이스 변경
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main navigation */}
        <SidebarGroup>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.to}
                  tooltip={item.label}
                >
                  <Link to={item.to}>
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Projects */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>프로젝트</span>
            <Button
              variant="ghost"
              size="icon"
              className="size-5"
              onClick={() => navigate({ to: '/projects' })}
            >
              <Plus className="size-3.5" />
            </Button>
          </SidebarGroupLabel>
          <SidebarMenu>
            {projects?.map((project) => (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton
                  asChild
                  isActive={params.projectId === project.id}
                  tooltip={project.name}
                >
                  <Link to="/projects/$projectId/issues" params={{ projectId: project.id }}>
                    <div
                      className="size-2 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: `var(--primary)` }}
                    />
                    <span className="truncate">{project.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Bottom nav */}
        <SidebarGroup>
          <SidebarMenu>
            {BOTTOM_ITEMS.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname.startsWith(item.to)}
                  tooltip={item.label}
                >
                  <Link to={item.to}>
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" tooltip={user?.name ?? ''}>
                  <Avatar className="size-7">
                    <AvatarFallback className="text-xs">
                      {user?.name?.charAt(0) ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-col text-left text-xs leading-tight">
                      <span className="truncate font-medium">{user?.name}</span>
                      <span className="truncate text-muted-foreground">{user?.email}</span>
                    </div>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-48">
                <DropdownMenuItem onClick={() => navigate({ to: '/settings' })}>
                  <Settings className="mr-2 size-4" />
                  설정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { disconnect(); navigate({ to: '/workspace' }) }}>
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
```

- [ ] **Step 2: 타입체크 확인**

```bash
pnpm typecheck:web
```

Expected: 에러 없이 통과 (아직 사용되지 않으므로 import 문제만 확인)

- [ ] **Step 3: Commit**

```bash
git add src/renderer/src/components/organisms/sidebars/AppSidebar.tsx
git commit -m "feat: v3 AppSidebar 컴포넌트 생성 (워크스페이스, 네비게이션, 프로젝트, 유저)"
```

---

## Task 5: DetailPanel 껍데기 컴포넌트 생성

**Files:**
- Create: `src/renderer/src/components/organisms/panels/DetailPanel.tsx`

- [ ] **Step 1: DetailPanel 컴포넌트 작성**

Phase 1에서는 빈 껍데기만 만든다. Phase 2에서 이슈 상세 내용을 채운다.

`src/renderer/src/components/organisms/panels/DetailPanel.tsx`:

```tsx
import { X } from 'lucide-react'

import { Button } from '@/atoms/Button'
import { usePanelStore } from '@/stores/panel'

export function DetailPanel() {
  const { isDetailOpen, selectedIssueId, closeDetail } = usePanelStore()

  if (!isDetailOpen || !selectedIssueId) return null

  return (
    <div className="flex h-full flex-col border-l bg-muted/30">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm text-muted-foreground">{selectedIssueId}</span>
        <Button variant="ghost" size="icon" className="size-7" onClick={closeDetail}>
          <X className="size-4" />
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
        이슈 상세 패널 (Phase 2에서 구현)
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 타입체크 확인**

```bash
pnpm typecheck:web
```

Expected: 에러 없이 통과

- [ ] **Step 3: Commit**

```bash
git add src/renderer/src/components/organisms/panels/DetailPanel.tsx
git commit -m "feat: DetailPanel 껍데기 컴포넌트 추가 (Phase 2에서 내용 구현)"
```

---

## Task 6: MainLayout을 3-panel 구조로 교체

**Files:**
- Modify: `src/renderer/src/components/layouts/MainLayout.tsx`

- [ ] **Step 1: MainLayout 재작성**

기존 Header 기반 레이아웃을 SidebarProvider + AppSidebar + SidebarInset + DetailPanel 구조로 교체한다.

`src/renderer/src/components/layouts/MainLayout.tsx`:

```tsx
import { Outlet } from '@tanstack/react-router'

import { Toaster } from '@/atoms/Sonner'
import { useAuth } from '@/hooks/use-auth'
import { DetailPanel } from '@/organisms/panels/DetailPanel'
import { AppSidebar } from '@/organisms/sidebars/AppSidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/organisms/sidebars/Sidebar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/atoms/ResizablePanel'
import { usePanelStore } from '@/stores/panel'

export function MainLayout() {
  const { user } = useAuth()
  const isDetailOpen = usePanelStore((s) => s.isDetailOpen)

  if (!user) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ResizablePanelGroup direction="horizontal" className="h-screen">
          <ResizablePanel defaultSize={isDetailOpen ? 60 : 100} minSize={40}>
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 border-b px-4 py-2">
                <SidebarTrigger className="-ml-1" />
              </div>
              <main className="flex-1 overflow-auto">
                <Outlet />
              </main>
            </div>
          </ResizablePanel>
          {isDetailOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={40} minSize={25} maxSize={50}>
                <DetailPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
```

- [ ] **Step 2: 타입체크 확인**

```bash
pnpm typecheck:web
```

Expected: 에러 없이 통과

- [ ] **Step 3: dev 서버로 UI 확인**

```bash
pnpm dev
```

Expected: 앱이 사이드바 + 콘텐츠 구조로 렌더링됨. 사이드바 접기/펼치기(Cmd/Ctrl+B) 동작.

- [ ] **Step 4: Commit**

```bash
git add src/renderer/src/components/layouts/MainLayout.tsx
git commit -m "feat: MainLayout을 Sidebar + Content + DetailPanel 3-panel 구조로 교체"
```

---

## Task 7: ProjectLayout 및 SettingsLayout 단순화

**Files:**
- Modify: `src/renderer/src/components/layouts/ProjectLayout.tsx`
- Modify: `src/renderer/src/components/layouts/SettingsLayout.tsx`

- [ ] **Step 1: ProjectLayout 단순화**

ProjectSidebar를 제거하고 콘텐츠만 렌더링한다. 프로젝트 네비게이션은 AppSidebar에서 처리한다.

`src/renderer/src/components/layouts/ProjectLayout.tsx`:

```tsx
import { Outlet } from '@tanstack/react-router'

export function ProjectLayout() {
  return (
    <div className="flex h-full flex-col">
      <Outlet />
    </div>
  )
}
```

- [ ] **Step 2: SettingsLayout 단순화**

SettingsSidebar를 제거하고 콘텐츠만 렌더링한다.

`src/renderer/src/components/layouts/SettingsLayout.tsx`:

```tsx
import { Outlet } from '@tanstack/react-router'

export function SettingsLayout() {
  return (
    <div className="flex h-full flex-col p-6 md:p-10">
      <Outlet />
    </div>
  )
}
```

- [ ] **Step 3: 타입체크 확인**

```bash
pnpm typecheck:web
```

Expected: 에러 없이 통과

- [ ] **Step 4: Commit**

```bash
git add src/renderer/src/components/layouts/ProjectLayout.tsx src/renderer/src/components/layouts/SettingsLayout.tsx
git commit -m "refactor: ProjectLayout, SettingsLayout에서 개별 사이드바 제거 (AppSidebar로 통합)"
```

---

## Task 8: 라우트 구조 업데이트

**Files:**
- Modify: `src/renderer/src/routers/routes.tsx`

- [ ] **Step 1: v3 라우트 구조로 수정**

기존 routes.tsx에서 다음을 변경:
- `/my-issues`, `/notifications`, `/members` 라우트 추가 (빈 placeholder 컴포넌트)
- `/settings/members`, `/settings/notifications` 라우트 추가
- 기존 `/settings/integration` 제거
- TempComponent를 사용하여 미구현 페이지 placeholder 표시

`src/renderer/src/routers/routes.tsx`의 authenticated route children에 새 라우트를 추가:

```tsx
// 기존 index route (HomePage) 아래에 추가
const myIssuesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/my-issues',
  component: lazyRoute(() => import('@/pages/HomePage')), // Phase 2에서 별도 페이지로 교체
})

const notificationsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/notifications',
  component: () => <TempComponent title="알림" />,
})

const membersRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/members',
  component: () => <TempComponent title="멤버 관리" />,
})

// settings children에 추가
const settingsMembersRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/members',
  component: () => <TempComponent title="멤버 설정" />,
})

const settingsNotificationsRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/notifications',
  component: () => <TempComponent title="알림 설정" />,
})
```

routeTree에 새 라우트를 추가:

```tsx
const routeTree = rootRoute.addChildren([
  authenticatedRoute.addChildren([
    indexRoute,
    myIssuesRoute,
    notificationsRoute,
    membersRoute,
    projectsRoute,
    projectLayoutRoute.addChildren([
      projectIndexRoute,
      projectIssuesRoute,
      projectIssueDetailRoute,
      projectTasksRoute,
      projectTaskDetailRoute,
      projectSettingsRoute.addChildren([projectSettingsDetailRoute]),
    ]),
    settingsRoute.addChildren([
      settingsIndexRoute,
      settingsMembersRoute,
      settingsNotificationsRoute,
    ]),
  ]),
  workspaceRoute,
])
```

- [ ] **Step 2: 기존 integration 라우트 제거**

`settingsIntegrationRoute` 정의와 routeTree에서의 참조를 제거한다.

- [ ] **Step 3: 타입체크 확인**

```bash
pnpm typecheck:web
```

Expected: 에러 없이 통과

- [ ] **Step 4: dev 서버로 라우트 동작 확인**

```bash
pnpm dev
```

Expected: 사이드바의 모든 링크가 올바른 페이지로 이동. /my-issues, /notifications, /members, /settings/members, /settings/notifications가 placeholder 표시.

- [ ] **Step 5: Commit**

```bash
git add src/renderer/src/routers/routes.tsx
git commit -m "feat: v3 라우트 구조 반영 (my-issues, notifications, members 추가, integration 제거)"
```

---

## Task 9: 다크모드 토글 (next-themes 연동)

**Files:**
- Modify: `src/renderer/src/App.tsx` 또는 진입점 (ThemeProvider 래핑)
- Create: `src/renderer/src/components/atoms/ThemeToggle.tsx`

- [ ] **Step 1: 진입점에서 ThemeProvider 확인**

next-themes 패키지가 이미 설치되어 있다 (`"next-themes": "^0.4.6"`). 앱의 진입점에서 `ThemeProvider`로 래핑되어 있는지 확인하고, 없으면 추가한다.

앱 진입점 파일(보통 `src/renderer/src/App.tsx` 또는 `src/renderer/src/main.tsx`)에서:

```tsx
import { ThemeProvider } from 'next-themes'

// 기존 RouterProvider를 ThemeProvider로 래핑
<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
  <RouterProvider router={router} context={{ auth }} />
</ThemeProvider>
```

- [ ] **Step 2: ThemeToggle 컴포넌트 생성**

`src/renderer/src/components/atoms/ThemeToggle.tsx`:

```tsx
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/atoms/Button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">테마 전환</span>
    </Button>
  )
}
```

- [ ] **Step 3: AppSidebar 유저 드롭다운에 테마 토글 추가**

`src/renderer/src/components/organisms/sidebars/AppSidebar.tsx`의 유저 DropdownMenuContent 안에:

```tsx
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

// DropdownMenuContent 안, Settings 메뉴 아이템 아래에 추가:
<DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  {theme === 'dark' ? <Sun className="mr-2 size-4" /> : <Moon className="mr-2 size-4" />}
  {theme === 'dark' ? '라이트 모드' : '다크 모드'}
</DropdownMenuItem>
```

- [ ] **Step 4: 타입체크 확인**

```bash
pnpm typecheck:web
```

Expected: 에러 없이 통과

- [ ] **Step 5: dev 서버로 테마 전환 확인**

```bash
pnpm dev
```

Expected: 사이드바 하단 유저 메뉴에서 테마 전환 시 라이트↔다크 전환됨. 커스텀 CSS 변수(상태 색상 등)도 함께 변경됨.

- [ ] **Step 6: Commit**

```bash
git add src/renderer/src/components/atoms/ThemeToggle.tsx src/renderer/src/components/organisms/sidebars/AppSidebar.tsx
git commit -m "feat: CSS-only 다크모드 토글 구현 (next-themes + 커스텀 CSS 변수)"
```

---

## Task 10: 기존 Header/개별 사이드바 정리

**Files:**
- Delete: `src/renderer/src/components/organisms/headers/Header.tsx`
- Delete: `src/renderer/src/components/organisms/headers/HeaderUserMenu.tsx`
- Delete: `src/renderer/src/components/organisms/sidebars/ProjectSidebar.tsx`
- Delete: `src/renderer/src/components/organisms/sidebars/SettingsSidebar.tsx`

- [ ] **Step 1: 삭제 대상 파일에 대한 import 참조 확인**

```bash
cd /c/Users/A040-000-0001/Documents/hydra
grep -r "Header\|HeaderUserMenu\|ProjectSidebar\|SettingsSidebar" src/renderer/src --include="*.tsx" --include="*.ts" -l
```

Expected: MainLayout.tsx, ProjectLayout.tsx, SettingsLayout.tsx에서만 참조 (이미 이전 Task에서 수정 완료)

- [ ] **Step 2: 파일 삭제**

```bash
rm src/renderer/src/components/organisms/headers/Header.tsx
rm src/renderer/src/components/organisms/headers/HeaderUserMenu.tsx
rm src/renderer/src/components/organisms/sidebars/ProjectSidebar.tsx
rm src/renderer/src/components/organisms/sidebars/SettingsSidebar.tsx
```

- [ ] **Step 3: 타입체크 및 빌드 확인**

```bash
pnpm typecheck
```

Expected: 에러 없이 통과. 삭제된 파일에 대한 import가 남아 있으면 안 됨.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: 기존 Header, ProjectSidebar, SettingsSidebar 제거 (AppSidebar로 통합 완료)"
```

---

## Task 11: 최종 통합 확인

- [ ] **Step 1: 전체 타입체크**

```bash
pnpm typecheck
```

Expected: main + renderer 모두 에러 없이 통과

- [ ] **Step 2: Lint 확인**

```bash
pnpm lint
```

Expected: 에러 없이 통과

- [ ] **Step 3: dev 서버로 전체 동작 확인**

```bash
pnpm dev
```

확인 항목:
1. 앱 시작 → 워크스페이스 페이지 표시
2. 워크스페이스 연결 → 사이드바 + 콘텐츠 레이아웃 표시
3. 사이드바 접기/펼치기 (Cmd/Ctrl+B) 동작
4. 사이드바 네비게이션: 홈, 내 이슈, 알림, 프로젝트, 멤버, 설정
5. 프로젝트 클릭 → 프로젝트 이슈 페이지
6. 설정 페이지 → Account, Members, Notifications 탭
7. 유저 메뉴 → 설정, 테마 전환, 로그아웃
8. 다크모드 전환 시 모든 색상 올바르게 변경
9. 한글 타이포그래피 (Pretendard 폰트, 자간)

- [ ] **Step 4: Commit (필요시)**

```bash
git add -A
git commit -m "chore: Phase 1 Foundation 최종 정리"
```
