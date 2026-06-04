# Sport Shop

Next.js e-commerce app for sports gear — customer storefront and administrator panel.

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
npm install
cp .env.example .env
# Edit .env and set NEXT_PUBLIC_API_URL to your API
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm run start`| Production server        |
| `npm run lint` | ESLint                   |

## Branches

- **`main`** — primary branch (production-ready code)
- `feature/product-management` — feature work (merge via PR into `main`)

## Project structure

- `src/app/(customer)/` — shop, cart, checkout, profile
- `src/app/administrator/` — dashboard, products, orders, users
- `src/redux/` — client state (auth, cart, catalog)
- `src/services/` — API clients
