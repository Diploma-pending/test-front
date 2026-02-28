import { Link } from "@tanstack/react-router"

export const AppHeader = () => (
  <header className="flex items-center justify-between max-w-6xl mx-auto px-6 py-4 border-b border-border bg-background/90">
    <div className="flex items-center gap-2">
      <span className="text-xl font-semibold tracking-tight">AI Support Chats</span>
    </div>
    <nav className="flex items-center gap-4 text-sm text-muted-foreground">
      <Link
        to="/"
        className="hover:text-foreground data-[status=active]:text-foreground data-[status=active]:font-semibold"
      >
        Create group
      </Link>
      <Link
        to="/groups"
        className="hover:text-foreground data-[status=active]:text-foreground data-[status=active]:font-semibold"
      >
        Groups
      </Link>
    </nav>
  </header>
)

