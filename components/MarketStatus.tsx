'use client'
import {useEffect,useState} from 'react'
export default function MarketStatus(){const [now,setNow]=useState(new Date()); useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(t)},[]); return <div className="flex items-center gap-3 text-xs text-slate-500"><span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>Demo market</span><span>{now.toLocaleTimeString()}</span></div>}
