/**
 * Test Backend Connection
 * Simple endpoint to verify backend API connectivity
 */

import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3000";

export async function GET() {
  const tests = [];

  // Test 1: Check environment variable
  tests.push({
    test: "Environment Variable",
    status: BACKEND_API_URL ? "✓ Pass" : "✗ Fail",
    value: BACKEND_API_URL,
  });

  // Test 2: Try to reach backend
  let backendReachable = false;
  let backendError = null;

  try {
    const response = await fetch(`${BACKEND_API_URL}/cities/popular`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    backendReachable = response.ok;
    
    if (!response.ok) {
      backendError = `Status: ${response.status} ${response.statusText}`;
    }
  } catch (error) {
    backendError = error instanceof Error ? error.message : "Unknown error";
  }

  tests.push({
    test: "Backend /cities/popular",
    status: backendReachable ? "✓ Pass" : "✗ Fail",
    error: backendError,
  });

  return NextResponse.json({
    backend_url: BACKEND_API_URL,
    tests,
    summary: tests.every((t) => t.status.includes("Pass"))
      ? "All tests passed ✓"
      : "Some tests failed ✗",
  });
}
