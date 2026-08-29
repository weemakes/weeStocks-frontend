import Link from 'next/link';
import { TrendingUp, DollarSign, Rocket, Calculator, Shield, Clock, Users, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950/20 to-gray-950 py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-400 font-medium">100% Shariah-Compliant Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Guide to <span className="text-blue-500">Halal Investing</span> & Financial Intelligence
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Know where to invest, what to avoid, and how to grow your wealth the right way. One platform for Halal stocks, metals, IPOs & Zakat.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/stocks" className="btn btn-primary text-lg px-8 py-4 justify-center">
                <TrendingUp className="w-5 h-5" />
                Explore Investments
              </Link>
              <Link href="/about" className="btn btn-outline text-lg px-8 py-4 justify-center">
                Learn More
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span>10,000+ Stocks Screened</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span>Real-time Metal Prices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span>Daily IPO Updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Core Offerings</h2>
            <p className="text-gray-400 text-lg">Everything you need to make informed, Shariah-compliant investment decisions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Halal Stocks Card */}
            <Link href="/stocks" className="card group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">Halal Stock Screener</h3>
                    <span className="badge badge-blue">Updated Daily</span>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Identify Shariah-compliant stocks with our intelligent screening tool. Know which companies align with Islamic principles.
                  </p>
                  <div className="flex items-center text-blue-500 font-medium">
                    Explore Stocks <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Metal Rates Card */}
            <Link href="/gold/agra" className="card group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                  <DollarSign className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">Live Metal Prices</h3>
                    <span className="badge badge-success">Live Updates</span>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Real-time Gold, Silver, and Platinum rates. Track prices by purity, city, and international markets.
                  </p>
                  <div className="flex items-center text-blue-500 font-medium">
                    View Metals <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* IPO Card */}
            <Link href="/ipo" className="card group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <Rocket className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">IPO Analysis Hub</h3>
                    <span className="badge badge-blue">New Listings</span>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Complete IPO details, subscription status, GMP, company fundamentals - everything to decide if you should invest.
                  </p>
                  <div className="flex items-center text-blue-500 font-medium">
                    Check IPOs <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Zakat Card */}
            <Link href="/zakat" className="card group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <Calculator className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">Zakat & Investment Guide</h3>
                    <span className="badge badge-success">Ethical Investing</span>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Calculate your Zakat and understand how to manage your money, what to donate, and how to avoid interest.
                  </p>
                  <div className="flex items-center text-blue-500 font-medium">
                    Learn More <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Empowering Every Type of Investor</h2>
            <p className="text-gray-400 text-lg">Trusted by thousands of conscious investors worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Halal Investors</h3>
              <p className="text-gray-400 text-sm">Find Shariah-compliant opportunities with confidence</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">New Investors</h3>
              <p className="text-gray-400 text-sm">Learn where to start and what to avoid</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ethical Investors</h3>
              <p className="text-gray-400 text-sm">Invest with conscience and clarity</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Donors</h3>
              <p className="text-gray-400 text-sm">Calculate and allocate your Zakat correctly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">10,000+</div>
              <div className="text-gray-400">Stocks Screened</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">24/7</div>
              <div className="text-gray-400">Daily Price Updates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">5,000+</div>
              <div className="text-gray-400">IPO Data Points</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">50,000+</div>
              <div className="text-gray-400">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Start your Halal investment journey in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Explore</h3>
              <p className="text-gray-400">Browse our sections - Stocks, Metals, and IPOs</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analyze</h3>
              <p className="text-gray-400">Get comprehensive data and insights on investments</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Invest</h3>
              <p className="text-gray-400">Make informed, Shariah-compliant decisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-950 to-gray-950">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Ahead of the Market</h2>
          <p className="text-gray-400 text-lg mb-8">Get daily updates on Halal stocks, metal rates, and IPOs</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button className="btn btn-primary whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
          
          <p className="text-gray-500 text-sm mt-4">Join 50,000+ investors. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
