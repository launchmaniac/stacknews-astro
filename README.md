# StackNews

Real-time information aggregator with cyber-terminal aesthetic.

Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com

## Project Structure

```text
/
├── public/
├── src/
│   ├── components/
│   │   ├── astro/       # Astro components (Header, FeedPanel, StatCard, etc.)
│   │   └── react/       # React islands (Ticker, Clock, FeedLoader, etc.)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── constants.ts # Feed configurations
│   │   ├── feeds.ts     # RSS feed fetching logic
│   │   └── types.ts     # TypeScript interfaces
│   ├── pages/
│   │   ├── api/         # Server-side API endpoints
│   │   └── index.astro  # Main dashboard
│   └── styles/
│       └── global.css   # Design system tokens and styles
└── package.json
```

## Commands

All commands are run from the root of the project:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start local dev server at `localhost:4321`   |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview build locally before deploying       |

## Deployment

Deployed to Cloudflare Pages at stacknews.org

## Tech Stack

- Astro (SSR mode)
- React (client islands)
- Tailwind CSS v4
- Cloudflare Pages/Workers
