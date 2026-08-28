export type MarketQuote = { symbol: string; name: string; price: number; changePercent: number; currency: string }

export const demoQuotes: MarketQuote[] = [
  { symbol: 'NIFTY50', name: 'NIFTY 50', price: 25118.95, changePercent: 0.82, currency: 'INR' },
  { symbol: 'SENSEX', name: 'SENSEX', price: 82365.77, changePercent: 0.67, currency: 'INR' },
  { symbol: 'SPX', name: 'S&P 500', price: 6481.4, changePercent: 0.21, currency: 'USD' },
  { symbol: 'IXIC', name: 'NASDAQ', price: 21590.14, changePercent: -0.18, currency: 'USD' },
]

export async function getQuotes(): Promise<MarketQuote[]> {
  return demoQuotes
}
