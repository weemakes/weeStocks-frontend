# UI Requirements - GoodReturns Style

Based on https://www.goodreturns.in/gold-rates/

## Page Structure

### 1. Header Section
- Site logo and navigation
- Breadcrumb trail
- Page title: "Gold Rate Today in India"
- Last updated timestamp
- City selector dropdown

### 2. Top Price Cards (Highlight Section)
- Large cards showing:
  - 24K Gold price
  - 22K Gold price
  - Today's change (with up/down indicator)
- Prominent display with visual hierarchy

### 3. Quick Price Table (Today's Rates)
- Compact table showing:
  - Weight columns (1g, 8g, 10g, 100g)
  - Purity rows (24K, 22K, 18K)
  - Grid layout with clear borders

### 4. Price Chart
- Interactive line chart
- Date range selector (1D, 1W, 1M, 3M, 6M, 1Y)
- Purity selector (24K, 22K, 18K)
- Weight selector (1g, 8g, 10g, 100g)
- Hover tooltip showing exact price and date

### 5. City-wise Price Table
- List of major Indian cities with prices
- Columns:
  - City name
  - 24K price
  - 22K price
  - Change indicator
- Clickable rows to switch cities

### 6. Last 10 Days Table
- Date in first column
- 24K and 22K prices
- Change indicators for each day
- Alternating row colors for readability

### 7. FAQ Section
- Common questions about gold prices
- Expandable/collapsible sections
- SEO-optimized content

### 8. Additional Info Sections
- Factors affecting gold prices
- How to check purity
- Investment tips
- Market analysis

## Key UI Features

### Design Elements
- Clean, minimal design
- White background with light gray sections
- Green for positive changes, Red for negative
- Clear typography hierarchy
- Card-based layout
- Responsive grid system

### Interactive Elements
- City search with autocomplete
- Chart interactions (zoom, pan, tooltip)
- Expandable FAQ items
- Clickable table rows
- Smooth transitions and animations

### Color Scheme
- Primary: Dark blue/black for text
- Success: Green (#00A651 or similar)
- Danger: Red (#E74C3C or similar)
- Background: White (#FFFFFF)
- Secondary BG: Light gray (#F8F9FA)
- Borders: Light gray (#DEE2E6)

### Typography
- Headings: Bold, larger sizes
- Prices: Prominent, bold, larger
- Body text: Regular weight, readable size
- Changes: Colored, with arrows

## Mobile Responsiveness
- Stack cards vertically on mobile
- Horizontal scroll for wide tables
- Collapsible navigation
- Touch-friendly buttons and selectors
- Optimized chart for mobile viewing

## Priority Features for MVP

### P0 (Must Have)
1. ✅ City selector
2. ✅ Current price display
3. ✅ Price table (purity x weight)
4. ✅ Interactive chart
5. ✅ Last 10 days table
6. City-wise prices table
7. Basic styling to match design

### P1 (Should Have)
1. FAQ section
2. Additional info sections
3. Better mobile responsiveness
4. Loading states
5. Error states
6. Animations and transitions

### P2 (Nice to Have)
1. Price alerts
2. Compare cities
3. Export data
4. Share functionality
5. Print-friendly view
6. Dark mode

## Next Steps

1. Fix current errors (metal config issue)
2. Get page fully functional with data
3. Update styling to match GoodReturns
4. Add missing components (city-wise table, FAQ)
5. Polish and optimize
6. Test on mobile devices
