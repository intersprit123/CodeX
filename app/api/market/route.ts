import { NextResponse } from 'next'
import { getMarketProvider } from '@/lib/market-provider'
import { MARKET_MODE } from '@/lib/market-mode'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const quotes = await getMarketProvider().quotes()
    return NextResponse.json({
      quotes,
      source: MARKET_MODE,
      liveData: MARKET_MODE === 'live',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Market data unavailable'
    console.error('[MarketOS][MarketData] API ERROR', { message })
    return NextResponse.json(
      { quotes: [], source: MARKET_MODE, liveData: MARKET_MODE === 'live', error: message },
      { status: 503 },
    )
  }
}
