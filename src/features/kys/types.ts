/**
 * KYS (Know Your Skin) Feature Types
 */

/**
 * Skin analysis result from Gemini AI
 */
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
  markers: SkinMarker[];
}

/**
 * Individual skin health marker
 */
export interface SkinMarker {
  name: string;
  value: number;
  status: 'good' | 'fair' | 'needs_attention';
}

/**
 * Connectivity check result
 */
export interface ConnectivityReport {
  internetReachable: boolean;
  geminiHostReachable: boolean;
  errorCode?: string;
  errorDetail?: string;
}

/**
 * Analysis state for UI
 */
export interface AnalysisState {
  isAnalyzing: boolean;
  progress: number;
  error: string | null;
  result: SkinAnalysisResult | null;
}
