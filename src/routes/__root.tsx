import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router"
import { AppHeader } from "@/widgets/layout/app-header"
import { ErrorPage } from "@/pages/error-page"
import { NotFoundPage } from "@/pages/not-found-page"

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
})

function RootLayout() {
  const location = useLocation()
  return (
    <div className="min-h-svh bg-background text-foreground">
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
        <div
          key={location.pathname}
          className="animate-fade-in flex flex-col gap-6"
        >
          <Outlet />
        </div>
      </main>
    </div>
  )
}

