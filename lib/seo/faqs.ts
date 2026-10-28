import type { FaqItem } from '@/components/seo/PageFaq';

export const STOCK_FAQS: FaqItem[] = [
  { question: 'Where can I find the complete NSE & BSE Halal stock list for India?', answer: 'WeeStox monitors and screens all active NSE and BSE equities against AAOIFI Standard 21. Use our Stock Screener with the "Compliant" Shariah filter to explore the full list of Shariah-compliant Indian stocks with live prices, debt ratios, and dividend purification rates.' },
  { question: 'How is a stock screened to determine if it is Halal or Haram?', answer: 'A stock is screened in two stages: (1) Core business activity screening to exclude non-permissible sectors like interest-based banking, alcohol, gambling, and conventional insurance; and (2) Financial ratio screening to ensure total debt-to-market cap is below 33%, interest-bearing cash/securities are below 33%, and impure non-operating revenue does not exceed 5%.' },
  { question: 'What is dividend purification and how do I calculate it?', answer: 'Dividend purification is the process of donating the small portion of a company’s earnings derived from non-operating interest or non-permissible sources to charity without religious reward (Sadaqah). WeeStox calculates the exact purification percentage for each dividend-paying halal stock.' },
  { question: 'Can I screen international stocks from Saudi Arabia, UAE, and Japan on WeeStox?', answer: 'Yes. WeeStox provides multi-market screening for Saudi Arabia (Tadawul), UAE (ADX and DFM), Japan (Tokyo Stock Exchange), and India, applying institutional Shariah compliance benchmarks tailored to each market currency.' },
  { question: 'What do P/E ratio, Market Cap, and Debt-to-Equity mean for an investor?', answer: 'P/E (Price-to-Earnings) compares the current share price with EPS to evaluate valuation. Market capitalization represents the total equity value. Debt-to-Equity assesses financial leverage. These fundamental metrics should be analyzed together with sector averages before making investment decisions.' },
];

export const IPO_FAQS: FaqItem[] = [
  { question: 'Is investing in an IPO halal or permissible in Islam?', answer: 'Applying for an IPO is permissible (Halal) if the issuing company’s core business activity is permissible (free from interest banking, gambling, liquor, etc.) and its balance sheet leverage (debt-to-market-cap) complies with AAOIFI Shariah thresholds. WeeStox provides an automated Shariah screening audit for upcoming and active Indian IPOs.' },
  { question: 'What is IPO Grey Market Premium (GMP) and how is it calculated?', answer: 'Grey Market Premium (GMP) is the unofficial price premium at which IPO shares and applications are traded among dealers prior to official stock exchange listing. For example, if an IPO price band is ₹100 and the GMP is ₹25, the indicative listing price is estimated at ₹125 (a 25% expected premium).' },
  { question: 'Does a high IPO GMP guarantee listing day profits?', answer: 'No. While a high GMP indicates strong retail and broker sentiment, grey market rates fluctuate rapidly and do not legally guarantee exchange listing prices or liquidity. Investors must always evaluate company fundamentals, valuation, promoter background, and market conditions.' },
  { question: 'How do I check my IPO allotment status online on Link Intime, KFintech, or Bigshare?', answer: 'Once an IPO basis of allotment is finalized, visit the designated registrar portal (such as Link Intime, KFin Technologies, or Bigshare Services) or check directly on the BSE/NSE IPO allotment portals. You will need your PAN number, Application Number, or Demat DP Client ID to view your allocated shares.' },
  { question: 'What is the difference between Mainboard IPO and SME IPO?', answer: 'Mainboard IPOs are launched by larger established companies on the primary NSE/BSE boards with a minimum application value around ₹14,000–₹15,000. SME (Small and Medium Enterprise) IPOs list on NSE Emerge or BSE SME, typically carry a higher minimum investment lot size (₹1,00,000 to ₹1,40,000), and involve higher risk and lower post-listing liquidity.' },
  { question: 'What do QIB, NII, and Retail IPO subscription numbers mean?', answer: 'Subscription numbers represent demand. QIB (Qualified Institutional Buyers) indicates institutional demand like mutual funds and FIIs. NII / HNI represents high-net-worth bids above ₹2 Lakhs. Retail represents individual bids up to ₹2 Lakhs. A 10x subscription means bids were received for 10 times the shares reserved for that category.' },
];

export const ZAKAT_FAQS: FaqItem[] = [
  { question: 'What is Zakat, and who is obligated to pay it in Islam?', answer: 'Zakat is a mandatory pillar of Islam requiring every adult Muslim who owns wealth above the Nisab threshold continuously for one lunar year (Hawl) to give 2.5% of their eligible net liquid and trade assets to specified beneficiaries (the poor and needy).' },
  { question: 'How do I calculate Zakat on my stock portfolio and equity investments?', answer: 'The calculation depends on your investment intent: (1) Active Trading Shares: If you buy and sell shares for short-term capital gains, calculate 2.5% on the full current market value of your portfolio. (2) Long-Term Investment: If you hold shares for long-term dividends, Zakat applies only to the underlying company’s net zakatable assets (cash + inventory + receivables minus short-term debts), typically estimated at 25% to 30% of market value, or 2.5% on the full value as a conservative measure.' },
  { question: 'What is the Nisab threshold for Gold and Silver in India today?', answer: 'The classical Nisab threshold is 85 grams of pure (24K) Gold or 595 grams of pure Silver. Because silver has a lower monetary threshold, classical scholars recommend using the silver Nisab for cash, bank deposits, and shares to maximize benefit for the poor. You can check today’s exact live bullion rates on our Precious Metals page.' },
  { question: 'Do I have to pay Zakat on 22K and 24K gold jewellery?', answer: 'Yes, according to the majority of contemporary scholars, gold jewellery held as savings, wealth accumulation, or exceeding standard customary personal use is subject to 2.5% Zakat. Convert the weight of 22K gold into pure 24K gold equivalent (Weight × 22 ÷ 24) and apply the current 24K bullion rate per gram to calculate the payable amount.' },
  { question: 'Can I deduct home loans, car loans, or personal debts from Zakat?', answer: 'Only immediate short-term liabilities (debts currently due or living expenses for the current month) can be deducted from your zakatable assets. Long-term loans (like a 20-year mortgage or future car loan installments) are not deducted in their entirety; only the upcoming installment due immediately is deductible.' },
  { question: 'Is dividend purification the same as Zakat?', answer: 'No. Dividend purification removes impermissible interest fractions from company earnings and must be given away to charity without religious reward (Sadaqah). Zakat is an obligatory 2.5% act of worship calculated on your lawful net surplus wealth.' },
];

export const ABOUT_FAQS: FaqItem[] = [
  { question: 'What is WeeStox used for?', answer: 'WeeStox is a specialized financial intelligence platform offering automated AAOIFI Shariah stock screening, live IPO Grey Market Premium (GMP) tracking, subscription updates, city-wise precious metal rates, and verified Zakat calculators.' },
  { question: 'Does WeeStox provide investment advice or stock recommendations?', answer: 'No. WeeStox provides factual research, screening calculations, and public market data. All content is for educational and research purposes only and does not constitute SEBI-registered investment advice or a solicitation to buy or sell securities.' },
  { question: 'How frequently is stock, IPO, and metal data updated on WeeStox?', answer: 'Stock prices and financial ratios update dynamically throughout market trading hours. IPO GMP quotes and subscription figures are updated in real-time via live data streams. Gold, silver, and platinum bullion rates update every morning based on spot market prices across Indian cities.' },
];

export function companyFaqs(name: string, symbol: string, country = 'India', isHalal?: boolean): FaqItem[] {
  return [
    {
      question: `Is ${name} (${symbol}) stock halal or haram to buy?`,
      answer: `${name} (${symbol}) is audited on WeeStox against AAOIFI Shariah Standard 21. ${
        isHalal === true
          ? `${name} is currently classified as Shariah Compliant (Halal), passing both core business activity screening and financial debt/liquidity thresholds.`
          : isHalal === false
          ? `${name} is currently flagged as Non-Compliant due to non-permissible business revenue or debt-to-market-cap exceeding the 33% threshold.`
          : `Check the live Shariah screening audit card above to review ${name}'s core business permissibility, interest debt ratio (≤33%), interest investments (≤33%), and non-halal revenue share (≤5%).`
      }`,
    },
    {
      question: `What is ${name}'s debt-to-market-cap ratio and financial health?`,
      answer: `WeeStox monitors ${name}'s total debt relative to its market capitalization, enterprise value, and interest coverage. A debt-to-market-cap ratio under 33% is required for Islamic compliance and signals a conservative balance sheet protected against rising interest rate cycles.`,
    },
    {
      question: `Does ${name} require dividend purification, and how is it calculated?`,
      answer: `If ${name} generates a small fraction of non-operating income from bank interest or conventional deposits (under 5%), a corresponding percentage of any received dividend must be purified and donated to charity without reward. Check the purification rate in the financial breakdown above.`,
    },
    {
      question: `Where can I check ${name} (${symbol}) latest share price and financial statements?`,
      answer: `This report includes ${name}'s live price chart, historical returns, quarterly and annual balance sheets, P&L statements, cash flows, and promoter shareholding patterns for institutional research.`,
    },
  ];
}

export interface IpoFaqSourceData {
  company_name: string;
  slug: string;
  price_band_lower?: number | null;
  price_band_upper?: number | null;
  lot_size?: number | null;
  min_investment?: number | null;
  listing_date?: string | null;
  gmp_value?: number | null;
  gmp_percentage?: number | null;
  registrar_name?: string | null;
  registrar_website?: string | null;
  is_halal?: boolean | null;
  halal_status?: string | null;
  subscription_times?: number | null;
}

export function ipoCompanyFaqs(data: IpoFaqSourceData): FaqItem[] {
  const name = data.company_name;
  const isHalal = data.is_halal === true || data.halal_status === 'HALAL';
  const gmpVal = data.gmp_value != null ? `₹${data.gmp_value}` : null;
  const gmpPct = data.gmp_percentage != null ? `${Number(data.gmp_percentage).toFixed(1)}%` : null;
  const upperPrice = data.price_band_upper || data.price_band_lower;
  const lotSize = data.lot_size;
  const minInv = data.min_investment || (lotSize && upperPrice ? lotSize * upperPrice : null);

  const faqs: FaqItem[] = [
    {
      question: `Is ${name} IPO halal or Shariah compliant?`,
      answer: `${name} IPO is evaluated under AAOIFI Shariah Standard 21. ${
        isHalal
          ? `${name} passes core business activity screening and financial debt/liquidity thresholds, qualifying as Shariah compliant.`
          : `${name} is currently designated as ${data.halal_status || 'under continuous review'} based on revenue activity or debt leverage thresholds.`
      } Review the detailed Shariah audit breakdown above for debt-to-market-cap ratios and purification notes before applying.`,
    },
    {
      question: `What is ${name} IPO GMP today and expected listing gain?`,
      answer: gmpVal
        ? `The latest Grey Market Premium (GMP) for ${name} IPO is ${gmpVal}${gmpPct ? ` (${gmpPct})` : ''}. ${
            upperPrice
              ? `At the upper price band of ₹${upperPrice}, the estimated listing price is approximately ₹${upperPrice + (data.gmp_value || 0)}.`
              : ''
          } Grey market premiums reflect dealer sentiment and are subject to market volatility prior to exchange listing.`
        : `Live Grey Market Premium (GMP) quotes for ${name} IPO are being tracked in real time. Refer to the daily GMP trend table above for historical updates and premium direction.`,
    },
    {
      question: `How do I check ${name} IPO allotment status online?`,
      answer: `You can check ${name} IPO allotment status online through the official registrar portal${
        data.registrar_name ? ` (${data.registrar_name})` : ''
      }${data.registrar_website ? ` at ${data.registrar_website}` : ''} or on the official BSE and NSE IPO allotment verification pages using your PAN number, IPO Application Number, or Demat DP Client ID.`,
    },
    {
      question: `What is the issue price band, lot size, and minimum investment for ${name} IPO?`,
      answer: `${name} IPO issue price is ${
        data.price_band_lower && data.price_band_upper
          ? `₹${data.price_band_lower} to ₹${data.price_band_upper} per share`
          : upperPrice ? `₹${upperPrice} per share` : 'stated in RHP prospectus'
      }. The retail lot size is ${lotSize ? `${lotSize} shares` : '1 lot'}${
        minInv ? `, requiring a minimum retail application investment of ₹${minInv.toLocaleString('en-IN')}` : ''
      }.`,
    },
  ];

  if (data.subscription_times != null && data.subscription_times > 0) {
    faqs.push({
      question: `What is the total subscription demand for ${name} IPO?`,
      answer: `${name} IPO has received total bids of ${Number(data.subscription_times).toFixed(2)}x across Qualified Institutional Buyers (QIB), Non-Institutional Investors (NII/HNI), and Retail categories. Check the live subscription meter above for real-time category updates.`,
    });
  }

  if (data.listing_date) {
    faqs.push({
      question: `When is ${name} IPO listing date on NSE and BSE?`,
      answer: `The tentative listing date for ${name} IPO on the stock exchange is ${data.listing_date}. Allocated shares are credited to successful applicants' demat accounts prior to market opening.`,
    });
  }

  return faqs;
}

