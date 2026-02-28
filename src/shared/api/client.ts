import type {
  BusinessContextItem,
  ChatDetailResponse,
  CreateGroupResponse,
  GroupChatsResponse,
  TriggerAnalysisResponse,
} from "./types"

const API_BASE_URL = "https://zackary-oversalty-louie.ngrok-free.dev"

// ngrok free tier shows an interstitial unless this header is sent
const NGROK_HEADERS: HeadersInit = {
  "ngrok-skip-browser-warning": "true",
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
    throw new Error(
      typeof detail === "string" ? detail : JSON.stringify(detail),
    )
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
  topic: string
  business?: string
  contextFile?: File
  websiteUrl?: string
  numChats?: number
}): Promise<CreateGroupResponse> {
  const { topic, business, contextFile, websiteUrl, numChats = 8 } = params

  const form = new FormData()
  form.append("topic", topic)
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

  return handleResponse<CreateGroupResponse>(res)
}

export async function triggerAnalysis(
  groupId: string,
): Promise<TriggerAnalysisResponse> {
  const res = await fetch(`${API_BASE_URL}/groups/${groupId}/analyze`, {
    method: "POST",
    headers: NGROK_HEADERS,
  })

  return handleResponse<TriggerAnalysisResponse>(res)
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
