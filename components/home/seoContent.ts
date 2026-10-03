export interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

export const HOME_FAQS: FAQItem[] = [
  {
    category: 'Shariah Stock Screening',
    question: 'How does WeeStox screen Indian stocks for Shariah compliance?',
    answer:
      'WeeStox evaluates NSE and BSE equities against internationally recognized AAOIFI Standard No. 21 criteria. This involves a rigorous two-tier audit: (1) Core business activity screening to eliminate conventional banking, alcohol, gambling, adult entertainment, and tobacco; and (2) Financial ratio screening ensuring debt-to-market-cap is ≤33%, interest-earning deposits are ≤33%, and impermissible revenue is under 5%.',
  },
  {
    category: 'Shariah Stock Screening',
    question: 'Which Indian stocks are currently Shariah compliant on NSE and BSE?',
    answer:
      'Top Indian companies that frequently meet AAOIFI Shariah screening criteria include Tata Consultancy Services (TCS), Infosys (INFY), HCL Technologies, Tata Motors, Sun Pharma, Cipla, and UltraTech Cement. You can explore real-time compliance status, debt ratios, and purification percentages for over 1,500+ listed equities on our Halal Stock Screener.',
  },
  {
    category: 'Shariah Stock Screening',
    question: 'How is dividend purification calculated for Halal stocks?',
    answer:
      'When a Shariah-compliant company earns minor interest income on cash deposits (under the 5% threshold), investors must purify their dividends. WeeStox automatically calculates the exact purification percentage: (Non-Permissible Income / Total Revenue) × Dividend Received. This amount must be donated to charitable causes without expecting spiritual reward.',
  },
  {
    category: 'Shariah Stock Screening',
    question: 'Is Intraday, Futures & Options (F&O) trading permissible in Islamic finance?',
    answer:
      'Conventional Islamic jurisprudence (including AAOIFI and Fiqh academies) prohibits derivative trading (Futures & Options) and short selling due to Gharar (excessive uncertainty), Maisir (gambling elements), and selling assets not owned. WeeStox focuses exclusively on cash-delivery equity investing where the investor takes genuine ownership of shares.',
  },
  {
    category: 'IPO & GMP Intelligence',
    question: 'What is Grey Market Premium (GMP) and how is the expected listing price estimated?',
    answer:
      'Grey Market Premium (GMP) is the unofficial premium over the issue price at which IPO shares trade in the grey market prior to listing. Expected Listing Price = IPO Cut-off Price + GMP. For example, if an issue price is ₹200 and the live GMP is ₹50, the estimated listing price is ₹250 (+25%). WeeStox tracks daily GMP trends, Kostak rates, and subject-to-sauda quotes.',
  },
  {
    category: 'IPO & GMP Intelligence',
    question: 'How does WeeStox conduct Shariah compliance audits on upcoming IPOs?',
    answer:
      'Our research desk analyzes the Draft Red Herring Prospectus (DRHP) and RHP of Mainboard and SME IPOs. We review the intended use of proceeds (OFS vs Fresh Issue debt repayment), existing balance sheet leverage, and commercial business models to determine compliance before the bidding window opens.',
  },
  {
    category: 'Precious Metals Tracking',
    question: 'How are live 24K, 22K and 18K Gold and Silver rates calculated in India?',
    answer:
      'Gold and silver rates in India are determined by international spot bullion prices, import customs duties, and local bullion association premiums. WeeStox delivers city-wise live rates for 24K (999 pure gold), 22K (916 hallmarked jewellery gold), 18K gold, and Silver (per 1g, 10g, and 1kg) across Delhi, Mumbai, Bangalore, Hyderabad, Chennai, and other major cities.',
  },
  {
    category: 'Precious Metals Tracking',
    question: 'What is the Shariah ruling on investing in digital gold and physical gold?',
    answer:
      'Under Islamic finance (the Sarf rules), trading gold and silver requires immediate or prompt settlement (hand-to-hand/spot basis) without deferment. Physical gold bullion, coins, and Shariah-compliant vaulted gold with 100% physical backing and immediate title transfer are permissible, whereas leveraged gold margin trading is prohibited.',
  },
  {
    category: 'Zakat & Islamic Wealth',
    question: 'How do I calculate Zakat on shares, mutual funds, and liquid investments?',
    answer:
      'For short-term trading stocks held for capital gains, Zakat is calculated at 2.5% on the full market value on your Zakat valuation date. For long-term investments held for dividends, scholars recommend calculating 2.5% on the proportional liquid/zakatable assets (cash + inventory + receivables) of the company, or 2.5% on total dividends received. WeeStox provides a built-in Zakat calculator to automate this.',
  },
  {
    category: 'Zakat & Islamic Wealth',
    question: 'What is the Nisab threshold for Zakat in India today?',
    answer:
      'Nisab is the minimum wealth threshold that triggers Zakat liability after one lunar year (Hawl). Classical benchmarks are 85 grams of 24K gold or 595 grams of pure silver. In modern practice, most scholars recommend the silver Nisab (~₹50,000–₹60,000 based on current silver rates) to ensure more underprivileged families receive assistance. WeeStox tracks both benchmarks daily.',
  },
  {
    category: 'Ethical Value Investing',
    question: 'How often does WeeStox update its stock data, financial ratios, and market feeds?',
    answer:
      'Equities market prices and IPO GMP update in real-time during market hours. Financial statement audits and debt ratios are updated quarterly following company filings on BSE and NSE. City metal prices are updated multiple times daily as bullion associations publish new spot rates.',
  },
  {
    category: 'Ethical Value Investing',
    question: 'Why is Shariah screening useful for non-Muslim and value investors?',
    answer:
      'Shariah screening operates as a rigorous fundamental safety filter. By enforcing a debt ceiling of ≤33% of market capitalization and eliminating predatory financial models, it systematically protects investors from over-leveraged bankruptcy traps, rising interest rate shocks, and opaque corporate accounting.',
  },
];

export const AAOIFI_PILLARS = [
  {
    id: 'activity',
    title: 'Business Activity Filter',
    threshold: '100% Permissible',
    description:
      'Core business operations must be permissible. Strictly excludes conventional banking, interest-bearing lending, alcohol, pork, gambling, and weapons.',
    badge: 'Hygiene Test',
    tagColor: 'text-sky-600 bg-sky-50 dark:bg-sky-950/50 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  },
  {
    id: 'debt',
    title: 'Debt-to-Market-Cap Ratio',
    threshold: '≤ 33.00%',
    description:
      'Total interest-bearing debt divided by 24-month average market capitalization must not exceed 33%. Protects portfolios from insolvency and excessive leverage.',
    badge: 'Leverage Ceiling',
    tagColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'liquidity',
    title: 'Interest-Bearing Securities',
    threshold: '≤ 33.00%',
    description:
      'Cash and interest-earning deposits divided by market capitalization must remain under 33%. Ensures value derives from active enterprise, not money lending.',
    badge: 'Cash Purity',
    tagColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  },
  {
    id: 'revenue',
    title: 'Non-Permissible Income',
    threshold: '≤ 5.00%',
    description:
      'Incidental revenue from interest or non-compliant activities must be less than 5% of gross revenue, and must be purified via charitable donation.',
    badge: 'Purification Filter',
    tagColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  },
];

export const POPULAR_HALAL_SECTORS = [
  {
    name: 'Information Technology',
    complianceRate: '95%+ Halal',
    note: 'Consulting, software services, cloud & cybersecurity with negligible interest debt.',
    examples: 'TCS, Infosys, HCLTech, Wipro, Tech Mahindra',
    tone: 'sky',
  },
  {
    name: 'Pharmaceuticals & Healthcare',
    complianceRate: '85%+ Halal',
    note: 'Life-saving medicines, diagnostics, hospital infrastructure, and biomedical research.',
    examples: 'Sun Pharma, Cipla, Dr. Reddy’s, Lupin, Mankind',
    tone: 'emerald',
  },
  {
    name: 'Automobiles & Mobility',
    complianceRate: '70%+ Halal',
    note: 'EV manufacturing, commercial vehicles, 2-wheelers, auto components & batteries.',
    examples: 'Tata Motors, Maruti Suzuki, Mahindra, Bosch',
    tone: 'amber',
  },
  {
    name: 'Consumer Goods & Retail',
    complianceRate: '80%+ Halal',
    note: 'FMCG, personal care, packaged foods, apparel, and durable household consumer brands.',
    examples: 'Hindustan Unilever, Nestle, Dabur, Marico, Titan',
    tone: 'rose',
  },
];
