import type { GroupStatus } from "@/shared/api/types"

export const TERMINAL_GROUP_STATUSES: readonly GroupStatus[] = [
  "completed",
  "context_gathering_failed",
  "generation_failed",
  "analysis_failed",
] as const

export const CHAT_ANALYZING_STATUSES = ["analyzing"] as const

export const MAX_CONTEXT_FILE_SIZE_BYTES = 1024 * 1024 // 1 MB
