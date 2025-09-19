export type CampaignData = {
  ref?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  utm_influencer?: string
}

const KEY = 'campaign_data'

export function captureFromURL() {
  try {
    const url = new URL(window.location.href)
    const data: CampaignData = {}
    const params = url.searchParams
    const keys = ['ref', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_influencer'] as const
    let found = false
    keys.forEach((k) => {
      const v = params.get(k)
      if (v) {
        Object.assign(data, { [k]: v } as Partial<CampaignData>)
        found = true
      }
    })
    if (found) {
      const prev = getCampaignData()
      const merged = { ...prev, ...data }
      localStorage.setItem(KEY, JSON.stringify(merged))
    }
  } catch {
    // ignore
  }
}

export function getCampaignData(): CampaignData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    return JSON.parse(raw) as CampaignData
  } catch {
    return {}
  }
}
