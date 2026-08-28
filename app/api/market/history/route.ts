import { NextResponse } from 'next/server'
import { twelveTimeSeries } from '@/lib/twelve-data'

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams
  const symbol = p.get('symbol')
  const interval = p.get('interval') || '1day'
  const outputsize = p.get('outputsize') || '120'
  if (!symbol) return NextResponse.json({ error: 'symbol is required' }, { status: 400 })
  try {
    const data = await twelveTimeSeries(symbol, interval, outputsize)
    return NextResponse.json({ ...data, source: 'twelve-data' })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Market history request failed' }, { status: 502 })
  }
}
