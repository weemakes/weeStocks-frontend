'use client';

import { useState } from 'react';
import { Calculator, Info, BookOpen, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function ZakatPage() {
  const [formData, setFormData] = useState({
    cash: '',
    bankBalance: '',
    gold: '',
    silver: '',
    stocks: '',
    businessAssets: '',
    debts: '',
    loans: '',
  });

  const [result, setResult] = useState<number | null>(null);

  const handleInputChange = (field: string, value: string) => {
    if (value !== '' && parseFloat(value) < 0) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateZakat = () => {
    const total = 
      (parseFloat(formData.cash) || 0) +
      (parseFloat(formData.bankBalance) || 0) +
      (parseFloat(formData.gold) || 0) +
      (parseFloat(formData.silver) || 0) +
      (parseFloat(formData.stocks) || 0) +
      (parseFloat(formData.businessAssets) || 0) -
      (parseFloat(formData.debts) || 0) -
      (parseFloat(formData.loans) || 0);

    const zakatAmount = total * 0.025; // 2.5%
    setResult(zakatAmount > 0 ? zakatAmount : 0);
  };

  const resetCalculator = () => {
    setFormData({
      cash: '',
      bankBalance: '',
      gold: '',
      silver: '',
      stocks: '',
      businessAssets: '',
      debts: '',
      loans: '',
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-canvas py-12 pb-20 text-body">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Islamic Finance Tool</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
            Zakat Calculator &amp; Investment Guide
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Calculate your Zakat accurately and learn how to manage your wealth according to Islamic principles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">Zakat Calculator</h2>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Calculate 2.5% of your qualifying wealth held for one lunar year</p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Assets Section */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Assets (Zakatable)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Cash in Hand
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-semibold">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
                          value={formData.cash}
                          onChange={(e) => handleInputChange('cash', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Bank Balance
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-semibold">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
                          value={formData.bankBalance}
                          onChange={(e) => handleInputChange('bankBalance', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Gold (Value in ₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-semibold">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
                          value={formData.gold}
                          onChange={(e) => handleInputChange('gold', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Silver (Value in ₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-semibold">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
                          value={formData.silver}
                          onChange={(e) => handleInputChange('silver', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Halal Stocks &amp; Investments
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-semibold">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
                          value={formData.stocks}
                          onChange={(e) => handleInputChange('stocks', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Business Assets
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-semibold">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
                          value={formData.businessAssets}
                          onChange={(e) => handleInputChange('businessAssets', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Liabilities Section */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-500" />
                    Liabilities (Deductible)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Outstanding Debts
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-semibold">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
                          value={formData.debts}
                          onChange={(e) => handleInputChange('debts', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Loans Payable
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-semibold">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
                          value={formData.loans}
                          onChange={(e) => handleInputChange('loans', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={calculateZakat}
                    className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calculator className="w-5 h-5" />
                    Calculate Zakat
                  </button>
                  <button
                    onClick={resetCalculator}
                    className="py-3 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                {/* Result */}
                {result !== null && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-6 shadow-xs">
                    <div className="text-center">
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">Your Zakat Obligation</p>
                      <div className="text-4xl md:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-2 tabular-nums">
                        ₹{result.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                        This represents exactly 2.5% of your qualifying net wealth
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Investment Guidance */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-xl mt-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Investment Guidance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* What to Invest In */}
                <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">What to Invest In</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓</span>
                      <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm">Shariah-compliant stocks and equities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓</span>
                      <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm">Halal mutual funds and ETFs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓</span>
                      <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm">Gold and silver (physical assets)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓</span>
                      <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm">Real estate investments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓</span>
                      <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm">Halal business ventures</span>
                    </li>
                  </ul>
                </div>

                {/* What to Avoid */}
                <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-500" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">What to Avoid</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 dark:text-rose-500 font-bold mt-0.5">✗</span>
                      <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm">Interest-based banking products</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 dark:text-rose-500 font-bold mt-0.5">✗</span>
                      <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm">Conventional bonds and fixed deposits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 dark:text-rose-500 font-bold mt-0.5">✗</span>
                      <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm">Stocks from alcohol, gambling, tobacco companies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 dark:text-rose-500 font-bold mt-0.5">✗</span>
                      <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm">Companies with high interest-bearing debt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 dark:text-rose-500 font-bold mt-0.5">✗</span>
                      <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm">Speculative trading and derivatives</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Information */}
          <div className="space-y-6">
            {/* About Zakat */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">About Zakat</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm mb-4 leading-relaxed">
                Zakat is one of the Five Pillars of Islam. It is a mandatory charitable contribution of 2.5% of qualifying wealth held for one lunar year.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm">Purifies your wealth</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm">Helps those in need</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm">Fulfills religious obligation</span>
                </div>
              </div>
            </div>

            {/* Nisab Threshold */}
            <div className="bg-gradient-to-br from-sky-50 to-indigo-50/50 dark:from-sky-950/30 dark:to-slate-900 border border-sky-200 dark:border-sky-500/30 rounded-2xl p-6 shadow-sm dark:shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">Nisab Threshold</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm mb-4 leading-relaxed">
                Zakat is only due if your wealth exceeds the Nisab (minimum threshold):
              </p>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-sky-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 text-xs md:text-sm font-medium">Gold Nisab</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold tabular-nums text-sm">87.48g</span>
                </div>
                <div className="flex justify-between items-center bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-sky-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 text-xs md:text-sm font-medium">Silver Nisab</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold tabular-nums text-sm">612.36g</span>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">Learn More</h3>
              </div>
              <div className="space-y-2.5 text-xs md:text-sm">
                <a href="#" className="block text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors">
                  &rarr; Understanding Riba (Interest)
                </a>
                <a href="#" className="block text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors">
                  &rarr; Halal vs Haram Investments
                </a>
                <a href="#" className="block text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors">
                  &rarr; Islamic Investment Principles
                </a>
                <a href="#" className="block text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors">
                  &rarr; How to Purify Wealth
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
