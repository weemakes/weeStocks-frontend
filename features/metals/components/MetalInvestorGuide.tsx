import { BookOpen, TrendingUp, HelpCircle, Award, Scale } from "lucide-react";
import type { Metal } from "../types";

interface MetalInvestorGuideProps {
  metal: Metal;
  cityName: string;
}

export function MetalInvestorGuide({ metal, cityName }: MetalInvestorGuideProps) {
  const isGold = metal === "gold";
  const isSilver = metal === "silver";

  const faqs = isGold
    ? [
        {
          q: `What is the difference between 24K, 22K, and 18K gold in ${cityName}?`,
          a: "24 Karat (99.9% pure) is investment-grade gold bullion used for coins and bars. 22 Karat (91.6% pure, also called BIS 916) contains copper and zinc alloys to provide the strength needed for traditional Indian jewellery. 18 Karat (75.0% pure) is commonly used in diamond-studded and daily-wear designer jewellery.",
        },
        {
          q: `Why do gold prices differ between ${cityName} and other Indian cities?`,
          a: `Gold prices across Indian cities differ due to local transportation logistics, jewellers' association daily benchmarks, municipal octroi/entry taxes, and regional demand dynamics. Port cities like Mumbai and Chennai typically have lower transit charges than inland locations.`,
        },
        {
          q: "What taxes and making charges are added when buying gold in India?",
          a: "A nationwide 3% Goods and Services Tax (GST) is levied on the total purchase value (metal cost + making charges). Jewellers charge making fees ranging from 5% to 15% for plain gold, and up to 25% for intricate handcrafted or antique ornaments.",
        },
        {
          q: "What is the mandatory BIS Hallmarking with HUID in India?",
          a: "Under Bureau of Indian Standards (BIS) regulations, every hallmarked gold article must bear three marks: the BIS triangular logo, the purity mark (e.g., 22K916), and a unique 6-digit alphanumeric Hallmark Unique Identification (HUID) code stamped via laser.",
        },
        {
          q: "What is the Islamic Zakat Nisab for Gold and Silver?",
          a: "According to classical Islamic jurisprudence, the Nisab for gold is 85 grams (approx 7.5 tolas) of pure 24K gold. For silver, it is 595 grams (52.5 tolas). If your total qualifying wealth meets or exceeds this threshold and has been held for one full lunar year (hawl), 2.5% is payable as Zakat.",
        },
      ]
    : isSilver
    ? [
        {
          q: `How is silver priced in ${cityName}?`,
          a: "Silver rates are quoted in grams and kilograms based on international spot silver (XAG/USD), MCX commodity futures prices, import duty (6%), and currency fluctuations between the USD and INR.",
        },
        {
          q: "What is the difference between 999 Fine Silver and Sterling Silver (925)?",
          a: "999 Fine Silver (99.9% pure) is used in investment bars and coins. 925 Sterling Silver (92.5% silver + 7.5% copper) is used for tableware, utensils, and luxury jewellery for enhanced durability.",
        },
        {
          q: "What is the Nisab for silver in Zakat calculation?",
          a: "The Nisab threshold for silver is 595 grams (approx 52.5 tolas). Because silver has a lower per-gram cost than gold, classical scholars often recommend using the silver Nisab to ensure maximum benefit for the needy.",
        },
      ]
    : [
        {
          q: `How is platinum priced in ${cityName}?`,
          a: "Platinum rates reflect international platinum markets, the USD/INR exchange rate, import costs, local availability, and the purity of the quoted product.",
        },
        {
          q: "Which platinum purity should I compare?",
          a: "Platinum jewellery and bullion can use different fineness standards. Compare products using the stated fineness and weight, and ask the seller for a purity certificate before purchase.",
        },
        {
          q: "Why can platinum prices move differently from gold?",
          a: "Platinum has significant industrial demand, especially from automotive and manufacturing uses. Supply concentration and industrial cycles can therefore move its price differently from gold.",
        },
      ];

  return (
    <div className="space-y-8">
      {/* 1. Investor Guidance & Market Drivers (3-Column Grid directly on page canvas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Card 1: Purity & Hallmarking */}
        <div className="bg-panel/40 border border-line/70 p-4 rounded-xl space-y-2.5">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold">
            <Award className="w-4 h-4" />
            <span>{isGold ? "Gold Purity & HUID" : isSilver ? "Silver Fineness" : "Platinum Fineness"}</span>
          </div>
          {isGold ? (
            <>
              <p className="text-muted leading-relaxed">
                Verify the stated purity and HUID on hallmarked gold jewellery before buying.
              </p>
              <ul className="space-y-1.5 text-body">
                <li>• <strong className="text-ink">24K999</strong>: 99.9% pure bullion</li>
                <li>• <strong className="text-ink">22K916</strong>: 91.6% jewellery grade</li>
                <li>• <strong className="text-ink">18K750</strong>: 75.0% gold</li>
              </ul>
            </>
          ) : isSilver ? (
            <p className="text-muted leading-relaxed">
              Compare silver products by weight and fineness. Fine silver is commonly marked 999, while sterling silver is commonly marked 925.
            </p>
          ) : (
            <p className="text-muted leading-relaxed">
              Compare platinum products using the seller&apos;s stated fineness and net weight. Request a purity certificate and itemised invoice before purchase.
            </p>
          )}
        </div>

        {/* Card 2: Market Catalysts */}
        <div className="bg-panel/40 border border-line/70 p-4 rounded-xl space-y-2.5">
          <div className="flex items-center gap-2 text-[#B68214] dark:text-[#FCD34D] font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Key Macro Price Drivers</span>
          </div>
          <p className="text-muted leading-relaxed">
            Domestic metal rates in India are directly influenced by four core financial factors:
          </p>
          <ul className="space-y-1.5 text-body">
            <li>• <strong className="text-ink">US Fed Rates</strong> &amp; Dollar Index</li>
            <li>• <strong className="text-ink">USD / INR Exchange Rate</strong> depreciation</li>
            <li>• <strong className="text-ink">Customs Duty (6%)</strong> &amp; 3% GST</li>
            <li>• <strong className="text-ink">MCX Futures &amp; Festive Demand</strong></li>
          </ul>
        </div>

        {/* Card 3: Investment Vehicles */}
        <div className="bg-panel/40 border border-line/70 p-4 rounded-xl space-y-2.5">
          <div className="flex items-center gap-2 text-positive font-bold">
            <Scale className="w-4 h-4" />
            <span>Investment Options</span>
          </div>
          <p className="text-muted leading-relaxed">
            Choose the right vehicle according to your financial timeline:
          </p>
          <ul className="space-y-1.5 text-body">
            <li>• <strong className="text-ink">Physical Bullion</strong>: Dealer premium &amp; storage</li>
            <li>• <strong className="text-ink">Exchange-traded ETFs</strong>: High liquidity &amp; no making</li>
            <li>• <strong className="text-ink">Jewellery</strong>: Purity, making &amp; deductions</li>
            <li>• <strong className="text-ink">Digital Gold</strong>: 24/7 fractional buying</li>
          </ul>
        </div>
      </div>

      {/* 2. Frequently Asked Questions (FAQ) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-[#B68214] dark:text-[#FCD34D]" />
          <h3 className="text-sm font-bold text-ink">
            Frequently Asked Questions — {isGold ? "Gold" : isSilver ? "Silver" : "Platinum"} in {cityName}
          </h3>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-panel/40 border border-line/60 rounded-xl p-4 transition-colors hover:border-line"
            >
              <h4 className="text-xs font-bold text-ink mb-1.5 flex items-start gap-2">
                <span className="text-[#B68214] dark:text-[#FCD34D] font-black">Q.</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-muted leading-relaxed pl-4">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
