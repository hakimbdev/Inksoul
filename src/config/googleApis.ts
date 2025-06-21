// Google APIs Configuration
export const GOOGLE_APIS_CONFIG = {
  FONTS_API_KEY: 'AIzaSyD4z58lkIQQ6W-CR4vNt2k72o_SBSVHQq8',
  TRANSLATION_API_KEY: 'AIzaSyD4z58lkIQQ6W-CR4vNt2k72o_SBSVHQq8',
  CLOUD_VISION_API_KEY: 'fb6470eea35254f93ff5d12a7bb0490f7f097089',
  DRIVE_API_KEY: 'fb6470eea35254f93ff5d12a7bb0490f7f097089',
  MAPS_API_KEY: 'fb6470eea35254f93ff5d12a7bb0490f7f097089',
  
  // API Endpoints
  FONTS_API_URL: 'https://www.googleapis.com/webfonts/v1/webfonts',
  TRANSLATION_API_URL: 'https://translation.googleapis.com/language/translate/v2',
  VISION_API_URL: 'https://vision.googleapis.com/v1/images:annotate',
  DRIVE_API_URL: 'https://www.googleapis.com/drive/v3',
  MAPS_API_URL: 'https://maps.googleapis.com/maps/api/js',
};

// Supported languages for translation
export const SUPPORTED_LANGUAGES = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'en', name: 'English', flag: '🇺🇸', rtl: false },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', rtl: true },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', rtl: true },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', rtl: false },
  { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'es', name: 'Español', flag: '🇪🇸', rtl: false },
];

// Font categories for different calligraphy styles
export const FONT_CATEGORIES = {
  arabic: ['Amiri', 'Scheherazade New', 'Noto Sans Arabic', 'Cairo', 'Tajawal'],
  gothic: ['UnifrakturMaguntia', 'Cinzel', 'Pirata One', 'Metal Mania'],
  brush: ['Dancing Script', 'Pacifico', 'Kaushan Script', 'Satisfy', 'Great Vibes'],
  modern: ['Poppins', 'Montserrat', 'Roboto', 'Open Sans', 'Lato'],
};