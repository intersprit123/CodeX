import { NextResponse } from 'next/server'
import { twelveStatistics } from '@/lib/twelve-data'

export async function GET(req: Request) {
  const symbol = new URL(req.url).searchParams.get('symbol')?.trim()
  if (!symbol) return NextResponse.json({ error: 'symbol is required' }, { status: 400 })
  try {
    return NextResponse.json({ ...(await twelveStatistics(symbol)), source: 'twelve-data' })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Fundamentals request failed' }, { status: 502 })
  }
}
