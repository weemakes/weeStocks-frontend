'use client';

import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

interface GoldCalculatorProps {
  prices: {
    '24K': number;
    '22K': number;
    '18K': number;
  };
}

export function GoldCalculator({ prices }: GoldCalculatorProps) {
  const [purity, setPurity] = useState<'24K' | '22K' | '18K'>('22K');
  const [weight, setWeight] = useState('10');
  const [makingCharges, setMakingCharges] = useState('12');
  const [gstOption, setGstOption] = useState<'incl' | 'excl'>('incl');
  
  const [baseValue, setBaseValue] = useState(0);
  const [makingChargesAmount, setMakingChargesAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const weightNum = parseFloat(weight) || 0;
    const makingPercent = parseFloat(makingCharges) || 0;
    const pricePerGram = prices[purity];

    // Calculate base value
    const base = pricePerGram * weightNum;
    setBaseValue(base);

    // Calculate making charges
    const making = (base * makingPercent) / 100;
    setMakingChargesAmount(making);

    // Calculate GST (3% on base + making)
    const gst = ((base + making) * 3) / 100;
    setGstAmount(gst);

    // Calculate total
    if (gstOption === 'incl') {
      setTotalAmount(base + making + gst);
    } else {
      setTotalAmount(base + making);
    }
  }, [purity, weight, makingCharges, gstOption, prices]);

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Gold Calculator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Purity */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Purity
          </label>
          <div className="inline-flex rounded-lg border border-gray-700 bg-gray-900 p-1 w-full">
            {(['24K', '22K', '18K'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPurity(p)}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  purity === p
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Weight (gm)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="10"
            min="0"
            step="0.1"
          />
        </div>

        {/* Making Charges */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Making (%)
          </label>
          <input
            type="number"
            value={makingCharges}
            onChange={(e) => setMakingCharges(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="12"
            min="0"
            step="0.1"
          />
        </div>

        {/* GST */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            GST
          </label>
          <select
            value={gstOption}
            onChange={(e) => setGstOption(e.target.value as 'incl' | 'excl')}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="incl">Incl. 3%</option>
            <option value="excl">Excl. 3%</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculation Breakdown */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-white">Base value</span>
                <span className="text-white font-semibold">
                  ₹{baseValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-white">Making charges</span>
                <span className="text-white font-semibold">
                  ₹{makingChargesAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-white">GST (3%)</span>
                <span className="text-white font-semibold">
                  ₹{gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Amount */}
        <div>
          <div className="bg-gradient-to-br from-blue-950/50 to-gray-900 border border-blue-500/30 rounded-lg p-6 h-full flex flex-col justify-center">
            <p className="text-sm text-gray-400 mb-2">Total Amount</p>
            <p className="text-3xl font-bold text-blue-400 mb-1">
              ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-500">Incl. all charges</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-950/20 border border-blue-500/20 rounded-lg p-4">
        <div>
          <p className="text-sm font-semibold text-white mb-2">Know your money's worth!</p>
          <p className="text-xs text-gray-400">
            Enter any amount to see how much gold you can get. This calculator helps you understand the complete cost including making charges and GST.
          </p>
        </div>
      </div>
    </div>
  );
}
