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
  const width = 900
  const height = 300
  const pad = 24
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const points = values.map((value, index) => {
    const x = pad + (index / (values.length - 1)) * (width - pad * 2)
    const y = height - pad - ((value - min) / range) * (height - pad * 2)
    return { x, y, value }
  })

  return (
    <div>
      <div className="flex items-center gap-5 px-2 pb-3 text-xs">
        <span className="inline-flex items-center gap-2 text-emerald-400">
          <span className="h-2.5 w-6 rounded-full bg-emerald-400" /> Rising
        </span>
        <span className="inline-flex items-center gap-2 text-red-400">
          <span className="h-0.5 w-6 border-t-2 border-dashed border-red-400" /> Falling
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-72" role="img" aria-label="Demo 30-day price history chart">
        <defs>
          <linearGradient id="historyFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((row) => {
          const y = pad + row * ((height - pad * 2) / 3)
          return <line key={row} x1={pad} x2={width - pad} y1={y} y2={y} stroke="currentColor" className="text-white/[.06]" />
        })}

        <polyline
          points={`${pad},${height - pad} ${points.map((point) => `${point.x},${point.y}`).join(' ')} ${width - pad},${height - pad}`}
          fill="url(#historyFill)"
          className="text-cyan-400"
          stroke="none"
        />

        {points.slice(0, -1).map((point, index) => {
          const next = points[index + 1]
          const rising = next.value >= point.value
          return (
            <line
              key={`${index}-${point.value}`}
              x1={point.x}
              y1={point.y}
              x2={next.x}
              y2={next.y}
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className={rising ? 'text-emerald-400' : 'text-red-400'}
              strokeDasharray={rising ? undefined : '8 6'}
            />
          )
        })}

        {points.map((point, index) => {
          const rising = index === 0 || point.value >= points[index - 1].value
          return (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3.5"
              fill="currentColor"
              className={rising ? 'text-emerald-300' : 'text-red-300'}
            />
          )
        })}

        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="6"
          fill="currentColor"
          className="text-cyan-300"
        />
      </svg>
    </div>
  )
}

export default function Markets() {
  const [selected, setSelected] = useState(quotes[4].symbol)
  const selectedQuote = quotes.find((quote) => quote.symbol === selected) ?? quotes[4]
  const values = history[selectedQuote.symbol]
  const low = useMemo(() => Math.min(...values), [values])
  const high = useMemo(() => Math.max(...values), [values])

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto">
      <a href="/" className="text-sm text-cyan-400">MarketOS</a>

      <div className="flex flex-col md:flex-row md:items-end justify-between mt-8 gap-4">
        <div>
          <div className="text-cyan-400 text-sm">MARKETS</div>
          <h1 className="text-4xl font-bold mt-2">Indian Markets</h1>
          <p className="text-slate-500 mt-2">Demo NSE market data</p>
        </div>
        <div className="glass px-4 py-2 rounded-xl text-xs text-amber-300">DEMO MODE</div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
        {quotes.map((quote) => (
          <button
            type="button"
            onClick={() => setSelected(quote.symbol)}
            className={`glass rounded-2xl p-5 text-left hover:bg-white/[.05] transition ${selected === quote.symbol ? 'ring-1 ring-cyan-400/60' : ''}`}
            key={quote.symbol}
          >
            <div className="text-sm text-cyan-400">NSE</div>
            <div className="mt-4 text-slate-400">{quote.name}</div>
            <div className="text-sm text-slate-500 mt-1">{quote.symbol}</div>
            <div className="text-2xl font-semibold mt-3">Rs. {quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className={`mt-2 ${quote.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
            </div>
            <div className="h-20 mt-5 rounded-lg bg-white/[.03] relative overflow-hidden">
              <div className="absolute bottom-3 left-3 right-3 h-px bg-cyan-400/30" />
            </div>
          </button>
        ))}
      </div>

      <section className="glass rounded-2xl mt-10 p-5 md:p-7">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="text-cyan-400 text-xs font-medium tracking-wider">PRICE HISTORY</div>
            <h2 className="text-2xl font-semibold mt-2">{selectedQuote.name}</h2>
            <p className="text-slate-500 mt-1">{selectedQuote.symbol} · 30-day history</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">Rs. {selectedQuote.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-emerald-400 text-sm mt-1">+{selectedQuote.changePercent.toFixed(2)}%</div>
          </div>
        </div>

        <div className="mt-7 rounded-xl bg-black/20 p-3 md:p-5 overflow-hidden">
          <FakeChart values={values} />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5 text-sm">
          <div className="rounded-xl bg-white/[.03] p-4">
            <div className="text-slate-500">Period</div>
            <div className="mt-1 font-medium">30 days</div>
          </div>
          <div className="rounded-xl bg-white/[.03] p-4">
            <div className="text-slate-500">Low</div>
            <div className="mt-1 font-medium">Rs. {low.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          </div>
          <div className="rounded-xl bg-white/[.03] p-4">
            <div className="text-slate-500">High</div>
            <div className="mt-1 font-medium">Rs. {high.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="mt-5 text-xs text-amber-300/80">DEMO HISTORY · Sample data for UI preview only.</div>
      </section>

      <h2 className="text-xl font-semibold mt-10">NSE Stocks</h2>

      <div className="glass rounded-2xl mt-4 overflow-hidden">
        <div className="grid grid-cols-3 px-5 py-4 text-sm text-slate-500 border-b border-white/[.06]">
          <span>Stock</span><span>Price</span><span>Change</span>
        </div>
        {quotes.map((quote) => (
          <button type="button" onClick={() => setSelected(quote.symbol)} key={quote.symbol} className="w-full grid grid-cols-3 px-5 py-4 text-left border-b border-white/[.04] last:border-0 hover:bg-white/[.03]">
            <div><div>{quote.name}</div><div className="text-xs text-slate-500 mt-1">{quote.symbol}</div></div>
            <div>Rs. {quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className={quote.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>{quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%</div>
          </button>
        ))}
      </div>

      <div className="mt-10 text-xs text-slate-600">Demo market data. Live backend will be connected later.</div>
    </main>
  )
}
