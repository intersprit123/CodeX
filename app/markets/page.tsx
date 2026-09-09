'use client'

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

export default function Markets() {
  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto">
<a href="/" className="text-sm text-cyan-400">MarketOS</a>

      <div className="flex flex-col md:flex-row md:items-end justify-between mt-8 gap-4">
        <div>
          <div className="text-cyan-400 text-sm">MARKETS</div>
          <h1 className="text-4xl font-bold mt-2">Indian Markets</h1>
          <p className="text-slate-500 mt-2">Demo NSE market data</p>
        </div>

        <div className="glass px-4 py-2 rounded-xl text-xs text-amber-300">
<div className="glass px-4 py-2 rounded-xl text-xs text-amber-300">DEMO MODE</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
        {quotes.map((quote) => (
          <div className="glass rounded-2xl p-5 hover:bg-white/[.05] transition" key={quote.symbol}>
            <div className="text-sm text-cyan-400">NSE</div>
            <div className="mt-4 text-slate-400">{quote.name}</div>
            <div className="text-sm text-slate-500 mt-1">{quote.symbol}</div>
            <div className="text-2xl font-semibold mt-3">
              Rs. {quote.price.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className={`mt-2 ${quote.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
            </div>
            <div className="h-20 mt-5 rounded-lg bg-white/[.03] relative overflow-hidden">
              <div className="absolute bottom-3 left-3 right-3 h-px bg-cyan-400/30" />
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-10">NSE Stocks</h2>

      <div className="glass rounded-2xl mt-4 overflow-hidden">
        <div className="grid grid-cols-3 px-5 py-4 text-sm text-slate-500 border-b border-white/[.06]">
          <span>Stock</span>
          <span>Price</span>
          <span>Change</span>
        </div>

        {quotes.map((quote) => (
          <div key={quote.symbol} className="grid grid-cols-3 px-5 py-4 border-b border-white/[.04] last:border-0">
            <div>
              <div>{quote.name}</div>
              <div className="text-xs text-slate-500 mt-1">{quote.symbol}</div>
            </div>
            <div>Rs. {quote.price.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</div>
            <div className={quote.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-xs text-slate-600">
        Demo market data. Live backend will be connected later.
      </div>
    </main>
  )
}





