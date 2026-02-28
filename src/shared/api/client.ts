import type {
  BusinessContextItem,
  ChatDetailResponse,
  GroupAnalyzeResponse,
  GroupChatsResponse,
  GroupCreateResponse,
  GroupSummary,
} from "./types"

const API_BASE_URL = "https://zackary-oversalty-louie.ngrok-free.dev"

const NGROK_HEADERS: HeadersInit = {
  "ngrok-skip-browser-warning": "true",
}

export class ApiError extends Error {
  readonly status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text()
  let body: unknown
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = { detail: text || res.statusText }
  }

  if (!res.ok) {
    const detail =
      typeof body === "object" && body !== null && "detail" in body
        ? (body as { detail: unknown }).detail
        : res.statusText
    const message =
      typeof detail === "string" ? detail : JSON.stringify(detail)
    throw new ApiError(message, res.status)
  }

  return body as T
}

export async function listBusinesses(): Promise<BusinessContextItem[]> {
  const res = await fetch(`${API_BASE_URL}/groups/businesses`, {
    headers: NGROK_HEADERS,
  })
  return handleResponse<BusinessContextItem[]>(res)
}

export async function createGroup(params: {
  business?: string
  contextFile?: File
  websiteUrl?: string
  numChats?: number
}): Promise<GroupCreateResponse> {
  const { business, contextFile, websiteUrl, numChats = 8 } = params

  const form = new FormData()
  if (business) {
    form.append("business", business)
  }
  if (contextFile) {
    form.append("context_file", contextFile, contextFile.name)
  }
  if (websiteUrl) {
    form.append("website_url", websiteUrl)
  }
  form.append("num_chats", String(numChats))

  const res = await fetch(`${API_BASE_URL}/groups`, {
    method: "POST",
    headers: NGROK_HEADERS,
    body: form,
  })

  return handleResponse<GroupCreateResponse>(res)
}

export async function listGroups(): Promise<GroupSummary[]> {
  const res = await fetch(`${API_BASE_URL}/groups`, {
    headers: NGROK_HEADERS,
  })
  return handleResponse<GroupSummary[]>(res)
}

export async function triggerAnalysis(
  groupId: string,
): Promise<GroupAnalyzeResponse> {
  const res = await fetch(`${API_BASE_URL}/groups/${groupId}/analyze`, {
    method: "POST",
    headers: NGROK_HEADERS,
  })

  return handleResponse<GroupAnalyzeResponse>(res)
}

export async function getGroupChats(
  groupId: string,
): Promise<GroupChatsResponse> {
  const res = await fetch(`${API_BASE_URL}/groups/${groupId}/chats`, {
    headers: NGROK_HEADERS,
  })

  return handleResponse<GroupChatsResponse>(res)
}

export async function getChatDetail(
  groupId: string,
  chatId: string,
): Promise<ChatDetailResponse> {
  const res = await fetch(
    `${API_BASE_URL}/groups/${groupId}/chats/${encodeURIComponent(chatId)}`,
    { headers: NGROK_HEADERS },
  )

  return handleResponse<ChatDetailResponse>(res)
}

export async function triggerChatAnalysis(
  groupId: string,
  chatId: string,
): Promise<ChatDetailResponse> {
  const res = await fetch(
    `${API_BASE_URL}/groups/${groupId}/chats/${encodeURIComponent(chatId)}/analyze`,
    {
      method: "POST",
      headers: NGROK_HEADERS,
    },
  )

  return handleResponse<ChatDetailResponse>(res)
}
