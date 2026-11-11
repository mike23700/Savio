/**
 * Guard for production builds.
 *
 * The frontend and the Laravel API live on two different subdomains on IONOS,
 * so the bundle must contain an absolute API URL. Forgetting VITE_API_URL
 * would make the deployed site call /api on the frontend host and receive
 * index.html instead of JSON — a very confusing 200 response.
 *
 * Run through `npm run build:prod`, or directly:
 *   VITE_API_URL=https://api.example.com/api node scripts/check-production-env.mjs
 */

import { loadEnv } from "vite"

const cwd = process.cwd()

const fileEnv = loadEnv("production", cwd, "VITE_")
const raw = (process.env.VITE_API_URL || fileEnv.VITE_API_URL || "").trim()

const fail = (message) => {
  console.error(`\n✖ ${message}\n`)
  console.error(
    "Set VITE_API_URL to the absolute API root, for example:\n" +
      "  VITE_API_URL=https://api.savio.example.com/api npm run build:prod\n",
  )
  process.exit(1)
}

if (!raw) {
  fail("VITE_API_URL is empty.")
}

let url
try {
  url = new URL(raw)
} catch {
  fail(`VITE_API_URL is not a valid absolute URL: ${raw}`)
}

const isLocal =
  url.hostname === "localhost" ||
  url.hostname === "127.0.0.1" ||
  url.hostname === "::1"

if (url.protocol !== "https:" && !isLocal) {
  fail(`VITE_API_URL must use HTTPS in production (got ${url.protocol}).`)
}

if (url.search || url.hash) {
  fail("VITE_API_URL must not contain a query string or a hash.")
}

if (!url.pathname.replace(/\/+$/, "").endsWith("/api")) {
  fail("VITE_API_URL must end with /api (Laravel's API prefix).")
}

if (isLocal) {
  console.warn(
    `⚠ VITE_API_URL points to ${url.origin}; this build is only usable for local testing.`,
  )
}

console.log(`✓ API URL: ${url.origin}${url.pathname.replace(/\/+$/, "")}`)
