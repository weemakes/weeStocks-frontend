# Precious Metals Feature

This module provides comprehensive precious metal (Gold, Silver, Platinum) price information across Indian cities.

## Architecture

### Feature-Based Structure

```
features/metals/
├── api/                    # Server-side API layer
│   ├── api-client.ts      # HTTP client with error handling
│   ├── cities.server.ts   # City data API functions
│   ├── metals.server.ts   # Metal price API functions
│   └── index.ts
│
├── components/             # React components
│   ├── CitySelector.tsx   # City selection dropdown (Client)
│   ├── MetalSelector.tsx  # Metal navigation tabs (Client)
│   ├── PriceChange.tsx    # Price change indicator (Server)
│   ├── MetalPriceCard.tsx # Price display card (Server)
│   ├── MetalPriceTable.tsx    # Full price table (Server)
│   ├── Last10DaysTable.tsx    # Historical table (Server)
│   ├── HistoryChart.tsx       # Chart visualization (Client)
│   ├── HistoryControls.tsx    # Chart controls (Client)
│   ├── HistoryChartSection.tsx # Complete chart section (Client)
│   └── index.ts
│
├── types/                  # TypeScript type definitions
│   ├── metal.types.ts     # Metal, purity, unit types
│   ├── city.types.ts      # City data types
│   ├── price.types.ts     # Price and chart data types
│   └── index.ts
│
├── utils/                  # Utility functions
│   ├── format.ts          # Formatting functions
│   ├── mappers.ts         # API response transformers
│   └── index.ts
│
└── README.md              # This file
```

## Routes

### Metal Pages

- `/gold` - Gold index (redirects to default city)
- `/gold/[citySlug]` - Gold prices for specific city
- `/silver/[citySlug]` - Silver prices for specific city
- `/platinum/[citySlug]` - Platinum prices for specific city

### API Routes

- `/api/cities/search?query=` - Client-side city search
- `/api/metals/history?params=` - Client-side chart data fetching

## Server vs Client Components

### Server Components (Default)
- Main page layout
- Price displays
- Price tables
- Last 10 days table
- SEO content

### Client Components
- City selector (interactive dropdown)
- Metal selector (navigation tabs)
- History chart (interactive visualization)
- Chart controls (purity, unit, duration selectors)

## Data Flow

### Initial Page Load (SSR)

```
User Request
    ↓
Next.js Server
    ↓
Server Components fetch data
    ├── City data
    ├── Latest prices
    ├── Last 10 days
    └── Initial chart data
    ↓
HTML with data rendered
    ↓
Browser receives complete page
```

### Interactive Chart Updates

```
User changes chart controls
    ↓
Client Component state update
    ↓
Fetch from /api/metals/history
    ↓
Next.js API Route
    ↓
Server-side API call
    ↓
Backend API
    ↓
Transform and return data
    ↓
Update chart visualization
```

## Configuration

### Metal Configuration

Each metal has a configuration object:

```typescript
{
  name: "gold",
  displayName: "Gold",
  purityOptions: ["24K", "22K", "18K"],
  units: ["1g", "8g", "10g", "100g"],
  historyEnabled: true,
  defaultPurity: "24K",
  defaultUnit: "1g",
  defaultDuration: "1w",
}
```

### Environment Variables

Required server-side environment variable:

```
BACKEND_API_URL=http://localhost:3000
```

**Important:** This is server-only and NOT exposed to the browser.

## Backend API Endpoints

### Cities

- `GET /cities` - Search cities
- `GET /cities/popular` - Get popular cities

### Metal Prices

- `GET /metals/latest-price?city_id={id}&metal={metal}` - Latest prices
- `GET /metals/last-10days-data?city_id={id}&metal={metal}` - Last 10 days
- `GET /metals/fetch-history-data?city_slug={slug}&metal={metal}&unit={unit}&purity={purity}&duration={duration}` - History chart data

## Caching Strategy

- **Popular cities**: 1 hour cache
- **City search**: No cache (real-time search)
- **Latest prices**: 5 minutes cache
- **Last 10 days**: 1 hour cache
- **History data**: 30 minutes cache

## Adding a New Metal

To add a new metal (e.g., "palladium"):

1. Add type to `metal.types.ts`:
   ```typescript
   export type Metal = "gold" | "silver" | "platinum" | "palladium";
   ```

2. Add configuration to `METAL_CONFIG`:
   ```typescript
   palladium: {
     name: "palladium",
     displayName: "Palladium",
     purityOptions: [],
     units: ["1g", "8g", "10g", "100g", "1kg"],
     historyEnabled: false,
     defaultUnit: "1g",
     defaultDuration: "1w",
   }
   ```

3. The routes will automatically work: `/palladium/[citySlug]`

No component changes needed - the architecture is fully reusable!

## Key Design Principles

1. **Server-First**: Use Server Components by default, Client Components only for interactivity
2. **API Isolation**: Backend API never exposed directly to browser
3. **Type Safety**: Full TypeScript coverage with strict types
4. **Reusability**: Single codebase for all three metals
5. **Configuration-Driven**: Metal differences handled through config, not duplication
6. **Performance**: Strategic caching at multiple levels
7. **SEO-Friendly**: Server-side rendering with dynamic metadata
8. **Responsive**: Mobile-first design with desktop optimization

## Testing the Feature

### Development

```bash
npm run dev
```

Then visit:
- http://localhost:3000 (homepage)
- http://localhost:3000/gold/agra
- http://localhost:3000/silver/mumbai
- http://localhost:3000/platinum/delhi

### Production Build

```bash
npm run build
npm start
```

## Error Handling

- API errors are caught and logged
- Empty states displayed for missing data
- Loading states for async operations
- Graceful fallbacks for failed requests
- User-friendly error messages

## Future Enhancements

- [ ] Add more cities dynamically
- [ ] Enable history charts for Silver/Platinum
- [ ] Add price alerts
- [ ] Compare prices across cities
- [ ] Add export functionality (PDF, CSV)
- [ ] Add price calculators
- [ ] Implement real-time price updates (WebSocket)
- [ ] Add authentication for personalized features
