type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
const API_BASE = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'

function buildHeaders(extra?: HeadersInit): HeadersInit {
  const h: Record<string, string> = {}
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('AUTH_TOKEN') : null
  if (token) h['Authorization'] = `Bearer ${token}`
  return { ...extra, ...h }
}

type ApiOptions = { headers?: HeadersInit; signal?: AbortSignal; timeoutMs?: number; retryGet?: boolean }

export async function apiRequest<T = unknown>(method: Method, path: string, body?: unknown, opts?: ApiOptions): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const headers: HeadersInit = buildHeaders({ 'Content-Type': 'application/json', ...(opts?.headers || {}) })
  const timeoutMs = typeof opts?.timeoutMs === 'number' ? opts!.timeoutMs : 12000
  const attempts = method === 'GET' && (opts?.retryGet ?? true) ? 2 : 1
  let lastErr: unknown = null
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    // If a caller-supplied signal is provided, abort our controller when it fires
    if (opts?.signal) {
      const onAbort = () => controller.abort()
      if ('aborted' in opts.signal && opts.signal.aborted) controller.abort()
      else opts.signal.addEventListener('abort', onAbort, { once: true })
    }
    try {
      const res = await fetch(url, {
        method,
        headers,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        signal: controller.signal,
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
      clearTimeout(timer)
      return json as T
    } catch (e) {
      clearTimeout(timer)
      lastErr = e
      // retry only on GET and only if not last attempt
      if (attempt === attempts) break
    }
  }
  // If we get here, retries exhausted
  if (lastErr instanceof Error) throw lastErr
  throw new Error('Request failed')
}

export const apiGet = <T = unknown>(path: string, opts?: { headers?: HeadersInit; signal?: AbortSignal }) => apiRequest<T>('GET', path, undefined, opts)
export const apiPost = <T = unknown>(path: string, body?: unknown, opts?: { headers?: HeadersInit; signal?: AbortSignal }) => apiRequest<T>('POST', path, body, opts)
