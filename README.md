# Donation.Box

Decentralized crowdfunding on Solana — transparent, global, and community-powered.

Create fundraising campaigns, accept SOL donations directly to your wallet, and track your impact — all on-chain with no intermediaries.

## Features

- **Campaign creation** — Start a campaign with a story, goal amount, category, and media
- **SOL donations** — Donate via Phantom or Backpack wallets through Solana Actions
- **Real-time progress** — Live donation feed with animated progress visualization
- **Impact feed** — Social-style feed where donations can be liked and commented on
- **Solana Actions / BLINKS** — Shareable donation links that work across the Solana ecosystem
- **Creator dashboard** — Manage campaigns, view donor activity, and track progress
- **Partner system** — Verified NGO/INGO profiles with admin management
- **Glassmorphism UI** — Custom design system with glass effects, liquid animations, and smooth transitions

## Tech Stack

**Next.js 16** (App Router) · **React 19** · **TypeScript** · **Solana Web3.js** · **Solana Actions** · **Tailwind CSS v4** · **Framer Motion** · **Vitest**

## Getting Started

```bash
git clone <repo-url>
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint (defaults to devnet) |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Cluster name: `devnet`, `testnet`, or `mainnet-beta` |
| `NEXT_PUBLIC_DONATION_RECIPIENT` | Fallback wallet for mock-campaign donations |
| `ADMIN_WALLET` | Admin wallet authorized to manage partner profiles |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests (Vitest) |

## Project Structure

```
app/               App Router pages and API routes
├── campaign/      Campaign detail page
├── create/        Campaign creation form
├── explore/       Browse campaigns
├── dashboard/     Creator dashboard
├── impact/        Donation impact feed
├── blink-preview/ Solana Action BLINK preview
├── api/           API routes (donate, partners, feed, upload)
└── layout.tsx     Root layout with providers

components/        React components
├── campaigns/     Campaign cards, donation panel, progress visualizer
├── ui/            Design system (Button, Card, Modal, Glass, Toast, etc.)
├── hero/          Landing page hero
├── layout/        Footer, background, filter defs
├── solana/        Wallet provider
└── impact/        Impact feed components

lib/               Utilities and business logic
├── server/        Server-side repositories and admin helpers
├── design-system/ Theme tokens, animations, theme provider
└── ...            Campaign store, categories, blink generator, explorer helpers

data/              JSON data files (campaigns, partners)
```

## Routes

| Path | Page |
|---|---|
| `/` | Landing page |
| `/campaign/[id]` | Campaign detail |
| `/create` | Create a campaign |
| `/explore` | Browse all campaigns |
| `/dashboard` | Creator dashboard |
| `/impact` | Donation impact feed |
| `/faq` | Frequently asked questions |
| `/terms` | Terms of service |
| `/docs` | Documentation |
| `/blink-preview/[id]` | BLINK preview |
