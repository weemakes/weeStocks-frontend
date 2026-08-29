import Link from 'next/link';
import { Rocket, TrendingUp, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { getIPOList, getIPOSummary } from '@/features/ipo/api';
import IPOFilters from './components/IPOFilters';

export const metadata = {
  title: 'IPO GMP & Subscription Status | WeeStox',
  description: 'Complete IPO details with Grey Market Premium (GMP), live subscription status, and detailed analysis',
};

interface IPOPageProps {
  searchParams: Promise<{
    status?: string;
    type?: string;
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

function getStatusBadge(status: string) {
  const styles = {
    Upcoming: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    Open: 'bg-green-500/20 text-green-400 border border-green-500/30',
    Closed: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    Listed: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  };
  return styles[status as keyof typeof styles] || styles.Upcoming;
}

function getTrendArrow(gmpTrend: string | null, gmpValue: number | null, gmpPrevious: number | null) {
  // First check explicit trend
  if (gmpTrend === 'up') {
    return { icon: <ArrowUp className="w-3 h-3" />, color: 'text-green-500' };
  }
  if (gmpTrend === 'down') {
    return { icon: <ArrowDown className="w-3 h-3" />, color: 'text-red-500' };
  }
  
  // Fall back to comparing values
  if (gmpValue && gmpPrevious) {
    if (gmpValue > gmpPrevious) {
      return { icon: <ArrowUp className="w-3 h-3" />, color: 'text-green-500' };
    }
    if (gmpValue < gmpPrevious) {
      return { icon: <ArrowDown className="w-3 h-3" />, color: 'text-red-500' };
    }
  }
  
  return { icon: <span className="w-3 h-3">–</span>, color: 'text-gray-400' };
}

function formatDate(dateStr: string) {
  // API already provides date in "dd-MMM" format, return as-is
  return dateStr;
}

export default async function IPOPage({ searchParams }: IPOPageProps) {
  const params = await searchParams;
  
  try {
    const ipoListData = await getIPOList({
      status: params.status as any || 'all',
      type: params.type as any,
      category: params.category as any,
      search: params.search,
      sort: params.sort as any,
      page: params.page ? parseInt(params.page) : 1,
      limit: 20,
    });

    const { ipos, summary, total, page, totalPages, snapshot_date } = ipoListData.data;

    return (
      <div className="min-h-screen bg-gray-950 py-8 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Rocket className="w-8 h-8 text-blue-500" />
                <h1 className="text-3xl font-bold text-white">
                  IPO Grey Market Premium (GMP)
                </h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Last Updated: {formatDate(snapshot_date)}</span>
              </div>
            </div>
            <p className="text-gray-400">
              Live IPO subscription status, GMP data, and detailed analysis
            </p>
          </div>

          {/* Clickable Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <Link 
              href="/ipo"
              className={`bg-gray-900 border rounded-lg p-3 text-center transition-all hover:border-blue-500 hover:shadow-lg ${
                !params.status || params.status === 'all' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-800'
              }`}
            >
              <div className="text-2xl font-bold text-white">{summary.total}</div>
              <div className="text-xs text-gray-400">Total</div>
            </Link>
            
            <Link 
              href="/ipo?status=open"
              className={`bg-gray-900 border rounded-lg p-3 text-center transition-all hover:border-green-500 hover:shadow-lg ${
                params.status === 'open' ? 'border-green-500 ring-2 ring-green-500/20' : 'border-gray-800'
              }`}
            >
              <div className="text-2xl font-bold text-green-400">{summary.open}</div>
              <div className="text-xs text-gray-400">Open</div>
            </Link>
            
            <Link 
              href="/ipo?status=upcoming"
              className={`bg-gray-900 border rounded-lg p-3 text-center transition-all hover:border-blue-500 hover:shadow-lg ${
                params.status === 'upcoming' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-800'
              }`}
            >
              <div className="text-2xl font-bold text-blue-400">{summary.upcoming}</div>
              <div className="text-xs text-gray-400">Upcoming</div>
            </Link>
            
            <Link 
              href="/ipo?status=closed"
              className={`bg-gray-900 border rounded-lg p-3 text-center transition-all hover:border-orange-500 hover:shadow-lg ${
                params.status === 'closed' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-gray-800'
              }`}
            >
              <div className="text-2xl font-bold text-orange-400">{summary.closed}</div>
              <div className="text-xs text-gray-400">Closed</div>
            </Link>
            
            <Link 
              href="/ipo?status=listed"
              className={`bg-gray-900 border rounded-lg p-3 text-center transition-all hover:border-gray-500 hover:shadow-lg ${
                params.status === 'listed' ? 'border-gray-500 ring-2 ring-gray-500/20' : 'border-gray-800'
              }`}
            >
              <div className="text-2xl font-bold text-gray-400">{summary.listed}</div>
              <div className="text-xs text-gray-400">Listed</div>
            </Link>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
              <div className="text-sm text-gray-400 mb-1">MB/SME</div>
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="text-blue-400 font-semibold">{summary.mainboard}</span>
                <span className="text-gray-600">/</span>
                <span className="text-purple-400 font-semibold">{summary.sme}</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <IPOFilters currentParams={params} />

          {/* IPO Table */}
          {ipos.length > 0 ? (
            <>
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden mb-6">
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-gray-800/90 backdrop-blur-sm z-10">
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Open / Close
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          IPO Size
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Issue Price
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Min. Investment
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          GMP
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Est. Profit
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Est. Listing
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Subscription
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Lot Size
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Listing Date
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Anchor
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {ipos.map(ipo => {
                        const trendArrow = getTrendArrow(ipo.gmp_trend, ipo.gmp_value, ipo.gmp_previous);
                        const isHighGMP = ipo.parsed.gmp_percentage >= 50;
                        
                        return (
                          <tr key={ipo.id} className={`hover:bg-gray-800/30 transition-colors ${isHighGMP ? 'bg-green-950/10' : ''}`}>
                            {/* Company Name + Status Badge */}
                            <td className="px-4 py-3">
                              <Link 
                                href={`/ipo/${encodeURIComponent(ipo.company_name)}`}
                                className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center gap-2"
                              >
                                {ipo.company_name}
                                {isHighGMP && (
                                  <span className="inline-block px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded uppercase">
                                    Hot
                                  </span>
                                )}
                              </Link>
                              <div className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(ipo.status)}`}>
                                {ipo.status}
                              </div>
                            </td>

                            {/* Type */}
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                ipo.parsed.is_sme 
                                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}>
                                {ipo.parsed.is_sme ? 'SME' : 'Mainboard'}
                              </span>
                            </td>

                            {/* Open / Close Dates */}
                            <td className="px-4 py-3 text-center text-sm text-white whitespace-nowrap">
                              {formatDate(ipo.open_date)} → {formatDate(ipo.close_date)}
                            </td>

                            {/* IPO Size */}
                            <td className="px-4 py-3 text-right text-white font-medium text-sm whitespace-nowrap">
                              {ipo.ipo_size}
                            </td>

                            {/* Issue Price */}
                            <td className="px-4 py-3 text-right text-white font-medium text-sm whitespace-nowrap">
                              ₹{ipo.price}
                            </td>

                            {/* Min Investment */}
                            <td className="px-4 py-3 text-right text-white text-sm whitespace-nowrap">
                              ₹{ipo.parsed.min_investment.toLocaleString('en-IN')}
                            </td>

                            {/* GMP */}
                            <td className="px-4 py-3 text-right">
                              {ipo.parsed.gmp_value > 0 ? (
                                <div>
                                  <div className="text-white font-semibold text-sm">
                                    ₹{ipo.parsed.gmp_value}
                                  </div>
                                  <div className={`flex items-center justify-end gap-0.5 text-xs font-medium ${trendArrow.color}`}>
                                    {trendArrow.icon}
                                    {ipo.parsed.gmp_percentage.toFixed(1)}%
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-sm">—</span>
                              )}
                            </td>

                            {/* Est. Profit */}
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              {ipo.parsed.est_profit_per_lot ? (
                                <span className={`font-semibold text-sm ${
                                  ipo.parsed.est_profit_per_lot > 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {ipo.parsed.est_profit_per_lot > 0 ? '+' : ''}₹{ipo.parsed.est_profit_per_lot.toLocaleString('en-IN')}
                                </span>
                              ) : (
                                <span className="text-gray-500 text-sm">—</span>
                              )}
                            </td>

                            {/* Est. Listing */}
                            <td className="px-4 py-3 text-right text-white font-medium text-sm whitespace-nowrap">
                              {ipo.parsed.est_listing ? `₹${ipo.parsed.est_listing}` : '—'}
                            </td>

                            {/* Subscription */}
                            <td className="px-4 py-3 text-center whitespace-nowrap">
                              {ipo.parsed.subscription_times !== null && ipo.parsed.subscription_times > 0 ? (
                                <span className={`font-semibold text-sm ${
                                  ipo.parsed.subscription_times >= 1 ? 'text-green-400' : 'text-yellow-400'
                                }`}>
                                  {ipo.parsed.subscription_times}x
                                </span>
                              ) : (
                                <span className="text-gray-500 text-sm">—</span>
                              )}
                            </td>

                            {/* Lot Size */}
                            <td className="px-4 py-3 text-center text-white text-sm whitespace-nowrap">
                              {ipo.parsed.lot_size.toLocaleString('en-IN')} shares
                            </td>

                            {/* Listing Date */}
                            <td className="px-4 py-3 text-center text-white text-xs whitespace-nowrap">
                              {formatDate(ipo.listing_date)}
                            </td>

                            {/* Anchor */}
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs font-medium ${
                                ipo.anchor === 'Yes' ? 'text-green-400' : 'text-gray-500'
                              }`}>
                                {ipo.anchor || '—'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden divide-y divide-gray-800">
                  {ipos.map(ipo => {
                    const trendArrow = getTrendArrow(ipo.gmp_trend, ipo.gmp_value, ipo.gmp_previous);
                    const isHighGMP = ipo.parsed.gmp_percentage >= 50;
                    
                    return (
                      <div key={ipo.id} className={`p-4 ${isHighGMP ? 'bg-green-950/10' : ''}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <Link 
                              href={`/ipo/${encodeURIComponent(ipo.company_name)}`}
                              className="text-blue-400 hover:text-blue-300 font-semibold text-base block mb-1"
                            >
                              {ipo.company_name}
                              {isHighGMP && (
                                <span className="ml-2 inline-block px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded uppercase">
                                  Hot
                                </span>
                              )}
                            </Link>
                            <div className="flex items-center gap-2">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                ipo.parsed.is_sme 
                                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}>
                                {ipo.parsed.is_sme ? 'SME' : 'Mainboard'}
                              </span>
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(ipo.status)}`}>
                                {ipo.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-gray-400 text-xs mb-1">Price</div>
                            <div className="text-white font-semibold">₹{ipo.price}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-xs mb-1">GMP</div>
                            {ipo.parsed.gmp_value > 0 ? (
                              <div className="flex items-center gap-1">
                                <span className="text-white font-semibold">₹{ipo.parsed.gmp_value}</span>
                                <span className={`flex items-center gap-0.5 text-xs ${trendArrow.color}`}>
                                  {trendArrow.icon}
                                  {ipo.parsed.gmp_percentage.toFixed(1)}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </div>
                          <div>
                            <div className="text-gray-400 text-xs mb-1">Subscription</div>
                            {ipo.parsed.subscription_times !== null && ipo.parsed.subscription_times > 0 ? (
                              <span className={`font-semibold ${
                                ipo.parsed.subscription_times >= 1 
                                  ? 'text-green-400' 
                                  : 'text-yellow-400'
                              }`}>
                                {ipo.parsed.subscription_times}x
                              </span>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </div>
                          <div>
                            <div className="text-gray-400 text-xs mb-1">Est. Profit</div>
                            {ipo.parsed.est_profit_per_lot ? (
                              <div className={`font-semibold ${
                                ipo.parsed.est_profit_per_lot > 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {ipo.parsed.est_profit_per_lot > 0 ? '+' : ''}
                                ₹{ipo.parsed.est_profit_per_lot.toLocaleString('en-IN')}
                              </div>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-gray-400">Open: </span>
                            <span className="text-white">{formatDate(ipo.open_date)}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Close: </span>
                            <span className="text-white">{formatDate(ipo.close_date)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                    // Show first 3, last 3, and pages around current
                    const pageNum = i + 1;
                    if (
                      pageNum <= 3 ||
                      pageNum > totalPages - 3 ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <Link
                          key={pageNum}
                          href={`/ipo?page=${pageNum}${params.status ? `&status=${params.status}` : ''}${params.type ? `&type=${params.type}` : ''}`}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                            pageNum === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    } else if (pageNum === 4 || pageNum === totalPages - 3) {
                      return <span key={pageNum} className="px-2 text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No IPOs found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching IPO data:', error);
    return (
      <div className="min-h-screen bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
            <Rocket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Unable to Load IPO Data</h2>
            <p className="text-gray-400 mb-6">Please make sure the backend server is running on port 3000</p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
