# figma-make-app

React + Vite + Tailwind CSS project running inside Figma Make, connected to a Laravel/MySQL backend in `backend/` (API only, no Blade views). The frontend fetches content from the API via `src/lib/api.ts` instead of static data wherever a Laravel-backed resource exists; only `NEWS`, `EVENTS` and `TEAM` in `src/data/content.ts` remain static.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and the usual starting point for UI work
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain version for Node.js
- `src/lib/api.ts` - fetch wrapper for the Laravel API (reads `VITE_API_URL`, attaches the Bearer token)
- `src/lib/auth.tsx` - `AuthProvider`, `useAuth()`, `RequireAuth`, `RequireAdmin` route guards
- `src/lib/settings.tsx` - parish-wide settings (WhatsApp number, social links) fetched from `/api/settings`
- `src/pages/admin/**` - the admin panel (mounted at `/admin`, gated by `RequireAdmin`)
- `backend/` - Laravel API (PHP 8.2, MySQL via XAMPP, Sanctum token auth); see `backend/routes/api.php` for every endpoint and `backend/database/seeders/` for starter data

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt
- Backend: Laravel (PHP 8.2), Laravel Sanctum, MySQL

## Backend / dev workflow

The Vite dev server proxies `/api` to `http://127.0.0.1:8001` (configurable via `VITE_API_PROXY_TARGET`). To run the full stack locally:

1. Start MySQL (e.g. `sudo /opt/lampp/lampp startmysql` if using XAMPP).
2. `cd backend && php artisan serve --host=127.0.0.1 --port=8001`
3. `npm run dev` at the repo root (already documented as always-on in this environment).

Admin panel: `/admin`, gated by a `role=admin` user (seeded by `backend/database/seeders/AdminUserSeeder.php`). Payment (boutique orders, donations) goes through `backend/app/Payments/PaymentProviderInterface.php` — currently a manual/guided provider (instructions + admin confirmation), swappable later for a real Orange Money/MTN MoMo integration without touching the Order/Donation flow.

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings. An unescaped apostrophe in a single-quoted string breaks the build.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.
