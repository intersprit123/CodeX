const BASE_URL = 'https://finmagine.com/api/v1'

export type FinmagineStock = {
  symbol?: string
  company_name?: string | null
  name?: string
  price_cmp?: number | string
  price?: number | string
  current_price?: number | string
  close?: number | string
  close_price?: number | string
  cmp?: number | string
  change_percent?: number | string
  percent_change?: number | string
  change_pct?: number | string
  pct_change?: number | string
  currency?: string
}

function apiKey() {
  const key = process.env.FINMAGINE_API_KEY
  if (!key) throw new Error('FINMAGINE_API_KEY is not configured')
  return key
}

async function request(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  )

  const res = await fetch(url, {
    headers: { 'X-Api-Key': apiKey() },
    next: { revalidate: 1800 },
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok || body?.error) {
    throw new Error(
      body?.message || `Finmagine request failed (${res.status})`
    )
  }

  return body
}

function unwrapStocks(body: any): FinmagineStock[] {
  const data = body?.data ?? body

  if (Array.isArray(data)) return data
  if (Array.isArray(data?.stocks)) return data.stocks
  if (Array.isArray(data?.companies)) return data.companies
  if (Array.isArray(data?.gainers)) return data.gainers
  if (Array.isArray(data?.losers)) return data.losers
  if (Array.isArray(data?.movers)) return data.movers

  return []
}

export async function finmagineTopMovers(limit = 8) {
  const body = await request('/market/top-movers', {
    direction: 'all',
    limit: String(limit),
  })

  return unwrapStocks(body)
}

export async function finmagineCompanyProfile(symbol: string) {
  const body = await request('/company/profile', {
    symbol: symbol.toUpperCase(),
  })

  return (body?.data ?? body) as FinmagineStock
}

export async function finmagineStatus() {
  const url = `${BASE_URL}/status`

  const res = await fetch(url, {
    next: { revalidate: 300 },
  })

  return res.json()
}