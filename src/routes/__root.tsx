import { Outlet, createRootRoute } from "@tanstack/react-router"
import { AppHeader } from "@/widgets/layout/app-header"

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

