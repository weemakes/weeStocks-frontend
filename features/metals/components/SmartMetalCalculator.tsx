"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ShieldCheck, Sparkles, AlertCircle, Percent } from "lucide-react";
import type { Metal } from "../types";
import { formatPrice } from "../utils";

interface SmartMetalCalculatorProps {
  metal: Metal;
  cityName: string;
  prices: {
    "24K"?: number;
    "22K"?: number;
    "18K"?: number;
    perGram?: number;
  };
}

export function SmartMetalCalculator({
  metal,
  cityName,
  prices,
}: SmartMetalCalculatorProps) {
  const isGold = metal === "gold";
  const isSilver = metal === "silver";

  const [purity, setPurity] = useState<"24K" | "22K" | "18K">("22K");
  const [weight, setWeight] = useState<string>(isSilver ? "100" : "10");
  const [makingChargePct, setMakingChargePct] = useState<number>(8); // 8% default for jewellery
  const [includeGst, setIncludeGst] = useState<boolean>(true); // 3% GST in India

  // Determine active rate per gram
  const pricePerGram = useMemo(() => {
    if (isGold) {
      return prices[purity] || 15495;
    }
    return prices.perGram || (isSilver ? 250 : 5513);
  }, [isGold, purity, prices, isSilver]);

  const parsedWeight = parseFloat(weight) || 0;
  const metalValue = parsedWeight * pricePerGram;
  const makingChargeAmount = (metalValue * makingChargePct) / 100;
  const subtotal = metalValue + makingChargeAmount;
  const gstAmount = includeGst ? (subtotal * 3) / 100 : 0;
  const totalPayable = subtotal + gstAmount;

  // Nisab calculations (85g 24K gold, 595g silver)
  const nisabThresholdGrams = isGold ? 85 : isSilver ? 595 : 85;
  const nisabGoldRate = prices["24K"] || 15495;
  const nisabSilverRate = prices.perGram || 250;
  const nisabValueINR = isGold ? 85 * nisabGoldRate : 595 * nisabSilverRate;
  const isEligibleForZakat = metalValue >= nisabValueINR;

  const quickWeights = isGold
    ? [
        { label: "1g", value: 1 },
        { label: "8g (Sovereign)", value: 8 },
        { label: "10g (Tola)", value: 10 },
        { label: "50g", value: 50 },
        { label: "100g (Bar)", value: 100 },
      ]
    : [
        { label: "10g", value: 10 },
        { label: "50g", value: 50 },
        { label: "100g", value: 100 },
        { label: "500g", value: 500 },
        { label: "1kg (1000g)", value: 1000 },
      ];

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">
              {cityName} {metal} Price Calculator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculate exact cost including Making Charges &amp; 3% GST
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          Live Rate: ₹{pricePerGram.toLocaleString("en-IN")}/g
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
        {/* Controls Column */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Purity Selection (For Gold) */}
          {isGold && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Select Gold Purity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["24K", "22K", "18K"] as const).map((p) => {
                  const active = purity === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPurity(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        active
                          ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                          : "bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div>{p}</div>
                      <span
                        className={`text-[10px] font-normal block ${
                          active ? "text-slate-900 font-semibold" : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {p === "24K"
                          ? "99.9% Pure"
                          : p === "22K"
                          ? "91.6% Jewellery"
                          : "75.0% Diamond"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weight Input & Quick Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Weight in Grams
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {parsedWeight > 0 ? `${parsedWeight} grams` : ""}
              </span>
            </div>

            <div className="relative mb-2">
              <input
                type="number"
                inputMode="decimal"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight in grams..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:outline-none focus-visible:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all tabular-nums"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                grams
              </span>
            </div>

            {/* Quick Weight Chips */}
            <div className="flex flex-wrap gap-1.5">
              {quickWeights.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setWeight(chip.value.toString())}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    parsedWeight === chip.value
                      ? "bg-sky-600 dark:bg-sky-500 text-white font-bold"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/60"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Making Charges Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <span>Making Charges</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">({makingChargePct}%)</span>
              </label>
              <span className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                +₹{Math.round(makingChargeAmount).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={makingChargePct}
                onChange={(e) => setMakingChargePct(parseInt(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 w-10 text-right">
                {makingChargePct}%
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              <span>0% (Bullion / Coin)</span>
              <span>8% (Plain Gold)</span>
              <span>15%+ (Designer)</span>
            </div>
          </div>

          {/* GST Toggle */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="gst-toggle"
                checked={includeGst}
                onChange={(e) => setIncludeGst(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-0 cursor-pointer accent-sky-500"
              />
              <label htmlFor="gst-toggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                Include 3% GST <span className="hidden sm:inline text-[10px] text-slate-400 dark:text-slate-500 font-normal">(Standard Bullion Tax)</span>
              </label>
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums shrink-0">
              {includeGst ? `+₹${Math.round(gstAmount).toLocaleString("en-IN")}` : "Exempt"}
            </span>
          </div>
        </div>

        {/* Total & Breakdown Column */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-5 h-full">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Estimated Total Purchase Cost
            </span>

            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight mb-4">
              ₹{Math.round(totalPayable).toLocaleString("en-IN")}
            </div>

            {/* Price Line Breakdown (2-Line Financial Layout) */}
            <div className="space-y-3 text-xs border-t border-slate-200 dark:border-slate-800 pt-3.5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    Base Metal
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block tabular-nums">
                    {parsedWeight}g @ ₹{pricePerGram.toLocaleString("en-IN")}/g
                  </span>
                </div>
                <span className="font-bold tabular-nums text-slate-900 dark:text-slate-100 text-sm shrink-0">
                  ₹{Math.round(metalValue).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    Making Charges
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block tabular-nums">
                    {makingChargePct}% crafting &amp; wastage
                  </span>
                </div>
                <span className="font-bold tabular-nums text-slate-900 dark:text-slate-100 text-sm shrink-0">
                  ₹{Math.round(makingChargeAmount).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    GST (3%)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    {includeGst ? "Standard precious metal tax" : "Exempt from purchase"}
                  </span>
                </div>
                <span className="font-bold tabular-nums text-slate-900 dark:text-slate-100 text-sm shrink-0">
                  {includeGst ? `₹${Math.round(gstAmount).toLocaleString("en-IN")}` : "₹0"}
                </span>
              </div>
            </div>
          </div>

          {/* Shariah Zakat Nisab Check (WeeStox Special Feature) */}
          <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/80 dark:bg-slate-900/70 p-3.5 rounded-xl">
            <div className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Zakat Nisab Benchmark Check</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Standard Nisab is <strong className="text-slate-800 dark:text-slate-200">{nisabThresholdGrams}g</strong> of pure metal (≈ ₹{Math.round(nisabValueINR).toLocaleString("en-IN")}).
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-800/60">
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md inline-block w-fit ${
                  isEligibleForZakat
                    ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700/60"
                }`}
              >
                {isEligibleForZakat ? "Exceeds Nisab Threshold" : "Below Nisab Threshold"}
              </span>
              <Link
                href="/zakat"
                className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-bold inline-flex items-center gap-1 transition-colors"
              >
                Calculate Zakat &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
