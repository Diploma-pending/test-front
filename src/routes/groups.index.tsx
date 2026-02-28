import { createFileRoute, Link } from "@tanstack/react-router"
import { ApiError } from "@/shared/api/client"
import { Button } from "@/shared/ui/button"
import { useGroups } from "@/features/groups/api/queries"
import type { GroupStatus } from "@/shared/api/types"

export const Route = createFileRoute("/groups/" as const)({
  component: GroupsListPage,
})

function getStatusBadgeVariant(
  status: GroupStatus,
): "default" | "secondary" | "destructive" | "outline" {
  if (
    status === "context_gathering_failed" ||
    status === "generation_failed" ||
    status === "analysis_failed"
  ) {
    return "destructive"
  }
  if (status === "completed") return "default"
  return "secondary"
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

function GroupsListPage() {
  const { data: groups, isLoading, error } = useGroups()

  if (isLoading && !groups) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        Loading groups…
      </div>
    )
  }

  if (error) {
    if (error instanceof ApiError && error.status === 404) {
      return (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-lg font-medium">No groups found</p>
          <Button asChild variant="outline" size="sm">
            <Link to="/">Create a group</Link>
          </Button>
        </div>
      )
    }
    return (
      <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error instanceof Error ? error.message : String(error)}
      </div>
    )
  }

  const list = groups ?? []

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Groups</h1>
          <p className="text-sm text-muted-foreground">
            All chat analysis groups. Open a group to see and analyze its chats.
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/">New group</Link>
        </Button>
      </header>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card/50 py-12 text-center">
          <p className="text-muted-foreground">No groups yet.</p>
          <Button asChild variant="outline" size="sm">
            <Link to="/">Create your first group</Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((group) => (
            <li key={group.group_id}>
              <Link
                to="/groups/$groupId"
                params={{ groupId: group.group_id }}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card/70 p-4 shadow-sm transition-colors hover:bg-secondary/50 hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-medium leading-tight line-clamp-2">
                    {group.topic}
                  </h2>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      getStatusBadgeVariant(group.status) === "destructive"
                        ? "bg-destructive/15 text-destructive"
                        : getStatusBadgeVariant(group.status) === "default"
                          ? "bg-primary/15 text-primary"
                          : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {group.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{group.num_chats} chats</span>
                  <span>{formatDate(group.created_at)}</span>
                </div>
                {group.website_url && (
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {group.website_url}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
