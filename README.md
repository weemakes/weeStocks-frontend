# Halal Stock - Precious Metals Platform

A modern Next.js application for tracking precious metal (Gold, Silver, Platinum) prices across Indian cities.

## Features

- **Real-time Price Data**: Current prices for Gold, Silver, and Platinum
- **City-Specific Prices**: View prices for major Indian cities
- **Multiple Purities**: Gold prices for 24K, 22K, and 18K
- **Multiple Units**: Prices for 1g, 8g, 10g, 100g, and 1kg
- **Historical Data**: Last 10 days price history
- **Interactive Charts**: Gold price history visualization with customizable parameters
- **Server-Side Rendering**: Fast initial page loads with SEO optimization
- **Responsive Design**: Mobile-first design with desktop optimization

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React

## Architecture

### Server-First Design

- Backend APIs are not exposed to the browser
- Server Components fetch data server-side
- Client Components only for interactive features
- Next.js API Routes act as a secure proxy layer

### Feature-Based Structure

```
app/
├── (metals)/           # Metal routes
│   └── [metal]/
│       ├── page.tsx           # Metal index
│       └── [citySlug]/
│           └── page.tsx       # Metal city page
├── api/                # API routes (proxy layer)
│   ├── cities/
│   └── metals/
└── layout.tsx          # Root layout

features/
└── metals/             # Metals feature module
    ├── api/           # Server-side API functions
    ├── components/    # React components
    ├── types/         # TypeScript types
    └── utils/         # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API server running

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd halal-stock-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and set your backend API URL:
```
BACKEND_API_URL=http://localhost:3000
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

Build for production:

```bash
npm run build
npm start
```

## Routes

- `/` - Homepage
- `/gold` - Gold index (redirects to default city)
- `/gold/[citySlug]` - Gold prices for specific city (e.g., `/gold/agra`)
- `/silver/[citySlug]` - Silver prices for specific city
- `/platinum/[citySlug]` - Platinum prices for specific city

## Backend API Requirements

The application expects the following API endpoints:

### Cities
- `GET /cities` - Search cities
- `GET /cities/popular` - Get popular cities

### Metal Prices
- `GET /metals/latest-price?city_id={id}&metal={metal}` - Latest prices
- `GET /metals/last-10days-data?city_id={id}&metal={metal}` - Last 10 days
- `GET /metals/fetch-history-data` - History chart data

See `features/metals/README.md` for detailed API documentation.

## Configuration

### Metal Configuration

Each metal can be configured independently in `features/metals/types/metal.types.ts`:

```typescript
const metalConfig = {
  gold: {
    purityOptions: ["24K", "22K", "18K"],
    units: ["1g", "8g", "10g", "100g"],
    historyEnabled: true,
    // ...
  }
}
```

### Caching Strategy

- Popular cities: 1 hour
- Latest prices: 5 minutes
- Last 10 days: 1 hour
- History data: 30 minutes

## Project Structure

```
halal-stock-frontend/
├── app/                # Next.js App Router
├── features/           # Feature modules
│   └── metals/        # Precious metals feature
├── public/            # Static assets
├── .env.local         # Environment variables (not committed)
├── .env.example       # Environment template
├── next.config.ts     # Next.js configuration
├── tailwind.config.ts # Tailwind configuration
└── tsconfig.json      # TypeScript configuration
```

## Key Design Principles

1. **Server-First**: Use Server Components by default
2. **Type Safety**: Full TypeScript coverage
3. **Reusability**: Shared components for all metals
4. **Configuration-Driven**: No code duplication
5. **Performance**: Strategic caching at multiple levels
6. **SEO-Friendly**: Server-side rendering with dynamic metadata
7. **Security**: Backend APIs never exposed to browser

## Development Guidelines

### Adding a New Metal

To add a new precious metal:

1. Update the `Metal` type in `features/metals/types/metal.types.ts`
2. Add configuration to `METAL_CONFIG`
3. Routes will automatically work!

### Creating New Components

- Place shared components in `features/metals/components/`
- Use Server Components by default
- Add `"use client"` directive only when needed
- Export from `index.ts` for easy imports

### API Integration

- Add server functions to `features/metals/api/`
- Use the `apiRequest` helper for HTTP calls
- Transform responses using mappers in `utils/mappers.ts`
- Never expose backend URLs to client components

## Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Build test
npm run build
```

## Deployment

The application can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- Any Node.js hosting platform

Make sure to set the `BACKEND_API_URL` environment variable in your deployment platform.

## Contributing

1. Follow the existing code structure
2. Maintain type safety
3. Use Server Components when possible
4. Add error handling
5. Update documentation

## License

[Your License Here]

## Support

For detailed feature documentation, see `features/metals/README.md`.
