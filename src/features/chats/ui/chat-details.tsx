import { useParams } from "@tanstack/react-router"
import { Button } from "@/shared/ui/button"
import { getChatDetailById } from "../lib/mocks"

export const ChatDetails = () => {
  const { chatId } = useParams({ from: "/chats/$chatId" })
  const chat = getChatDetailById(chatId)

  if (!chat) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Chat not found.</p>
        <Button asChild variant="outline" size="sm">
          <a href="/">Back to list</a>
        </Button>
      </div>
    )
  }

  const flags = [
    chat.scenario.hasHiddenDissatisfaction && "Hidden dissatisfaction",
    chat.scenario.hasTonalErrors && "Tonal errors",
    chat.scenario.hasLogicalErrors && "Logical errors",
  ].filter(Boolean) as string[]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
              {chat.id}
            </span>
            <h1 className="text-lg font-semibold tracking-tight">{chat.title}</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Domain: <span className="font-medium">{chat.scenario.domain}</span> · Case type:{" "}
            <span className="font-medium">{chat.scenario.caseType}</span>
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <a href="/">Back to all chats</a>
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/80 p-4 shadow-sm">
          <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">Conversation</h2>
          <div className="flex flex-col gap-3 rounded-lg bg-secondary/40 p-3 max-h-[520px] overflow-y-auto">
            {chat.messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "client" ? "justify-start" : "justify-end"
                } text-sm`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 shadow-sm ${
                    message.role === "client"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <div className="mb-1 text-[10px] uppercase tracking-wide opacity-70">
                    {message.role === "client" ? "Client" : "Agent"}
                  </div>
                  <p className="leading-snug">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-3 rounded-xl border border-border bg-card/80 p-4 text-sm shadow-sm">
          <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">
            Quality analysis (mock)
          </h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Intent</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                {chat.quality.intent}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Satisfaction</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                {chat.quality.satisfaction}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Quality score</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                {chat.quality.qualityScore} / 5
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Scenario flags</span>
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
              <p className="text-xs text-muted-foreground">Clean scenario.</p>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Agent mistakes</span>
            {chat.quality.agentMistakes.length ? (
              <ul className="list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
                {chat.quality.agentMistakes.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No mistakes detected.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

