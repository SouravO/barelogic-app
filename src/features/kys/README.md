# KYS (Know Your Skin) Feature

AI-powered skin analysis feature using Google Gemini Vision API to provide personalized skincare recommendations.

## Structure

```
kys/
├── screens/
│   └── KysScreen.tsx           # Main KYS screen
├── components/
│   └── KysScannerModal.tsx     # Camera/image picker modal with analysis
├── hooks/
│   └── useKysAnalysis.ts       # Analysis state management hook
├── services/
│   └── geminiApi.ts            # Google Gemini API integration
├── types.ts                     # Feature type definitions
├── index.ts                     # Barrel export
└── README.md                    # This file
```

## Features

### AI Skin Analysis
- Multi-angle facial image capture (1-5 images)
- Google Gemini 2.5 Flash vision model
- Comprehensive skin assessment
- Personalized product recommendations

### Analysis Metrics
- **Overall Score**: 0-100 skin health rating
- **Skin Type**: Dry, oily, combination, or normal
- **Conditions**: 8 specific skin condition measurements
  - Dryness, oiliness, pimples, acne
  - Scars, dark spots, wrinkles, redness
- **10 Clinical Markers**:
  - Stratum Corneum Hydration
  - Lipid Barrier Density
  - Melanin Distribution
  - Cellular Turnover Velocity
  - Sebum Matrix Index
  - Microbiome Balance
  - TEWL (Trans-Epidermal Water Loss)
  - Dermal Elasticity
  - Oxidative Stress Level
  - Pore Structural Integrity

### Image Processing
- Automatic image resizing (max 1024px width)
- JPEG compression (60% quality)
- Base64 encoding for API transmission
- Multi-angle support for accuracy

## Components

### KysScreen
Simple screen with hero banner that triggers the scanner modal.

### KysScannerModal
Full-featured modal with:
- Camera view with face detection
- Image picker integration
- Multi-angle capture (up to 5 images)
- Real-time analysis progress
- Results display
- Regimen application

## Hooks

### useKysAnalysis
Manages skin analysis state and operations.

**Usage:**
```typescript
const {
  isAnalyzing,
  progress,
  error,
  result,
  analyzeSkin,
  reset,
} = useKysAnalysis();

// Analyze images
const result = await analyzeSkin([imageUri1, imageUri2]);

// Reset state
reset();
```

**Returns:**
- `isAnalyzing`: Boolean indicating analysis in progress
- `progress`: Number 0-100 showing analysis progress
- `error`: Error message if analysis failed
- `result`: SkinAnalysisResult or null
- `analyzeSkin(imageUris)`: Function to start analysis
- `reset()`: Function to reset state

## Services

### geminiApi
Google Gemini API integration service.

**Functions:**

#### analyzeSkinWithGemini(imagesBase64)
Analyzes skin from base64-encoded images.

**Parameters:**
- `imagesBase64`: Array of base64 image strings (1-5 images)

**Returns:**
- `SkinAnalysisResult`: Comprehensive skin analysis

**Throws:**
- API key not configured
- Invalid API key
- Request timeout
- Network errors
- Invalid response

#### convertImageToBase64(uri)
Converts image URI to optimized base64 string.

**Parameters:**
- `uri`: Image URI from camera or picker

**Returns:**
- Base64-encoded JPEG string

#### testConnectivity()
Tests internet and Gemini API connectivity.

**Returns:**
- `ConnectivityReport`: Connection status details

## Configuration

### Environment Variables
Set in `.env`:
```
EXPO_PUBLIC_GEMINI_API_KEY=your-api-key-here
```

Get your free API key at: https://aistudio.google.com/app/apikey

### API Limits (Free Tier)
- 1,500 requests per day
- 60 requests per minute
- No cost

### Image Optimization
```typescript
const MAX_IMAGE_WIDTH = 1024;
const IMAGE_COMPRESSION = 0.6;
const GEMINI_TIMEOUT_MS = 90000;
```

## Usage

### Import the screen
```typescript
import { KysScreen } from '@/features/kys';

export default function KysRoute() {
  return <KysScreen />;
}
```

### Use the hook
```typescript
import { useKysAnalysis } from '@/features/kys';

function MyComponent() {
  const { analyzeSkin, isAnalyzing, result } = useKysAnalysis();

  const handleAnalyze = async () => {
    try {
      const analysis = await analyzeSkin([imageUri]);
      console.log('Analysis:', analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  return (
    <Pressable
      onPress={handleAnalyze}
      disabled={isAnalyzing}
    />
  );
}
```

## Error Handling

### Common Errors

**GEMINI_API_KEY_NOT_CONFIGURED**
- API key not set in environment variables
- Solution: Add `EXPO_PUBLIC_GEMINI_API_KEY` to `.env`

**INVALID_API_KEY**
- API key is invalid or expired
- Solution: Generate new key at https://aistudio.google.com/app/apikey

**REQUEST_TIMEOUT**
- Analysis took longer than 90 seconds
- Solution: Retry with fewer/smaller images

**Network request failed**
- Common on Android with large images
- Solution: Images are auto-compressed to prevent this

## Future Enhancements

- [ ] Save analysis history to local storage
- [ ] Compare multiple analysis results over time
- [ ] Export analysis reports
- [ ] Share results with dermatologist
- [ ] Offline analysis caching
- [ ] Progress photos tracking
- [ ] Recommended products integration
- [ ] Custom regimen builder
- [ ] Reminder system for routine
- [ ] Analysis insights dashboard
