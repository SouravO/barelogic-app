/**
 * Google Gemini API — Skin Analysis
 * Vision-capable model with generous free tier.
 * Get your API key at: https://aistudio.google.com/app/apikey
 */

import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

/**
 * Gemini vision models don't need full-resolution photos. Downscaling keeps the
 * HTTP request small enough that React Native's fetch on Android does not throw
 * "Network request failed" with multi-MB base64 payloads.
 */
const MAX_IMAGE_WIDTH = 1024;
const IMAGE_COMPRESSION = 0.6;

const GEMINI_API_KEY = (process.env.EXPO_PUBLIC_GEMINI_API_KEY || '').trim();
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';
const GEMINI_TIMEOUT_MS = 90000;

async function fetchWithTimeout(url: string, timeoutMs: number, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export interface ConnectivityReport {
  internetReachable: boolean;
  geminiHostReachable: boolean;
  errorCode?: string;
  errorDetail?: string;
}

/**
 * Determines whether the device has internet at all and whether it can reach
 * Google's Gemini host. Used to tell a "no internet" failure from a
 * "network/ISP blocks Google services" failure.
 */
export async function testConnectivity(): Promise<ConnectivityReport> {
  let internetReachable = false;
  try {
    const res = await fetchWithTimeout(
      'https://connectivitycheck.gstatic.com/generate_204',
      8000
    );
    internetReachable = res.ok;
  } catch {
    internetReachable = false;
  }

  let geminiHostReachable = false;
  let errorCode: string | undefined;
  let errorDetail: string | undefined;
  try {
    await fetchWithTimeout('https://generativelanguage.googleapis.com', 8000);
    geminiHostReachable = true; // any HTTP response means the host is reachable
  } catch (e) {
    const err = e as { code?: string; message?: string };
    errorCode = err?.code;
    errorDetail = err?.message;
  }

  return { internetReachable, geminiHostReachable, errorCode, errorDetail };
}
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
 * Analyzes face images using Google Gemini 2.5 Flash (vision model).
 * Accepts 1–5 base64-encoded images taken from different angles for higher accuracy.
 * @param imagesBase64 - Array of base64-encoded images (with or without data URI prefix)
 */
export async function analyzeSkinWithGemini(
  imagesBase64: string[]
): Promise<SkinAnalysisResult> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED: Add EXPO_PUBLIC_GEMINI_API_KEY to your .env file. Get a free key at https://aistudio.google.com/app/apikey');
  }

  if (!imagesBase64.length) {
    throw new Error('At least one image is required for skin analysis');
  }

  // Strip data URI prefixes
  const base64Images = imagesBase64.map((img) =>
    img.includes('base64,') ? img.split('base64,')[1] : img
  );

  // Build image parts — one inline_data per captured angle
  const imageParts = base64Images.map((data) => ({
    inline_data: { mime_type: 'image/jpeg' as const, data },
  }));

  const angleCount = base64Images.length;
  const angleDesc =
    angleCount === 1
      ? 'one frontal facial image'
      : angleCount === 2
        ? 'two facial images from different angles'
        : `${angleCount} facial images from different angles (front, left cheek, right cheek${angleCount > 3 ? ', and additional angles' : ''})`;

  let response: Response;
  try {
    response = await fetchWithTimeout(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      GEMINI_TIMEOUT_MS,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        contents: [
        {
          parts: [
            {
              text: `You are an expert dermatologist AI. I am providing ${angleDesc} of the same person for a comprehensive skin analysis. Analyze ALL images together to form a more accurate assessment than a single image alone would provide.

Return a skin analysis JSON object with EXACTLY these fields — no markdown, no code blocks, raw JSON only:

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
  "diagnosis": "<2-3 professional sentences synthesizing all angles>",
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
            ...imageParts,
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    }),
      }
    );
  } catch (error) {
    const err = error as Error;
    if (err?.name === 'AbortError' || /abort|timed?\s?out/i.test(err?.message || '')) {
      throw new Error('REQUEST_TIMEOUT: Analysis timed out. Please try again.');
    }
    throw error;
  }

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
 * Convert an image URI (camera / picker) to a small JPEG base64 string.
 * Resizes to max 1024px and compresses so the Gemini request stays well under
 * Android's fetch body limits (huge base64 payloads throw "Network request failed").
 */
export async function convertImageToBase64(uri: string): Promise<string> {
  if (uri.startsWith('file://')) {
    const context = ImageManipulator.manipulate(uri);
    const rendered = await context.renderAsync();

    if (rendered.width > MAX_IMAGE_WIDTH) {
      const resizedContext = ImageManipulator.manipulate(uri);
      resizedContext.resize({ width: MAX_IMAGE_WIDTH });
      const resized = await resizedContext.renderAsync();
      const result = await resized.saveAsync({
        format: SaveFormat.JPEG,
        compress: IMAGE_COMPRESSION,
        base64: true,
      });
      return result.base64 ?? '';
    }

    const result = await rendered.saveAsync({
      format: SaveFormat.JPEG,
      compress: IMAGE_COMPRESSION,
      base64: true,
    });
    return result.base64 ?? '';
  }

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
