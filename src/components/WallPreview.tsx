import React, { useState, useRef } from 'react';
import { Camera, Upload, Eye, RotateCcw, ZoomIn, ZoomOut, MapPin, Scan, Download } from 'lucide-react';
import { useImageAnalysis, useGoogleApis } from '../hooks/useGoogleApis';

const WallPreview: React.FC = () => {
  const [wallImage, setWallImage] = useState<string | null>(null);
  const [artworkOverlay, setArtworkOverlay] = useState<string | null>(null);
  const [scale, setScale] = useState(100);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [detectedWalls, setDetectedWalls] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const downloadCanvasRef = useRef<HTMLCanvasElement>(null);

  const { analyzeImage, detectWalls } = useImageAnalysis();
  const { isInitialized, services } = useGoogleApis();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageBase64 = e.target?.result as string;
        setWallImage(imageBase64);
        
        // Analyze image for wall detection
        if (isInitialized) {
          setIsAnalyzing(true);
          try {
            const walls = await detectWalls(imageBase64);
            setDetectedWalls(walls);
          } catch (error) {
            console.error('Wall detection failed:', error);
          } finally {
            setIsAnalyzing(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPreview = () => {
    const wallImg = new Image();
    wallImg.crossOrigin = 'anonymous';
    wallImg.src = wallImage!;
    
    wallImg.onload = () => {
      const artImg = new Image();
      artImg.crossOrigin = 'anonymous';
      artImg.src = artworkOverlay!;

      artImg.onload = () => {
        const canvas = downloadCanvasRef.current;
        const container = previewContainerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match container for accurate representation
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        // Draw wall image as background
        ctx.drawImage(wallImg, 0, 0, canvas.width, canvas.height);

        // Calculate artwork dimensions and position on the canvas
        const artWidth = (artImg.width * scale) / 100;
        const artHeight = (artImg.height * scale) / 100;
        const artX = (position.x / 100) * (canvas.width - artWidth);
        const artY = (position.y / 100) * (canvas.height - artHeight);

        // Draw artwork overlay
        ctx.drawImage(artImg, artX, artY, artWidth, artHeight);
        
        // Trigger download
        const link = document.createElement('a');
        link.download = 'wall-preview.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      };

      artImg.onerror = () => {
        alert('Could not load artwork image. Please try a different one.');
      };
    };

    wallImg.onerror = () => {
      alert('Could not load wall image. Please try a different one.');
    };
  };

  const analyzeWallImage = async () => {
    if (!wallImage) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeImage(wallImage);
      if (analysis) {
        console.log('Image analysis:', analysis);
        // Process analysis results
        const walls = analysis.wallSurfaces || [];
        setDetectedWalls(walls);
      }
    } catch (error) {
      console.error('Image analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const findNearbyGalleries = async () => {
    try {
      const location = await services.maps.getCurrentLocation();
      if (location) {
        const galleries = await services.maps.findNearbyArtGalleries(location);
        console.log('Nearby galleries:', galleries);
        // Handle gallery results
      }
    } catch (error) {
      console.error('Failed to find galleries:', error);
    }
  };

  const sampleWalls = [
    'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=600',
  ];

  const sampleArtworks = [
    'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1071882/pexels-photo-1071882.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1154861/pexels-photo-1154861.jpeg?auto=compress&cs=tinysrgb&w=300',
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-primary-50 to-ink-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-ink-800 mb-4">AI Wall Preview & AR Visualization</h2>
          <p className="text-xl text-ink-600">See how your art looks on real walls with Google Vision AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wall Upload Section */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-ink-800 mb-4 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-primary-600" />
              Wall Image
            </h3>

            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-500 transition-colors flex items-center justify-center text-primary-600"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Wall Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {wallImage && (
                <button
                  onClick={analyzeWallImage}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Scan className="w-4 h-4 mr-2 animate-pulse" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Analyze Wall Surface
                    </>
                  )}
                </button>
              )}

              <button
                onClick={findNearbyGalleries}
                className="w-full py-3 bg-gold-600 text-white rounded-lg font-semibold hover:bg-gold-700 transition-colors flex items-center justify-center"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Find Nearby Galleries
              </button>

              <div className="text-center text-ink-500 text-sm">or choose a sample</div>

              <div className="grid grid-cols-1 gap-3">
                {sampleWalls.map((wall, index) => (
                  <button
                    key={index}
                    onClick={() => setWallImage(wall)}
                    className="relative overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
                  >
                    <img src={wall} alt={`Sample wall ${index + 1}`} className="w-full h-20 object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                  </button>
                ))}
              </div>

              {detectedWalls.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-semibold text-green-800 mb-2">
                    AI Detected {detectedWalls.length} Wall Surface{detectedWalls.length > 1 ? 's' : ''}
                  </p>
                  {detectedWalls.map((wall, index) => (
                    <div key={index} className="text-xs text-green-700">
                      Wall {index + 1}: {Math.round(wall.confidence * 100)}% confidence
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Artwork Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-ink-800 mb-4">Select Artwork</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {sampleArtworks.map((artwork, index) => (
                  <button
                    key={index}
                    onClick={() => setArtworkOverlay(artwork)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                      artworkOverlay === artwork 
                        ? 'border-primary-500 ring-2 ring-primary-200' 
                        : 'border-transparent hover:border-primary-300'
                    }`}
                  >
                    <img src={artwork} alt={`Artwork ${index + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>

              <button className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Use My Creation
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-ink-800 mb-4">Positioning Controls</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Scale</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setScale(Math.max(50, scale - 10))}
                    className="p-2 bg-ink-100 rounded-lg hover:bg-ink-200 transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="flex-1"
                  />
                  <button
                    onClick={() => setScale(Math.min(200, scale + 10))}
                    className="p-2 bg-ink-100 rounded-lg hover:bg-ink-200 transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center text-sm text-ink-600 mt-1">{scale}%</div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Horizontal Position</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={position.x}
                  onChange={(e) => setPosition({...position, x: Number(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Vertical Position</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={position.y}
                  onChange={(e) => setPosition({...position, y: Number(e.target.value)})}
                  className="w-full"
                />
              </div>

              <button
                onClick={() => {
                  setScale(100);
                  setPosition({ x: 50, y: 50 });
                }}
                className="w-full py-3 border-2 border-ink-300 text-ink-700 rounded-lg font-semibold hover:bg-ink-50 transition-colors flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Position
              </button>
            </div>
          </div>
        </div>

        {/* Preview Window */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-ink-800 mb-6">Live Preview with AI Enhancement</h3>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-ink-800">Preview</h3>
            <button 
              onClick={handleDownloadPreview}
              disabled={!wallImage || !artworkOverlay}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </button>
          </div>
          
          <div
            ref={previewContainerRef}
            className="relative w-full aspect-video bg-ink-100 rounded-lg overflow-hidden border-2 border-dashed border-ink-200"
          >
            {wallImage ? (
              <>
                <img 
                  src={wallImage} 
                  alt="Wall" 
                  className="w-full h-full object-cover"
                />
                {artworkOverlay && (
                  <div
                    className="absolute"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      transform: `translate(-50%, -50%) scale(${scale / 100})`,
                      maxWidth: '300px',
                      maxHeight: '300px',
                    }}
                  >
                    <img
                      src={artworkOverlay}
                      alt="Artwork overlay"
                      className="rounded-lg shadow-2xl"
                      style={{
                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                      }}
                    />
                  </div>
                )}
                {/* Wall detection overlays */}
                {detectedWalls.map((wall, index) => (
                  <div
                    key={index}
                    className="absolute border-2 border-green-400 bg-green-400 bg-opacity-20"
                    style={{
                      left: `${wall.boundingBox.x * 100}%`,
                      top: `${wall.boundingBox.y * 100}%`,
                      width: `${wall.boundingBox.width * 100}%`,
                      height: `${wall.boundingBox.height * 100}%`,
                    }}
                  >
                    <div className="absolute -top-6 left-0 text-xs bg-green-500 text-white px-2 py-1 rounded">
                      Wall {index + 1}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-400">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Upload or select a wall image to start</p>
                  <p className="text-sm mt-2">AI will analyze the wall surface automatically</p>
                </div>
              </div>
            )}
          </div>

          {wallImage && artworkOverlay && (
            <div className="mt-6 flex justify-center space-x-4">
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Save to Drive
              </button>
              <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Export High-Res
              </button>
              <button className="px-6 py-3 border-2 border-ink-300 text-ink-700 rounded-lg font-semibold hover:bg-ink-50 transition-colors">
                Share Preview
              </button>
            </div>
          )}

          {/* Hidden canvas for download */}
          <canvas ref={downloadCanvasRef} className="hidden"></canvas>
        </div>
      </div>
    </section>
  );
};

export default WallPreview;