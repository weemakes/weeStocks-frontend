import { NextRequest } from 'next/server';
import { proxyStocks } from '@/lib/stock-proxy';
export async function GET(request:NextRequest,context:{params:Promise<{path:string[]}>}){return proxyStocks(request,(await context.params).path)}
