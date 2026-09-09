import { NextResponse } from 'next/server'

const BASE_URL = 'https://api.twelvedata.com'
const ALLOWED = new Set(['sma','ema','rsi','macd','bbands','adx','stoch'])

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams
  const symbol = p.get('symbol')?.trim()
  const indicator = (p.get('indicator') || 'rsi').toLowerCase()
  const interval = p.get('interval') || '1day'
  if (!symbol) return NextResponse.json({ error: 'symbol is required' }, { status: 400 })
  if (!ALLOWED.has(indicator)) return NextResponse.json({ error: 'Unsupported indicator' }, { status: 400 })
  const key = process.env.TWELVE_DATA_API_KEY
  if (!key) return NextResponse.json({ error: 'TWELVE_DATA_API_KEY is not configured' }, { status: 503 })
  const url = new URL(`${BASE_URL}/${indicator}`)
  url.searchParams.set('symbol', symbol)
  url.searchParams.set('interval', interval)
  url.searchParams.set('outputsize', p.get('outputsize') || '120')
  url.searchParams.set('apikey', key)
  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    const data = await res.json()
    if (!res.ok || data.status === 'error') return NextResponse.json({ error: data.message || 'Technical indicator request failed' }, { status: 502 })
    return NextResponse.json({ ...data, source: 'twelve-data', indicator })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Technical indicator request failed' }, { status: 502 })
  }
}
