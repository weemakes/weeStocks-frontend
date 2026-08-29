'use client';

import { useState } from 'react';
import { TrendingUp, Search, Filter, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

// Mock data for demonstration
const mockStocks = [
  {
    id: 1,
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'Technology',
    price: 3456.50,
    change: 2.3,
    marketCap: '12.5L Cr',
    halalScore: 95,
    compliance: {
      interestRatio: 2.1,
      debt: 15,
      nonHalalRevenue: 0,
    },
  },
  {
    id: 2,
    symbol: 'INFY',
    name: 'Infosys',
    sector: 'Technology',
    price: 1543.20,
    change: 1.8,
    marketCap: '6.4L Cr',
    halalScore: 92,
    compliance: {
      interestRatio: 3.2,
      debt: 18,
      nonHalalRevenue: 0,
    },
  },
  {
    id: 3,
    symbol: 'WIPRO',
    name: 'Wipro',
    sector: 'Technology',
    price: 432.75,
    change: -0.5,
    marketCap: '2.3L Cr',
    halalScore: 90,
    compliance: {
      interestRatio: 4.1,
      debt: 22,
      nonHalalRevenue: 0,
    },
  },
  {
    id: 4,
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical',
    sector: 'Healthcare',
    price: 1234.00,
    change: 3.2,
    marketCap: '2.9L Cr',
    halalScore: 88,
    compliance: {
      interestRatio: 4.5,
      debt: 28,
      nonHalalRevenue: 2,
    },
  },
  {
    id: 5,
    symbol: 'DRREDDY',
    name: 'Dr Reddy\'s Laboratories',
    sector: 'Healthcare',
    price: 5678.90,
    change: 1.5,
    marketCap: '1.9L Cr',
    halalScore: 85,
    compliance: {
      interestRatio: 4.8,
      debt: 30,
      nonHalalRevenue: 3,
    },
  },
  {
    id: 6,
    symbol: 'HCLTECH',
    name: 'HCL Technologies',
    sector: 'Technology',
    price: 1123.45,
    change: 2.1,
    marketCap: '3.0L Cr',
    halalScore: 93,
    compliance: {
      interestRatio: 2.8,
      debt: 20,
      nonHalalRevenue: 0,
    },
  },
];

const sectors = ['All', 'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Consumer Goods'];
const marketCaps = ['All', 'Large Cap', 'Mid Cap', 'Small Cap'];
const purityScores = ['All', '90-100%', '80-89%', '70-79%'];

export default function StocksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedMarketCap, setSelectedMarketCap] = useState('All');
  const [selectedPurityScore, setSelectedPurityScore] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (score >= 80) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
  };

  const getComplianceStatus = (value: number, threshold: number, inverse = false) => {
    const isCompliant = inverse ? value < threshold : value <= threshold;
    return isCompliant ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 pb-20">
      <div className="container mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-blue-400 font-medium">Shariah-Compliant Investment</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Halal Stock Screener
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover Shariah-compliant stocks with comprehensive compliance analysis and real-time data
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company name or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline whitespace-nowrap"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sector</label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Market Cap</label>
                <select
                  value={selectedMarketCap}
                  onChange={(e) => setSelectedMarketCap(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {marketCaps.map(cap => (
                    <option key={cap} value={cap}>{cap}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Halal Score</label>
                <select
                  value={selectedPurityScore}
                  onChange={(e) => setSelectedPurityScore(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {purityScores.map(score => (
                    <option key={score} value={score}>{score}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-500 mb-1">{mockStocks.length}</div>
            <div className="text-sm text-gray-400">Total Stocks</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-500 mb-1">
              {mockStocks.filter(s => s.halalScore >= 90).length}
            </div>
            <div className="text-sm text-gray-400">Highly Compliant</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-500 mb-1">3</div>
            <div className="text-sm text-gray-400">Sectors Covered</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-500 mb-1">24/7</div>
            <div className="text-sm text-gray-400">Live Updates</div>
          </div>
        </div>

        {/* Stock Cards */}
        <div className="space-y-4">
          {mockStocks.map(stock => (
            <div key={stock.id} className="card hover:border-blue-500/50 transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Stock Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
                        <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs">
                          {stock.sector}
                        </span>
                      </div>
                      <p className="text-gray-400">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">
                        ₹{stock.price.toLocaleString('en-IN')}
                      </div>
                      <div className={`text-sm font-medium ${stock.change >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                        {stock.change >= 0 ? '↑' : '↓'} {Math.abs(stock.change)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Market Cap:</span>
                      <span className="text-white ml-2 font-medium">{stock.marketCap}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Halal Compliance */}
                <div className="md:w-80 border-l border-gray-800 pl-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Halal Score</span>
                      <span className={`text-2xl font-bold ${getScoreColor(stock.halalScore).split(' ')[0]}`}>
                        {stock.halalScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${stock.halalScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Interest Ratio:</span>
                      <span className={`font-medium ${getComplianceStatus(stock.compliance.interestRatio, 5)}`}>
                        {stock.compliance.interestRatio}% {stock.compliance.interestRatio < 5 ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Debt Ratio:</span>
                      <span className={`font-medium ${getComplianceStatus(stock.compliance.debt, 33)}`}>
                        {stock.compliance.debt}% {stock.compliance.debt < 33 ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Non-Halal Revenue:</span>
                      <span className={`font-medium ${getComplianceStatus(stock.compliance.nonHalalRevenue, 5)}`}>
                        {stock.compliance.nonHalalRevenue}% {stock.compliance.nonHalalRevenue < 5 ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>

                  <button className="btn btn-primary w-full mt-4 justify-center">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="card mt-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Shariah Compliance Criteria</h3>
              <p className="text-gray-400 mb-4">
                Our screening process ensures all listed stocks meet the following Islamic finance requirements:
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Interest-bearing debt less than 33% of total assets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Interest income less than 5% of total revenue</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Non-permissible income (alcohol, gambling, etc.) less than 5%</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>No involvement in prohibited business activities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
