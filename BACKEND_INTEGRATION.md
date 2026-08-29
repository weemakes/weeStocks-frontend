# Backend Integration Guide

## Current Issue

The frontend is trying to connect to the backend API but getting connection errors. The error "Cannot read properties of undefined (reading 'length')" indicates that the API calls are failing.

## Quick Diagnosis

Visit the debug page to check backend connectivity:

**http://localhost:3001/debug**

This page will show:
- ✓ Environment variable configuration
- ✓ Backend reachability test
- ✗ Specific error messages
- 📋 Troubleshooting steps

## Backend API Requirements

Your backend must be running on `http://localhost:3000` (or the URL in `.env.local`) and provide these endpoints:

### 1. Get Popular Cities
```
GET /cities/popular
```

**Expected Response:**
```json
{
  "cities": [
    {
      "id": 1,
      "name": "Agra",
      "slug": "agra",
      "state": "Uttar Pradesh",
      "is_popular": true
    },
    {
      "id": 2,
      "name": "Jaipur",
      "slug": "jaipur",
      "state": "Rajasthan",
      "is_popular": true
    }
  ]
}
```

### 2. Search Cities
```
GET /cities?search={query}&only_metals=true
```

**Expected Response:**
```json
{
  "cities": [
    {
      "id": 1,
      "name": "Agra",
      "slug": "agra",
      "state": "Uttar Pradesh"
    }
  ]
}
```

### 3. Get Latest Metal Price
```
GET /metals/latest-price?city_id=1&metal=gold
```

**Expected Response:**
```json
{
  "metal": "gold",
  "city_id": 1,
  "city_name": "Agra",
  "date": "2026-08-23",
  "prices": [
    {
      "purity": "24K",
      "unit": "1g",
      "price": 7500,
      "previous_price": 7450,
      "change": 50,
      "change_direction": "up"
    },
    {
      "purity": "22K",
      "unit": "1g",
      "price": 6875,
      "previous_price": 6850,
      "change": 25,
      "change_direction": "up"
    }
  ]
}
```

### 4. Get Last 10 Days Data
```
GET /metals/last-10days-data?city_id=1&metal=gold
```

**Expected Response:**
```json
{
  "metal": "gold",
  "city_id": 1,
  "data": [
    {
      "date": "2026-08-23",
      "prices": [
        {
          "purity": "24K",
          "unit": "1g",
          "price": 7500
        },
        {
          "purity": "22K",
          "unit": "1g",
          "price": 6875
        }
      ]
    }
  ]
}
```

### 5. Get History Chart Data
```
GET /metals/fetch-history-data?city_slug=agra&metal=gold&unit=1g&purity=24K&duration=1w
```

**Expected Response:**
```json
{
  "metal": "gold",
  "city_slug": "agra",
  "unit": "1g",
  "purity": "24K",
  "duration": "1w",
  "data": [
    {
      "date": "2026-08-17",
      "price": 7400
    },
    {
      "date": "2026-08-18",
      "price": 7425
    },
    {
      "date": "2026-08-19",
      "price": 7450
    }
  ]
}
```

## Common Issues & Solutions

### Issue 1: Connection Refused

**Error:** `Network error: fetch failed`

**Cause:** Backend server is not running

**Solution:**
```bash
# Start your backend server on port 3000
cd /path/to/backend
npm start
# or
python manage.py runserver
# or
./your-backend-command
```

### Issue 2: Wrong Port

**Error:** `API request failed: 404 Not Found`

**Cause:** Backend is running on a different port

**Solution:** Update `.env.local`
```env
BACKEND_API_URL=http://localhost:8000  # or whatever port your backend uses
```

Then restart the frontend:
```bash
npm run dev:3001
```

### Issue 3: CORS Error

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Cause:** Backend doesn't allow requests from frontend

**Solution:** Configure CORS on your backend to allow `http://localhost:3001`

**Example (Express.js):**
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3001'
}));
```

**Example (Django):**
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3001",
]
```

### Issue 4: Endpoint Not Found

**Error:** `API request failed: 404 Not Found`

**Cause:** Backend endpoint doesn't match expected path

**Solution:** Verify your backend routes match exactly:
- `/cities/popular` (not `/api/cities/popular`)
- `/cities?search=` (not `/cities/search`)
- `/metals/latest-price`
- etc.

### Issue 5: Wrong Response Format

**Error:** Data displays incorrectly or causes errors

**Cause:** Backend response doesn't match expected format

**Solution:** Ensure your backend returns data in the exact format shown above, especially:
- Return `cities` array, not just array
- Include all required fields (`id`, `name`, `slug`)
- Use correct field names (snake_case as shown)

## Testing Backend Manually

Test each endpoint with curl:

```bash
# Test popular cities
curl http://localhost:3000/cities/popular

# Test city search
curl http://localhost:3000/cities?search=agra

# Test latest price
curl http://localhost:3000/metals/latest-price?city_id=1&metal=gold

# Test last 10 days
curl http://localhost:3000/metals/last-10days-data?city_id=1&metal=gold

# Test history data
curl http://localhost:3000/metals/fetch-history-data?city_slug=agra&metal=gold&unit=1g&purity=24K&duration=1w
```

All should return valid JSON responses.

## Checking Frontend Logs

Look for API request logs in your terminal where you ran `npm run dev:3001`:

```
[API Request] GET http://localhost:3000/cities/popular
[API Response] http://localhost:3000/cities/popular - Status: 200
[API Success] http://localhost:3000/cities/popular - Data received
```

Or errors like:
```
[API Network Error] http://localhost:3000/cities/popular - fetch failed
```

## Environment Configuration

Your `.env.local` should contain:

```env
BACKEND_API_URL=http://localhost:3000
```

**Important Notes:**
- No trailing slash
- Use the correct protocol (http vs https)
- Use the correct port
- This is server-side only (not exposed to browser)

## Restart Checklist

When you make changes, restart in this order:

1. ✓ Update `.env.local` if needed
2. ✓ Restart backend server
3. ✓ Restart frontend server (Ctrl+C, then `npm run dev:3001`)
4. ✓ Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
5. ✓ Check `/debug` page
6. ✓ Try navigating to `/gold/agra`

## Mock Backend (Temporary Solution)

If your backend isn't ready, you can temporarily mock the responses by modifying the server API functions in `features/metals/api/` to return hardcoded data.

Example:
```typescript
// features/metals/api/cities.server.ts
export async function getPopularCities(): Promise<City[]> {
  // Temporary mock data
  return [
    { id: 1, name: "Agra", slug: "agra", state: "UP" },
    { id: 2, name: "Jaipur", slug: "jaipur", state: "Rajasthan" },
    { id: 3, name: "Mumbai", slug: "mumbai", state: "Maharashtra" },
  ];
}
```

## Next Steps

1. **Visit `/debug`** - Check connection status
2. **Verify backend is running** - Test with curl
3. **Check response format** - Ensure it matches expected structure
4. **Review CORS settings** - Allow frontend origin
5. **Check terminal logs** - Look for API request/response logs
6. **Test each endpoint** - One at a time

## Need Help?

Common commands:
```bash
# Check what's running on port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Check frontend dev server
http://localhost:3001

# Check debug page
http://localhost:3001/debug

# View backend directly
http://localhost:3000/cities/popular
```

The frontend is now more robust and will show helpful error messages instead of crashing when the backend is unreachable.
