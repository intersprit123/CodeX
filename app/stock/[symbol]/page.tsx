import TradingChart from '@/components/TradingChart'
import { twelveQuotes } from '@/lib/twelve-data'
import { MARKET_MODE } from '@/lib/market-mode'

export function generateStaticParams() {
  return [
    { symbol: 'RELIANCE' }, { symbol: 'TCS' }, { symbol: 'INFY' },
    { symbol: 'NOVARTIND' }, { symbol: 'SHIVALIK' }, { symbol: 'GOACARBON' },
    { symbol: 'SREEL' }, { symbol: 'BALPHARMA' }, { symbol: 'CFEL' },
    { symbol: 'MEDICAPQ' }, { symbol: 'ANMOL' },
  ]
}

type StockState = { name:string; price:string; change:string; sector:string; pe:string; roe:string; growth:string; debt:string }

const demo:Record<string,StockState>={
  RELIANCE:{name:'Reliance Industries',price:'₹1,418.30',change:'+2.84%',sector:'Energy · Retail',pe:'24.1x',roe:'11.8%',growth:'8.4%',debt:'0.9x'},
  TCS:{name:'Tata Consultancy Services',price:'₹3,284.40',change:'+1.82%',sector:'IT Services',pe:'28.6x',roe:'49.2%',growth:'10.7%',debt:'0.1x'},
  INFY:{name:'Infosys',price:'₹1,492.20',change:'+1.72%',sector:'IT Services',pe:'25.4x',roe:'31.1%',growth:'8.9%',debt:'0.1x'},
  NOVARTIND:{name:'Novartis India Ltd',price:'₹2,186.40',change:'+20.00%',sector:'Pharmaceuticals',pe:'28.4x',roe:'18.2%',growth:'12.5%',debt:'0.4x'},
  SHIVALIK:{name:'Shivalik Rasayan Ltd',price:'₹384.90',change:'+20.00%',sector:'Pharmaceuticals',pe:'22.8x',roe:'16.4%',growth:'14.2%',debt:'0.7x'},
  GOACARBON:{name:'Goa Carbon Limited',price:'₹463.50',change:'+20.00%',sector:'Chemicals',pe:'18.6x',roe:'12.8%',growth:'9.7%',debt:'1.1x'},
  SREEL:{name:'SREEL',price:'₹345.01',change:'+20.00%',sector:'Industrials',pe:'24.1x',roe:'14.6%',growth:'11.3%',debt:'0.8x'},
  BALPHARMA:{name:'Bal Pharma Limited',price:'₹114.45',change:'+19.99%',sector:'Pharmaceuticals',pe:'31.2x',roe:'10.9%',growth:'8.4%',debt:'1.5x'},
  CFEL:{name:'CFEL',price:'₹38.65',change:'+19.99%',sector:'Industrials',pe:'19.7x',roe:'13.2%',growth:'10.6%',debt:'0.9x'},
  MEDICAPQ:{name:'MEDICAPQ',price:'₹30.74',change:'+19.98%',sector:'Healthcare',pe:'26.5x',roe:'11.8%',growth:'13.1%',debt:'0.6x'},
  ANMOL:{name:'Anmol India Ltd',price:'₹13.63',change:'+19.77%',sector:'Trading',pe:'21.3x',roe:'15.1%',growth:'9.2%',debt:'0.5x'},
}

const liveMeta:Record<string,{name:string;sector:string}>={RELIANCE:{name:'Reliance Industries',sector:'Energy · Retail'},TCS:{name:'Tata Consultancy Services',sector:'IT Services'},INFY:{name:'Infosys',sector:'IT Services'},HDFCBANK:{name:'HDFC Bank',sector:'Financials'},ICICIBANK:{name:'ICICI Bank',sector:'Financials'},BHARTIARTL:{name:'Bharti Airtel',sector:'Telecom'},LT:{name:'Larsen & Toubro',sector:'Industrials'},ITC:{name:'ITC',sector:'Consumer'}}

export default async function StockPage({params}:{params:Promise<{symbol:string}>}){
  const{symbol}=await params
  const key=symbol.toUpperCase()
  const fallback:StockState=demo[key]||{name:liveMeta[key]?.name||key,price:'—',change:'',sector:liveMeta[key]?.sector||'NSE · Equity',pe:'—',roe:'—',growth:'—',debt:'—'}
  let s:StockState={...fallback}
  let liveQuote=false

  if(MARKET_MODE==='live'&&process.env.TWELVE_DATA_API_KEY){
    try{
      const rows=await twelveQuotes([`${key}:NSE`])
      const q=rows.find(row=>row.symbol?.toUpperCase()===key||row.symbol?.toUpperCase()===`${key}:NSE`)
      if(q?.close){
        s={...s,name:q.name||s.name,price:`${q.currency==='INR'?'₹':q.currency+' '}${Number(q.close).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`,change:`${Number(q.percent_change||0)>=0?'+':''}${Number(q.percent_change||0).toFixed(2)}%`}
        liveQuote=true
      }
    }catch{
      // Keep demo quote if live provider lookup fails.
    }
  }

  const pricePositive=!s.change.startsWith('-')
  return <main className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto"><a href="/" className="text-sm text-cyan-400">← MarketOS</a><div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-4"><div><div className="text-sm text-slate-500">NSE · {liveQuote?'LIVE QUOTE':'DEMO QUOTE'} · {s.sector}</div><h1 className="text-4xl font-bold mt-2">{s.name}</h1><div className="text-3xl mt-3 font-semibold">{s.price} <span className={`text-base ${pricePositive?'text-emerald-400':'text-red-400'}`}>{s.change}</span></div></div><div className="flex gap-2"><a href="/watchlist" className="rounded-xl bg-white/5 px-5 py-3 font-semibold">Watchlist</a><a href="/ai" className="rounded-xl bg-cyan-400 text-black px-5 py-3 font-semibold">Analyze with AI</a></div></div><div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">{[['P/E',s.pe],['ROE',s.roe],['Revenue growth',s.growth],['Debt',s.debt],['52W range',liveQuote?'Live history':'Demo history']].map(([a,b])=><div className="glass rounded-xl p-5" key={a}><div className="text-xs text-slate-500">{a}</div><div className="text-lg font-semibold mt-2">{b}</div></div>)}</div><div className="mt-6"><TradingChart symbol={key}/></div><div className="grid lg:grid-cols-3 gap-5 mt-6"><div className="glass rounded-2xl p-6 lg:col-span-2"><div className="text-xs text-cyan-400">AI RESEARCH</div><h2 className="text-xl font-semibold mt-2">Complete AI view</h2><p className="text-slate-400 mt-3">Ask MarketOS AI to analyze fundamentals, price action, catalysts, risks, valuation and bull/base/bear scenarios.</p><div className="flex flex-wrap gap-2 mt-5">{['Explain this move','Bull vs bear case','Valuation check','Key risks','Compare with peers'].map(q=><a href={`/ai?prompt=${encodeURIComponent(q+' for '+key)}`} className="px-3 py-2 rounded-lg bg-white/5 text-sm hover:bg-white/10" key={q}>{q}</a>)}</div></div><div className="glass rounded-2xl p-6"><div className="text-xs text-slate-500">SIGNALS</div><div className="mt-4 space-y-4">{[['Trend','Bullish'],['Momentum','Positive'],['Valuation','Neutral'],['Risk','Moderate']].map(([a,b])=><div className="flex justify-between" key={a}><span className="text-slate-400">{a}</span><span>{b}</span></div>)}</div></div></div></main>
}
