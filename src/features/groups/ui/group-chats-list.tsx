import { Link } from "@tanstack/react-router"
import { Button } from "@/shared/ui/button"
import { useGroupChats, useTriggerAnalysis } from "../api/queries"
import type { GroupStatus } from "@/shared/api/types"

interface GroupChatsListProps {
  groupId: string
}

function getStatusMessage(status: GroupStatus): string {
  switch (status) {
    case "gathering_context":
      return "Fetching website and generating context…"
    case "context_gathering_failed":
      return "Context gathering failed."
    case "generating":
      return "Generating chats…"
    case "generated":
      return "All chats generated. Run analysis to continue."
    case "generation_failed":
      return "Generation failed."
    case "analyzing":
      return "Analyzing chats…"
    case "completed":
      return "Analysis complete."
    case "analysis_failed":
      return "Analysis failed."
    default:
      return ""
  }
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
    return (
      <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error instanceof Error ? error.message : String(error)}
      </div>
    )
  }

  if (!data) {
    return null
  }

  const isFailed =
    data.status === "context_gathering_failed" ||
    data.status === "generation_failed" ||
    data.status === "analysis_failed"
  const canAnalyze = data.status === "generated"
  const isInProgress =
    data.status === "gathering_context" ||
    data.status === "generating" ||
    data.status === "analyzing"

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
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <p>{getStatusMessage(data.status)}</p>
          {data.status === "context_gathering_failed" &&
            data.context_gathering_error && (
              <p className="mt-2 text-xs opacity-90">
                {data.context_gathering_error}
              </p>
            )}
        </div>
      )}

      {isInProgress && (
        <div className="rounded-md bg-secondary/50 px-4 py-2 text-sm text-muted-foreground">
          {data.status === "gathering_context"
            ? "Fetching website and generating context document…"
            : data.status === "generating"
              ? `Generating chats… ${data.chats.length} of ${data.num_chats} ready`
              : `Analyzing… ${analyzedCount} of ${data.num_chats} done`}
        </div>
      )}

      {canAnalyze && (
        <div className="flex items-center gap-3">
          <Button
            onClick={() => triggerAnalysis.mutate()}
            disabled={triggerAnalysis.isPending}
          >
            {triggerAnalysis.isPending ? "Starting..." : "Run analysis"}
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card/70 shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Chats ({data.chats.length} / {data.num_chats})
          </span>
        </div>

        <ul className="divide-y divide-border">
          {data.chats.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground">
              {data.status === "gathering_context"
                ? "Fetching website and generating context…"
                : "No chats yet. Generation in progress…"}
            </li>
          ) : (
            data.chats.map((chat) => (
              <li key={chat.chat_id} className="group">
                <Link
                  to="/groups/$groupId/chats/$chatId"
                  params={{ groupId, chatId: chat.chat_id }}
                  className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-secondary/60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
                        {chat.chat_id}
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {chat.case_type.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-secondary px-2 py-0.5">
                        {chat.status}
                      </span>
                      {chat.analysis && (
                        <span className="rounded-full bg-secondary px-2 py-0.5">
                          score {chat.analysis.quality_score}/10
                        </span>
                      )}
                    </div>
                  </div>
                  {chat.analysis && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {chat.analysis.reasoning}
                    </p>
                  )}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  )
}
