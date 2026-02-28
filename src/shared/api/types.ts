export interface BusinessContextItem {
  id: string
  label: string
}

export type GroupStatus =
  | "gathering_context"
  | "context_gathering_failed"
  | "generating"
  | "generated"
  | "generation_failed"
  | "analyzing"
  | "completed"
  | "analysis_failed"

export type ChatStatus =
  | "pending"
  | "generating"
  | "generated"
  | "analyzing"
  | "analyzed"
  | "failed"

export type CaseType =
  | "simple_resolved"
  | "complex_resolved"
  | "escalated"
  | "unresolved"

export type Satisfaction = "satisfied" | "neutral" | "unsatisfied"

export type AgentMistakeType = "tonal" | "logical"

export interface AgentMistake {
  type: AgentMistakeType
  description: string
  message_index: number
}

export interface ChatAnalysis {
  chat_id: string
  intent: string
  satisfaction: Satisfaction
  quality_score: number
  agent_mistakes: AgentMistake[]
  reasoning: string
}

export interface ChatSummary {
  chat_id: string
  case_type: CaseType
  status: ChatStatus
  analysis: ChatAnalysis | null
}

export interface GroupChatsResponse {
  group_id: string
  topic: string
  status: GroupStatus
  num_chats: number
  created_at: string
  website_url: string | null
  context_gathering_error: string | null
  chats: ChatSummary[]
}

export interface Message {
  role: "customer" | "agent"
  text: string
}

export interface Scenario {
  domain: string
  case_type: CaseType
  has_hidden_dissatisfaction: boolean
  has_tonal_errors: boolean
  has_logical_errors: boolean
}

export interface ChatDetailResponse {
  chat_id: string
  case_type: CaseType
  status: ChatStatus
  messages: Message[] | null
  scenario: Scenario | null
  analysis: ChatAnalysis | null
}

export interface CreateGroupResponse {
  group_id: string
  status: GroupStatus
  num_chats: number
}

export interface TriggerAnalysisResponse {
  group_id: string
  status: GroupStatus
}
