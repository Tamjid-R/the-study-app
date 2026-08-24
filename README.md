# The Study — a focus & practice journal

A personal productivity app that combines a customizable Pomodoro timer, a
spontaneous-speaking practice tool ("Articulate"), and analytics for both —
wrapped in a calm, vintage, academic-journal aesthetic instead of a generic
SaaS dashboard.

Everything runs entirely in your browser. There is no backend, no login, and
no external service: all history and settings are stored locally via
**IndexedDB**, so your data stays on your device and survives refreshes and
browser restarts.

---

## Features

**Pomodoro**
- Fully customizable focus / short break / long break durations and how many
  focus sessions happen before a long break
- Session naming ("Database Assignment", "Study Statistics", …)
- Large timer with start / pause / reset / skip, clear focus vs. break state
- Accurate even if the tab is backgrounded or minimized — the timer is driven
  by absolute timestamps, not a naive per-second countdown, and resumes
  correctly after a page refresh or navigating to another page of the app
- Automatic transition from focus → break → focus, cycling long breaks in on
  schedule
- Only fully completed focus sessions count toward your statistics;
  interrupted sessions are still recorded but marked as such

**Analytics**
- Today / Week / Month / Year views of your Pomodoro history
- Interactive bar charts (hover a bar for date, session count, and time
  focused) and an hourly "today's rhythm" chart
- Updates immediately whenever a session completes

**Articulate**
- Generates a random speaking topic from a large, varied bank spanning
  science, history, philosophy, culture, hypotheticals, debatable questions,
  and more
- 1-minute (fully customizable) speaking timer with start / pause / reset
- A topic is only recorded to your practice history if you actually start the
  timer **and** speak for more than 5 seconds — just generating a topic and
  moving on records nothing

**Speaking History**
- Log of every recorded attempt: topic, date, target duration, actual
  duration, and whether you hit the target
- Summary stats: topics attempted, completed, total speaking time, average
  duration, longest session, and today/week/month counts

**Settings**
- Timer durations (focus, short break, long break, sessions before long
  break, Articulate duration)
- Four vintage themes (Parchment, Midnight Library, Forest Study, Sepia Ink)
- Four classic serif typefaces (EB Garamond, Libre Baskerville, Georgia,
  Spectral)
- Comfortable / compact density
- Export your entire history and settings to a single JSON file, import it
  back (e.g. on another device or browser), or clear everything with a
  confirmation prompt

---

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for dev/build tooling
- [React Router](https://reactrouter.com/) (`HashRouter`, so it works
  unmodified on GitHub Pages) for the three main pages + history + settings
- [Recharts](https://recharts.org/) for the analytics charts
- Native **IndexedDB** for storage — no external database, no backend
- Plain CSS with a small design-token system (no UI framework) for the
  vintage/academic look

---

## Project structure

```
src/
  components/        Reusable UI: Sidebar, Timer, Charts, Buttons, Settings controls, ...
  contexts/          SettingsContext, DataContext, PomodoroContext (app-wide state)
  data/topics.ts     The Articulate topic bank
  db/db.ts           Minimal IndexedDB wrapper
  hooks/             useTimestampTimer — the drift-proof countdown timer
  pages/             Pomodoro, Articulate, Analytics, SpeakingHistory, Settings
  utils/             time formatting, stats aggregation, JSON export/import
```

---

## Getting started locally

Requires [Node.js](https://nodejs.org/) 18 or later.

```bash
# 1. Install dependencies
npm install

# 2. Start the local dev server (with hot reload)
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Building for production

```bash
npm run build
```

This type-checks the project and outputs a static site to `dist/`. You can
preview the production build locally with:

```bash
npm run preview
```

---

## Deploying to GitHub Pages

This repo includes a ready-to-use GitHub Actions workflow at
`.github/workflows/deploy.yml` that builds the app and publishes `dist/` to
GitHub Pages automatically on every push to `main`.

**One-time setup:**

1. Push this project to a GitHub repository.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push (or re-run the workflow from the **Actions** tab) — the site will be
   built and deployed automatically. The deployed URL appears on the
   **Actions** run summary and under **Settings → Pages**.

No additional configuration is required: the app uses a relative Vite
`base: './'` and React Router's `HashRouter`, so it works correctly whether
it's hosted at a domain root or under a GitHub Pages project path like
`https://<username>.github.io/<repo>/` — there's nothing to edit for your
specific repo name.

### Deploying elsewhere

Because this is a static site, the contents of `dist/` after `npm run build`
can be hosted anywhere that serves static files — Netlify, Vercel, Cloudflare
Pages, an S3 bucket, or your own server. No server-side configuration or
environment variables are needed.

---

## Data & privacy

All Pomodoro sessions, Articulate practice history, and settings are stored
in your browser's IndexedDB. Nothing is sent to a server. This also means:

- Data is per-browser, per-device. Opening the app in a different browser or
  on a different device starts with a fresh, empty history.
- Clearing your browser's site data for this app will erase your history.
- Use **Settings → Export data** periodically, or before switching browsers
  or devices, to keep a backup you can restore with **Settings → Import
  data**.

---

## Browser support

Any modern browser with IndexedDB support (Chrome, Firefox, Safari, Edge —
desktop and mobile). The layout is fully responsive: a persistent sidebar on
larger screens, and a hamburger-menu drawer on phones and narrow tablets.

---

## What's new since v1

- **315+ Articulate topics** spanning mythology, movies, opinions & controversial
  opinions, one-word prompts, one-liners, internet culture, ethics, life
  questions, fashion & style, career, technology/CSE/AI, and math — with a
  **shuffle-bag mechanism** that cycles through every topic once before any
  repeat, instead of pure random selection.
- **Session tags** (Work / Study / Reading / Writing / Coding / Other) on
  Pomodoro sessions, with a time-by-tag breakdown on the Analytics Overview
  tab.
- **Session name autocomplete** — recent names you've used are suggested as
  you type.
- **Sound & browser notifications** when a focus session or break ends,
  configurable in Settings (uses the Web Audio API directly, no audio files
  to load).
- **Daily goal + progress ring** on the Pomodoro page.
- **Analytics "Overview" tab**: a combined Pomodoro + Articulate dashboard
  with a GitHub-style yearly focus heatmap, a "best time of day" insight, and
  the tag breakdown.
- **Non-persistent sidebar** — now a toggleable overlay drawer on every
  screen size (not just mobile), so the main content always has full width.
- **7 new themes**: Noir Orchid (pink/purple on black), Blue Hour (blue on
  black), Neobrutalist, Panel Pop (comic-panel style), Dark Fantasy
  (near-pure black), Vintage Vibe, and Level Up Academy — 11 themes total.
- **Subtle page-turn transition** between sections.

See `TODO.md` in this repo for what's still on the table.
