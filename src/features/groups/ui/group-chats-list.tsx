import { Link } from "@tanstack/react-router"
import { ApiError } from "@/shared/api/client"
import { getChatDisplayName } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/styles"
import { useGroupChats, useTriggerAnalysis } from "../hooks/use-groups-queries"
import {
  formatStatusLabel,
  getChatStatusBadgeClassName,
  getGroupStatusMessage,
} from "../lib/utils"

type GroupChatsListProps = {
  groupId: string
}

export const GroupChatsList = ({ groupId }: GroupChatsListProps) => {
  const { data, isLoading, error } = useGroupChats(groupId)
  const triggerAnalysis = useTriggerAnalysis(groupId)

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (error) {
    if (error instanceof ApiError && error.status === 404) {
      return (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-lg font-medium">Group not found</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            This group doesn't exist or you don't have access to it.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/">Back to home</Link>
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

  if (!data) return null

  const isFailed =
    data.status === "context_gathering_failed" ||
    data.status === "generation_failed" ||
    data.status === "analysis_failed"
  const canAnalyze = data.status === "generated"
  const isInProgress =
    data.status === "gathering_context" ||
    data.status === "generating" ||
    data.status === "analyzing"

  const generatedCount = data.chats.filter(
    (c) => c.status !== "pending" && c.status !== "generating",
  ).length
  const analyzedCount = data.chats.filter(
    (c) => c.status === "analyzed" || c.status === "failed",
  ).length

  return (
    <section className="flex flex-col gap-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Support chat dataset
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Topic: <span className="font-medium">{data.topic}</span>
          {data.website_url && (
            <> · URL: <span className="font-medium">{data.website_url}</span></>
          )}
          . Generated sample chats between customers and support agents.
        </p>
      </header>

      {isFailed && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-in transition-colors duration-200">
          <p>{getGroupStatusMessage(data.status)}</p>
          {data.status === "context_gathering_failed" &&
            data.context_gathering_error && (
              <p className="mt-2 text-xs opacity-90">
                {data.context_gathering_error}
              </p>
            )}
        </div>
      )}

      {isInProgress && (
        <div className="rounded-md bg-secondary/50 px-4 py-2 text-sm text-muted-foreground animate-fade-in transition-colors duration-200">
          {data.status === "gathering_context"
            ? "Fetching website and generating context document…"
            : data.status === "generating"
              ? `Generating chats… ${generatedCount} of ${data.num_chats} ready`
              : `Analyzing… ${analyzedCount} of ${data.num_chats} done`}
        </div>
      )}

      {canAnalyze && (
        <div className="flex items-center gap-3 animate-fade-in transition-opacity duration-200">
          <Button
            onClick={() => triggerAnalysis.mutate()}
            disabled={triggerAnalysis.isPending}
          >
            {triggerAnalysis.isPending ? "Starting..." : "Run analysis"}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Chats ({data.chats.length} / {data.num_chats})
          </span>
        </div>

        {data.chats.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card/50 py-16 text-center text-sm text-muted-foreground">
            {data.status === "gathering_context"
              ? "Fetching website and generating context…"
              : "No chats yet. Generation in progress…"}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.chats.map((chat, index) => (
              <li key={chat.chat_id}>
                <Link
                  to="/groups/$groupId/chats/$chatId"
                  params={{ groupId, chatId: chat.chat_id }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card/80 p-4 shadow-sm ring-1 ring-black/5 transition-all duration-200 ease-out hover:border-primary/20 hover:bg-card hover:shadow-md hover:ring-primary/10"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-xl bg-primary/90 px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm">
                      {getChatDisplayName(index + 1)}
                    </span>
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <span
                        className={cn(
                          "rounded-lg px-2 py-0.5 text-[11px] font-medium",
                          getChatStatusBadgeClassName(chat.status),
                        )}
                      >
                        {formatStatusLabel(chat.status)}
                      </span>
                      {chat.analysis &&
                        typeof chat.analysis.quality_score === "number" && (
                          <span className="rounded-lg bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                            {chat.analysis.quality_score}/10
                          </span>
                        )}
                    </div>
                  </div>
                  {chat.analysis &&
                  typeof chat.analysis.reasoning === "string" ? (
                    <p className="mt-3 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                      {chat.analysis.reasoning}
                    </p>
                  ) : (
                    <p className="mt-3 flex-1 text-xs italic text-muted-foreground/70">
                      No analysis yet
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center text-[11px] font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    View details →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
