# Home Feature

The home feature is the main storefront/landing page of the Notwo app.

## Structure

```
home/
├── screens/
│   └── HomeScreen.tsx      # Main home screen
├── components/
│   ├── HeroBanner.tsx       # KYS call-to-action banner
│   ├── ProductCard.tsx      # Product display card
│   ├── EssentialsBanner.tsx # Essentials kit promotion
│   └── NewFormulations.tsx  # New products section
├── hooks/
│   └── useProducts.ts       # Product data management
├── data/
│   └── products.ts          # Static product data
├── types.ts                 # Feature type definitions
├── index.ts                 # Barrel export
└── README.md                # This file
```

## Components

### HomeScreen
Main screen component that orchestrates the home page layout.

**Features:**
- Hero banner with KYS scanner integration
- Bestsellers product grid
- Essentials kit promotion
- New formulations section
- Search and KYS modals

### HeroBanner
Call-to-action banner promoting the KYS (Know Your Skin) AI analysis feature.

### ProductCard
Displays individual product information with add-to-cart functionality.

### EssentialsBanner
Promotional banner for the curated essentials kit bundle.

### NewFormulations
Section displaying new product releases.

## Hooks

### useProducts
Manages product data fetching and state.

**Returns:**
- `products`: Array of product items
- `loading`: Loading state
- `error`: Error message if any
- `refetch`: Function to reload data

**Future:**
- Ready for TanStack Query integration
- API endpoint connection
- Caching and invalidation

## Data Flow

```
Static Data (data/products.ts)
    ↓
useProducts Hook
    ↓
HomeScreen
    ↓
Product Components
```

## Usage

```typescript
import { HomeScreen } from '@/features/home';

// In route file
export default function HomeRoute() {
  return <HomeScreen />;
}
```

## Future Enhancements

- [ ] Connect to real product API
- [ ] Implement TanStack Query for caching
- [ ] Add product filtering/sorting
- [ ] Add personalized recommendations
- [ ] Implement wishlist functionality
- [ ] Add product quick view
- [ ] Analytics tracking
