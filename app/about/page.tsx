import { Shield, Target, Users, Heart, TrendingUp, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas py-12 pb-20">
      <div className="container mx-auto max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-accent font-medium">About WeeStox</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            Your Trusted Partner in Halal Investing
          </h1>
          <p className="text-xl text-muted">
            Empowering conscious investors with the tools and knowledge to make Shariah-compliant financial decisions
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="card">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-ink mb-3">Our Mission</h2>
            <p className="text-muted leading-relaxed">
              To provide a comprehensive financial intelligence platform that helps Muslims and ethical investors make informed, Shariah-compliant investment decisions with confidence and clarity.
            </p>
          </div>

          <div className="card">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-ink mb-3">Our Vision</h2>
            <p className="text-muted leading-relaxed">
              To become the world’s most trusted platform for Halal investing, where every investor can grow their wealth ethically while contributing to a more just and equitable financial system.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="card mb-16">
          <h2 className="text-3xl font-bold text-ink mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink mb-2">Halal Stock Screening</h3>
                <p className="text-muted text-sm">
                  Comprehensive Shariah compliance analysis with real-time data on thousands of stocks
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink mb-2">Live Metal Prices</h3>
                <p className="text-muted text-sm">
                  Real-time gold, silver, and platinum rates across cities with historical trends
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink mb-2">IPO Analysis</h3>
                <p className="text-muted text-sm">
                  Complete IPO details, subscription data, and investment recommendations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-positive" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink mb-2">Zakat Calculator</h3>
                <p className="text-muted text-sm">
                  Accurate Zakat calculation and guidance on Islamic financial principles
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="card mb-16">
          <h2 className="text-3xl font-bold text-ink mb-8 text-center">Our Core Values</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-ink mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Integrity
              </h3>
              <p className="text-muted pl-7">
                We maintain the highest standards of accuracy and transparency in all our data and recommendations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Community First
              </h3>
              <p className="text-muted pl-7">
                We’re committed to serving our community and helping every investor make informed decisions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-500" />
                Ethical Excellence
              </h3>
              <p className="text-muted pl-7">
                We believe in wealth creation that aligns with Islamic principles and benefits society.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">10,000+</div>
            <div className="text-muted">Stocks Screened</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">50,000+</div>
            <div className="text-muted">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">24/7</div>
            <div className="text-muted">Live Updates</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">20+</div>
            <div className="text-muted">Countries</div>
          </div>
        </div>

        {/* CTA */}
        <div className="card text-center bg-gradient-to-br from-blue-950 to-panel border-blue-500/50">
          <h2 className="text-3xl font-bold text-ink mb-4">Join Our Community</h2>
          <p className="text-muted mb-6 max-w-2xl mx-auto">
            Start your Halal investment journey today. Get access to comprehensive data, expert analysis, and tools designed for conscious investors.
          </p>
          <button className="btn btn-primary">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}
