import { GOOGLE_APIS_CONFIG, SUPPORTED_LANGUAGES } from '../config/googleApis';

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
  confidence?: number;
}

class GoogleTranslationService {
  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<TranslationResult> {
    try {
      const requestBody = {
        q: text,
        target: targetLanguage,
        ...(sourceLanguage && { source: sourceLanguage }),
        format: 'text',
        key: GOOGLE_APIS_CONFIG.TRANSLATION_API_KEY,
      };

      const response = await fetch(GOOGLE_APIS_CONFIG.TRANSLATION_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Translation request failed');
      }

      const data = await response.json();
      const translation = data.data.translations[0];

      return {
        translatedText: translation.translatedText,
        detectedSourceLanguage: translation.detectedSourceLanguage,
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text');
    }
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      const requestBody = {
        q: text,
        key: GOOGLE_APIS_CONFIG.TRANSLATION_API_KEY,
      };

      const response = await fetch(
        'https://translation.googleapis.com/language/translate/v2/detect',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error('Language detection failed');
      }

      const data = await response.json();
      return data.data.detections[0][0].language;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  getLanguageInfo(code: string) {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  }
}

export const googleTranslationService = new GoogleTranslationService();