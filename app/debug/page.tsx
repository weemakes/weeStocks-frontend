/**
 * Debug Page
 * Check backend connectivity and configuration
 */

"use client";

import { useState, useEffect } from "react";

export default function DebugPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-backend");
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      setTestResults({
        error: "Failed to run tests",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas py-8 text-body">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-xl">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Backend Connection Debug
          </h1>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-slate-600 dark:text-slate-400 font-medium">Running tests...</div>
            </div>
          ) : testResults?.error ? (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 rounded-xl p-4">
              <h3 className="font-semibold text-rose-900 dark:text-rose-200 mb-2">Error</h3>
              <p className="text-rose-700 dark:text-rose-400 text-sm">{testResults.message}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary */}
              <div
                className={`p-4 rounded-xl border ${
                  testResults.summary.includes("passed")
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-200"
                }`}
              >
                <h2 className="text-base md:text-lg font-semibold mb-2">
                  {testResults.summary}
                </h2>
                <p className="text-xs md:text-sm">
                  Backend URL:{" "}
                  <code className="bg-white/80 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 font-mono">
                    {testResults.backend_url}
                  </code>
                </p>
              </div>

              {/* Test Results */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Test Results</h3>
                <div className="space-y-3">
                  {testResults.tests.map((test: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                          {test.test}
                        </span>
                        <span
                          className={`font-semibold text-xs px-2 py-0.5 rounded-full ${
                            test.status.includes("Pass")
                              ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                              : "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30"
                          }`}
                        >
                          {test.status}
                        </span>
                      </div>
                      {test.value && (
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          Value: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-800 dark:text-slate-200">{test.value}</code>
                        </div>
                      )}
                      {test.error && (
                        <div className="text-xs text-rose-600 dark:text-rose-400 mt-2">
                          Error: {test.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Troubleshooting */}
              {!testResults.summary.includes("passed") && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">
                    Troubleshooting Steps
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-xs md:text-sm text-amber-800 dark:text-amber-300">
                    <li>
                      Ensure your backend API is running on{" "}
                      <code className="bg-amber-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">
                        {testResults.backend_url}
                      </code>
                    </li>
                    <li>
                      Check that <code className="bg-amber-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">.env.local</code> has the correct{" "}
                      <code className="bg-amber-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">BACKEND_API_URL</code>
                    </li>
                    <li>Verify the backend endpoint <code className="bg-amber-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">/cities/popular</code> exists</li>
                    <li>Check CORS settings on your backend</li>
                    <li>Restart both frontend and backend servers</li>
                  </ol>
                </div>
              )}

              {/* Retry Button */}
              <button
                onClick={runTests}
                className="w-full px-4 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-sm shadow-md shadow-sky-600/20 transition-all cursor-pointer"
              >
                Run Tests Again
              </button>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <a
            href="/"
            className="block p-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-slate-800 dark:text-slate-200 hover:border-sky-500 font-semibold text-sm transition-all shadow-xs"
          >
            &larr; Back to Homepage
          </a>
          <a
            href="/gold/agra"
            className="block p-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-slate-800 dark:text-slate-200 hover:border-sky-500 font-semibold text-sm transition-all shadow-xs"
          >
            Try Gold Page &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
