import { useState } from 'react';
import { analyzeSkinWithGemini, convertImageToBase64 } from '../services/geminiApi';
import type { SkinAnalysisResult, AnalysisState } from '../types';

/**
 * Hook to manage KYS skin analysis state and operations
 */
export const useKysAnalysis = () => {
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    progress: 0,
    error: null,
    result: null,
  });

  /**
   * Analyze skin from image URIs
   */
  const analyzeSkin = async (imageUris: string[]): Promise<SkinAnalysisResult> => {
    try {
      setState({
        isAnalyzing: true,
        progress: 0,
        error: null,
        result: null,
      });

      // Convert images to base64
      setState(prev => ({ ...prev, progress: 20 }));
      const base64Images = await Promise.all(
        imageUris.map(uri => convertImageToBase64(uri))
      );

      // Analyze with Gemini
      setState(prev => ({ ...prev, progress: 50 }));
      const result = await analyzeSkinWithGemini(base64Images);

      setState({
        isAnalyzing: false,
        progress: 100,
        error: null,
        result,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      
      setState({
        isAnalyzing: false,
        progress: 0,
        error: errorMessage,
        result: null,
      });

      throw error;
    }
  };

  /**
   * Reset analysis state
   */
  const reset = () => {
    setState({
      isAnalyzing: false,
      progress: 0,
      error: null,
      result: null,
    });
  };

  return {
    ...state,
    analyzeSkin,
    reset,
  };
};
