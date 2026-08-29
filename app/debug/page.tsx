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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Backend Connection Debug
          </h1>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Running tests...</div>
            </div>
          ) : testResults?.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Error</h3>
              <p className="text-red-700">{testResults.message}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary */}
              <div
                className={`p-4 rounded-lg ${
                  testResults.summary.includes("passed")
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <h2 className="text-lg font-semibold mb-2">
                  {testResults.summary}
                </h2>
                <p className="text-sm">
                  Backend URL:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {testResults.backend_url}
                  </code>
                </p>
              </div>

              {/* Test Results */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Test Results</h3>
                <div className="space-y-3">
                  {testResults.tests.map((test: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {test.test}
                        </span>
                        <span
                          className={`font-semibold ${
                            test.status.includes("Pass")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {test.status}
                        </span>
                      </div>
                      {test.value && (
                        <div className="text-sm text-gray-600">
                          Value: <code className="bg-gray-100 px-2 py-0.5 rounded">{test.value}</code>
                        </div>
                      )}
                      {test.error && (
                        <div className="text-sm text-red-600 mt-2">
                          Error: {test.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Troubleshooting */}
              {!testResults.summary.includes("passed") && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Troubleshooting Steps
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
                    <li>
                      Ensure your backend API is running on{" "}
                      <code className="bg-yellow-100 px-1 py-0.5 rounded">
                        {testResults.backend_url}
                      </code>
                    </li>
                    <li>
                      Check that <code className="bg-yellow-100 px-1 py-0.5 rounded">.env.local</code> has the correct{" "}
                      <code className="bg-yellow-100 px-1 py-0.5 rounded">BACKEND_API_URL</code>
                    </li>
                    <li>Verify the backend endpoint <code className="bg-yellow-100 px-1 py-0.5 rounded">/cities/popular</code> exists</li>
                    <li>Check CORS settings on your backend</li>
                    <li>Restart both frontend and backend servers</li>
                  </ol>
                </div>
              )}

              {/* Retry Button */}
              <button
                onClick={runTests}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
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
            className="block p-4 bg-white border border-gray-200 rounded-lg text-center hover:border-gray-900 transition-colors"
          >
            ← Back to Homepage
          </a>
          <a
            href="/gold/agra"
            className="block p-4 bg-white border border-gray-200 rounded-lg text-center hover:border-gray-900 transition-colors"
          >
            Try Gold Page →
          </a>
        </div>
      </div>
    </div>
  );
}
