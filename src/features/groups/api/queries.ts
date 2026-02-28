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
  triggerAnalysis,
} from "@/shared/api/client"
import type { GroupChatsResponse } from "@/shared/api/types"

const groupChatsKey = (groupId: string) => ["groups", groupId, "chats"] as const
const chatDetailKey = (groupId: string, chatId: string) =>
  ["groups", groupId, "chats", chatId] as const

const TERMINAL_GROUP_STATUSES = [
  "completed",
  "context_gathering_failed",
  "generation_failed",
  "analysis_failed",
] as const

function shouldPoll(status: GroupChatsResponse["status"]) {
  return !TERMINAL_GROUP_STATUSES.includes(
    status as (typeof TERMINAL_GROUP_STATUSES)[number],
  )
}

export function useBusinesses() {
  return useQuery({
    queryKey: ["groups", "businesses"] as const,
    queryFn: listBusinesses,
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: groupChatsKey(data.group_id) })
    },
  })
}

export function useTriggerAnalysis(groupId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => triggerAnalysis(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupChatsKey(groupId) })
    },
  })
}

export function useGroupChats(groupId: string | undefined) {
  return useQuery({
    queryKey: groupChatsKey(groupId ?? ""),
    queryFn: () => getGroupChats(groupId!),
    enabled: Boolean(groupId),
    refetchInterval: (query) => {
      const data = query.state.data as GroupChatsResponse | undefined
      if (!data) return false
      return shouldPoll(data.status) ? 3000 : false
    },
  })
}

export function useChatDetail(
  groupId: string | undefined,
  chatId: string | undefined,
) {
  return useQuery({
    queryKey: chatDetailKey(groupId ?? "", chatId ?? ""),
    queryFn: () => getChatDetail(groupId!, chatId!),
    enabled: Boolean(groupId) && Boolean(chatId),
  })
}
