import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Type, Wand2, Download, RefreshCw, Languages, Globe } from 'lucide-react';
import { useTranslation, useGoogleApis } from '../hooks/useGoogleApis';
import { SUPPORTED_LANGUAGES } from '../config/googleApis';

const CalligraphyGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('arabic');
  const [selectedLanguage, setSelectedLanguage] = useState('arabic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  const { translateText, isTranslating, supportedLanguages } = useTranslation();
  const { isInitialized, services } = useGoogleApis();

  const styles = [
    { id: 'arabic', name: 'Arabic Naskh', preview: 'بسم الله', fontFamily: 'Amiri' },
    { id: 'thuluth', name: 'Arabic Thuluth', preview: 'الخط العربي', fontFamily: 'Scheherazade New' },
    { id: 'diwani', name: 'Arabic Diwani', preview: 'الديواني', fontFamily: 'Cairo' },
    { id: 'gothic', name: 'Gothic', preview: 'Medieval', fontFamily: 'UnifrakturMaguntia' },
    { id: 'brush', name: 'Brush Style', preview: 'Flowing', fontFamily: 'Dancing Script' },
    { id: 'modern', name: 'Modern Script', preview: 'Contemporary', fontFamily: 'Poppins' },
  ];

  useEffect(() => {
    if (isInitialized) {
      // Load fonts for selected style
      const selectedStyleData = styles.find(s => s.id === selectedStyle);
      if (selectedStyleData) {
        services.fonts.loadFont(selectedStyleData.fontFamily);
      }
    }
  }, [selectedStyle, isInitialized, services.fonts]);

  const handleLanguageChange = async (langCode: string) => {
    setSelectedLanguage(langCode);
    
    if (inputText && langCode !== 'en') {
      const translation = await translateText(inputText, langCode, 'en');
      if (translation) {
        setTranslatedText(translation.translatedText);
      }
    } else {
      setTranslatedText('');
    }
  };

  const generateCalligraphy = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Use translated text if available
      const textToGenerate = translatedText || inputText;
      
      // Load appropriate font
      const selectedStyleData = styles.find(s => s.id === selectedStyle);
      if (selectedStyleData && isInitialized) {
        await services.fonts.loadFont(selectedStyleData.fontFamily);
      }
      
      // Simulate AI generation with proper font loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult(`Generated ${selectedStyle} calligraphy for: "${textToGenerate}"`);
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (previewRef.current) {
      html2canvas(previewRef.current, {
        backgroundColor: null, // Use transparent background
        scale: 2, // Increase scale for better resolution
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'calligraphy.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage);

  return (
    <section className="min-h-screen bg-gradient-to-br from-white to-primary-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-ink-800 mb-4">AI Calligraphy Generator</h2>
          <p className="text-xl text-ink-600">Transform your text into beautiful calligraphy art with Google AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-ink-800 mb-6 flex items-center">
              <Type className="w-6 h-6 mr-3 text-primary-600" />
              Text Input
            </h3>

            {/* Language Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-ink-700 mb-3 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Language
              </label>
              <div className="grid grid-cols-2 gap-3">
                {supportedLanguages.slice(0, 4).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    disabled={isTranslating}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      selectedLanguage === lang.code
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-ink-200 hover:border-primary-300'
                    } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-lg mr-2">{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-ink-700 mb-3">Your Text</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={currentLanguage?.rtl ? 'أدخل النص هنا...' : 'Enter your text here...'}
                className={`w-full h-32 p-4 rounded-lg border-2 border-ink-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 resize-none ${
                  currentLanguage?.rtl ? 'text-right' : ''
                }`}
                dir={currentLanguage?.rtl ? 'rtl' : 'ltr'}
              />
              {translatedText && (
                <div className="mt-2 p-3 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-700 mb-1">Translation:</p>
                  <p className={`text-primary-800 ${currentLanguage?.rtl ? 'text-right' : ''}`} dir={currentLanguage?.rtl ? 'rtl' : 'ltr'}>
                    {translatedText}
                  </p>
                </div>
              )}
            </div>

            {/* Style Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-ink-700 mb-3">Calligraphy Style</label>
              <div className="grid grid-cols-2 gap-3">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedStyle === style.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-ink-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="font-semibold text-ink-800">{style.name}</div>
                    <div 
                      className={`text-lg mt-1 ${
                        style.id.includes('arabic') ? 'text-right' : ''
                      }`}
                      style={{ fontFamily: style.fontFamily }}
                    >
                      {style.preview}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateCalligraphy}
              disabled={!inputText.trim() || isGenerating || isTranslating}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : isTranslating ? (
                <>
                  <Languages className="w-5 h-5 mr-2 animate-pulse" />
                  Translating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Calligraphy
                </>
              )}
            </button>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-ink-800">Preview</h3>
              <button
                onClick={handleDownload}
                disabled={!result}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </button>
            </div>
            
            <div 
              ref={previewRef}
              className="h-80 bg-gradient-to-br from-ink-50 to-primary-50 rounded-xl border-2 border-dashed border-ink-200 flex items-center justify-center mb-6 flex-grow"
            >
              {result ? (
                <div className="text-center p-6">
                  <div 
                    className={`text-4xl mb-4 ${
                      currentLanguage?.rtl ? 'text-right' : ''
                    }`}
                    style={{ 
                      fontFamily: styles.find(s => s.id === selectedStyle)?.fontFamily,
                      color: '#744fed'
                    }}
                    dir={currentLanguage?.rtl ? 'rtl' : 'ltr'}
                  >
                    {translatedText || inputText || 'Your Calligraphy'}
                  </div>
                  <p className="text-ink-600">{result}</p>
                </div>
              ) : (
                <div className="text-center text-ink-500">
                  <Wand2 className="w-12 h-12 mx-auto mb-4" />
                  <p>Your generated art will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalligraphyGenerator;