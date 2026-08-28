export const MARKET_MODE = process.env.MARKET_DATA_MODE === 'live' ? 'live' : 'demo' as const
export const isLiveMarketData = MARKET_MODE === 'live'

export function marketModeLabel() {
  return isLiveMarketData ? 'LIVE' : 'DEMO'
}
