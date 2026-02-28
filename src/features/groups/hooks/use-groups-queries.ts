import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import {
  createGroup,
  getChatDetail,
  getGroupChats,
  listBusinesses,
  listGroups,
  triggerAnalysis,
  triggerChatAnalysis,
  regenerateChat,
} from "@/shared/api/client"
import type {
  ChatDetailResponse,
  GroupChatsResponse,
} from "@/shared/api/types"
import {
  CHAT_ANALYZING_STATUSES,
  TERMINAL_GROUP_STATUSES,
} from "../lib/constants"

const groupChatsKey = (groupId: string) => ["groups", groupId, "chats"] as const
const chatDetailKey = (groupId: string, chatId: string) =>
  ["groups", groupId, "chats", chatId] as const

const shouldPollGroup = (status: GroupChatsResponse["status"]) =>
  !TERMINAL_GROUP_STATUSES.includes(
    status as (typeof TERMINAL_GROUP_STATUSES)[number],
  )

const shouldPollChatDetail = (status: ChatDetailResponse["status"]) =>
  CHAT_ANALYZING_STATUSES.includes(
    status as (typeof CHAT_ANALYZING_STATUSES)[number],
  )

export const useBusinesses = () =>
  useQuery({
    queryKey: ["groups", "businesses"] as const,
    queryFn: listBusinesses,
  })

export const useGroups = () =>
  useQuery({
    queryKey: ["groups", "list"] as const,
    queryFn: listGroups,
  })

export const useCreateGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["groups", "list"] })
      queryClient.invalidateQueries({ queryKey: groupChatsKey(data.group_id) })
    },
  })
}

export const useTriggerAnalysis = (groupId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => triggerAnalysis(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupChatsKey(groupId) })
    },
  })
}

export const useTriggerChatAnalysis = (groupId: string, chatId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => triggerChatAnalysis(groupId, chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupChatsKey(groupId) })
      queryClient.invalidateQueries({
        queryKey: chatDetailKey(groupId, chatId),
      })
    },
  })
}

export const useTriggerChatRegenerate = (groupId: string, chatId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => regenerateChat(groupId, chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupChatsKey(groupId) })
      queryClient.invalidateQueries({
        queryKey: chatDetailKey(groupId, chatId),
      })
    },
  })
}

export const useGroupChats = (groupId: string | undefined) =>
  useQuery({
    queryKey: groupChatsKey(groupId ?? ""),
    queryFn: () => getGroupChats(groupId!),
    enabled: Boolean(groupId),
    refetchInterval: (query) => {
      const data = query.state.data as GroupChatsResponse | undefined
      if (!data) return false
      return shouldPollGroup(data.status) ? 3000 : false
    },
  })

export const useChatDetail = (
  groupId: string | undefined,
  chatId: string | undefined,
) =>
  useQuery({
    queryKey: chatDetailKey(groupId ?? "", chatId ?? ""),
    queryFn: () => getChatDetail(groupId!, chatId!),
    enabled: Boolean(groupId) && Boolean(chatId),
    refetchInterval: (query) => {
      const data = query.state.data as ChatDetailResponse | undefined
      if (!data) return false
      return shouldPollChatDetail(data.status) ? 3000 : false
    },
  })
