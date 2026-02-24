import { Link } from "@tanstack/react-router"
import { Button } from "@/shared/ui/button"
import { chatSummariesMock } from "../lib/mocks"

export const ChatsList = () => (
  <section className="flex flex-col gap-6">
    <header className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Support chat dataset</h1>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Generated sample chats between customers and support agents. Select a chat to see the full
        conversation and quality evaluation.
      </p>
    </header>

    <div className="rounded-xl border border-border bg-card/70 shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Chats ({chatSummariesMock.length})
        </span>
        <Button size="sm" variant="outline">
          Regenerate (mock)
        </Button>
      </div>

      <ul className="divide-y divide-border">
        {chatSummariesMock.map((chat) => (
          <li key={chat.id} className="group">
            <Link
              to="/chats/$chatId"
              params={{ chatId: chat.id }}
              className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-secondary/60"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
                    {chat.id}
                  </span>
                  <span className="text-sm font-medium">{chat.title}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-secondary px-2 py-0.5">
                    {chat.scenario.domain}
                  </span>
                  <span className="rounded-full bg-secondary px-2 py-0.5">
                    {chat.scenario.caseType}
                  </span>
                  <span className="rounded-full bg-secondary px-2 py-0.5">
                    score {chat.quality.qualityScore}/5
                  </span>
                </div>
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">{chat.preview}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

