import React, { useState, useRef, useEffect } from 'react';
import { Brush, Eraser, Undo, Redo, Download, Palette, Settings, Layers, Cloud, Save } from 'lucide-react';
import { useCloudStorage, useGoogleApis } from '../hooks/useGoogleApis';

const CanvasEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#744fed');
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [artworkName, setArtworkName] = useState('');

  const { saveArtwork, isSaving, authenticate, isAuthenticated } = useCloudStorage();
  const { isInitialized } = useGoogleApis();

  const colors = [
    '#744fed', '#f97316', '#eab308', '#22c55e', '#3b82f6', 
    '#ef4444', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'
  ];

  const tools = [
    { id: 'brush', icon: Brush, name: 'Brush' },
    { id: 'eraser', icon: Eraser, name: 'Eraser' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Set initial styles
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = brushColor;
    ctx.globalAlpha = brushOpacity / 100;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = artworkName || 'artwork.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const saveToCloud = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!isAuthenticated) {
      const success = await authenticate();
      if (!success) {
        alert('Authentication failed. Please try again.');
        return;
      }
    }

    const fileName = artworkName || `artwork-${Date.now()}.png`;
    const success = await saveArtwork(canvas, fileName);
    
    if (success) {
      alert('Artwork saved to Google Drive successfully!');
    } else {
      alert('Failed to save artwork. Please try again.');
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-ink-50 to-primary-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-ink-800 mb-4">AI-Enhanced Canvas Editor</h2>
          <p className="text-xl text-ink-600">Create and edit your artwork with Google Cloud integration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tools Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-ink-800 mb-4 flex items-center">
              <Brush className="w-5 h-5 mr-2 text-primary-600" />
              Tools
            </h3>

            {/* Tool Selection */}
            <div className="space-y-3 mb-6">
              {tools.map((toolItem) => (
                <button
                  key={toolItem.id}
                  onClick={() => setTool(toolItem.id as 'brush' | 'eraser')}
                  className={`w-full p-3 rounded-lg flex items-center transition-all ${
                    tool === toolItem.id
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                      : 'border-2 border-ink-200 hover:border-primary-300'
                  }`}
                >
                  <toolItem.icon className="w-5 h-5 mr-3" />
                  {toolItem.name}
                </button>
              ))}
            </div>

            {/* Brush Size */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-ink-700 mb-2">
                Brush Size: {brushSize}px
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Opacity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-ink-700 mb-2">
                Opacity: {brushOpacity}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={brushOpacity}
                onChange={(e) => setBrushOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Color Palette */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-ink-700 mb-3">Colors</label>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBrushColor(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      brushColor === color ? 'border-ink-400 scale-110' : 'border-ink-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-full h-10 rounded-lg border-2 border-ink-200"
              />
            </div>

            {/* Actions */}
            <div>
              <h3 className="text-lg font-bold text-ink-800 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary-600" />
                Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={clearCanvas}
                  className="w-full p-3 rounded-lg flex items-center border-2 border-ink-200 hover:border-red-400 hover:text-red-500 transition-all"
                >
                  <Undo className="w-5 h-5 mr-3" />
                  Clear Canvas
                </button>
                <button
                  onClick={downloadCanvas}
                  className="w-full p-3 rounded-lg flex items-center border-2 border-ink-200 hover:border-green-400 hover:text-green-500 transition-all"
                >
                  <Download className="w-5 h-5 mr-3" />
                  Download
                </button>
                <button
                  onClick={saveToCloud}
                  disabled={isSaving || !isInitialized}
                  className="w-full p-3 rounded-lg flex items-center bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 transition-all"
                >
                  {isSaving ? (
                    <>
                      <Cloud className="w-4 h-4 mr-2 animate-pulse" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save to Drive
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink-800">Canvas</h3>
              <div className="flex space-x-2">
                <button className="p-2 bg-ink-100 rounded-lg hover:bg-ink-200 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadCanvas}
                  className="p-2 bg-ink-100 rounded-lg hover:bg-ink-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="border-2 border-ink-200 rounded-xl overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-96 cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>

            <div className="mt-4 text-center text-sm text-ink-500">
              Click and drag to draw • Use the tools panel to customize your brush
            </div>

            {/* Artwork Name Input */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter artwork name..."
                value={artworkName}
                onChange={(e) => setArtworkName(e.target.value)}
                className="w-full p-3 border-2 border-ink-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>

          {/* AI Assistant Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-ink-800 mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-primary-600" />
              AI Assistant
            </h3>

            <div className="space-y-4">
              <button className="w-full p-3 bg-primary-100 text-primary-700 rounded-lg font-semibold hover:bg-primary-200 transition-colors">
                Auto-Complete Drawing
              </button>
              
              <button className="w-full p-3 bg-gold-100 text-gold-700 rounded-lg font-semibold hover:bg-gold-200 transition-colors">
                Suggest Colors
              </button>
              
              <button className="w-full p-3 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors">
                Enhance Details
              </button>

              <div className="border-t border-ink-200 pt-4 mt-6">
                <h4 className="font-semibold text-ink-700 mb-3">Cloud Storage</h4>
                <div className="space-y-2">
                  <button
                    onClick={saveToCloud}
                    disabled={isSaving || !isInitialized}
                    className="w-full p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSaving ? (
                      <>
                        <Cloud className="w-4 h-4 mr-2 animate-pulse" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save to Drive
                      </>
                    )}
                  </button>
                  
                  {!isAuthenticated && (
                    <p className="text-xs text-ink-500 text-center">
                      Authentication required for cloud save
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-ink-200 pt-4 mt-6">
                <h4 className="font-semibold text-ink-700 mb-3">Export Options</h4>
                <div className="space-y-2">
                  <button className="w-full p-2 text-left text-sm bg-ink-50 rounded-lg hover:bg-ink-100 transition-colors">
                    PNG (High Quality)
                  </button>
                  <button className="w-full p-2 text-left text-sm bg-ink-50 rounded-lg hover:bg-ink-100 transition-colors">
                    SVG (Vector)
                  </button>
                  <button className="w-full p-2 text-left text-sm bg-ink-50 rounded-lg hover:bg-ink-100 transition-colors">
                    PDF (Print Ready)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CanvasEditor;