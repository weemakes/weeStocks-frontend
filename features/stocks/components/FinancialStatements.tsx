'use client';

import { useEffect, useRef, useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Check, ChevronDown, FileText } from 'lucide-react';
import type { StockMasterDetail } from '../types';
import { formatMarketCap, formatSafePct, formatSafePrice } from '../utils/mappers';
import ViewModeToggle from './ViewModeToggle';

type Period = 'annual' | 'quarterly';
type Statement = 'performance' | 'income' | 'balance' | 'cashflow';
type ViewMode = 'chart' | 'table';
type AnnualRow = NonNullable<StockMasterDetail['annual_financials']>[number];
type QuarterlyRow = NonNullable<StockMasterDetail['quarterly_financials']>[number];
type Row = AnnualRow | QuarterlyRow;
type Column = { key: keyof AnnualRow | keyof QuarterlyRow; label: string; kind?: 'money' | 'price' | 'pct' | 'change' };

const performanceColumns: Column[] = [
  { key: 'revenue', label: 'Revenue', kind: 'money' },
  { key: 'revenue_yoy_pct', label: 'Revenue YoY', kind: 'change' },
  { key: 'ebitda', label: 'EBITDA', kind: 'money' },
  { key: 'ebitda_margin_pct', label: 'EBITDA margin', kind: 'pct' },
  { key: 'net_income', label: 'PAT', kind: 'money' },
  { key: 'pat_yoy_pct', label: 'PAT YoY', kind: 'change' },
  { key: 'pat_margin_pct', label: 'PAT margin', kind: 'pct' },
  { key: 'diluted_eps', label: 'EPS', kind: 'price' },
];
const incomeColumns: Column[] = [
  { key: 'revenue', label: 'Revenue', kind: 'money' },
  { key: 'gross_profit', label: 'Gross profit', kind: 'money' },
  { key: 'operating_income', label: 'Operating income', kind: 'money' },
  { key: 'ebitda', label: 'EBITDA', kind: 'money' },
  { key: 'interest_income', label: 'Interest income', kind: 'money' },
  { key: 'interest_expense', label: 'Interest expense', kind: 'money' },
  { key: 'pbt', label: 'PBT', kind: 'money' },
  { key: 'tax_expense', label: 'Tax', kind: 'money' },
  { key: 'net_income', label: 'PAT', kind: 'money' },
];
const balanceColumns: Column[] = [
  { key: 'total_assets', label: 'Total assets', kind: 'money' },
  { key: 'total_liabilities', label: 'Total liabilities', kind: 'money' },
  { key: 'total_debt', label: 'Total debt', kind: 'money' },
  { key: 'cash_and_equivalents', label: 'Cash & equivalents', kind: 'money' },
  { key: 'equity_share_capital', label: 'Share capital', kind: 'money' },
  { key: 'reserves_surplus', label: 'Reserves & surplus', kind: 'money' },
];
const cashFlowColumns: Column[] = [
  { key: 'operating_cash_flow', label: 'Operating cash flow', kind: 'money' },
  { key: 'capex', label: 'Capital expenditure', kind: 'money' },
  { key: 'free_cash_flow', label: 'Free cash flow', kind: 'money' },
];

const statementColumnsMap: Record<Statement, Column[]> = {
  performance: performanceColumns,
  income: incomeColumns,
  balance: balanceColumns,
  cashflow: cashFlowColumns,
};

const hasDataFor = (dataset: Row[], cols: Column[], isQuarterly = false) => {
  if (!dataset || dataset.length === 0) return false;

  const rowsWithData = dataset.filter((row) =>
    cols.some((col) => {
      const val = row[col.key as keyof Row];
      return val != null && val !== 0 && !Number.isNaN(Number(val));
    })
  ).length;

  // Quarterly balance sheet / cash flow requires consistent quarterly reporting (at least 50% quarters, min 4)
  if (isQuarterly) {
    return rowsWithData >= Math.min(4, Math.ceil(dataset.length * 0.5));
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
  annual: AnnualRow[];
  quarterly: QuarterlyRow[];
  country: string;
  currency: string;
  statementScope?: 'CONSOLIDATED' | 'STANDALONE';
  availableScopes?: ('CONSOLIDATED' | 'STANDALONE')[];
  onScopeChange?: (scope: 'CONSOLIDATED' | 'STANDALONE') => void;
}) {
  const [period, setPeriod] = useState<Period>('annual');
  const [statement, setStatement] = useState<Statement>('performance');
  const [view, setView] = useState<ViewMode>('chart');

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
  const columns = statementColumnsMap[selectedStatement];
  const visibleColumns = columns.filter((column) => rows.some((row) => row[column.key as keyof Row] != null));
  const minWidth = visibleColumns.length >= 8 ? 'min-w-[1080px]' : visibleColumns.length >= 5 ? 'min-w-[820px]' : 'min-w-[620px]';
  const chartSeries = getChartSeries(selectedStatement, visibleColumns);
  const chartData = [...rows].reverse().map((row) => ({
    ...row,
    period: 'fiscal_quarter' in row ? `Q${row.fiscal_quarter} FY${row.fiscal_year}` : `FY${row.fiscal_year}`,
  }));

  const handleSelectStatement = (value: string) => {
    const nextStmt = value as Statement;
    setStatement(nextStmt);
    const targetCols = statementColumnsMap[nextStmt];
    const hasQuarterly = hasDataFor(quarterly, targetCols, true);
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

  return <section id="financials" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <FileText className="h-4 w-4 text-sky-600" />
            Financial Statements
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">Complete reported financial history · Values use the company&apos;s reporting currency</p>
        </div>
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

      {availableStatements.length > 1 && (
        <Toggle
          values={availableStatements}
          selected={selectedStatement}
          onSelect={handleSelectStatement}
          labels={{ performance: 'Performance', income: 'Income Statement', balance: 'Balance Sheet', cashflow: 'Cash Flow' }}
        />
      )}
    </div>
    {visibleColumns.length === 0 ? (
      <div className="py-12 text-center text-xs text-slate-400">No reported data available for this statement period.</div>
    ) : view === 'chart' ? (
      <FinancialChart data={chartData} series={chartSeries} country={country} />
    ) : (
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className={`w-full ${minWidth} text-[10px]`}>
          <thead className="bg-slate-50 text-[9px] uppercase tracking-wide text-slate-400 dark:bg-slate-950"><tr><th className="sticky left-0 z-10 bg-inherit px-4 py-3 text-left">Period</th>{visibleColumns.map((column) => <th key={String(column.key)} className="whitespace-nowrap px-3 py-3 text-right">{column.label}</th>)}</tr></thead>
          <tbody>{rows.map((row, index) => <tr key={`${row.fiscal_year}-${'fiscal_quarter' in row ? row.fiscal_quarter : 'annual'}-${index}`} className="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"><td className="sticky left-0 bg-white px-4 py-3 font-black dark:bg-slate-900">{'fiscal_quarter' in row ? `Q${row.fiscal_quarter} FY${row.fiscal_year}` : `FY${row.fiscal_year}`}</td>{visibleColumns.map((column) => <FinancialCell key={String(column.key)} value={row[column.key as keyof Row] as number | undefined} column={column} country={country} currency={currency} />)}</tr>)}</tbody>
        </table>
      </div>
    )}
    <p className="mt-2 text-[9px] text-slate-400">{view === 'table' ? 'Unavailable values are shown as —. Horizontal scrolling is enabled only when the table exceeds the available screen width.' : 'Hover over the chart for exact reported values. Percentage lines use the right-hand axis.'}</p>
  </section>;
}

const chartColors = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e'];

function getChartSeries(statement: Statement, visibleColumns: Column[]) {
  const preferred = statement === 'performance'
    ? ['revenue', 'ebitda', 'net_income', 'ebitda_margin_pct', 'pat_margin_pct']
    : statement === 'income'
      ? ['revenue', 'gross_profit', 'operating_income', 'net_income']
      : statement === 'balance'
        ? ['total_assets', 'total_liabilities', 'total_debt', 'cash_and_equivalents']
        : ['operating_cash_flow', 'capex', 'free_cash_flow'];
  return preferred.map((key) => visibleColumns.find((column) => column.key === key)).filter((column): column is Column => Boolean(column));
}

function FinancialChart({ data, series, country }: { data: Array<Row & { period: string }>; series: Column[]; country: string }) {
  const valueSeries = series.filter((item) => item.kind !== 'pct' && item.kind !== 'change');
  const percentSeries = series.filter((item) => item.kind === 'pct' || item.kind === 'change');
  return <div className="h-[360px] w-full rounded-xl border border-slate-200 p-2 dark:border-slate-800 sm:p-4"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={data} margin={{ top: 10, right: percentSeries.length ? 12 : 4, left: 4, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" /><XAxis dataKey="period" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={data.length > 8 ? 1 : 0} /><YAxis yAxisId="value" tickFormatter={(value) => formatMarketCap(value, country)} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={58} />{percentSeries.length > 0 && <YAxis yAxisId="percent" orientation="right" tickFormatter={(value) => `${value}%`} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={42} />}<Tooltip contentStyle={{ borderRadius: 12, borderColor: '#cbd5e1', fontSize: 11 }} formatter={(value, name) => { const item = series.find((entry) => entry.label === name); return item?.kind === 'pct' || item?.kind === 'change' ? [formatSafePct(Number(value), item.kind === 'pct' ? false : true), name] : [formatMarketCap(Number(value), country), name]; }} /><Legend wrapperStyle={{ fontSize: 10 }} />{valueSeries.map((item, index) => <Bar key={String(item.key)} yAxisId="value" dataKey={String(item.key)} name={item.label} fill={chartColors[index % chartColors.length]} radius={[3, 3, 0, 0]} maxBarSize={42} />)}{percentSeries.map((item, index) => <Line key={String(item.key)} yAxisId="percent" type="monotone" dataKey={String(item.key)} name={item.label} stroke={chartColors[(valueSeries.length + index) % chartColors.length]} strokeWidth={2.5} dot={{ r: 3 }} connectNulls />)}</ComposedChart></ResponsiveContainer></div>;
}

function FinancialCell({ value, column, country, currency }: { value?: number; column: Column; country: string; currency: string }) {
  const change = column.kind === 'change';
  const content = column.kind === 'money' ? formatMarketCap(value, country) : column.kind === 'price' ? formatSafePrice(value, currency) : column.kind === 'pct' ? formatSafePct(value, false) : column.kind === 'change' ? formatSafePct(value) : String(value ?? '—');
  return <td className={`whitespace-nowrap px-3 py-3 text-right tabular-nums ${change && value != null ? value >= 0 ? 'font-bold text-emerald-600' : 'font-bold text-rose-600' : column.key === 'net_income' ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{content}</td>;
}

function Toggle({ values, selected, onSelect, labels, accent = false }: { values: string[]; selected: string; onSelect: (value: string) => void; labels?: Record<string, string>; accent?: boolean }) {
  return <div className="flex max-w-full overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-950 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">{values.map((value) => <button type="button" key={value} onClick={() => onSelect(value)} className={`shrink-0 rounded-md px-3 py-1.5 text-[9px] font-bold cursor-pointer transition-all ${selected === value ? accent ? 'bg-sky-600 text-white' : 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-sky-600'}`}>{labels?.[value] || value.charAt(0).toUpperCase() + value.slice(1)}</button>)}</div>;
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
