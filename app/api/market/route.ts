import { NextResponse } from 'next/server'
import { getQuotes } from '@/lib/market-data'

export async function GET() {
  const quotes = await getQuotes()
  return NextResponse.json({ quotes, source: 'demo', liveData: false })
}
