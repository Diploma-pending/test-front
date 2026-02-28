import { request } from "../base"
import type {
  BusinessContextItem,
  GroupAnalyzeResponse,
  GroupChatsResponse,
  GroupCreateResponse,
  GroupSummary,
} from "../types"

export const listBusinesses = (): Promise<BusinessContextItem[]> =>
  request<BusinessContextItem[]>("/groups/businesses")

export const listGroups = (): Promise<GroupSummary[]> =>
  request<GroupSummary[]>("/groups")

export const createGroup = async (params: {
  business?: string
  contextFile?: File
  websiteUrl?: string
  numChats?: number
}): Promise<GroupCreateResponse> => {
  const { business, contextFile, websiteUrl, numChats = 8 } = params
  const form = new FormData()
  if (business) form.append("business", business)
  if (contextFile) form.append("context_file", contextFile, contextFile.name)
  if (websiteUrl) form.append("website_url", websiteUrl)
  form.append("num_chats", String(numChats))
  return request<GroupCreateResponse>("/groups", { method: "POST", body: form })
}

export const triggerAnalysis = (
  groupId: string,
): Promise<GroupAnalyzeResponse> =>
  request<GroupAnalyzeResponse>(`/groups/${groupId}/analyze`, {
    method: "POST",
  })

export const getGroupChats = (
  groupId: string,
): Promise<GroupChatsResponse> =>
  request<GroupChatsResponse>(`/groups/${groupId}/chats`)
