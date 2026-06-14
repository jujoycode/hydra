import type { ReactNode } from 'react'

// 좌측 브랜드 패널 + 우측 폼. 인증 화면(로그인/셋업)의 공통 셸이자 앱 UX 기준 레이아웃.
export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className='flex min-h-screen'>
      {/* Brand panel */}
      <div className='hidden md:flex md:w-1/2 flex-col justify-between bg-zinc-900 p-10 text-zinc-50'>
        <div className='flex size-9 items-center justify-center rounded-lg bg-zinc-50 font-bold text-zinc-900'>H</div>
        <div className='space-y-2'>
          <div className='text-2xl font-bold'>Hydra</div>
          <p className='text-sm leading-relaxed text-zinc-400'>가볍고 빠른 이슈·프로젝트 관리</p>
        </div>
        <div className='text-xs text-zinc-600'>v3 workspace</div>
      </div>
      {/* Form panel */}
      <div className='flex w-full items-center justify-center bg-background p-6 md:w-1/2'>
        <div className='w-full max-w-sm space-y-6'>
          <div className='space-y-1'>
            <h1 className='text-xl font-bold text-foreground'>{title}</h1>
            <p className='text-sm text-muted-foreground'>{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
