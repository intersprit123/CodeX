'use client'

import { FormEvent, useState } from 'react'

export default function AIPage() {
  const [message, setMessage] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function ask(e: FormEvent) {
    e.preventDefault()
    if (!message.trim() || loading) return
    setLoading(true); setAnswer('')
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) })
      const data = await res.json()
      setAnswer(data.answer || data.error || 'Something went wrong.')
    } catch { setAnswer('Could not reach MarketOS AI.') }
    finally { setLoading(false) }
  }

  return <main className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
    <a href="/" className="text-sm text-cyan-400">← MarketOS</a>
    <div className="mt-10 max-w-3xl">
      <div className="text-xs text-cyan-400 font-semibold tracking-widest">MARKETOS AI</div>
      <h1 className="text-4xl font-bold mt-2">Your market research copilot.</h1>
      <p className="text-slate-500 mt-3">Ask about markets, companies, sectors, valuation concepts, or how to interpret financial data.</p>
      <div className="glass rounded-2xl p-5 mt-8 min-h-72">
        {answer ? <div className="whitespace-pre-wrap leading-7 text-slate-200">{answer}</div> : <div className="text-slate-600">Try: “Explain why interest rates matter for technology stocks.”</div>}
      </div>
      <form onSubmit={ask} className="mt-4 flex gap-3">
        <input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask MarketOS AI..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-400/50" />
        <button disabled={loading} className="rounded-xl bg-cyan-400 text-black px-6 font-semibold disabled:opacity-50">{loading ? 'Thinking…' : 'Ask'}</button>
      </form>
    </div>
  </main>
}
