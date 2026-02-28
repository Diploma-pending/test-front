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

/** Chat summary from GET /groups/{group_id}/chats */
export interface ChatSummary {
  chat_id: string
  status: ChatStatus
  analysis?: Record<string, unknown> | null
}

export interface GroupChatsResponse {
  group_id: string
  topic: string
  status: GroupStatus
  num_chats: number
  created_at: string
  chats: ChatSummary[]
  website_url?: string | null
  context_gathering_error?: string | null
  business?: string | null
}

/** Message in chat detail; API returns objects with arbitrary shape */
export interface ChatMessageRecord {
  role?: "customer" | "agent"
  text?: string
  [key: string]: unknown
}

/** Full chat detail from GET /groups/{group_id}/chats/{chat_id} */
export interface ChatDetailResponse {
  chat_id: string
  status: ChatStatus
  messages?: ChatMessageRecord[] | null
  analysis?: Record<string, unknown> | null
}

export interface GroupSummary {
  group_id: string
  topic: string
  status: GroupStatus
  num_chats: number
  created_at: string
  website_url?: string | null
  context_gathering_error?: string | null
  business?: string | null
}

export interface GroupCreateResponse {
  group_id: string
  status: GroupStatus
  num_chats: number
}

export interface GroupAnalyzeResponse {
  group_id: string
  status: GroupStatus
}
