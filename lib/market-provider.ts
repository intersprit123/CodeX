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

export function getMarketProvider(): MarketProvider {
  // Live provider is intentionally not activated yet. This switch is the single future integration point.
  return new DemoMarketProvider()
}
