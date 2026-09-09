import { NextResponse } from 'next/server'
import { getMarketProvider } from '@/lib/market-provider'
import { MARKET_MODE } from '@/lib/market-mode'

export async function GET() {
  const quotes = await getMarketProvider().quotes()
  return NextResponse.json({ quotes, source: MARKET_MODE, liveData: MARKET_MODE === 'live' })
}
