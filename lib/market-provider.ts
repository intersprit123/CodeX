import { finmagineTopMovers } from '@/lib/finmagine'

export type Quote = {
  symbol: string
  name: string
  price: number
  changePercent: number
  currency: string
}

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

// Finmagine free tier: cache market data to reduce API usage.
const CACHE_MS = 30 * 60_000

let liveCache: {
  quotes: Quote[]
  expiresAt: number
} | null = null

let liveRequest: Promise<Quote[]> | null = null
let debugInitialized = false

function debug(message: string, details?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== 'development') return

  console.log(
    `[MarketOS][MarketData] ${message}${
      details ? ` ${JSON.stringify(details)}` : ''
    }`,
  )
}

function printStatus() {
  if (debugInitialized) return

  debugInitialized = true

  debug('STATUS', {
    mode: process.env.MARKET_DATA_MODE === 'live' ? 'LIVE' : 'DEMO',
    provider:
      process.env.MARKET_DATA_MODE === 'live' &&
      process.env.FINMAGINE_API_KEY
        ? 'Finmagine'
        : 'Demo',
    apiKeyLoaded: Boolean(process.env.FINMAGINE_API_KEY),
    endpoint: '/market/top-movers',
    cacheMinutes: CACHE_MS / 60_000,
    rateLimitStrategy: '1 market request / 30m',
  })
}

function numberValue(...values: unknown[]) {
  for (const value of values) {
    const n = Number(value)

    if (Number.isFinite(n)) {
      return n
    }
  }

  return null
}

export class FinmagineMarketProvider implements MarketProvider {
  async quotes(): Promise<Quote[]> {
    printStatus()

    const now = Date.now()

    if (liveCache && liveCache.expiresAt > now) {
      debug('CACHE HIT', {
        quotes: liveCache.quotes.length,
        secondsRemaining: Math.ceil(
          (liveCache.expiresAt - now) / 1000,
        ),
      })

      return liveCache.quotes
    }

    if (liveRequest) {
      debug('REQUEST JOIN', {
        reason: 'another request is already fetching market data',
      })

      return liveRequest
    }

    debug('API REQUEST START', {
      provider: 'Finmagine',
      endpoint: '/market/top-movers',
    })

    liveRequest = (async () => {
      const started = Date.now()

      try {
        const rows = await finmagineTopMovers(8)

        const quotes = rows.flatMap((row) => {
          const symbol =
            typeof row.symbol === 'string'
              ? row.symbol.trim().toUpperCase()
              : ''

          const price = numberValue(
            row.price_cmp,
            row.current_price,
            row.price,
            row.close,
            row.close_price,
            row.cmp,
          )

          if (!symbol || price === null || price <= 0) {
            return []
          }

          const changePercent =
            numberValue(
              row.change_percent,
              row.percent_change,
              row.change_pct,
              row.pct_change,
            ) ?? 0

          return [
            {
              symbol,
              name: row.company_name || row.name || symbol,
              price,
              changePercent,
              currency: row.currency || 'INR',
            },
          ]
        })

        liveCache = {
          quotes,
          expiresAt: Date.now() + CACHE_MS,
        }

        debug('API REQUEST SUCCESS', {
          returned: rows.length,
          usable: quotes.length,
          elapsedMs: Date.now() - started,
          cacheMinutes: CACHE_MS / 60_000,
        })

        return quotes
      } catch (error) {
        debug('API REQUEST FAILED', {
          elapsedMs: Date.now() - started,
          error:
            error instanceof Error
              ? error.message
              : 'Unknown market data error',
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

  if (
    process.env.MARKET_DATA_MODE === 'live' &&
    process.env.FINMAGINE_API_KEY
  ) {
    return new FinmagineMarketProvider()
  }

  return new DemoMarketProvider()
}