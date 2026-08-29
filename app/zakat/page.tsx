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
    <div className="min-h-screen bg-gray-950 py-12 pb-20">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <Calculator className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-400 font-medium">Islamic Finance Tool</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Zakat Calculator & Investment Guide
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Calculate your Zakat accurately and learn how to manage your wealth according to Islamic principles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Section */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Zakat Calculator</h2>
                  <p className="text-sm text-gray-400">Calculate 2.5% of your qualifying wealth</p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Assets Section */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Assets (Zakatable)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cash in Hand
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={formData.cash}
                          onChange={(e) => handleInputChange('cash', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bank Balance
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={formData.bankBalance}
                          onChange={(e) => handleInputChange('bankBalance', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Gold (Value in ₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={formData.gold}
                          onChange={(e) => handleInputChange('gold', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Silver (Value in ₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={formData.silver}
                          onChange={(e) => handleInputChange('silver', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Halal Stocks & Investments
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={formData.stocks}
                          onChange={(e) => handleInputChange('stocks', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Business Assets
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={formData.businessAssets}
                          onChange={(e) => handleInputChange('businessAssets', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Liabilities Section */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    Liabilities (Deductible)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Outstanding Debts
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={formData.debts}
                          onChange={(e) => handleInputChange('debts', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Loans Payable
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={formData.loans}
                          onChange={(e) => handleInputChange('loans', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={calculateZakat}
                    className="flex-1 btn btn-primary"
                  >
                    <Calculator className="w-5 h-5" />
                    Calculate Zakat
                  </button>
                  <button
                    onClick={resetCalculator}
                    className="btn btn-outline"
                  >
                    Reset
                  </button>
                </div>

                {/* Result */}
                {result !== null && (
                  <div className="bg-gradient-to-br from-blue-950 to-gray-900 border border-blue-500/50 rounded-lg p-6">
                    <div className="text-center">
                      <p className="text-gray-400 mb-2">Your Zakat Amount</p>
                      <div className="text-4xl font-bold text-blue-400 mb-2">
                        ₹{result.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-sm text-gray-400">
                        This is 2.5% of your qualifying wealth
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Investment Guidance */}
            <div className="card mt-8">
              <h2 className="text-2xl font-bold text-white mb-6">Investment Guidance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* What to Invest In */}
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-bold text-white">What to Invest In</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-300 text-sm">Shariah-compliant stocks and equities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-300 text-sm">Halal mutual funds and ETFs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-300 text-sm">Gold and silver (physical assets)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-300 text-sm">Real estate investments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-300 text-sm">Halal business ventures</span>
                    </li>
                  </ul>
                </div>

                {/* What to Avoid */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-6 h-6 text-red-500" />
                    <h3 className="text-lg font-bold text-white">What to Avoid</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span className="text-gray-300 text-sm">Interest-based banking products</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span className="text-gray-300 text-sm">Conventional bonds and fixed deposits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span className="text-gray-300 text-sm">Stocks from alcohol, gambling, tobacco companies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span className="text-gray-300 text-sm">Companies with high interest-bearing debt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span className="text-gray-300 text-sm">Speculative trading and derivatives</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Information */}
          <div className="space-y-6">
            {/* About Zakat */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-white">About Zakat</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Zakat is one of the Five Pillars of Islam. It is a mandatory charitable contribution of 2.5% of qualifying wealth held for one lunar year.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-sm">Purifies your wealth</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-sm">Helps those in need</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-sm">Fulfills religious obligation</span>
                </div>
              </div>
            </div>

            {/* Nisab Threshold */}
            <div className="card bg-gradient-to-br from-blue-950/30 to-gray-900">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-white">Nisab Threshold</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Zakat is only due if your wealth exceeds the Nisab (minimum threshold):
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Gold Nisab</span>
                  <span className="text-white font-semibold">87.48g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Silver Nisab</span>
                  <span className="text-white font-semibold">612.36g</span>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-white">Learn More</h3>
              </div>
              <div className="space-y-3">
                <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  → Understanding Riba (Interest)
                </a>
                <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  → Halal vs Haram Investments
                </a>
                <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  → Islamic Investment Principles
                </a>
                <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  → How to Purify Wealth
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
