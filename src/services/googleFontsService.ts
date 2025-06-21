import { GOOGLE_APIS_CONFIG, FONT_CATEGORIES } from '../config/googleApis';

export interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  category: string;
  files: Record<string, string>;
}

class GoogleFontsService {
  private loadedFonts = new Set<string>();

  async fetchAvailableFonts(): Promise<GoogleFont[]> {
    try {
      const response = await fetch(
        `${GOOGLE_APIS_CONFIG.FONTS_API_URL}?key=${GOOGLE_APIS_CONFIG.FONTS_API_KEY}&sort=popularity`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch Google Fonts');
      }
      
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching Google Fonts:', error);
      return [];
    }
  }

  async loadFont(fontFamily: string, variants: string[] = ['400']): Promise<void> {
    if (this.loadedFonts.has(fontFamily)) {
      return;
    }

    try {
      const variantString = variants.join(',');
      const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@${variantString}&display=swap`;
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontUrl;
      document.head.appendChild(link);
      
      this.loadedFonts.add(fontFamily);
      
      // Wait for font to load
      await document.fonts.ready;
    } catch (error) {
      console.error(`Error loading font ${fontFamily}:`, error);
    }
  }

  async loadCalligraphyFonts(style: keyof typeof FONT_CATEGORIES): Promise<void> {
    const fonts = FONT_CATEGORIES[style];
    const loadPromises = fonts.map(font => this.loadFont(font));
    await Promise.all(loadPromises);
  }

  getFontsByCategory(category: keyof typeof FONT_CATEGORIES): string[] {
    return FONT_CATEGORIES[category];
  }

  async preloadEssentialFonts(): Promise<void> {
    const essentialFonts = [
      'Amiri', 'Dancing Script', 'Cinzel', 'Poppins'
    ];
    
    const loadPromises = essentialFonts.map(font => this.loadFont(font));
    await Promise.all(loadPromises);
  }
}

export const googleFontsService = new GoogleFontsService();