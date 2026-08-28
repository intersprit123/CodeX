const BASE_URL = 'https://api.twelvedata.com'

export type TwelveQuote = {
  symbol: string
  name?: string
  exchange?: string
  currency?: string
  close?: string
  previous_close?: string
  change?: string
  percent_change?: string
}

function apiKey() {
  const key = process.env.TWELVE_DATA_API_KEY
  if (!key) throw new Error('TWELVE_DATA_API_KEY is not configured')
  return key
}

async function request(path: string, params: Record<string, string>) {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries({ ...params, apikey: apiKey() }).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url, { next: { revalidate: 30 } })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.status === 'error' || data.code) {
    throw new Error(data.message || `Twelve Data request failed (${res.status})`)
  }
  return data
}

export async function twelveQuotes(symbols: string[]) {
  const data = await request('/quote', { symbol: symbols.join(',') })
  const rows: TwelveQuote[] = []

  // Single-symbol responses are returned directly by Twelve Data.
  if (symbols.length === 1 && data.symbol) rows.push(data)
  else {
    // Batch responses are keyed by symbol. Some responses do not repeat the
    // symbol inside each object, so use the response key as a safe fallback.
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (!value || typeof value !== 'object') continue
      const row = value as Partial<TwelveQuote>
      if (!row.close) continue
      rows.push({
        ...(row as TwelveQuote),
        symbol: row.symbol || key,
      })
    }
  }

  console.log('[MarketOS][TwelveData] Quote response', {
    requested: symbols.length,
    returned: rows.length,
    symbols: rows.map(row => row.symbol),
  })

  return rows
}

export async function twelveTimeSeries(symbol: string, interval = '1day', outputsize = '120') {
  return request('/time_series', { symbol, interval, outputsize })
}

export async function twelveSearch(query: string) {
  return request('/symbol_search', { symbol: query })
}

export async function twelveStatistics(symbol: string) {
  return request('/statistics', { symbol })
}

export async function twelveNews(symbol?: string) {
  const params: Record<string, string> = { limit: '20' }
  if (symbol) params.symbol = symbol
  return request('/news', params)
}
