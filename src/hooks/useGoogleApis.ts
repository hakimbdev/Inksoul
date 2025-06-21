import { useState, useEffect } from 'react';
import { googleFontsService } from '../services/googleFontsService';
import { googleTranslationService } from '../services/googleTranslationService';
import { googleVisionService } from '../services/googleVisionService';
import { googleDriveService } from '../services/googleDriveService';
import { googleMapsService } from '../services/googleMapsService';

export const useGoogleApis = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApis = async () => {
      try {
        // Preload essential fonts
        await googleFontsService.preloadEssentialFonts();
        
        // Initialize Google Maps
        await googleMapsService.loadGoogleMaps();
        
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize APIs');
      }
    };

    initializeApis();
  }, []);

  return {
    isInitialized,
    error,
    services: {
      fonts: googleFontsService,
      translation: googleTranslationService,
      vision: googleVisionService,
      drive: googleDriveService,
      maps: googleMapsService,
    },
  };
};

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);

  const translateText = async (text: string, targetLang: string, sourceLang?: string) => {
    setIsTranslating(true);
    try {
      const result = await googleTranslationService.translateText(text, targetLang, sourceLang);
      return result;
    } catch (error) {
      console.error('Translation error:', error);
      return null;
    } finally {
      setIsTranslating(false);
    }
  };

  const detectLanguage = async (text: string) => {
    try {
      return await googleTranslationService.detectLanguage(text);
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  };

  return {
    translateText,
    detectLanguage,
    isTranslating,
    supportedLanguages: googleTranslationService.getSupportedLanguages(),
  };
};

export const useImageAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = async (imageBase64: string) => {
    setIsAnalyzing(true);
    try {
      const result = await googleVisionService.analyzeImage(imageBase64);
      return result;
    } catch (error) {
      console.error('Image analysis error:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const detectWalls = async (imageBase64: string) => {
    setIsAnalyzing(true);
    try {
      const walls = await googleVisionService.detectWallsInImage(imageBase64);
      return walls;
    } catch (error) {
      console.error('Wall detection error:', error);
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeImage,
    detectWalls,
    isAnalyzing,
  };
};

export const useCloudStorage = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authenticate = async () => {
    try {
      const success = await googleDriveService.authenticate();
      setIsAuthenticated(success);
      return success;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };

  const saveArtwork = async (canvas: HTMLCanvasElement, fileName: string) => {
    setIsSaving(true);
    try {
      const success = await googleDriveService.saveArtwork(canvas, fileName);
      return success;
    } catch (error) {
      console.error('Save error:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    authenticate,
    saveArtwork,
    isSaving,
    isAuthenticated,
  };
};