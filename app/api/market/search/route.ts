import { NextResponse } from 'next/server'
import { twelveSearch } from '@/lib/twelve-data'

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')?.trim()
  if (!q) return NextResponse.json({ error: 'q is required' }, { status: 400 })
  try {
    return NextResponse.json({ ...(await twelveSearch(q)), source: 'twelve-data' })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Market search failed' }, { status: 502 })
  }
}
