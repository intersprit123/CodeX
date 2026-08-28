import {NextResponse} from 'next/server'
const news=[
{id:'1',symbol:'NIFTY50',category:'Macro',title:'Markets digest inflation and rate expectations',summary:'Simulated macro headline for demo mode.',sentiment:'positive',minutes:18},
{id:'2',symbol:'TCS',category:'Company',title:'Technology services remain in focus',summary:'Simulated company headline for research workflows.',sentiment:'positive',minutes:42},
{id:'3',symbol:'RELIANCE',category:'Company',title:'Energy and retail themes draw investor attention',summary:'Simulated sector headline for demo mode.',sentiment:'neutral',minutes:67},
{id:'4',symbol:'NVDA',category:'Technology',title:'Semiconductor growth remains a key market theme',summary:'Simulated global technology headline.',sentiment:'positive',minutes:91},
{id:'5',symbol:'GOLD',category:'Commodities',title:'Gold remains a macro risk-watch asset',summary:'Simulated commodities headline.',sentiment:'neutral',minutes:120}
]
export async function GET(req:Request){const q=new URL(req.url).searchParams.get('q')?.toLowerCase()||'';return NextResponse.json({mode:'demo',items:news.filter(n=>`${n.symbol} ${n.category} ${n.title}`.toLowerCase().includes(q))})}
