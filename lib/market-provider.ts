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

// Twelve Data's free plan allows 8 API credits per minute.
// Keep the live dashboard within that limit and refresh at most once per minute.
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

export class TwelveDataMarketProvider implements MarketProvider {
  async quotes(): Promise<Quote[]> {
    const now = Date.now()
    if (liveCache && liveCache.expiresAt > now) return liveCache.quotes

    // Deduplicate simultaneous page/API requests so one refresh costs one API call.
    if (liveRequest) return liveRequest

    liveRequest = (async () => {
      const rows = await twelveQuotes(LIVE_SYMBOLS.map(x => x.symbol))
      const bySymbol = new Map(rows.map(row => [row.symbol.toUpperCase(), row]))
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
      return quotes
    })()

    try {
      return await liveRequest
    } finally {
      liveRequest = null
    }
  }
}

export function getMarketProvider(): MarketProvider {
  if (process.env.MARKET_DATA_MODE === 'live' && process.env.TWELVE_DATA_API_KEY) {
    return new TwelveDataMarketProvider()
  }
  return new DemoMarketProvider()
}
