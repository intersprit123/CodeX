import {NextResponse} from 'next/server'
import {searchDemo} from '@/lib/demo-universe'
export async function GET(req:Request){const q=new URL(req.url).searchParams.get('q')||'';return NextResponse.json({mode:'demo',results:searchDemo(q)})}
