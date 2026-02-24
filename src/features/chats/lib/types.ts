export type CaseType = "successful" | "problematic" | "conflict" | "agent_error"

export type ChatIntent =
  | "payment"
  | "technical_issue"
  | "account_access"
  | "tariff_question"
  | "refund"
  | "other"

export type Satisfaction = "satisfied" | "neutral" | "unsatisfied"

export interface ChatMessage {
  role: "client" | "agent"
  content: string
  timestamp?: string
}

export interface ChatScenarioMeta {
  domain: string
  caseType: CaseType
  hasHiddenDissatisfaction: boolean
  hasTonalErrors: boolean
  hasLogicalErrors: boolean
}

export interface ChatQualityMeta {
  intent: ChatIntent
  satisfaction: Satisfaction
  qualityScore: number
  agentMistakes: string[]
}

export interface ChatSummary {
  id: string
  title: string
  createdAt: string
  scenario: ChatScenarioMeta
  quality: ChatQualityMeta
  preview: string
}

export interface ChatDetail extends ChatSummary {
  messages: ChatMessage[]
}


