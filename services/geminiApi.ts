/**
 * Google Gemini 2.5 Flash API — Skin Analysis
 * Vision-capable model with generous free tier.
 * Get your API key at: https://aistudio.google.com/app/apikey
 */

const GEMINI_API_KEY = (process.env.EXPO_PUBLIC_GEMINI_API_KEY || '').trim();
// Replace line 9:
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';
// ─── Types ────────────────────────────────────────────────────────────────────

export interface SkinAnalysisResult {
  overall_score: number;
  skin_type: 'dry' | 'oily' | 'combination' | 'normal';
  conditions: {
    dryness: number;
    oiliness: number;
    pimples: number;
    acne: number;
    scars: number;
    dark_spots: number;
    wrinkles: number;
    redness: number;
  };
  diagnosis: string;
  recommendations: string[];
  markers: {
    name: string;
    value: number;
    status: 'good' | 'fair' | 'needs_attention';
  }[];
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Analyzes a face image using Google Gemini 2.5 Flash (vision model).
 * @param imageBase64 - Base64-encoded image (with or without data URI prefix)
 */
export async function analyzeSkinWithGemini(
  imageBase64: string
): Promise<SkinAnalysisResult> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED: Add EXPO_PUBLIC_GEMINI_API_KEY to your .env file. Get a free key at https://aistudio.google.com/app/apikey');
  }

  // Strip data URI prefix if present
  const base64Data = imageBase64.includes('base64,')
    ? imageBase64.split('base64,')[1]
    : imageBase64;

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `You are an expert dermatologist AI. Analyze this facial image and return a skin analysis JSON object with EXACTLY these fields — no markdown, no code blocks, raw JSON only:

{
  "overall_score": <integer 0-100>,
  "skin_type": <"dry"|"oily"|"combination"|"normal">,
  "conditions": {
    "dryness": <int 0-100>,
    "oiliness": <int 0-100>,
    "pimples": <int 0-100>,
    "acne": <int 0-100>,
    "scars": <int 0-100>,
    "dark_spots": <int 0-100>,
    "wrinkles": <int 0-100>,
    "redness": <int 0-100>
  },
  "diagnosis": "<2-3 professional sentences>",
  "recommendations": ["<rec1>", "<rec2>", "<rec3>", "<rec4>"],
  "markers": [
    { "name": "Stratum Corneum Hydration", "value": <int 45-95>, "status": <"good"|"fair"|"needs_attention"> },
    { "name": "Lipid Barrier Density", "value": <int 45-95>, "status": <"good"|"fair"|"needs_attention"> },
    { "name": "Melanin Distribution", "value": <int 45-95>, "status": <"good"|"fair"|"needs_attention"> },
    { "name": "Cellular Turnover Velocity", "value": <int 45-95>, "status": <"good"|"fair"|"needs_attention"> },
    { "name": "Sebum Matrix Index", "value": <int 45-95>, "status": <"good"|"fair"|"needs_attention"> },
    { "name": "Microbiome Balance", "value": <int 45-95>, "status": <"good"|"fair"|"needs_attention"> },
    { "name": "TEWL", "value": <int 45-95>, "status": <"good"|"fair"|"needs_attention"> },
    { "name": "Dermal Elasticity", "value": <int 45-95>, "status": <"good"|"fair"|"needs_attention"> },
    { "name": "Oxidative Stress Level", "value": <int 45-95>, "status": <"good"|"fair"|"needs_attention"> },
    { "name": "Pore Structural Integrity", "value": <int 45-95>, "status": <"good"|"fair"|"needs_attention"> }
  ]
}`,
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = (errorData?.error?.message || '').toLowerCase();

    console.error('Gemini API error:', { status: response.status, errorMsg });

    if (
      response.status === 401 ||
      response.status === 403 ||
      errorMsg.includes('api key not valid') ||
      errorMsg.includes('invalid api key')
    ) {
      throw new Error('INVALID_API_KEY: Your Gemini API key is invalid. Check https://aistudio.google.com/app/apikey');
    }

    throw new Error(`Gemini API error ${response.status}: ${errorMsg || JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error('Gemini returned an empty response');
  }

  // responseMimeType:application/json ensures clean JSON, but strip defensively
  let jsonContent = content.trim();
  jsonContent = jsonContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  const jsonStart = jsonContent.indexOf('{');
  const jsonEnd = jsonContent.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    jsonContent = jsonContent.slice(jsonStart, jsonEnd + 1);
  }

  let result: SkinAnalysisResult;
  try {
    result = JSON.parse(jsonContent);
  } catch {
    throw new Error('Gemini response could not be parsed as JSON');
  }

  if (!result.overall_score || !result.skin_type) {
    throw new Error('Gemini response is missing required fields');
  }

  return result;
}

/**
 * Convert an image URI (camera / picker) to a bare base64 string.
 */
export async function convertImageToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1] ?? base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
