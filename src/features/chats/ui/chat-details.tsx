import { Link } from "@tanstack/react-router"
import { ApiError } from "@/shared/api/client"
import { getChatDisplayName } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { useChatDetail, useGroupChats } from "@/features/groups/api/queries"

interface ChatDetailsPageProps {
  groupId: string
  chatId: string
}

export const ChatDetailsPage = ({ groupId, chatId }: ChatDetailsPageProps) => {
  const { data: chat, isLoading, error } = useChatDetail(groupId, chatId)
  const { data: groupData } = useGroupChats(groupId)
  const chatIndex =
    groupData?.chats.findIndex((c) => c.chat_id === chatId) ?? -1
  const chatDisplayName =
    chatIndex >= 0 ? getChatDisplayName(chatIndex + 1) : `Chat ${chatId}`

  if (isLoading && !chat) {
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
          <p className="text-lg font-medium">Chat not found</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            This chat doesn't exist or you don't have access to it.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/groups/$groupId" params={{ groupId }}>
              Back to list
            </Link>
          </Button>
        </div>
      )
    }
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/groups/$groupId" params={{ groupId }}>
            Back to list
          </Link>
        </Button>
      </div>
    )
  }

  if (!chat) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-lg font-medium">Chat not found</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          This chat doesn't exist or you don't have access to it.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/groups/$groupId" params={{ groupId }}>
            Back to list
          </Link>
        </Button>
      </div>
    )
  }

  const analysis = chat.analysis as Record<string, unknown> | null | undefined
  const scenario = analysis?.scenario as Record<string, unknown> | undefined
  const flags = [
    scenario?.has_hidden_dissatisfaction && "Hidden dissatisfaction",
    scenario?.has_tonal_errors && "Tonal errors",
    scenario?.has_logical_errors && "Logical errors",
  ].filter(Boolean) as string[]

  const messages = (chat.messages ?? []).filter(
    (m): m is { role: "customer" | "agent"; text: string } =>
      (m.role === "customer" || m.role === "agent") && typeof m.text === "string",
  )

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
              {chatDisplayName}
            </span>
            {analysis?.intent != null && (
              <h1 className="text-lg font-semibold tracking-tight capitalize">
                {String(analysis.intent).replace(/_/g, " ")}
              </h1>
            )}
          </div>
          {scenario?.case_type != null && (
            <p className="text-xs text-muted-foreground">
              Case type:{" "}
              <span className="font-medium capitalize">
                {String(scenario.case_type).replace(/_/g, " ")}
              </span>
            </p>
          )}
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to="/groups/$groupId" params={{ groupId }}>
            Back to all chats
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/80 p-4 shadow-sm">
          <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">
            Conversation
          </h2>
          {messages.length === 0 ? (
            <p className="rounded-lg bg-secondary/40 p-4 text-sm text-muted-foreground">
              Messages not yet loaded.
            </p>
          ) : (
            <div className="flex flex-col gap-3 rounded-lg bg-secondary/40 p-3 max-h-[calc(100vh-250px)] overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "customer" ? "justify-start" : "justify-end"
                  } text-sm`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 shadow-sm ${
                      message.role === "customer"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <div className="mb-1 text-[10px] uppercase tracking-wide opacity-70">
                      {message.role === "customer" ? "Customer" : "Agent"}
                    </div>
                    <p className="leading-snug">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="flex flex-col h-fit gap-3 rounded-xl border border-border bg-card/80 p-4 text-sm shadow-sm">
          <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">
            Quality analysis
          </h2>
          {analysis ? (
            <>
              <div className="space-y-1">
                {analysis.intent != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Intent</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                      {String(analysis.intent)}
                    </span>
                  </div>
                )}
                {analysis.satisfaction != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Satisfaction
                    </span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium capitalize">
                      {String(analysis.satisfaction)}
                    </span>
                  </div>
                )}
                {typeof analysis.quality_score === "number" && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Quality score
                    </span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                      {analysis.quality_score} / 10
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Scenario flags
                </span>
                {flags.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {flags.map((flag) => (
                      <span
                        key={flag}
                        className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Clean scenario.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Agent mistakes
                </span>
                {Array.isArray(analysis.agent_mistakes) &&
                analysis.agent_mistakes.length > 0 ? (
                  <ul className="list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
                    {(analysis.agent_mistakes as Array<{
                      type?: string
                      description?: string
                      message_index?: number
                    }>).map((m, i) => (
                      <li key={i}>
                        <span className="capitalize">{m.type ?? "—"}</span>:{" "}
                        {m.description ?? ""}
                        {typeof m.message_index === "number" && (
                          <> (message #{m.message_index + 1})</>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No mistakes detected.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Reasoning
                </span>
                <p className="text-xs text-muted-foreground">
                  {typeof analysis.reasoning === "string"
                    ? analysis.reasoning
                    : "—"}
                </p>
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Analysis not yet available ({String(chat.status)}).
            </p>
          )}
        </aside>
      </div>
    </section>
  )
}
