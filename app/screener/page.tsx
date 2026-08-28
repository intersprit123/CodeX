'use client'

import { useMemo, useState } from 'react'

const stocks = [
  {symbol:'RELIANCE', name:'Reliance Industries', sector:'Energy', pe:24.1, roe:11.8, growth:8.4},
  {symbol:'TCS', name:'Tata Consultancy Services', sector:'IT', pe:28.6, roe:49.2, growth:10.7},
  {symbol:'INFY', name:'Infosys', sector:'IT', pe:25.4, roe:31.1, growth:8.9},
  {symbol:'HDFCBANK', name:'HDFC Bank', sector:'Financials', pe:20.3, roe:16.4, growth:12.5},
  {symbol:'ICICIBANK', name:'ICICI Bank', sector:'Financials', pe:18.7, roe:17.9, growth:15.2},
]

export default function Screener(){
 const [minRoe,setMinRoe]=useState(0); const [maxPe,setMaxPe]=useState(100); const [minGrowth,setMinGrowth]=useState(0)
 const results=useMemo(()=>stocks.filter(s=>s.roe>=minRoe&&s.pe<=maxPe&&s.growth>=minGrowth),[minRoe,maxPe,minGrowth])
 return <main className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto"><a href="/" className="text-sm text-cyan-400">← MarketOS</a><h1 className="text-4xl font-bold mt-10">Screener</h1><p className="text-slate-500 mt-2">Build a filter and find companies matching it.</p><div className="grid md:grid-cols-3 gap-4 mt-8">{[['Minimum ROE',minRoe,setMinRoe,100],['Maximum P/E',maxPe,setMaxPe,100],['Minimum growth',minGrowth,setMinGrowth,100]].map(([label,value,setter,max])=><label className="glass rounded-xl p-4" key={String(label)}><div className="text-sm text-slate-400">{label}</div><input type="number" value={value as number} max={max as number} onChange={e=>(setter as any)(Number(e.target.value))} className="mt-3 w-full bg-white/5 rounded-lg px-3 py-2" /></label>)}</div><div className="glass rounded-2xl mt-6 overflow-hidden"><div className="grid grid-cols-5 px-5 py-3 text-xs text-slate-500 border-b border-white/5"><span>Company</span><span>Sector</span><span>P/E</span><span>ROE</span><span>Growth</span></div>{results.map(s=><div className="grid grid-cols-5 px-5 py-4 border-b border-white/5 text-sm" key={s.symbol}><span className="font-medium">{s.name}</span><span className="text-slate-400">{s.sector}</span><span>{s.pe}</span><span>{s.roe}%</span><span className="text-emerald-400">{s.growth}%</span></div>)}{!results.length&&<div className="p-8 text-center text-slate-500">No matches.</div>}</div></main>
}
