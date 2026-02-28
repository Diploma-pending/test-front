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

const handleResponse = async <T>(res: Response): Promise<T> => {
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

/** Base request helper: GET by default, merges base URL and ngrok headers. */
export const request = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { ...NGROK_HEADERS, ...init?.headers },
  })
  return handleResponse<T>(res)
}
