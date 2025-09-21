import { useEffect } from 'react'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (opts: { client_id: string; callback: (resp: { credential?: string }) => void }) => void
          prompt: (cb: (n: { isNotDisplayed?: boolean; isSkippedMoment?: boolean }) => void) => void
        }
      }
    }
  }
}

export default function GoogleSignIn({ onSuccess }: { onSuccess: (payload: { token: string; user: { sub: string; email: string; name?: string; picture?: string } }) => void }) {
  useEffect(() => {
    // Load Google Identity Services if not present
    if (!window.google) {
      const s = document.createElement('script')
      s.src = 'https://accounts.google.com/gsi/client'
      s.async = true
      s.defer = true
      document.head.appendChild(s)
    }
  }, [])

  const handleClick = async () => {
    const google = window.google
    const clientId = (import.meta as unknown as { env?: { VITE_GOOGLE_CLIENT_ID?: string; VITE_API_BASE_URL?: string } }).env?.VITE_GOOGLE_CLIENT_ID
    const apiBase = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ?? 'http://localhost:5000'
    if (!google || !clientId) {
      alert('Google Sign-In not configured')
      return
    }
    try {
      const token: string = await new Promise((resolve, reject) => {
        try {
          google.accounts.id.initialize({ client_id: clientId, callback: (resp: { credential?: string }) => resp.credential && resolve(resp.credential) })
          // There is no official promise; render a prompt
          google.accounts.id.prompt((n: { isNotDisplayed?: boolean; isSkippedMoment?: boolean }) => {
            if (n?.isNotDisplayed || n?.isSkippedMoment) {
              reject(new Error('User dismissed login'))
            }
          })
        } catch (e) {
          reject(e)
        }
      })
      const r = await fetch(`${apiBase}/api/auth/google`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_token: token }) })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.message || 'Auth failed')
      onSuccess(data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <button type="button" onClick={handleClick} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
      <span>Continue with Google</span>
    </button>
  )
}
