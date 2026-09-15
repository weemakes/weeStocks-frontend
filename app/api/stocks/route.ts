import { NextRequest } from 'next/server';
import { proxyStocks } from '@/lib/stock-proxy';
export async function GET(request:NextRequest){return proxyStocks(request)}
