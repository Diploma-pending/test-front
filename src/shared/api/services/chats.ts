import { request } from "../base"
import type { ChatDetailResponse } from "../types"

export const getChatDetail = (
  groupId: string,
  chatId: string,
): Promise<ChatDetailResponse> =>
  request<ChatDetailResponse>(
    `/groups/${groupId}/chats/${encodeURIComponent(chatId)}`,
  )

export const triggerChatAnalysis = (
  groupId: string,
  chatId: string,
): Promise<ChatDetailResponse> =>
  request<ChatDetailResponse>(
    `/groups/${groupId}/chats/${encodeURIComponent(chatId)}/analyze`,
    { method: "POST" },
  )

export const regenerateChat = (
  groupId: string,
  chatId: string,
): Promise<ChatDetailResponse> =>
  request<ChatDetailResponse>(
    `/groups/${groupId}/chats/${encodeURIComponent(chatId)}/regenerate`,
    { method: "POST" },
  )
