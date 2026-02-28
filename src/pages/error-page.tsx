import { Link } from "@tanstack/react-router"
import { AlertCircle } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface ErrorPageProps {
  error?: Error
  reset?: () => void
}

export function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="size-12 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="max-w-md text-muted-foreground">
          {error?.message ??
            "An unexpected error occurred. Please try again or go back home."}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {reset && (
          <Button variant="outline" onClick={reset}>
            Try again
          </Button>
        )}
        <Button asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}
