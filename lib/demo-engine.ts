import { DEMO_UNIVERSE, type DemoAsset } from './demo-universe'

export type DemoQuote = DemoAsset & { open:number; high:number; low:number; previousClose:number; volume:number }

function seed(n:string){return n.split('').reduce((a,c)=>a+c.charCodeAt(0),17)}
export function quoteFor(symbol:string):DemoQuote{
  const a=DEMO_UNIVERSE.find(x=>x.symbol===symbol.toUpperCase()) ?? DEMO_UNIVERSE[0]
  const s=seed(a.symbol), drift=((s%19)-9)/10, open=a.price*(1-drift/500), close=a.price, high=Math.max(open,close)*(1+0.006), low=Math.min(open,close)*(1-0.006)
  return {...a,open,high,low,previousClose:close/(1+a.change/100),volume:Math.round(1200000+(s%9000000))}
}
export function candlesFor(symbol:string,count=120){
  const q=quoteFor(symbol); let p=q.previousClose; const seed0=seed(symbol); return Array.from({length:count},(_,i)=>{const wave=Math.sin((i+seed0)/5)*1.8+Math.sin((i+seed0)/13)*2.6+(i/count)*4; const o=p; const c=Math.max(.01,o*(1+(wave+(i%7-3)*.35)/100)); const h=Math.max(o,c)*(1+((i%5)+1)/1200); const l=Math.min(o,c)*(1-((i%4)+1)/1400); p=c; return {time:i+1,open:o,high:h,low:l,close:c,volume:Math.round(500000+(i*seed0)%4500000)}})
}
export function portfolio(rows=[['TCS',10],['RELIANCE',8],['INFY',12]] as [string,number][]) { return rows.map(([symbol,quantity])=>{const q=quoteFor(symbol); return {...q,quantity,value:q.price*quantity,dayPnl:q.price*quantity*q.change/100}}) }
