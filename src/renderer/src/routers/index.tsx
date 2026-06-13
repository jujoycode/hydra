import { createHashHistory, createRouter } from '@tanstack/react-router'
import { routeTree } from './routes'

const hashHistory = createHashHistory()

export const router = createRouter({
  routeTree,
  history: hashHistory,
  context: {
    auth: undefined!
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
