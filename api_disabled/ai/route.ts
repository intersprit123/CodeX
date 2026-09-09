import {NextResponse} from 'next/server'
import {DEMO_UNIVERSE,searchDemo,screenDemo} from '@/lib/demo-universe'

function contextFor(message:string){
  const found=searchDemo(message)
  const likelyScreen=/pe|p\/e|roe|growth|debt|screen|find|stocks/i.test(message)
  const rows=likelyScreen?screenDemo({pe:30,roe:15,growth:10,debt:2}).slice(0,15):found
  const data=rows.length?rows:DEMO_UNIVERSE.slice(0,8)
  return data.map(a=>`${a.symbol}: ${a.name}; sector=${a.sector}; price=${a.price}; change=${a.change}%; PE=${a.pe}; ROE=${a.roe}%; growth=${a.growth}%; debt=${a.debt}x`).join('\n')
}

export async function POST(request:Request){
  const body=await request.json().catch(()=>({}))
  const message=typeof body.message==='string'?body.message.trim():''
  if(!message)return NextResponse.json({error:'Message is required'},{status:400})

  const key=process.env.GROQ_API_KEY
  if(!key)return NextResponse.json({error:'GROQ_API_KEY is not configured. Add it to .env.local and restart the dev server.'},{status:503})

  const context=contextFor(message)
  const upstream=await fetch('https://api.groq.com/openai/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},
    body:JSON.stringify({
      model:process.env.GROQ_MODEL||'openai/gpt-oss-120b',
      temperature:0.2,
      messages:[
        {role:'system',content:`You are MarketOS AI, a market research copilot. The application is currently DEMO MODE. Use ONLY the supplied simulated market context for current-looking numbers. Never claim it is live. Explain assumptions, compare companies, reason about valuation/risks, and clearly distinguish facts from analysis. Never give personalized financial advice as certainty.\n\nSIMULATED MARKET CONTEXT:\n${context}`},
        {role:'user',content:message}
      ]
    })
  })
  const data=await upstream.json().catch(()=>({}))
  if(!upstream.ok)return NextResponse.json({error:data?.error?.message||'Groq AI request failed'},{status:upstream.status})
  return NextResponse.json({answer:data?.choices?.[0]?.message?.content||'No response returned.',mode:'demo',provider:'groq'})
}
