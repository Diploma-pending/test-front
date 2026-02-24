import { Button } from "@/shared/ui/button"

export function HomePage() {
  return (
    <main className="flex min-h-svh bg-background flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <p className="text-muted-foreground">
        Vite + React + shadcn/ui + FSD
      </p>
      <Button>Get started</Button>
    </main>
  )
}
