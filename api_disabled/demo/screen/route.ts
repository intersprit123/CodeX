import {NextResponse} from 'next/server'
import {screenDemo} from '@/lib/demo-universe'
export async function GET(req:Request){const p=new URL(req.url).searchParams;const n=(k:string)=>{const v=Number(p.get(k));return Number.isFinite(v)?v:undefined};return NextResponse.json({mode:'demo',results:screenDemo({pe:n('pe'),roe:n('roe'),growth:n('growth'),debt:n('debt')})})}
