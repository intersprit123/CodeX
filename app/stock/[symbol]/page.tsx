import TradingChart from '@/components/TradingChart'
import { twelveQuotes } from '@/lib/twelve-data'
import { MARKET_MODE } from '@/lib/market-mode'

export function generateStaticParams() {
  return [
    { symbol: 'RELIANCE' },
    { symbol: 'TCS' },
    { symbol: 'INFY' },
  ]
}

type StockState = { name:string; price:string; change:string; sector:string; pe:string; roe:string; growth:string }

const demo:Record<string,StockState>={RELIANCE:{name:'Reliance Industries',price:'₹1,418.30',change:'+2.84%',sector:'Energy · Retail',pe:'24.1x',roe:'11.8%',growth:'8.4%'},TCS:{name:'Tata Consultancy Services',price:'₹3,284.40',change:'+1.82%',sector:'IT Services',pe:'28.6x',roe:'49.2%',growth:'10.7%'},INFY:{name:'Infosys',price:'₹1,492.20',change:'+1.72%',sector:'IT Services',pe:'25.4x',roe:'31.1%',growth:'8.9%'}}

const liveMeta:Record<string,{name:string;sector:string}>={RELIANCE:{name:'Reliance Industries',sector:'Energy · Retail'},TCS:{name:'Tata Consultancy Services',sector:'IT Services'},INFY:{name:'Infosys',sector:'IT Services'},HDFCBANK:{name:'HDFC Bank',sector:'Financials'},ICICIBANK:{name:'ICICI Bank',sector:'Financials'},BHARTIARTL:{name:'Bharti Airtel',sector:'Telecom'},LT:{name:'Larsen & Toubro',sector:'Industrials'},ITC:{name:'ITC',sector:'Consumer'}}

export default async function StockPage({params}:{params:Promise<{symbol:string}>}){
  const{symbol}=await params
  const key=symbol.toUpperCase()
  const fallback:StockState=demo[key]||{name:liveMeta[key]?.name||key,price:'—',change:'',sector:liveMeta[key]?.sector||'NSE · Equity',pe:'—',roe:'—',growth:'—'}
  let s:StockState={...fallback}
  let liveQuote=false

  if(MARKET_MODE==='live'&&process.env.TWELVE_DATA_API_KEY){
    try{
      // Fetch the requested NSE stock directly. This avoids showing a demo
      // quote when the global 8-symbol batch has only returned part of its data.
      const rows=await twelveQuotes([`${key}:NSE`])
      const q=rows.find(row=>row.symbol?.toUpperCase()===key||row.symbol?.toUpperCase()===`${key}:NSE`)
      if(q?.close){
        s={...s,name:q.name||s.name,price:`${q.currency==='INR'?'₹':q.currency+' '}${Number(q.close).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`,change:`${Number(q.percent_change||0)>=0?'+':''}${Number(q.percent_change||0).toFixed(2)}%`}
        liveQuote=true
      }else{
        s={...s,price:'—',change:''}
      }
    }catch{
      // Never expose provider/API errors in the stock UI.
      s={...s,price:'—',change:''}
    }
  }

  const pricePositive=!s.change.startsWith('-')
  return <main className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto"><a href="/" className="text-sm text-cyan-400">← MarketOS</a><div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-4"><div><div className="text-sm text-slate-500">NSE · {liveQuote?'LIVE QUOTE':'DEMO QUOTE'} · {s.sector}</div><h1 className="text-4xl font-bold mt-2">{s.name}</h1><div className="text-3xl mt-3 font-semibold">{s.price} <span className={`text-base ${pricePositive?'text-emerald-400':'text-red-400'}`}>{s.change}</span></div></div><div className="flex gap-2"><a href="/watchlist" className="rounded-xl bg-white/5 px-5 py-3 font-semibold">Watchlist</a><a href="/ai" className="rounded-xl bg-cyan-400 text-black px-5 py-3 font-semibold">Analyze with AI</a></div></div><div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">{[['P/E',s.pe],['ROE',s.roe],['Revenue growth',s.growth],['52W range',liveQuote?'Live history':'Demo history'],['Mode',liveQuote?'LIVE':'DEMO']].map(([a,b])=><div className="glass rounded-xl p-5" key={a}><div className="text-xs text-slate-500">{a}</div><div className="text-lg font-semibold mt-2">{b}</div></div>)}</div><div className="mt-6"><TradingChart symbol={key}/></div><div className="grid lg:grid-cols-3 gap-5 mt-6"><div className="glass rounded-2xl p-6 lg:col-span-2"><div className="text-xs text-cyan-400">AI RESEARCH</div><h2 className="text-xl font-semibold mt-2">Complete AI view</h2><p className="text-slate-400 mt-3">Ask MarketOS AI to analyze fundamentals, price action, catalysts, risks, valuation and bull/base/bear scenarios.</p><div className="flex flex-wrap gap-2 mt-5">{['Explain this move','Bull vs bear case','Valuation check','Key risks','Compare with peers'].map(q=><a href={`/ai?prompt=${encodeURIComponent(q+' for '+key)}`} className="px-3 py-2 rounded-lg bg-white/5 text-sm hover:bg-white/10" key={q}>{q}</a>)}</div></div><div className="glass rounded-2xl p-6"><div className="text-xs text-slate-500">SIGNALS</div><div className="mt-4 space-y-4">{[['Trend','Bullish'],['Momentum','Positive'],['Valuation','Neutral'],['Risk','Moderate']].map(([a,b])=><div className="flex justify-between" key={a}><span className="text-slate-400">{a}</span><span>{b}</span></div>)}</div></div></div></main>
}
