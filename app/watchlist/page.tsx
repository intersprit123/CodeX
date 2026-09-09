'use client'
import {useEffect,useMemo,useState} from 'react'

type Quote={symbol:string;name:string;price:number;changePercent:number;currency:string}
const defaults=['TCS','RELIANCE','INFY','HDFCBANK']

export default function Watchlist(){
  const[q,setQ]=useState(''),[list,setList]=useState<string[]>(defaults),[quotes,setQuotes]=useState<Quote[]>([]),[loading,setLoading]=useState(true)
  useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('marketos-watchlist')||'null');if(Array.isArray(saved)&&saved.length)setList(saved)}catch{}},[])
  useEffect(()=>{localStorage.setItem('marketos-watchlist',JSON.stringify(list))},[list])
  useEffect(()=>{const refresh=()=>{try{const saved=JSON.parse(localStorage.getItem('marketos-watchlist')||'null');if(Array.isArray(saved))setList(saved)}catch{}};window.addEventListener('marketos-watchlist-changed',refresh);return()=>window.removeEventListener('marketos-watchlist-changed',refresh)},[])
  useEffect(()=>{fetch('/api/market').then(r=>r.json()).then(x=>setQuotes(x.quotes||[])).catch(()=>setQuotes([])).finally(()=>setLoading(false))},[])
  const bySymbol=useMemo(()=>new Map(quotes.map(x=>[x.symbol.replace(':NSE','').toUpperCase(),x])),[quotes])
  const add=()=>{const symbol=q.trim().toUpperCase();if(symbol&&!list.includes(symbol)){setList([...list,symbol]);setQ('')}}
  const remove=(symbol:string)=>setList(list.filter(x=>x!==symbol))

  return <main className="p-6 md:p-10 max-w-6xl mx-auto"><a href="/" className="text-sm text-cyan-400">← MarketOS</a><div className="flex flex-col md:flex-row md:items-end justify-between mt-8 gap-4"><div><div className="text-cyan-400 text-sm">WATCHLIST</div><h1 className="text-4xl font-bold mt-2">Your Watchlist</h1><p className="text-slate-500 mt-2">Add or remove shares and track their latest available prices.</p></div><form onSubmit={e=>{e.preventDefault();add()}} className="flex gap-2"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Add symbol…" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5"/><button className="bg-cyan-400 text-black font-semibold px-4 rounded-xl">Add</button></form></div><div className="glass rounded-2xl mt-8 overflow-hidden"><div className="grid grid-cols-[1.4fr_1fr_1fr_auto] gap-4 p-4 text-xs text-slate-500 border-b border-white/5"><span>ASSET</span><span>PRICE</span><span>CHANGE</span><span/></div>{list.map(symbol=>{const quote=bySymbol.get(symbol);return <div className="grid grid-cols-[1.4fr_1fr_1fr_auto] gap-4 items-center p-5 border-b border-white/5" key={symbol}><div><span className="font-semibold">{quote?.name||symbol}</span><div className="text-xs text-slate-500 mt-1">{quote?.currency||'—'} · {quote?'LIVE':'waiting for quote'}</div></div><span>{quote?`${quote.currency==='INR'?'₹':quote.currency+' '}${quote.price.toFixed(2)}`:'—'}</span><span className={quote&&quote.changePercent<0?'text-red-400':'text-emerald-400'}>{quote?`${quote.changePercent>=0?'+':''}${quote.changePercent.toFixed(2)}%`:'—'}</span><button onClick={()=>remove(symbol)} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400 hover:text-red-300">Remove</button></div>})}{!list.length&&<div className="p-10 text-center text-slate-500">Your watchlist is empty. Add a symbol above.</div>}</div><div className="mt-4 text-xs text-slate-500">{loading?'Loading market data…':quotes.length?'Live market feed connected.':'No live quote available for these symbols yet.'}</div></main>
}
