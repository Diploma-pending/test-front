import type { ChatDetail, ChatSummary } from "./types"

const baseNow = new Date("2024-01-01T10:00:00Z").getTime()

const makeSummary = (id: number): ChatSummary => {
  const idx = id - 1
  const caseTypes = ["successful", "problematic", "conflict", "agent_error"] as const

  const caseType = caseTypes[idx % caseTypes.length]

  const scenarioFlags = {
    hasHiddenDissatisfaction: idx % 4 === 1,
    hasTonalErrors: idx % 4 === 2,
    hasLogicalErrors: idx % 4 === 3,
  }

  return {
    id: `chat_${id.toString().padStart(3, "0")}`,
    title: `Chat #${id.toString().padStart(3, "0")}`,
    createdAt: new Date(baseNow + idx * 1000 * 60 * 12).toISOString(),
    preview:
      "Customer reports an issue with payment and asks the agent to investigate the failed transaction.",
    scenario: {
      domain: ["payments", "technical", "account", "tariff", "refunds"][idx % 5] ?? "payments",
      caseType,
      ...scenarioFlags,
    },
    quality: {
      intent: "payment",
      satisfaction: (["unsatisfied", "neutral", "satisfied"][idx % 3] ??
        "neutral") as ChatSummary["quality"]["satisfaction"],
      qualityScore: (idx % 5) + 1,
      agentMistakes:
        caseType === "agent_error"
          ? ["incorrect_info", "no_resolution"]
          : scenarioFlags.hasTonalErrors
            ? ["rude_tone"]
            : [],
    },
  }
}

export const chatSummariesMock: ChatSummary[] = Array.from({ length: 20 }, (_, i) =>
  makeSummary(i + 1),
)

export const chatDetailsMock: ChatDetail[] = chatSummariesMock.map((summary, idx) => ({
  ...summary,
  messages: [
    {
      role: "client",
      content:
        "Hello! I was charged twice for my subscription and I don't see the second payment in my account.",
      timestamp: new Date(baseNow + idx * 1000 * 60 * 12).toISOString(),
    },
    {
      role: "agent",
      content:
        "Thanks for reaching out. Let me quickly check your billing history and see what happened.",
      timestamp: new Date(baseNow + idx * 1000 * 60 * 12 + 1000 * 45).toISOString(),
    },
    {
      role: "client",
      content: "Sure, I can provide any additional info you need.",
      timestamp: new Date(baseNow + idx * 1000 * 60 * 12 + 1000 * 90).toISOString(),
    },
    {
      role: "agent",
      content:
        "I can see two pending transactions from your bank, but only one was successfully captured. The second one should be released automatically within 1–3 business days.",
      timestamp: new Date(baseNow + idx * 1000 * 60 * 12 + 1000 * 150).toISOString(),
    },
  ],
}))

export function getChatSummaryById(id: string) {
  return chatSummariesMock.find((c) => c.id === id)
}

export function getChatDetailById(id: string) {
  return chatDetailsMock.find((c) => c.id === id)
}


