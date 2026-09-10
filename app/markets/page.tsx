'use client'

import { useMemo, useState } from 'react'

const quotes = [
  { symbol: 'NOVARTIND', name: 'Novartis India Ltd', price: 2186.40, changePercent: 20, currency: 'INR' },
  { symbol: 'SHIVALIK', name: 'Shivalik Rasayan Ltd', price: 384.90, changePercent: 20, currency: 'INR' },
  { symbol: 'GOACARBON', name: 'Goa Carbon Limited', price: 463.50, changePercent: 20, currency: 'INR' },
  { symbol: 'SREEL', name: 'SREEL', price: 345.01, changePercent: 20, currency: 'INR' },
  { symbol: 'BALPHARMA', name: 'Bal Pharma Limited', price: 114.45, changePercent: 19.99, currency: 'INR' },
  { symbol: 'CFEL', name: 'CFEL', price: 38.65, changePercent: 19.99, currency: 'INR' },
  { symbol: 'MEDICAPQ', name: 'MEDICAPQ', price: 30.74, changePercent: 19.98, currency: 'INR' },
  { symbol: 'ANMOL', name: 'Anmol India Ltd', price: 13.63, changePercent: 19.77, currency: 'INR' },
]

const history: Record<string, number[]> = {
  NOVARTIND: [1818, 1840, 1826, 1872, 1894, 1881, 1915, 1950, 1932, 1988, 2014, 2050, 2038, 2075, 2110, 2098, 2142, 2186],
  SHIVALIK: [321, 326, 319, 331, 337, 334, 341, 348, 344, 352, 359, 354, 362, 369, 365, 374, 380, 384.9],
  GOACARBON: [392, 401, 398, 407, 415, 411, 423, 431, 426, 438, 445, 441, 449, 456, 452, 459, 461, 463.5],
  SREEL: [286, 291, 288, 297, 302, 299, 307, 313, 309, 318, 325, 321, 329, 334, 331, 338, 342, 345.01],
  BALPHARMA: [91, 94, 92, 96, 99, 98, 101, 104, 102, 106, 108, 105, 109, 111, 110, 112, 113, 114.45],
  CFEL: [30.2, 31, 30.7, 32, 32.8, 32.4, 33.1, 34, 33.6, 34.5, 35.2, 34.9, 35.8, 36.4, 36.1, 37.2, 38, 38.65],
  MEDICAPQ: [24.1, 24.8, 24.5, 25.2, 25.8, 25.5, 26.2, 27, 26.7, 27.4, 28.1, 27.8, 28.6, 29.2, 29, 29.6, 30.1, 30.74],
  ANMOL: [10.8, 11.1, 10.9, 11.3, 11.6, 11.5, 11.8, 12.1, 11.9, 12.3, 12.5, 12.4, 12.7, 12.9, 12.8, 13.1, 13.3, 13.63],
}

function FakeChart({ values }: { values: number[] }) {
  const width = 900, height = 300, pad = 24
  const min = Math.min(...values), max = Math.max(...values), range = max - min || 1
  const points = values.map((value, index) => ({
    x: pad + (index / (values.length - 1)) * (width - pad * 2),
    y: height - pad - ((value - min) / range) * (height - pad * 2),
    value,
  }))

  return <div>
    <div className="flex items-center gap-5 px-2 pb-3 text-xs">
      <span className="inline-flex items-center gap-2 text-emerald-400"><span className="h-2.5 w-6 rounded-full bg-emerald-400" /> Rising</span>
      <span className="inline-flex items-center gap-2 text-red-400"><span className="h-0.5 w-6 border-t-2 border-dashed border-red-400" /> Falling</span>
    </div>
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-72" role="img" aria-label="Demo 30-day price history chart">
      {[0, 1, 2, 3].map(row => { const y = pad + row * ((height - pad * 2) / 3); return <line key={row} x1={pad} x2={width - pad} y1={y} y2={y} stroke="currentColor" className="text-white/[.06]" /> })}
      {points.slice(0, -1).map((point, index) => { const next = points[index + 1]; const rising = next.value >= point.value; return <line key={index} x1={point.x} y1={point.y} x2={next.x} y2={next.y} stroke="currentColor" strokeWidth="4" strokeLinecap="round" className={rising ? 'text-emerald-400' : 'text-red-400'} strokeDasharray={rising ? undefined : '8 6'} /> })}
      {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3.5" fill="currentColor" className={index === 0 || point.value >= points[index - 1].value ? 'text-emerald-300' : 'text-red-300'} />)}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="6" fill="currentColor" className="text-cyan-300" />
    </svg>
  </div>
}

function addToWatchlist(symbol: string) {
  const saved = JSON.parse(localStorage.getItem('marketos-watchlist') || '[]')
  if (!saved.includes(symbol)) localStorage.setItem('marketos-watchlist', JSON.stringify([...saved, symbol]))
  window.dispatchEvent(new Event('marketos-watchlist-changed'))
}

function addToPortfolio(symbol: string, price: number) {
  const saved = JSON.parse(localStorage.getItem('marketos-portfolio-additions') || '[]')
  if (!saved.some((x: { symbol: string }) => x.symbol === symbol)) localStorage.setItem('marketos-portfolio-additions', JSON.stringify([...saved, { symbol, price, quantity: 1 }]))
  window.dispatchEvent(new Event('marketos-portfolio-changed'))
}

function createAlert(symbol: string) {
  const saved = JSON.parse(localStorage.getItem('marketos-custom-alerts') || '[]')
  if (!saved.some((x: { symbol: string }) => x.symbol === symbol)) localStorage.setItem('marketos-custom-alerts', JSON.stringify([...saved, { symbol, condition: 'Price alert', type: 'Custom' }]))
  window.dispatchEvent(new Event('marketos-alerts-changed'))
}

export default function Markets() {
  const [selected, setSelected] = useState(quotes[4].symbol)
  const [quantity, setQuantity] = useState(100)
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const selectedQuote = quotes.find(q => q.symbol === selected) ?? quotes[4]
  const values = history[selectedQuote.symbol]
  const low = useMemo(() => Math.min(...values), [values]), high = useMemo(() => Math.max(...values), [values])

  // Educational demo model: order pressure is intentionally capped and is not a real price forecast.
  const simulation = useMemo(() => {
    const trendPct = ((values[values.length - 1] - values[0]) / values[0]) * 100
    const orderValue = quantity * selectedQuote.price
    const pressurePct = Math.min(5, (orderValue / 100000) * 0.5)
    const direction = side === 'buy' ? 1 : -1
    const simulatedMove = direction * pressurePct
    const predictedPrice = selectedQuote.price * (1 + (trendPct / 100 / 30) * 7 + simulatedMove / 100)
    const afterTradeValue = quantity * selectedQuote.price * (1 + simulatedMove / 100)
    return { trendPct, pressurePct, simulatedMove, predictedPrice, afterTradeValue }
  }, [quantity, selectedQuote, side, values])

  return <main className="p-6 md:p-10 max-w-7xl mx-auto">
    <a href="/" className="text-sm text-cyan-400">MarketOS</a>
    <div className="flex flex-col md:flex-row md:items-end justify-between mt-8 gap-4"><div><div className="text-cyan-400 text-sm">MARKETS</div><h1 className="text-4xl font-bold mt-2">Indian Markets</h1><p className="text-slate-500 mt-2">Demo NSE market data</p></div><div className="glass px-4 py-2 rounded-xl text-xs text-amber-300">DEMO MODE</div></div>

    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">{quotes.map(quote => <div key={quote.symbol} className={`glass rounded-2xl p-5 ${selected === quote.symbol ? 'ring-1 ring-cyan-400/60' : ''}`}>
      <button type="button" onClick={() => setSelected(quote.symbol)} className="w-full text-left"><div className="text-sm text-cyan-400">NSE</div><div className="mt-4 text-slate-400">{quote.name}</div><div className="text-sm text-slate-500 mt-1">{quote.symbol}</div><div className="text-2xl font-semibold mt-3">Rs. {quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div className={`mt-2 ${quote.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%</div></button>
      <div className="flex flex-wrap gap-2 mt-4"><button onClick={() => addToWatchlist(quote.symbol)} className="px-3 py-2 rounded-lg bg-white/5 text-xs hover:bg-white/10">☆ Watchlist</button><button onClick={() => addToPortfolio(quote.symbol, quote.price)} className="px-3 py-2 rounded-lg bg-white/5 text-xs hover:bg-white/10">+ Portfolio</button><button onClick={() => createAlert(quote.symbol)} className="px-3 py-2 rounded-lg bg-white/5 text-xs hover:bg-white/10">⚡ Alert</button><a href={`/stock/${quote.symbol}`} className="px-3 py-2 rounded-lg bg-cyan-400/10 text-cyan-300 text-xs">Details →</a></div>
    </div>)}</div>

    <section className="glass rounded-2xl mt-10 p-5 md:p-7"><div className="flex flex-col md:flex-row md:items-start justify-between gap-4"><div><div className="text-cyan-400 text-xs font-medium tracking-wider">PRICE HISTORY</div><h2 className="text-2xl font-semibold mt-2">{selectedQuote.name}</h2><p className="text-slate-500 mt-1">{selectedQuote.symbol} · 30-day history</p></div><div className="text-right"><div className="text-2xl font-semibold">Rs. {selectedQuote.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div className="text-emerald-400 text-sm mt-1">+{selectedQuote.changePercent.toFixed(2)}%</div></div></div><div className="mt-7 rounded-xl bg-black/20 p-3 md:p-5 overflow-hidden"><FakeChart values={values} /></div><div className="grid grid-cols-3 gap-3 mt-5 text-sm"><div className="rounded-xl bg-white/[.03] p-4"><div className="text-slate-500">Period</div><div className="mt-1 font-medium">30 days</div></div><div className="rounded-xl bg-white/[.03] p-4"><div className="text-slate-500">Low</div><div className="mt-1 font-medium">Rs. {low.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div></div><div className="rounded-xl bg-white/[.03] p-4"><div className="text-slate-500">High</div><div className="mt-1 font-medium">Rs. {high.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div></div></div><div className="mt-5 text-xs text-amber-300/80">DEMO HISTORY · Sample data for UI preview only.</div></section>

    <section className="glass rounded-2xl mt-6 p-5 md:p-7">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div><div className="text-cyan-400 text-xs font-medium tracking-wider">TRADE SIMULATOR</div><h2 className="text-2xl font-semibold mt-2">Buy / Sell Impact</h2><p className="text-slate-500 mt-1">See how a hypothetical order could affect the demo price.</p></div>
        <div className="text-xs text-amber-300 rounded-lg bg-amber-400/10 px-3 py-2">DEMO SIMULATION · NOT A REAL FORECAST</div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div><label className="text-xs text-slate-500">Action</label><div className="grid grid-cols-2 gap-2 mt-2"><button type="button" onClick={() => setSide('buy')} className={`rounded-xl px-4 py-3 font-semibold ${side === 'buy' ? 'bg-emerald-400 text-black' : 'bg-white/5'}`}>Buy</button><button type="button" onClick={() => setSide('sell')} className={`rounded-xl px-4 py-3 font-semibold ${side === 'sell' ? 'bg-red-400 text-black' : 'bg-white/5'}`}>Sell</button></div></div>
        <div><label htmlFor="quantity" className="text-xs text-slate-500">Shares</label><input id="quantity" type="number" min="1" step="1" value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value) || 1))} className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-cyan-400" /></div>
        <div className="rounded-xl bg-white/[.03] p-4"><div className="text-xs text-slate-500">Order value</div><div className="text-lg font-semibold mt-2">Rs. {Math.round(quantity * selectedQuote.price).toLocaleString('en-IN')}</div></div>
        <div className="rounded-xl bg-white/[.03] p-4"><div className="text-xs text-slate-500">Simulated price effect</div><div className={`text-lg font-semibold mt-2 ${simulation.simulatedMove >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{simulation.simulatedMove >= 0 ? '+' : ''}{simulation.simulatedMove.toFixed(2)}%</div></div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="rounded-xl bg-white/[.03] p-4"><div className="text-xs text-slate-500">Current price</div><div className="text-xl font-semibold mt-2">Rs. {selectedQuote.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div></div>
        <div className="rounded-xl bg-white/[.03] p-4"><div className="text-xs text-slate-500">After simulated order</div><div className="text-xl font-semibold mt-2">Rs. {(selectedQuote.price * (1 + simulation.simulatedMove / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div></div>
        <div className="rounded-xl bg-cyan-400/10 p-4"><div className="text-xs text-cyan-300">7-day demo estimate</div><div className="text-xl font-semibold mt-2">Rs. {simulation.predictedPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div className="text-xs text-slate-500 mt-1">Trend + simulated order pressure</div></div>
      </div>
      <div className="mt-5 text-xs text-slate-500">The simulator uses the demo history trend plus a small capped hypothetical order-pressure factor. It does not predict the actual market or execute trades.</div>
    </section>

    <h2 className="text-xl font-semibold mt-10">NSE Stocks</h2><div className="glass rounded-2xl mt-4 overflow-hidden"><div className="grid grid-cols-3 px-5 py-4 text-sm text-slate-500 border-b border-white/[.06]"><span>Stock</span><span>Price</span><span>Change</span></div>{quotes.map(quote => <button type="button" onClick={() => setSelected(quote.symbol)} key={quote.symbol} className="w-full grid grid-cols-3 px-5 py-4 text-left border-b border-white/[.04] last:border-0 hover:bg-white/[.03]"><div><div>{quote.name}</div><div className="text-xs text-slate-500 mt-1">{quote.symbol}</div></div><div>Rs. {quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div className={quote.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>{quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%</div></button>)}</div><div className="mt-10 text-xs text-slate-600">Demo market data. Live backend will be connected later.</div>
  </main>
}
