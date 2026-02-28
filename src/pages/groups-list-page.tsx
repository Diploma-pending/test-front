import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { FileText } from "lucide-react"
import { ApiError } from "@/shared/api/client"
import { Button } from "@/shared/ui/button"
import { useGroups, useBusinesses } from "@/features/groups/hooks/use-groups-queries"
import { BusinessIcon } from "@/features/groups/ui/business-icon"
import {
  formatGroupDateList,
  formatStatusLabel,
  getStatusBadgeClassName,
} from "@/features/groups/lib/utils"
import { cn } from "@/shared/lib/styles"

export const GroupsListPage = () => {
  const [businessFilter, setBusinessFilter] = useState<string>("")
  const { data: groups, isLoading, error } = useGroups()
  const { data: businesses = [] } = useBusinesses()

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
  const filteredList = businessFilter
    ? list.filter(
        (g) => (g.business ?? "").toLowerCase() === businessFilter.toLowerCase(),
      )
    : list

  const showFilter = list.length > 0 && businesses.length > 0

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

      {showFilter && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Business
          </span>
          <button
            type="button"
            onClick={() => setBusinessFilter("")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              !businessFilter
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card hover:bg-secondary/50 text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {businesses.map((b) => {
            const isActive = businessFilter === b.id
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setBusinessFilter(isActive ? "" : b.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card hover:bg-secondary/50 text-muted-foreground hover:text-foreground",
                )}
              >
                <BusinessIcon id={b.id} className="size-4" />
                {b.label}
              </button>
            )
          })}
        </div>
      )}

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card/50 py-12 text-center animate-fade-in">
          <p className="text-muted-foreground">No groups yet.</p>
          <Button asChild variant="outline" size="sm">
            <Link to="/">Create your first group</Link>
          </Button>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="rounded-xl border border-border bg-card/50 py-10 text-center text-sm text-muted-foreground animate-fade-in">
          No groups for this business. Try another filter or create a new group.
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredList.map((group) => (
            <li key={group.group_id}>
              <Link
                to="/groups/$groupId"
                params={{ groupId: group.group_id }}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card/70 p-4 shadow-sm transition-[color,background-color,border-color,box-shadow] duration-200 ease-out hover:bg-secondary/50 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/80 text-muted-foreground">
                    {group.business && group.business !== "custom" ? (
                      <BusinessIcon id={group.business} className="size-6" />
                    ) : (
                      <FileText className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-medium leading-tight line-clamp-2">
                        {group.topic}
                      </h2>
                      <span
                        className={cn(
                          "shrink-0 rounded-lg px-2 py-0.5 text-xs font-medium",
                          getStatusBadgeClassName(group.status),
                        )}
                      >
                        {formatStatusLabel(group.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{group.num_chats} chats</span>
                      <span>{formatGroupDateList(group.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
