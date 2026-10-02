import { Shield, Target, Users, Heart, TrendingUp, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas py-12 pb-20 text-body">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 mb-4">
            <Shield className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="text-xs md:text-sm text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-wider">About WeeStox</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
            Your Trusted Partner in Halal Investing
          </h1>
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Empowering conscious investors with institutional-grade tools and Shariah-compliant screening intelligence.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4 text-sky-600 dark:text-sky-400">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">Our Mission</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              To provide a comprehensive financial intelligence platform that helps Muslims and ethical investors make informed, Shariah-compliant investment decisions with confidence and clarity.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4 text-sky-600 dark:text-sky-400">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">Our Vision</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              To become the world&apos;s most trusted platform for Halal investing, where every investor can grow their wealth ethically while contributing to a more just and equitable financial system.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 text-sky-600 dark:text-sky-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Halal Stock Screening</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                  Comprehensive Shariah compliance analysis based on AAOIFI Standard 21 with real-time screening across global markets.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Live Metal Prices</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                  Real-time gold (24K, 22K, 18K), silver, and platinum rates across 50+ Indian cities with smart purity calculators.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">IPO Analysis &amp; GMP</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                  Complete Mainboard &amp; SME IPO intelligence, real-time GMP trends, anchor bidding, and Shariah audit verdicts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Zakat Calculator</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                  Accurate Zakat calculation with Nisab thresholds and purification guidance for conscious wealth stewardship.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">Our Core Values</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Integrity &amp; Rigor
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                  We maintain the highest standards of financial accuracy and ethical transparency in every calculation and audit note.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Community First
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                  We are committed to serving conscious investors with accessible, zero-jargon tools that elevate financial literacy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Ethical Excellence
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                  We believe that wealth creation should be equitable, productive, and aligned with timeless ethical principles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center shadow-xs">
            <div className="text-2xl md:text-4xl font-extrabold text-sky-600 dark:text-sky-400 mb-1 tabular-nums">10,000+</div>
            <div className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400">Stocks Screened</div>
          </div>
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center shadow-xs">
            <div className="text-2xl md:text-4xl font-extrabold text-sky-600 dark:text-sky-400 mb-1 tabular-nums">50,000+</div>
            <div className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400">Conscious Investors</div>
          </div>
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center shadow-xs">
            <div className="text-2xl md:text-4xl font-extrabold text-sky-600 dark:text-sky-400 mb-1 tabular-nums">24/7</div>
            <div className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400">Live Updates</div>
          </div>
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center shadow-xs">
            <div className="text-2xl md:text-4xl font-extrabold text-sky-600 dark:text-sky-400 mb-1 tabular-nums">50+</div>
            <div className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400">Indian Cities</div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-sky-50 to-indigo-50/50 dark:from-sky-950/30 dark:to-slate-900 border border-sky-200 dark:border-sky-500/30 rounded-2xl p-8 md:p-12 text-center shadow-sm dark:shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">Join Our Community</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto text-xs md:text-sm leading-relaxed">
            Start your Halal investment journey today. Get access to comprehensive stock intelligence, live metal rates, and verified IPO research.
          </p>
          <a
            href="/stocks"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all cursor-pointer"
          >
            Explore Halal Stocks &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
