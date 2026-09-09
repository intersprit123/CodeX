import { NextResponse } from 'next/server'
import { twelveTimeSeries } from '@/lib/twelve-data'
import { MARKET_MODE } from '@/lib/market-mode'

const SYMBOL_RE = /^[A-Z0-9.:_-]{1,30}$/i
const NSE_SYMBOLS = new Set(['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'BHARTIARTL', 'LT', 'ITC'])

function providerSymbol(symbol: string) {
  const upper = symbol.toUpperCase()
  return NSE_SYMBOLS.has(upper) ? `${upper}:NSE` : upper
}

function demoHistory(symbol: string) {
  const upper = symbol.toUpperCase()
  const base = upper === 'TCS' ? 3284.4 : upper === 'INFY' ? 1492.2 : upper === 'RELIANCE' ? 1418.3 : 1000
  return Array.from({ length: 120 }, (_, i) => {
    const drift = Math.sin(i / 7) * base * 0.018 + Math.sin(i / 2.8) * base * 0.006
    const close = base + (i - 119) * base * 0.0007 + drift
    const open = close - Math.sin(i * 1.7) * base * 0.002
    const high = Math.max(open, close) + base * 0.004
    const low = Math.min(open, close) - base * 0.004
    return { t: `D-${119 - i}`, o: open, h: high, l: low, c: close, v: Math.round(500000 + i * 4300) }
  })
}

export async function GET(req: Request) {
  const symbol = new URL(req.url).searchParams.get('symbol')?.trim().toUpperCase() || ''
  if (!SYMBOL_RE.test(symbol)) return NextResponse.json({ error: 'Invalid symbol' }, { status: 400 })

  if (MARKET_MODE !== 'live' || !process.env.TWELVE_DATA_API_KEY) {
    return NextResponse.json({ symbol, source: 'demo', liveData: false, values: demoHistory(symbol) })
  }

  try {
    const data = await twelveTimeSeries(providerSymbol(symbol), '1day', '120') as {
      values?: Array<{ datetime?: string; open?: string; high?: string; low?: string; close?: string; volume?: string }>
    }
    const values = (data.values || []).filter(v => v.open && v.high && v.low && v.close).reverse().map(v => ({
      t: v.datetime || '', o: Number(v.open), h: Number(v.high), l: Number(v.low), c: Number(v.close), v: Number(v.volume || 0),
    }))
    return NextResponse.json({ symbol, source: 'live', liveData: true, values }, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' } })
  } catch (error) {
    return NextResponse.json({ symbol, source: 'live', liveData: false, values: [], error: error instanceof Error ? error.message : 'History unavailable' })
  }
}
