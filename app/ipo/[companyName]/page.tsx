import Link from 'next/link';
import { ArrowLeft, Calendar, TrendingUp, ArrowUp, ArrowDown, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { getIPODetail } from '@/features/ipo/api';
import type { Metadata }  from 'next';

interface IPODetailPageProps {
  params: Promise<{
    companyName: string;
  }>;
}

export async function generateMetadata({ params }: IPODetailPageProps): Promise<Metadata> {
  const { companyName } = await params;
  const decodedName = decodeURIComponent(companyName);
  
  return {
    title: `${decodedName} IPO - GMP, Subscription & Details | WeeStox`,
    description: `Complete ${decodedName} IPO details including Grey Market Premium (GMP), subscription status, timeline, and day-wise history`,
  };
}

function formatDate(dateStr: string) {
  // API already provides date in "dd-MMM" format, return as-is
  return dateStr;
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
  if (gmpTrend === 'up' || (gmpValue && gmpPrevious && gmpValue > gmpPrevious)) {
    return { icon: <ArrowUp className="w-4 h-4" />, color: 'text-green-500', bg: 'bg-green-500/10' };
  }
  if (gmpTrend === 'down' || (gmpValue && gmpPrevious && gmpValue < gmpPrevious)) {
    return { icon: <ArrowDown className="w-4 h-4" />, color: 'text-red-500', bg: 'bg-red-500/10' };
  }
  return { icon: <span>–</span>, color: 'text-gray-400', bg: 'bg-gray-500/10' };
}

export default async function IPODetailPage({ params }: IPODetailPageProps) {
  const { companyName } = await params;
  const decodedName = decodeURIComponent(companyName);

  try {
    const response = await getIPODetail(decodedName);
    
    // Check if response data exists
    if (!response.data || !response.data.company) {
      throw new Error('IPO data not found');
    }
    
    const { company, history, summary } = response.data;
    
    const trendArrow = getTrendArrow(company.gmp_trend, company.gmp_value, company.gmp_previous);

    return (
      <div className="min-h-screen bg-gray-950 py-8 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Back Button */}
          <Link 
            href="/ipo"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to IPO List</span>
          </Link>

          {/* Header Section */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-3">{company.company_name}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusBadge(company.status)}`}>
                    {company.status}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                    company.parsed.is_sme 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {company.parsed.is_sme ? 'SME' : 'Mainboard'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Updated: {formatDate(company.updated_on)}</span>
              </div>
            </div>

            {/* Timeline Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-800">
              <div>
                <div className="text-xs text-gray-400 mb-1">Open Date</div>
                <div className="text-white font-medium">{formatDate(company.open_date)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Close Date</div>
                <div className="text-white font-medium">{formatDate(company.close_date)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Allotment</div>
                <div className="text-white font-medium">{company.boa_dt ? formatDate(company.boa_dt) : '—'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Listing Date</div>
                <div className="text-white font-medium">{formatDate(company.listing_date)}</div>
              </div>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {/* Price Band */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Price Band</div>
              <div className="text-2xl font-bold text-white">₹{summary.price_band}</div>
            </div>

            {/* Live GMP */}
            <div className={`bg-gray-900 border border-gray-800 rounded-lg p-4 ${trendArrow.bg} border-l-4 ${trendArrow.color.replace('text-', 'border-')}`}>
              <div className="text-sm text-gray-400 mb-2">Live GMP</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-white">₹{summary.current_gmp}</div>
                <div className={`flex items-center gap-1 ${trendArrow.color}`}>
                  {trendArrow.icon}
                  <span className="text-sm font-medium">{summary.gmp_percentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Subscription</div>
              <div className="text-2xl font-bold text-white">
                {summary.subscription !== '—' ? summary.subscription : '—'}
              </div>
            </div>

            {/* Issue Size */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Issue Size</div>
              <div className="text-2xl font-bold text-white">{summary.issue_size}</div>
            </div>

            {/* Est. Listing */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Est. Listing</div>
              <div className="text-2xl font-bold text-white">₹{summary.est_listing}</div>
            </div>
          </div>

          {/* GMP Summary Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              GMP Summary & Analysis
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Current GMP</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">₹{summary.current_gmp}</span>
                    <span className={`text-lg ${trendArrow.color}`}>({summary.gmp_percentage.toFixed(2)}%)</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Est. Listing Price</span>
                  <span className="text-2xl font-bold text-white">₹{summary.est_listing}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Est. Gain per Lot</span>
                  <span className={`text-2xl font-bold ${summary.est_profit_per_lot > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {summary.est_profit_per_lot > 0 ? '+' : ''}₹{summary.est_profit_per_lot.toLocaleString('en-IN')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Min Investment</span>
                  <span className="text-xl font-bold text-white">₹{company.parsed.min_investment.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-400 mb-2">Market Trend Analysis</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{summary.trend_text}</p>
                </div>
                
                {(summary.subject_to_sauda_retail || summary.subject_to_sauda_hni) && (
                  <div className="bg-yellow-950/30 border border-yellow-500/30 rounded-lg p-4 mt-4">
                    <h3 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Subject to Sauda
                    </h3>
                    {summary.subject_to_sauda_retail && (
                      <p className="text-gray-300 text-xs mb-1">Retail: {summary.subject_to_sauda_retail}</p>
                    )}
                    {summary.subject_to_sauda_hni && (
                      <p className="text-gray-300 text-xs">HNI: {summary.subject_to_sauda_hni}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* IPO Timeline Visual */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              IPO Timeline
            </h2>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 right-0 top-8 h-0.5 bg-gray-700 hidden md:block"></div>
              
              {/* Timeline Steps */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                {/* Issue Opens */}
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    company.status === 'Open' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">Issue Opens</div>
                  <div className="text-xs text-gray-400">{formatDate(company.open_date)}</div>
                </div>

                {/* Issue Closes */}
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    company.status === 'Closed' || company.status === 'Listed' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">Issue Closes</div>
                  <div className="text-xs text-gray-400">{formatDate(company.close_date)}</div>
                </div>

                {/* Allotment */}
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    company.status === 'Listed' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">Allotment</div>
                  <div className="text-xs text-gray-400">{company.boa_dt ? formatDate(company.boa_dt) : 'TBA'}</div>
                </div>

                {/* Listing */}
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    company.status === 'Listed' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">Listing</div>
                  <div className="text-xs text-gray-400">{formatDate(company.listing_date)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Day-wise GMP History */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Day-wise GMP History</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 sticky top-0">
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase">IPO Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase">GMP</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">Subscription</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase">Est. Listing</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase">Est. Profit/Lot</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {history.map((item, index) => {
                    const historyTrend = getTrendArrow(
                      item.gmp_trend, 
                      item.gmp_value, 
                      index < history.length - 1 ? history[index + 1].gmp_value : null
                    );
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3 text-white text-sm">{formatDate(item.snapshot_date)}</td>
                        <td className="px-4 py-3 text-right text-white font-medium">₹{item.price}</td>
                        <td className="px-4 py-3 text-right">
                          {item.parsed.gmp_value > 0 ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-white font-semibold">₹{item.parsed.gmp_value}</span>
                              <span className={`flex items-center gap-1 text-xs ${historyTrend.color}`}>
                                {historyTrend.icon}
                                {item.parsed.gmp_percentage.toFixed(1)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.parsed.subscription_times && item.parsed.subscription_times > 0 ? (
                            <span className="text-white font-medium">{item.parsed.subscription_times}x</span>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {item.parsed.est_listing ? (
                            <span className="text-white font-medium">₹{item.parsed.est_listing}</span>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {item.parsed.est_profit_per_lot ? (
                            <span className={`font-semibold ${
                              item.parsed.est_profit_per_lot > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {item.parsed.est_profit_per_lot > 0 ? '+' : ''}₹{item.parsed.est_profit_per_lot.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-gray-400">
                          {formatDate(item.updated_on)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Info Sidebar */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white font-medium">{company.parsed.is_sme ? 'SME' : 'Mainboard'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Anchor</span>
                  <span className="text-white font-medium">{company.anchor || 'No'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Lot Size</span>
                  <span className="text-white font-medium">{company.parsed.lot_size} shares</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Min Investment</span>
                  <span className="text-white font-medium">₹{company.parsed.min_investment.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Issue Size</span>
                  <span className="text-white font-medium">{company.ipo_size}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Important Dates</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Open Date</span>
                  <span className="text-white font-medium">{formatDate(company.open_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Close Date</span>
                  <span className="text-white font-medium">{formatDate(company.close_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Allotment Date</span>
                  <span className="text-white font-medium">{company.boa_dt ? formatDate(company.boa_dt) : 'To be announced'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Listing Date</span>
                  <span className="text-white font-medium">{formatDate(company.listing_date)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-950/20 border-2 border-yellow-500/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-2">Important Disclaimer</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Grey Market Premium (GMP) is sourced from unofficial grey market transactions and is indicative only. 
                  It does not guarantee listing gains or reflect the actual listing price. Market conditions, demand-supply dynamics, 
                  and overall sentiment can significantly impact the actual listing performance. Please conduct your own research 
                  and due diligence before making any investment decisions. This information is for educational purposes only 
                  and should not be considered as financial advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching IPO details:', error);
    return (
      <div className="min-h-screen bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Unable to Load IPO Details</h2>
            <p className="text-gray-400 mb-6">The IPO you're looking for could not be found or there was an error loading the data.</p>
            <Link href="/ipo" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to IPO List
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
