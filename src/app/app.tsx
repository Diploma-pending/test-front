import { Router, RouterProvider } from "@tanstack/react-router"
import { routeTree } from "@/routeTree.gen"
import { NotFoundPage } from "@/pages/not-found-page"

const router = new Router({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

export const App = () => <RouterProvider router={router} />
