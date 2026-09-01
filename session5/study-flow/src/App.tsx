import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './shared/lib/queryClient'
import { router } from './app/router'
import { ErrorBoundary } from './shared/components/ErrorBoundary'
import './shared/lib/i18n'

/**
 * Root application component.
 * Sets up React Query, routing, and error boundary.
 */
export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
