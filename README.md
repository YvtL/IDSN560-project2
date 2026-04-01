# Justice Park Behavioral Operations Program (JPBOP)

A TCKR Systems Experience — Interactive narrative prototype for IDSN560 Narratives & Storytelling.

A browser-based speculative ARG that presents as a corporate recruitment portal for a justice-park operations program. The player moves from social media entry to job application to a monitoring dashboard to a personal email reveal, gradually discovering they have been participating in — not just observing — a ritualized punishment cycle.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Production build

```bash
npm run build
npm start
```

## Deploy

This project is configured for Vercel. Push to GitHub and import at [vercel.com/new](https://vercel.com/new).

No environment variables required — all data is local mock/JSON.

## Tech stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- localStorage for session persistence
