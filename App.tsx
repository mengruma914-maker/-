
import React, { useState, useCallback, useRef } from 'react';
import { 
  GearCategory, 
  DesignStyle, 
  MaterialType, 
  Scenario, 
  DesignState, 
  GeneratedVariant,
  KeyPoint
} from './types';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import { analyzeGearImage, generateDesignVariant } from './services/geminiService';
import { 
  Upload, 
  History, 
  ChevronRight, 
  Trash2, 
  Download, 
  Layers,
  CheckCircle2,
  Info,
  // Fix: Added missing Sparkles icon import
  Sparkles
} from 'lucide-react';

const INITIAL_STATE: DesignState = {
  category: GearCategory.KNEE,
  style: DesignStyle.PROFESSIONAL,
  material: MaterialType.ELASTIC_MESH,
  scenario: Scenario.STUDIO,
  mainColor: '#4f46e5',
  accentColor: '#fbbf24'
};

const App: React.FC = () => {
  const [designState, setDesignState] = useState<DesignState>(INITIAL_STATE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [keypoints, setKeypoints] = useState<KeyPoint[]>([]);
  const [variants, setVariants] = useState<GeneratedVariant[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      setOriginalImage(e.target?.result as string);
      setCurrentImage(e.target?.result as string);
      setIsProcessing(true);

      try {
        const result = await analyzeGearImage(base64);
        setKeypoints(result.keypoints);
        setDesignState(prev => ({ 
            ...prev, 
            category: (Object.values(GearCategory).find(c => c.toLowerCase().includes(result.category.toLowerCase())) || prev.category) as GearCategory 
        }));
      } catch (error) {
        console.error("Analysis failed", error);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!originalImage) return;
    setIsGenerating(true);
    const base64 = originalImage.split(',')[1];
    
    try {
      const newImageUrl = await generateDesignVariant(base64, designState);
      const newVariant: GeneratedVariant = {
        id: Date.now().toString(),
        imageUrl: newImageUrl,
        prompt: `New ${designState.style} ${designState.category}`,
        timestamp: Date.now(),
        config: { ...designState }
      };
      setCurrentImage(newImageUrl);
      setVariants([newVariant, ...variants]);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectVariant = (v: GeneratedVariant) => {
    setCurrentImage(v.imageUrl);
    setDesignState(v.config);
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Design Controls Sidebar */}
      <Sidebar 
        state={designState} 
        setState={setDesignState} 
        onGenerate={handleGenerate} 
        isLoading={isGenerating} 
      />

      <div className="flex-1 flex flex-col relative">
        {/* Header/Workflow Bar */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${originalImage ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                {originalImage ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </span>
              <span className="text-sm font-medium text-slate-300">Upload</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-700" />
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${isProcessing ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                2
              </span>
              <span className="text-sm font-medium text-slate-300">Analysis</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-700" />
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${isGenerating ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                3
              </span>
              <span className="text-sm font-medium text-slate-300">Design</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition-colors border border-slate-700"
            >
              <Upload className="w-4 h-4" />
              Source Image
            </button>
            <button className="p-2 hover:bg-slate-800 text-slate-400 rounded-lg transition-colors border border-slate-800">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
          
          {/* Analysis Toggle Overlay */}
          {currentImage && keypoints.length > 0 && (
            <div className="absolute top-6 left-6 z-20 flex gap-2">
                <button 
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all border ${
                    showAnalysis 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' 
                    : 'bg-slate-900/50 border-slate-700 text-slate-400 backdrop-blur-md'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  {showAnalysis ? 'VISUALIZING STRUCTURE' : 'SHOW STRUCTURE'}
                </button>
                {isProcessing && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-[11px] font-bold">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    AI ANALYZING...
                  </div>
                )}
            </div>
          )}

          <Canvas 
            imageUrl={currentImage} 
            keypoints={keypoints} 
            showPoints={showAnalysis} 
          />

          {/* History / Gallery Strip */}
          {variants.length > 0 && (
            <div className="h-44 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 p-4 relative z-10">
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4" /> Design History
                </h3>
                <span className="text-[10px] text-slate-500">{variants.length} variations generated</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {/* Original */}
                <button 
                  onClick={() => setCurrentImage(originalImage)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all group ${currentImage === originalImage ? 'border-indigo-500 scale-105' : 'border-transparent hover:border-slate-700'}`}
                >
                  <img src={originalImage!} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-bold text-white uppercase">Original</span>
                  </div>
                </button>
                {/* Variants */}
                {variants.map((v) => (
                  <div key={v.id} className="relative group">
                    <button 
                      onClick={() => selectVariant(v)}
                      className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${currentImage === v.imageUrl ? 'border-indigo-500 scale-105 shadow-xl shadow-indigo-500/20' : 'border-transparent hover:border-slate-700'}`}
                    >
                      <img src={v.imageUrl} className="w-full h-full object-cover" />
                    </button>
                    <button 
                      onClick={() => setVariants(variants.filter(varnt => varnt.id !== v.id))}
                      className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Info Modal / Notification - Mock for UX feedback */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold">Dreaming up new designs...</h3>
                <p className="text-sm text-slate-400">
                    Applying {designState.material} textures and {designState.style} logic to your {designState.category}.
                </p>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
                </div>
                <style>{`
                    @keyframes loading {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(250%); }
                    }
                `}</style>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
