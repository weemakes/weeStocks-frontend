# Quick Start Guide - Halal Stock Precious Metals

Get the application running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Backend API server running (or URL available)
- Terminal/Command Prompt

## Step 1: Environment Setup

Copy the environment template:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your backend API URL:

```env
BACKEND_API_URL=http://localhost:3000
```

**Important**: Replace `http://localhost:3000` with your actual backend API URL.

## Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Recharts
- Lucide React

## Step 3: Run Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

## Step 4: Visit the Application

Open your browser and navigate to:

- **Homepage**: http://localhost:3000
- **Gold in Agra**: http://localhost:3000/gold/agra
- **Silver in Mumbai**: http://localhost:3000/silver/mumbai
- **Platinum in Delhi**: http://localhost:3000/platinum/delhi

## Expected Backend API Endpoints

Your backend must support these endpoints:

### Cities
```
GET /cities?search={query}
GET /cities/popular
```

### Metal Prices
```
GET /metals/latest-price?city_id={id}&metal={metal}
GET /metals/last-10days-data?city_id={id}&metal={metal}
GET /metals/fetch-history-data?city_slug={slug}&metal={metal}&unit={unit}&purity={purity}&duration={duration}
```

## Testing Without Backend

If your backend isn't ready yet, you can:

1. Create a mock API server
2. Use Next.js API routes to return mock data
3. Set up a proxy to a test environment

## Common Issues

### Backend Connection Failed

**Error**: `API request failed: Network error`

**Solution**: 
- Check `BACKEND_API_URL` in `.env.local`
- Verify backend server is running
- Check CORS settings on backend
- Ensure backend accepts requests from `http://localhost:3000`

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Use a different port
npm run dev -- -p 3001
```

### Build Fails

**Error**: TypeScript or lint errors

**Solution**:
```bash
# Check types
npx tsc --noEmit

# Run linter
npm run lint

# Fix lint issues automatically
npm run lint -- --fix
```

## Production Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Project Structure Overview

```
halal-stock-frontend/
├── app/                    # Next.js pages
│   ├── (metals)/          # Metal routes
│   ├── api/               # API proxy routes
│   └── page.tsx           # Homepage
│
├── features/metals/       # Metals feature module
│   ├── api/              # Server-side API layer
│   ├── components/       # React components
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities
│
├── .env.local            # Your environment config
└── package.json          # Dependencies
```

## Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # Run ESLint
```

## Key Features to Test

### 1. City Selection
- Click the city dropdown in the header
- Search for a city
- Select a different city
- Verify the URL changes and data updates

### 2. Metal Navigation
- Use the Gold | Silver | Platinum tabs
- Verify navigation works
- Check that the city persists across metals

### 3. Price Display
- View current prices for different purities (Gold only)
- Check price change indicators (↑ ↓)
- Verify all units are displayed

### 4. History Chart (Gold)
- Change purity (24K/22K/18K)
- Change unit (1g/8g/10g/100g)
- Change duration (1D/1W/1M/etc.)
- Verify chart updates

### 5. Last 10 Days Table
- View historical data
- Check all columns display correctly
- Verify date formatting

## Development Tips

### Hot Reload

The development server supports hot reload:
- Edit any file
- Save the file
- Changes appear automatically in browser

### TypeScript Errors

TypeScript errors will appear in:
- Terminal (during development)
- IDE/Editor (with TypeScript extension)
- Build output

### Component Inspection

Server Components vs Client Components:
- **Server Components**: Default, no `"use client"` directive
- **Client Components**: Have `"use client"` at the top

### Debugging

Enable detailed errors:
```typescript
// In next.config.ts
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
```

## Next Steps

1. ✅ Verify backend connectivity
2. ✅ Test all three metal types
3. ✅ Test city search and selection
4. ✅ Verify price data displays correctly
5. ✅ Test history charts (Gold)
6. ✅ Check responsive design on mobile
7. ✅ Review SEO metadata
8. ✅ Run production build

## Need Help?

Check the documentation:
- `README.md` - Complete project documentation
- `features/metals/README.md` - Feature-specific docs
- `IMPLEMENTATION.md` - Implementation details

## Quick Reference

### Environment Variables
```env
BACKEND_API_URL=http://localhost:3000
```

### Routes
- `/` - Homepage
- `/gold/[city]` - Gold page
- `/silver/[city]` - Silver page
- `/platinum/[city]` - Platinum page

### API Proxy Routes
- `/api/cities/search` - City search
- `/api/metals/history` - Chart data

That's it! You're ready to start developing. 🚀
