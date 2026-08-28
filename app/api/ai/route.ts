import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  const key = process.env.OPENAI_API_KEY
  if (!key) return NextResponse.json({ error: 'OPENAI_API_KEY is not configured. Run the local setup first.' }, { status: 503 })

  const upstream = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
      instructions: 'You are MarketOS AI. Provide clear, evidence-conscious market education and analysis. Never invent live prices, earnings, news, or other market facts. If current data is unavailable, say so. Do not present personalized financial advice as certainty.',
      input: message,
    }),
  })

  const data = await upstream.json()
  if (!upstream.ok) return NextResponse.json({ error: data?.error?.message || 'AI request failed' }, { status: upstream.status })
  return NextResponse.json({ answer: data.output_text || 'No response returned.' })
}
