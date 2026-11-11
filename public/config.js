/*
 * Runtime frontend configuration.
 *
 * This file is copied to the root of the frontend build and is read by the
 * app before it starts. Edit it on the server if the API subdomain changes:
 * no rebuild is needed.
 *
 * Leave apiUrl empty during local development: the Vite dev server proxies
 * /api and /storage to http://127.0.0.1:8001. In production it must be the
 * absolute API root, including /api, for example:
 *
 *   apiUrl: "https://api.savio.example.com/api"
 */
window.__SAVIO_CONFIG__ = {
  apiUrl: "",
}
