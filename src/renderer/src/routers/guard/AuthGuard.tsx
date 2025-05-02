import React, { ReactNode, useEffect, useState, useRef } from 'react'
import { Navigate, useLocation } from 'react-router'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
}

interface DecodedToken {
  exp: number
  sub: string
  email: string
  user_metadata?: {
    email?: string
    email_verified?: boolean
    [key: string]: any
  }
  [key: string]: any
}

/**
 * JWT 토큰 디코딩 함수
 */
function decodeToken(token: string): DecodedToken | null {
  try {
    // JWT 형식: header.payload.signature
    const base64Url = token.split('.')[1]
    if (!base64Url) return null

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('토큰 디코딩 오류:', error)
    return null
  }
}

/**
 * 인증 가드 컴포넌트
 *
 * @param children 보호할 컴포넌트/페이지
 * @param requireAuth 인증 필요 여부 (기본값: true)
 */
export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [_, setTokenExpiration] = useState<number | null>(null)
  const location = useLocation()

  // 로그 출력 제한을 위한 ref
  const hasLoggedToken = useRef(false)

  // 로컬 스토리지에서 토큰 가져오기
  const getToken = (): string | null => {
    try {
      const authData = localStorage.getItem('hydra-auth-storage')
      if (!authData) return null

      const parsedData = JSON.parse(authData)
      return parsedData.state?.session?.access_token || null
    } catch (error) {
      console.error('토큰 파싱 오류:', error)
      return null
    }
  }

  // 토큰 유효성 검사
  const isTokenValid = (token: string): boolean => {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return false

    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp > currentTime
  }

  // 토큰 만료 시간 (초) 계산
  const getTokenRemainingTime = (token: string): number | null => {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return null

    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp - currentTime
  }

  useEffect(() => {
    const token = getToken()

    if (token) {
      // 토큰 유효성 확인
      const isValid = isTokenValid(token)
      setIsAuthenticated(isValid)

      // 토큰 만료 시간 확인
      const remainingTime = getTokenRemainingTime(token)
      setTokenExpiration(remainingTime)

      // 디버깅용 로그 - 한 번만 출력
      if (remainingTime !== null && !hasLoggedToken.current) {
        const hours = Math.floor(remainingTime / 3600)
        const minutes = Math.floor((remainingTime % 3600) / 60)
        const seconds = remainingTime % 60
        console.log(`Token remaining time: ${hours}h ${minutes}m ${seconds}s`)
        hasLoggedToken.current = true
      }
    } else {
      setIsAuthenticated(false)
      setTokenExpiration(null)
    }
  }, [location.pathname]) // location 의존성 유지

  // 아직 인증 상태 확인 중인 경우
  if (isAuthenticated === null) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='w-8 h-8 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin'></div>
      </div>
    )
  }

  // 인증이 필요하지만 인증되지 않은 경우 로그인 페이지로 리다이렉트
  // 현재 경로가 이미 signin이 아닌 경우에만 리다이렉트
  if (requireAuth && !isAuthenticated && location.pathname !== '/signin') {
    return <Navigate to='/signin' state={{ from: location }} replace />
  }

  // 현재 signin 페이지인데 이미 인증된 경우 대시보드로 리다이렉트
  if (!requireAuth && isAuthenticated && location.pathname === '/signin') {
    return <Navigate to='/' replace />
  }

  // 인증이 필요하지 않은 페이지인데 이미 인증된 경우 대시보드로 리다이렉트
  // 현재 경로가 이미 루트가 아닌 경우에만 리다이렉트
  if (!requireAuth && isAuthenticated && location.pathname !== '/') {
    return <Navigate to='/' replace />
  }

  return <>{children}</>
}

/**
 * 인증이 필요한 컴포넌트를 감싸는 HOC
 *
 * @param Component 보호할 컴포넌트
 * @param requireAuth 인증 필요 여부 (기본값: true)
 */
export const withAuth = <P extends object>(Component: React.ComponentType<P>, requireAuth: boolean = true) => {
  const WithAuth = (props: P) => (
    <AuthGuard requireAuth={requireAuth}>
      <Component {...props} />
    </AuthGuard>
  )

  WithAuth.displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`

  return WithAuth
}

/**
 * 인증된 사용자만 접근 가능한 컴포넌트 래퍼
 *
 * @param Component 보호할 컴포넌트
 */
export const withProtected = <P extends object>(Component: React.ComponentType<P>) => {
  return withAuth(Component, true)
}

/**
 * 인증되지 않은 사용자만 접근 가능한 컴포넌트 래퍼 (로그인 페이지 등)
 *
 * @param Component 보호할 컴포넌트
 */
export const withPublic = <P extends object>(Component: React.ComponentType<P>) => {
  return withAuth(Component, false)
}

export default { AuthGuard, withAuth, withProtected, withPublic }
