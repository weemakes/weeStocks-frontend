'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Check, ChevronDown, FileText } from 'lucide-react';
import type { StockFinancialRow } from '../types';
import { formatMarketCap, formatSafePct, formatSafePrice } from '../utils/mappers';
import ViewModeToggle from './ViewModeToggle';

type Period = 'annual' | 'quarterly';
type Statement = 'performance' | 'income' | 'balance' | 'cashflow';
type ViewMode = 'chart' | 'table';
type Row = StockFinancialRow;

type Column = {
  key: keyof Row;
  label: string;
  kind?: 'money' | 'price' | 'pct' | 'change';
};

// View 1: Financials / Income Statement (ScanX Parity)
const incomeColumns: Column[] = [
  { key: 'revenue', label: 'Revenue', kind: 'money' },
  { key: 'expenses', label: 'Expenses', kind: 'money' },
  { key: 'ebitda', label: 'Operating Profit (EBITDA)', kind: 'money' },
  { key: 'opm_pct', label: 'Operating Profit %', kind: 'pct' },
  { key: 'depreciation', label: 'Depreciation', kind: 'money' },
  { key: 'interest_expense', label: 'Interest', kind: 'money' },
  { key: 'pbt', label: 'Profit Before Tax', kind: 'money' },
  { key: 'tax_expense', label: 'Tax', kind: 'money' },
  { key: 'net_income', label: 'Net Profit', kind: 'money' },
  { key: 'diluted_eps', label: 'EPS', kind: 'price' },
];

// View 2: Balance Sheet (ScanX Parity)
const balanceColumns: Column[] = [
  { key: 'total_assets', label: 'Total Assets', kind: 'money' },
  { key: 'fixed_assets', label: 'Fixed Assets', kind: 'money' },
  { key: 'cwip', label: 'Capital WIP', kind: 'money' },
  { key: 'investments', label: 'Investments', kind: 'money' },
  { key: 'other_assets', label: 'Other Assets', kind: 'money' },
  { key: 'total_equity_and_liabilities', label: 'Total Equity & Liabilities', kind: 'money' },
  { key: 'current_liabilities', label: 'Current Liabilities', kind: 'money' },
  { key: 'non_current_liabilities', label: 'Non Current Liabilities', kind: 'money' },
  { key: 'total_equity', label: 'Total Equity', kind: 'money' },
  { key: 'reserves_surplus', label: 'Reserve & Surplus', kind: 'money' },
  { key: 'equity_share_capital', label: 'Share Capital', kind: 'money' },
];

// View 3: Cash Flows (ScanX Parity)
const cashFlowColumns: Column[] = [
  { key: 'operating_activities', label: 'Operating Activities', kind: 'money' },
  { key: 'investing_activities', label: 'Investing Activities', kind: 'money' },
  { key: 'financing_activities', label: 'Financing Activities', kind: 'money' },
  { key: 'net_cash_flow', label: 'Net Cash Flow', kind: 'money' },
  { key: 'capex', label: 'Capital Expenditure', kind: 'money' },
  { key: 'free_cash_flow', label: 'Free Cash Flow', kind: 'money' },
];

// View 4: Performance Summary
const performanceColumns: Column[] = [
  { key: 'revenue', label: 'Revenue', kind: 'money' },
  { key: 'revenue_yoy_pct', label: 'Revenue YoY', kind: 'change' },
  { key: 'ebitda', label: 'EBITDA', kind: 'money' },
  { key: 'ebitda_margin_pct', label: 'EBITDA Margin', kind: 'pct' },
  { key: 'net_income', label: 'Net Profit (PAT)', kind: 'money' },
  { key: 'pat_yoy_pct', label: 'PAT YoY', kind: 'change' },
  { key: 'pat_margin_pct', label: 'PAT Margin', kind: 'pct' },
  { key: 'diluted_eps', label: 'EPS', kind: 'price' },
];

const statementColumnsMap: Record<Statement, Column[]> = {
  performance: performanceColumns,
  income: incomeColumns,
  balance: balanceColumns,
  cashflow: cashFlowColumns,
};

const statementTabLabels: Record<Statement, string> = {
  performance: 'Performance',
  income: 'Financials',
  balance: 'Balance Sheet',
  cashflow: 'Cash Flows',
};

const hasDataFor = (dataset: Row[], cols: Column[], isQuarterly = false) => {
  if (!dataset || dataset.length === 0) return false;

  const rowsWithData = dataset.filter((row) =>
    cols.some((col) => {
      const val = row[col.key as keyof Row];
      return val != null && val !== 0 && !Number.isNaN(Number(val));
    })
  ).length;

  if (isQuarterly) {
    return rowsWithData >= Math.min(2, Math.ceil(dataset.length * 0.3));
  }

  return rowsWithData > 0;
};

export default function FinancialStatements({
  annual,
  quarterly,
  country,
  currency,
  statementScope,
  availableScopes,
  onScopeChange,
}: {
  annual: Row[];
  quarterly: Row[];
  country: string;
  currency: string;
  statementScope?: 'CONSOLIDATED' | 'STANDALONE';
  availableScopes?: ('CONSOLIDATED' | 'STANDALONE')[];
  onScopeChange?: (scope: 'CONSOLIDATED' | 'STANDALONE') => void;
}) {
  const [period, setPeriod] = useState<Period>('annual');
  const [statement, setStatement] = useState<Statement>('performance');
  const [view, setView] = useState<ViewMode>('table');

  const isQuarterly = period === 'quarterly';
  const currentDataset = isQuarterly ? quarterly : annual;

  // Check which statements have meaningful data for the currently selected period
  const availableStatements: Statement[] = (['performance', 'income', 'balance', 'cashflow'] as Statement[]).filter(
    (stmt) => hasDataFor(currentDataset, statementColumnsMap[stmt], isQuarterly)
  );

  // Fallback if current statement is not available in the active period
  const selectedStatement: Statement = availableStatements.includes(statement)
    ? statement
    : availableStatements[0] || 'performance';

  // Check which periods (annual / quarterly) have data for the SELECTED statement
  const targetCols = statementColumnsMap[selectedStatement];
  const hasAnnualForStmt = hasDataFor(annual, targetCols, false);
  const hasQuarterlyForStmt = hasDataFor(quarterly, targetCols, true);

  const availablePeriods: Period[] = [];
  if (hasAnnualForStmt) availablePeriods.push('annual');
  if (hasQuarterlyForStmt) availablePeriods.push('quarterly');

  // Fallback if current period is not available for this statement
  const selectedPeriod: Period = availablePeriods.includes(period)
    ? period
    : availablePeriods[0] || 'annual';

  const rows: Row[] = selectedPeriod === 'annual' ? annual : quarterly;

  // Build Chronological Period List for ScanX table (oldest -> newest, plus TTM if annual)
  const sortedChronological = [...rows].reverse();
  const periodList: Array<{ label: string; data: Record<string, unknown> }> = sortedChronological.map((row) => ({
    label:
      'fiscal_quarter' in row && row.fiscal_quarter
        ? `Q${row.fiscal_quarter} FY${row.fiscal_year}`
        : `FY${row.fiscal_year}`,
    data: row as unknown as Record<string, unknown>,
  }));

  // Calculate TTM for annual period if quarterly history exists
  if (selectedPeriod === 'annual') {
    const qRows = [...quarterly].filter((q) => q.fiscal_quarter != null);
    if (qRows.length >= 4) {
      const last4 = qRows.slice(0, 4);
      const sumField = (key: keyof Row) => {
        const sum = last4.reduce((acc, q) => {
          const val = Number(q[key]);
          return Number.isFinite(val) ? acc + val : acc;
        }, 0);
        return sum !== 0 ? sum : undefined;
      };

      const ttmRevenue = sumField('revenue') ?? Number(rows[0]?.revenue || 0);
      const ttmEbitda = sumField('ebitda') ?? Number(rows[0]?.ebitda || 0);
      const ttmNetIncome = sumField('net_income') ?? Number(rows[0]?.net_income || 0);
      const ttmOpm = ttmRevenue > 0 ? (ttmEbitda / ttmRevenue) * 100 : undefined;
      const ttmPatMargin = ttmRevenue > 0 ? (ttmNetIncome / ttmRevenue) * 100 : undefined;

      const ttmData: Record<string, unknown> = {
        // Income statement
        revenue: ttmRevenue,
        expenses: sumField('expenses'),
        ebitda: ttmEbitda,
        opm_pct: ttmOpm,
        depreciation: sumField('depreciation'),
        interest_expense: sumField('interest_expense'),
        pbt: sumField('pbt'),
        tax_expense: sumField('tax_expense'),
        net_income: ttmNetIncome,
        diluted_eps: sumField('diluted_eps'),
        // Balance sheet (latest reported quarter)
        total_assets: last4[0]?.total_assets ?? rows[0]?.total_assets,
        fixed_assets: last4[0]?.fixed_assets ?? rows[0]?.fixed_assets,
        cwip: last4[0]?.cwip ?? rows[0]?.cwip,
        investments: last4[0]?.investments ?? rows[0]?.investments,
        other_assets: last4[0]?.other_assets ?? rows[0]?.other_assets,
        total_equity_and_liabilities:
          last4[0]?.total_equity_and_liabilities ??
          last4[0]?.total_assets ??
          rows[0]?.total_assets,
        current_liabilities: last4[0]?.current_liabilities ?? rows[0]?.current_liabilities,
        non_current_liabilities: last4[0]?.non_current_liabilities ?? rows[0]?.non_current_liabilities,
        total_equity: last4[0]?.total_equity ?? rows[0]?.total_equity,
        reserves_surplus: last4[0]?.reserves_surplus ?? rows[0]?.reserves_surplus,
        equity_share_capital: last4[0]?.equity_share_capital ?? rows[0]?.equity_share_capital,
        // Cash flow
        operating_activities:
          sumField('operating_activities') ?? sumField('operating_cash_flow') ?? rows[0]?.operating_activities,
        investing_activities: sumField('investing_activities') ?? rows[0]?.investing_activities,
        financing_activities: sumField('financing_activities') ?? rows[0]?.financing_activities,
        net_cash_flow: sumField('net_cash_flow') ?? rows[0]?.net_cash_flow,
        capex: sumField('capex') ?? rows[0]?.capex,
        free_cash_flow: sumField('free_cash_flow') ?? rows[0]?.free_cash_flow,
        // Performance
        revenue_yoy_pct: rows[0]?.revenue_yoy_pct,
        pat_yoy_pct: rows[0]?.pat_yoy_pct,
        ebitda_margin_pct: ttmOpm,
        pat_margin_pct: ttmPatMargin,
      };

      periodList.push({
        label: 'TTM',
        data: ttmData,
      });
    }
  }

  const columns = statementColumnsMap[selectedStatement];
  // Filter out columns that have no reported data across any period
  const visibleColumns = columns.filter((column) =>
    periodList.some(
      (p) => p.data[column.key] != null && p.data[column.key] !== '' && !Number.isNaN(Number(p.data[column.key]))
    )
  );

  const chartSeries = getChartSeries(selectedStatement, visibleColumns);
  const chartData = [...rows].reverse().map((row) => ({
    ...row,
    period: 'fiscal_quarter' in row ? `Q${row.fiscal_quarter} FY${row.fiscal_year}` : `FY${row.fiscal_year}`,
  }));

  const handleSelectStatement = (value: string) => {
    const nextStmt = value as Statement;
    setStatement(nextStmt);
    const target = statementColumnsMap[nextStmt];
    const hasQuarterly = hasDataFor(quarterly, target, true);
    if (!hasQuarterly && period === 'quarterly') {
      setPeriod('annual');
    }
  };

  const handleSelectPeriod = (value: string) => {
    const nextPeriod = value as Period;
    setPeriod(nextPeriod);
    if (nextPeriod === 'quarterly') {
      const isAvailableInQuarterly = hasDataFor(quarterly, statementColumnsMap[selectedStatement], true);
      if (!isAvailableInQuarterly) {
        setStatement('performance');
      }
    }
  };

  return (
    <section
      id="financials"
      className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="mb-4 flex flex-col gap-3">
        {/* Header title */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <FileText className="h-4 w-4 text-sky-600" />
            Financial Statements
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Complete reported financial history · Values use the company&apos;s reporting currency
          </p>
        </div>

        {/* Unified Toolbar: Statement tabs on left, filters & view toggles on right */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {availableStatements.length > 1 ? (
            <div className="inline-flex max-w-full overflow-x-auto rounded-lg border border-slate-200/90 bg-slate-100/90 p-0.5 dark:border-slate-800 dark:bg-slate-900 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {availableStatements.map((stmt) => {
                const isSelected = selectedStatement === stmt;
                return (
                  <button
                    key={stmt}
                    type="button"
                    onClick={() => handleSelectStatement(stmt)}
                    className={`shrink-0 rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-slate-800 shadow-xs dark:bg-slate-800 dark:text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    {statementTabLabels[stmt]}
                  </button>
                );
              })}
            </div>
          ) : (
            <div />
          )}

          <div className="flex flex-wrap items-center gap-2">
            <ViewModeToggle view={view} onChange={setView} />
            <ScopeDropdown
              scopes={availableScopes || ['CONSOLIDATED']}
              selected={statementScope || 'CONSOLIDATED'}
              onChange={(val) => onScopeChange?.(val)}
            />
            {availablePeriods.length > 1 ? (
              <div className="inline-flex items-center rounded-lg border border-slate-200/90 bg-slate-100/90 p-0.5 dark:border-slate-800 dark:bg-slate-900">
                {availablePeriods.map((p) => {
                  const isSelected = selectedPeriod === p;
                  const label = p === 'annual' ? 'Annual' : 'Quarter';
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleSelectPeriod(p)}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white text-slate-800 shadow-xs dark:bg-slate-800 dark:text-white'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ) : availablePeriods.length === 1 ? (
              <span className="inline-flex items-center rounded-lg border border-slate-200/90 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                {availablePeriods[0] === 'annual' ? 'Annual' : 'Quarter'}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {visibleColumns.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          No reported data available for this statement period.
        </div>
      ) : view === 'chart' ? (
        <FinancialChart data={chartData} series={chartSeries} country={country} />
      ) : (
        /* ScanX Matrix Table View: Metrics as Rows, Fiscal Periods across Columns */
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-[11px]">
            <thead className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="sticky left-0 z-20 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-left border-r border-slate-200/80 dark:border-slate-800">
                  Metric
                </th>
                {periodList.map((p) => (
                  <th
                    key={p.label}
                    className={`px-3.5 py-3 text-right whitespace-nowrap ${
                      p.label === 'TTM'
                        ? 'bg-sky-50/70 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300 font-bold'
                        : ''
                    }`}
                  >
                    {p.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {visibleColumns.map((col) => {
                const isHighlightRow =
                  col.key === 'revenue' ||
                  col.key === 'net_income' ||
                  col.key === 'ebitda' ||
                  col.key === 'total_assets' ||
                  col.key === 'total_equity' ||
                  col.key === 'net_cash_flow';

                return (
                  <tr
                    key={String(col.key)}
                    className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${
                      isHighlightRow ? 'font-semibold' : ''
                    }`}
                  >
                    <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 border-r border-slate-200/80 dark:border-slate-800 whitespace-nowrap shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]">
                      {col.label}
                    </td>
                    {periodList.map((p) => (
                      <FinancialCell
                        key={p.label}
                        value={p.data[col.key] as number | undefined}
                        column={col}
                        country={country}
                        currency={currency}
                        isTtm={p.label === 'TTM'}
                      />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-2 text-[9px] text-slate-400">
        {view === 'table'
          ? 'Values use the company’s reporting currency. Horizontal scrolling is enabled when periods exceed screen width.'
          : 'Hover over the chart for exact reported values. Percentage lines use the right-hand axis.'}
      </p>
    </section>
  );
}

const scanxColorMap: Record<string, string> = {
  // Cash Flows (ScanX colors: CFO Purple, CFI Blue, CFF Green, Net Cash Flow Orange)
  operating_activities: '#8b5cf6',
  operating_cash_flow: '#8b5cf6',
  investing_activities: '#3b82f6',
  financing_activities: '#10b981',
  net_cash_flow: '#f97316',

  // Financials / Income Statement
  revenue: '#0ea5e9',
  expenses: '#f43f5e',
  ebitda: '#10b981',
  net_income: '#8b5cf6',
  opm_pct: '#f59e0b',

  // Balance Sheet
  total_assets: '#0ea5e9',
  fixed_assets: '#8b5cf6',
  investments: '#f59e0b',
  total_equity: '#10b981',

  // Performance
  ebitda_margin_pct: '#10b981',
  pat_margin_pct: '#f59e0b',
};

const defaultPalette = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e'];

function getSeriesColor(key: string, index: number): string {
  return scanxColorMap[key] || defaultPalette[index % defaultPalette.length];
}

function getChartSeries(statement: Statement, visibleColumns: Column[]) {
  const preferred =
    statement === 'performance'
      ? ['revenue', 'ebitda', 'net_income', 'ebitda_margin_pct', 'pat_margin_pct']
      : statement === 'income'
        ? ['revenue', 'expenses', 'ebitda', 'net_income', 'opm_pct']
        : statement === 'balance'
          ? ['total_assets', 'total_equity', 'fixed_assets', 'investments']
          : ['operating_activities', 'investing_activities', 'financing_activities', 'net_cash_flow'];

  return preferred
    .map((key) => visibleColumns.find((column) => column.key === key))
    .filter((column): column is Column => Boolean(column));
}

function FinancialChart({
  data,
  series,
  country,
}: {
  data: Array<Row & { period: string }>;
  series: Column[];
  country: string;
}) {
  const isPercent = (item: Column) => item.kind === 'pct' || item.kind === 'change';
  const isLine = (item: Column) => isPercent(item) || item.key === 'net_cash_flow';

  const barSeries = series.filter((item) => !isLine(item));
  const lineSeries = series.filter((item) => isLine(item));
  const hasPercentAxis = series.some(isPercent);

  return (
    <div className="h-[360px] w-full rounded-xl border border-slate-200 p-2 dark:border-slate-800 sm:p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: hasPercentAxis ? 14 : 6, left: 4, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
          />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            interval={data.length > 8 ? 1 : 0}
          />
          <YAxis
            yAxisId="value"
            tickFormatter={(value) => formatMarketCap(value, country)}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={58}
          />
          {hasPercentAxis && (
            <YAxis
              yAxisId="percent"
              orientation="right"
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={42}
            />
          )}
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              borderColor: '#cbd5e1',
              fontSize: 11,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value, name) => {
              const item = series.find((entry) => entry.label === name);
              if (item?.kind === 'pct' || item?.kind === 'change') {
                return [formatSafePct(Number(value), item.kind === 'change'), name];
              }
              return [formatMarketCap(Number(value), country), name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
          {barSeries.map((item, index) => (
            <Bar
              key={String(item.key)}
              yAxisId="value"
              dataKey={String(item.key)}
              name={item.label}
              fill={getSeriesColor(String(item.key), index)}
              radius={[3, 3, 0, 0]}
              maxBarSize={36}
            />
          ))}
          {lineSeries.map((item, index) => {
            const axisId = isPercent(item) ? 'percent' : 'value';
            return (
              <Line
                key={String(item.key)}
                yAxisId={axisId}
                type="monotone"
                dataKey={String(item.key)}
                name={item.label}
                stroke={getSeriesColor(String(item.key), barSeries.length + index)}
                strokeWidth={2.5}
                dot={{ r: 3.5, strokeWidth: 1 }}
                connectNulls
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function FinancialCell({
  value,
  column,
  country,
  currency,
  isTtm,
}: {
  value?: number;
  column: Column;
  country: string;
  currency: string;
  isTtm?: boolean;
}) {
  const isNetMetric = column.key === 'net_income' || column.key === 'net_cash_flow';
  const isChange = column.kind === 'change';
  const isPct = column.kind === 'pct';
  const isPrice = column.kind === 'price';
  const isMoney = column.kind === 'money';

  let content = '—';
  if (value != null && !Number.isNaN(Number(value))) {
    if (isMoney) {
      content = formatMarketCap(value, country);
    } else if (isPrice) {
      content = formatSafePrice(value, currency);
    } else if (isPct) {
      content = formatSafePct(value, false);
    } else if (isChange) {
      content = formatSafePct(value, true);
    } else {
      content = String(value);
    }
  }

  const isPositive = value != null && value > 0;
  const isNegative = value != null && value < 0;

  const colorClass =
    isNetMetric && value != null
      ? isPositive
        ? 'font-bold text-emerald-600 dark:text-emerald-400'
        : isNegative
          ? 'font-bold text-rose-600 dark:text-rose-400'
          : 'text-slate-900 dark:text-white'
      : isChange && value != null
        ? isPositive
          ? 'font-medium text-emerald-600 dark:text-emerald-400'
          : isNegative
            ? 'font-medium text-rose-600 dark:text-rose-400'
            : 'text-slate-500'
        : 'text-slate-700 dark:text-slate-300';

  const ttmBg = isTtm ? 'bg-sky-50/30 dark:bg-sky-950/20' : '';

  return (
    <td className={`whitespace-nowrap px-3.5 py-2.5 text-right tabular-nums ${colorClass} ${ttmBg}`}>
      {content}
    </td>
  );
}

function ScopeDropdown({
  scopes,
  selected,
  onChange,
}: {
  scopes: ('CONSOLIDATED' | 'STANDALONE')[];
  selected: 'CONSOLIDATED' | 'STANDALONE';
  onChange?: (scope: 'CONSOLIDATED' | 'STANDALONE') => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const label = selected === 'CONSOLIDATED' ? 'Consolidated' : 'Standalone';

  if (!scopes || scopes.length <= 1) {
    return (
      <span className="inline-flex items-center rounded-lg border border-slate-200/90 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        {label}
      </span>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-30 min-w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100">
          {scopes.map((scope) => {
            const isSelected = selected === scope;
            const scopeLabel = scope === 'CONSOLIDATED' ? 'Consolidated' : 'Standalone';
            return (
              <button
                key={scope}
                type="button"
                onClick={() => {
                  onChange?.(scope);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span>{scopeLabel}</span>
                {isSelected && <Check className="h-3 w-3 text-sky-600 dark:text-sky-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
