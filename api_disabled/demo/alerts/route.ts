import {NextResponse} from 'next/server'
export async function POST(req:Request){const body=await req.json().catch(()=>({}));return NextResponse.json({mode:'demo',created:true,alert:{id:`demo-${Date.now()}`,symbol:body.symbol||'NIFTY50',condition:body.condition||'price crosses target',target:body.target??0,status:'armed',note:'Simulation only; no real notifications are sent.'}})}
