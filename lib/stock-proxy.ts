import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
export async function proxyStocks(request: NextRequest, path: string[] = []) {
  if (path.length > 2 || path.some(segment => !/^[\p{L}\p{N}._^=-]+$/u.test(segment) || segment === '.' || segment === '..')) return NextResponse.json({message:'Invalid stock path'},{status:400});
  const backend=(process.env.BACKEND_API_URL||'http://localhost:3000').replace(/\/$/,'');
  const query=new URLSearchParams(request.nextUrl.searchParams);
  for (const key of ['page','limit']) {
    const value=query.get(key);
    if(value!==null&&(!/^\d+$/.test(value)||Number(value)<1||Number(value)>(key==='limit'?100:100000))) return NextResponse.json({message:'Invalid pagination'},{status:400});
  }
  const suffix=(path.length?'/'+path.map(encodeURIComponent).join('/'):'')+(query.size?'?'+query.toString():'');
  const options:RequestInit={headers:{Accept:'application/json'},cache:'no-store',signal:AbortSignal.timeout(12000)};
  try {
    let response=await fetch(backend+'/stocks'+suffix,options);
    if(response.status===404)response=await fetch(backend+'/company/stocks'+suffix,options);
    if(!response.ok)return NextResponse.json({message:'Market data is unavailable'},{status:response.status>=500?502:response.status});
    return NextResponse.json(await response.json());
  } catch { return NextResponse.json({message:'Market data is temporarily unavailable'},{status:502}); }
}
