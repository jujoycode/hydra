import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/atoms/Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error', error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className='flex h-full w-full flex-col items-center justify-center gap-4 bg-background p-8 text-center text-foreground'>
          <div className='flex flex-col gap-1'>
            <h2 className='text-lg font-semibold text-destructive'>Something went wrong</h2>
            <p className='text-sm text-muted-foreground'>An unexpected error occurred while rendering this view.</p>
          </div>
          <Button variant='outline' onClick={this.handleReset}>
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
