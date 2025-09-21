type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
const API_BASE = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'

function buildHeaders(extra?: HeadersInit): HeadersInit {
  const h: Record<string, string> = {}
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('AUTH_TOKEN') : null
  if (token) h['Authorization'] = `Bearer ${token}`
  return { ...extra, ...h }
}

export async function apiRequest<T = unknown>(method: Method, path: string, body?: unknown, opts?: { headers?: HeadersInit; signal?: AbortSignal }): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const headers: HeadersInit = buildHeaders({ 'Content-Type': 'application/json', ...(opts?.headers || {}) })
  const res = await fetch(url, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...(opts?.signal ? { signal: opts.signal } : {}),
  })
  const text = await res.text()
  let json: unknown
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    json = { raw: text }
  }
  if (!res.ok) {
    let msg: string = 'Request failed'
    if (json && typeof json === 'object') {
      const j = json as { message?: unknown; error?: unknown }
      if (typeof j.message === 'string') msg = j.message
      else if (typeof j.error === 'string') msg = j.error
    }
    if (!msg && res.statusText) msg = res.statusText
    throw new Error(msg)
  }
  return json as T
}

export const apiGet = <T = unknown>(path: string, opts?: { headers?: HeadersInit; signal?: AbortSignal }) => apiRequest<T>('GET', path, undefined, opts)
export const apiPost = <T = unknown>(path: string, body?: unknown, opts?: { headers?: HeadersInit; signal?: AbortSignal }) => apiRequest<T>('POST', path, body, opts)
