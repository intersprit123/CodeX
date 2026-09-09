'use client'
import {useEffect,useMemo,useState} from 'react'

type Point={t:string,o:number,h:number,l:number,c:number,v:number}
type Props={symbol?:string}
const DEMO:Point[]=Array.from({length:120},(_,i)=>{const base=100+i*.42+Math.sin(i/2.4)*4+Math.sin(i/6)*7;const o=base+(i%3-1)*1.8,c=base+Math.sin(i*1.7)*2.4,h=Math.max(o,c)+2.5+(i%4),l=Math.min(o,c)-2-(i%3);return{t:`D-${120-i}`,o,h,l,c,v:800+i*31+(i%5)*120}})

export default function TradingChart({symbol='TCS'}:Props){
  const[range,setRange]=useState('1M'),[type,setType]=useState<'candle'|'line'>('candle'),[indicator,setIndicator]=useState<'MA'|'RSI'|'None'>('MA'),[hover,setHover]=useState<number|null>(null)
  const[allData,setAllData]=useState< Point[]>(DEMO),[live,setLive]=useState(false),[loading,setLoading]=useState(true),[replay,setReplay]=useState(false),[replayIndex,setReplayIndex]=useState<number|null>(null),[saved,setSaved]=useState(false)

  useEffect(()=>{let cancelled=false;setLoading(true);fetch(`/api/market/history?symbol=${encodeURIComponent(symbol)}`).then(r=>r.json()).then(body=>{if(cancelled)return;const rows=(body.values||[]).filter((p:Partial<Point>)=>Number.isFinite(p.c)&&Number.isFinite(p.o)&&Number.isFinite(p.h)&&Number.isFinite(p.l)).map((p:Partial<Point>)=>({t:String(p.t||''),o:Number(p.o),h:Number(p.h),l:Number(p.l),c:Number(p.c),v:Number(p.v||0)}));if(rows.length)setAllData(rows);setLive(Boolean(body.liveData&&rows.length));}).catch(()=>{if(!cancelled){setAllData(DEMO);setLive(false)}}).finally(()=>{if(!cancelled)setLoading(false)});return()=>{cancelled=true}},[symbol])

  useEffect(()=>{const raw=localStorage.getItem('marketos-watchlist');setSaved(raw?JSON.parse(raw).includes(symbol.toUpperCase()):false)},[symbol])
  useEffect(()=>{if(!replay)return;const id=window.setInterval(()=>setReplayIndex(i=>{const next=(i??0)+1;if(next>=data.length-1){setReplay(false);return null}return next}),80);return()=>window.clearInterval(id)})

  const data=useMemo(()=>{const counts:{[key:string]:number}={'1D':1,'1W':5,'1M':22,'3M':66,'1Y':120,'5Y':120,'MAX':120};const n=Math.min(counts[range]||22,allData.length);return allData.slice(-n)},[allData,range])
  const visible=replayIndex===null?data:data.slice(0,replayIndex+1)
  const W=1100,H=500,pad=44,chartH=390,min=Math.min(...visible.map(x=>x.l)),max=Math.max(...visible.map(x=>x.h)),span=Math.max(max-min,0.0001)
  const x=(i:number)=>pad+i*(W-pad*2)/Math.max(visible.length-1,1),y=(v:number)=>pad+(max-v)*(chartH-pad*2)/span
  const ma=visible.map((_,i)=>{const s=visible.slice(Math.max(0,i-7),i+1);return s.reduce((a,p)=>a+p.c,0)/s.length})
  const last=visible[visible.length-1]
  const up=last?last.c>=last.o:true
  const isNseClosed=(()=>{const d=new Date();const day=d.getDay();const mins=d.getHours()*60+d.getMinutes();return day===0||day===6||mins<555||mins>=930})()

  const toggleWatchlist=()=>{const key='marketos-watchlist';const current=JSON.parse(localStorage.getItem(key)||'[]') as string[];const next=saved?current.filter(x=>x!==symbol.toUpperCase()):Array.from(new Set([...current,symbol.toUpperCase()]));localStorage.setItem(key,JSON.stringify(next));setSaved(!saved);window.dispatchEvent(new Event('marketos-watchlist-changed'))}
  const startReplay=()=>{setReplayIndex(0);setReplay(true)}

  return <div className="rounded-2xl border border-white/10 bg-[#080d16] overflow-hidden">
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
      <div className="flex flex-wrap gap-1">{['1D','1W','1M','3M','1Y','5Y','MAX'].map(r=><button key={r} onClick={()=>{setRange(r);setReplay(false);setReplayIndex(null)}} className={`px-3 py-1.5 rounded-lg text-xs ${range===r?'bg-white/10 text-white':'text-slate-500 hover:text-white'}`}>{r}</button>)}</div>
      <div className="flex flex-wrap gap-2">
        <button onClick={toggleWatchlist} className={`px-3 py-1.5 rounded-lg text-xs ${saved?'bg-emerald-400/15 text-emerald-300':'bg-white/5 text-slate-300'}`}>{saved?'✓ In watchlist':'+ Add share'}</button>
        <button onClick={startReplay} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs">▶ Replay</button>
        <button onClick={()=>setType(type==='candle'?'line':'candle')} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs">{type==='candle'?'Candles':'Line'}</button>
        <button onClick={()=>setIndicator(indicator==='MA'?'RSI':indicator==='RSI'?'None':'MA')} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs">{indicator==='None'?'Indicators':indicator}</button>
      </div>
    </div>
    <div className="px-4 pt-3 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${live?'bg-emerald-400':'bg-amber-400'}`}/><span className="text-slate-400">{loading?'Loading history…':live?'LIVE HISTORY':'DEMO HISTORY'}</span>{isNseClosed&&<span className="rounded-full bg-white/5 px-2 py-1 text-slate-500">Market closed · last close</span>}</div>
      {last&&<span className={up?'text-emerald-400':'text-red-400'}>{last.c.toFixed(2)} {up?'▲':'▼'}</span>}
    </div>
    <div className="p-2 overflow-x-auto"><svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[820px] h-[450px]" onMouseLeave={()=>setHover(null)}>
      {[0,1,2,3,4].map(i=><line key={i} x1={pad} x2={W-pad} y1={pad+i*(chartH-pad*2)/4} y2={pad+i*(chartH-pad*2)/4} stroke="rgba(255,255,255,.07)"/>)}
      {type==='line'?<polyline fill="none" stroke="rgb(34 211 238)" strokeWidth="3" points={visible.map((p,i)=>`${x(i)},${y(p.c)}`).join(' ')}/>:visible.map((p,i)=>{const rising=p.c>=p.o;return <g key={`${p.t}-${i}`} onMouseEnter={()=>setHover(i)}><line x1={x(i)} x2={x(i)} y1={y(p.h)} y2={y(p.l)} stroke={rising?'#34d399':'#f87171'} strokeWidth="1.5"/><rect x={x(i)-5} y={Math.min(y(p.o),y(p.c))} width="10" height={Math.max(2,Math.abs(y(p.o)-y(p.c)))} fill={rising?'#34d399':'#f87171'} rx="1"/></g>})}
      {indicator==='MA'&&<polyline fill="none" stroke="rgba(251,191,36,.9)" strokeWidth="2" points={ma.map((v,i)=>`${x(i)},${y(v)}`).join(' ')}/>} 
      {last&&<><line x1={pad} x2={W-pad} y1={y(last.c)} y2={y(last.c)} stroke="rgba(255,255,255,.25)" strokeDasharray="6 5"/><circle cx={x(visible.length-1)} cy={y(last.c)} r="7" fill="none" stroke={up?'#34d399':'#f87171'} opacity=".8"><animate attributeName="r" values="5;11;5" dur="1.6s" repeatCount="indefinite"/></circle><text x={W-pad-5} y={y(last.c)-8} fill="rgba(255,255,255,.7)" fontSize="11" textAnchor="end">CLOSE {last.c.toFixed(2)}</text></>}
      {hover!==null&&visible[hover]&&<><line x1={x(hover)} x2={x(hover)} y1={pad} y2={chartH} stroke="rgba(255,255,255,.35)" strokeDasharray="4 4"/><circle cx={x(hover)} cy={y(visible[hover].c)} r="4" fill="white"/><foreignObject x={Math.min(x(hover)+10,W-190)} y="18" width="175" height="105"><div xmlns="http://www.w3.org/1999/xhtml" style={{background:'#111827',border:'1px solid rgba(255,255,255,.12)',borderRadius:10,padding:10,color:'#e5e7eb',fontSize:12}}>O {visible[hover].o.toFixed(2)} · H {visible[hover].h.toFixed(2)}<br/>L {visible[hover].l.toFixed(2)} · C {visible[hover].c.toFixed(2)}<br/>Volume {visible[hover].v.toLocaleString()}</div></foreignObject></>}
      {visible.map((p,i)=><rect key={`v${p.t}-${i}`} x={x(i)-4} y={chartH+10+(220-p.v/6)} width="8" height={Math.max(2,p.v/6)} fill="rgba(34,211,238,.18)" rx="1"/>)}
    </svg></div>
    <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-xs text-slate-500"><span>{live?'Twelve Data · cached history':'Simulated OHLCV'}</span><span className={isNseClosed?'text-amber-300':'text-emerald-400'}>{isNseClosed?'CLOSED':'MARKET OPEN'}</span></div>
  </div>
}
