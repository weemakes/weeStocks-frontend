import { Shield, BookOpen, TrendingUp, HelpCircle, Award, Scale } from "lucide-react";
import type { Metal } from "../types";

interface MetalInvestorGuideProps {
  metal: Metal;
  cityName: string;
}

export function MetalInvestorGuide({ metal, cityName }: MetalInvestorGuideProps) {
  const isGold = metal === "gold";

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
    : [
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
      ];

  return (
    <div className="space-y-6">
      {/* 1. Investor Guidance & Market Drivers */}
      <div className="bg-panel/90 border border-line rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold text-ink">
            Smart Investor Guide: {isGold ? "Gold" : metal.toUpperCase()} in {cityName}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card 1: Purity & Hallmarking */}
          <div className="bg-canvas/70 border border-line p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-accent font-bold">
              <Award className="w-4 h-4" />
              <span>BIS Hallmarking (HUID)</span>
            </div>
            <p className="text-muted leading-relaxed">
              Always verify the 6-digit laser-etched HUID code on the BIS CARE app before buying. Standard hallmarks include:
            </p>
            <ul className="space-y-1 text-body">
              <li>• <strong>24K999</strong>: 99.9% Pure Bullion</li>
              <li>• <strong>22K916</strong>: 91.6% Jewellery Grade</li>
              <li>• <strong>18K750</strong>: 75.0% Diamond Studded</li>
            </ul>
          </div>

          {/* Card 2: Market Catalysts */}
          <div className="bg-canvas/70 border border-line p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-warning font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>Key Macro Price Drivers</span>
            </div>
            <p className="text-muted leading-relaxed">
              Domestic metal rates in India are directly influenced by four core financial factors:
            </p>
            <ul className="space-y-1 text-body">
              <li>• <strong>US Federal Reserve Rates</strong> &amp; Dollar Index</li>
              <li>• <strong>USD / INR Exchange Rate</strong> depreciation</li>
              <li>• <strong>Customs Import Duty (6%)</strong> &amp; 3% GST</li>
              <li>• <strong>MCX Futures &amp; Festive Demand</strong></li>
            </ul>
          </div>

          {/* Card 3: Investment Vehicles */}
          <div className="bg-canvas/70 border border-line p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-positive font-bold">
              <Scale className="w-4 h-4" />
              <span>Ways to Invest in Precious Metals</span>
            </div>
            <p className="text-muted leading-relaxed">
              Choose the right vehicle according to your financial timeline:
            </p>
            <ul className="space-y-1 text-body">
              <li>• <strong>Physical Bullion</strong>: 0% making charges on minted bars</li>
              <li>• <strong>Gold / Silver ETFs</strong>: Demat liquidity at spot prices</li>
              <li>• <strong>Sovereign Gold Bonds (SGB)</strong>: 2.5% p.a. + Tax free</li>
              <li>• <strong>Digital Gold</strong>: Fractional accumulation from ₹1</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Frequently Asked Questions (FAQ) */}
      <div className="bg-panel/90 border border-line rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold text-ink">
            Frequently Asked Questions — {metal.toUpperCase()} in {cityName}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-canvas/60 border border-line/80 rounded-xl p-4 transition-colors"
            >
              <h3 className="text-xs font-bold text-ink mb-1.5 flex items-start gap-2">
                <span className="text-accent font-extrabold">Q.</span>
                <span>{faq.q}</span>
              </h3>
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
