import { twelveQuotes } from '@/lib/twelve-data'

export type Quote = { symbol: string; name: string; price: number; changePercent: number; currency: string }

export interface MarketProvider {
  quotes(): Promise<Quote[]>
}

export class DemoMarketProvider implements MarketProvider {
  async quotes(): Promise<Quote[]> {
    return [
      { symbol: 'NIFTY50', name: 'NIFTY 50', price: 25118.95, changePercent: 0.82, currency: 'INR' },
      { symbol: 'SENSEX', name: 'SENSEX', price: 82365.77, changePercent: 0.67, currency: 'INR' },
      { symbol: 'SPX', name: 'S&P 500', price: 6481.4, changePercent: 0.21, currency: 'USD' },
      { symbol: 'IXIC', name: 'NASDAQ', price: 21590.14, changePercent: -0.18, currency: 'USD' },
      { symbol: 'N225', name: 'NIKKEI 225', price: 43812.7, changePercent: 1.1, currency: 'JPY' },
      { symbol: 'DAX', name: 'DAX', price: 24921.1, changePercent: 0.44, currency: 'EUR' },
    ]
  }
}

// Twelve Data free plan: keep live quote traffic to one batched request per minute.
const LIVE_SYMBOLS = [
  { symbol: 'RELIANCE:NSE', name: 'Reliance Industries', currency: 'INR' },
  { symbol: 'TCS:NSE', name: 'Tata Consultancy Services', currency: 'INR' },
  { symbol: 'INFY:NSE', name: 'Infosys', currency: 'INR' },
  { symbol: 'HDFCBANK:NSE', name: 'HDFC Bank', currency: 'INR' },
  { symbol: 'ICICIBANK:NSE', name: 'ICICI Bank', currency: 'INR' },
  { symbol: 'BHARTIARTL:NSE', name: 'Bharti Airtel', currency: 'INR' },
  { symbol: 'LT:NSE', name: 'Larsen & Toubro', currency: 'INR' },
  { symbol: 'ITC:NSE', name: 'ITC', currency: 'INR' },
]

const CACHE_MS = 60_000
let liveCache: { quotes: Quote[]; expiresAt: number } | null = null
let liveRequest: Promise<Quote[]> | null = null
let debugInitialized = false

// Debug output is server-terminal only and is disabled in production.
function debug(message: string, details?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== 'development') return
  console.log(`[MarketOS][MarketData] ${message}${details ? ` ${JSON.stringify(details)}` : ''}`)
}

function printStatus() {
  if (debugInitialized) return
  debugInitialized = true
  debug('STATUS', {
    mode: process.env.MARKET_DATA_MODE === 'live' ? 'LIVE' : 'DEMO',
    provider: process.env.MARKET_DATA_MODE === 'live' && process.env.TWELVE_DATA_API_KEY ? 'Twelve Data' : 'Demo',
    apiKeyLoaded: Boolean(process.env.TWELVE_DATA_API_KEY),
    symbols: LIVE_SYMBOLS.length,
    cacheSeconds: CACHE_MS / 1000,
    rateLimitStrategy: '1 batched request / 60s',
  })
}

export class TwelveDataMarketProvider implements MarketProvider {
  async quotes(): Promise<Quote[]> {
    printStatus()
    const now = Date.now()

    if (liveCache && liveCache.expiresAt > now) {
      debug('CACHE HIT', { quotes: liveCache.quotes.length, secondsRemaining: Math.ceil((liveCache.expiresAt - now) / 1000) })
      return liveCache.quotes
    }

    if (liveRequest) {
      debug('REQUEST JOIN', { reason: 'another request is already fetching live data' })
      return liveRequest
    }

    debug('API REQUEST START', { symbols: LIVE_SYMBOLS.length })
    liveRequest = (async () => {
      const started = Date.now()
      try {
        const rows = await twelveQuotes(LIVE_SYMBOLS.map(x => x.symbol))
        const validRows = rows.filter(row => typeof row?.symbol === 'string' && row.symbol.length > 0)
        const invalidRows = rows.length - validRows.length
        if (invalidRows > 0) debug('IGNORED INVALID ROWS', { invalidRows })

        const bySymbol = new Map(validRows.map(row => [row.symbol.toUpperCase(), row]))
        const quotes = LIVE_SYMBOLS.flatMap(meta => {
          const row = bySymbol.get(meta.symbol.toUpperCase())
          if (!row || !row.close) return []
          return [{
            symbol: meta.symbol,
            name: row.name || meta.name,
            price: Number(row.close),
            changePercent: Number(row.percent_change || 0),
            currency: row.currency || meta.currency,
          }]
        })

        liveCache = { quotes, expiresAt: Date.now() + CACHE_MS }
        debug('API REQUEST SUCCESS', {
          returned: rows.length,
          usable: quotes.length,
          elapsedMs: Date.now() - started,
          cacheSeconds: CACHE_MS / 1000,
        })
        return quotes
      } catch (error) {
        // Never print the API key or raw provider payload.
        debug('API REQUEST FAILED', {
          elapsedMs: Date.now() - started,
          error: error instanceof Error ? error.message : 'Unknown market data error',
        })
        throw error
      }
    })()

    try {
      return await liveRequest
    } finally {
      liveRequest = null
    }
  }
}

export function getMarketProvider(): MarketProvider {
  printStatus()
  if (process.env.MARKET_DATA_MODE === 'live' && process.env.TWELVE_DATA_API_KEY) {
    return new TwelveDataMarketProvider()
  }
  return new DemoMarketProvider()
}
