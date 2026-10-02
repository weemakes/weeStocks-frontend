# Stock Detail Data Audit

## Frontend corrections completed

- Normalized CPR fields (`top_central`, `bottom_central`, `sentiment`) into the UI model.
- Converted classical pivot arrays into keyed R1–R3, pivot, and S1–S3 values.
- Normalized delivery fields (`delivery_pct`, `deliverable_quantity`) so conviction data renders.
- Normalized shareholding fields and selected the latest quarter containing an ownership breakdown for summary cards.
- Converted numeric financial strings into numbers.
- Removed duplicate annual fiscal-year rows by selecting the most complete record.
- Treated ROE and ROCE as percentage values instead of multiplying them by 100.
- Normalized percentage-form debt-to-equity values such as `36.653` to the ratio `0.36653x`.
- Added earnings yield, forward EPS growth, EV premium, and latest net margin calculations.

## Backend fields to add or clarify

### Financial statement identity

Add these fields to every annual and quarterly record:

- `statement_scope`: `CONSOLIDATED` or `STANDALONE`
- `period_end_date`
- `period_type`: `ANNUAL`, `QUARTERLY`, or `TTM`
- `is_audited`
- `source_url`
- `restated`

The current response contains two rows for several fiscal years without identifying their scope. The frontend currently selects the most complete row, but an explicit scope is required for exact reporting.

### Metric units and provenance

Return explicit units or consistently normalized ratios:

- `debt_to_equity_ratio` as `0.3665`, rather than a provider percentage such as `36.65`
- `roe_pct`, `roa_pct`, and `roce_pct` as percentage values
- `dividend_yield_pct` as a percentage value, rather than a decimal fraction
- `metric_as_of_date`
- `metric_source`

This prevents provider-specific scaling errors.

### Profitability and cash-flow inputs

Add:

- `gross_profit`
- `operating_cash_flow`
- `capital_expenditure`
- `cash_and_equivalents`
- `shareholders_equity`
- `total_liabilities`
- `interest_expense`
- `tax_expense`
- `shares_outstanding`

These fields enable gross margin, operating cash conversion, capex intensity, net debt, ROIC, interest coverage, tax rate, and per-share calculations.

### Growth and quality metrics

The backend can provide authoritative precomputed values with their comparison periods:

- Revenue and profit YoY/QoQ growth
- Three-year and five-year revenue, EPS, and FCF CAGR
- EBITDA, operating, net, and FCF margins
- ROIC
- Interest coverage
- Net debt/EBITDA
- CFO/PAT cash conversion
- Piotroski F-score
- Altman Z-score where applicable
- Beneish M-score where applicable

### Valuation context

Add:

- Sector median P/E, forward P/E, P/B, EV/EBITDA, and PEG
- Company five-year median valuation multiples
- Price-to-sales and EV/EBITDA
- Consensus target price, analyst count, and estimate date

This enables relative valuation and avoids presenting a multiple without context.

### Ownership quality

Add:

- `data_available` or `filing_status` per quarter
- Mutual fund, insurance, government, and employee ownership
- Promoter pledge quantity and percentage
- QoQ ownership changes calculated against the previous complete filing

Rows with null ownership values should be labelled as unavailable filings rather than appearing as zero holdings.

### Technical and market data

Add:

- 20/50/100/200 DMA values and calculation date
- RSI, MACD, ATR, beta, and average 20-day volume
- One-month, three-month, six-month, one-year, and three-year returns
- Relative returns against the sector index and benchmark index
- Corporate-action-adjusted flag for historical candles

### Shariah audit traceability

Add:

- Numerator, denominator, threshold, pass/fail result, and source date for every ratio
- Non-permissible income amount and percentage
- Receivables ratio where required by the selected methodology
- Purification amount per share and per dividend
- Screening version and review timestamp

This makes the compliance verdict independently auditable.
