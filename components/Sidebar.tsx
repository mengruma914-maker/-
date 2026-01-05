
import React from 'react';
import { 
  GearCategory, 
  DesignStyle, 
  MaterialType, 
  Scenario, 
  DesignState 
} from '../types';
import { 
  Activity, 
  Shield, 
  Box, 
  Palette, 
  Image as ImageIcon,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  state: DesignState;
  setState: React.Dispatch<React.SetStateAction<DesignState>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ state, setState, onGenerate, isLoading }) => {
  return (
    <div className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col custom-scrollbar overflow-y-auto">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
          <Shield className="w-6 h-6" />
          GuardAI Studio
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Advanced Gear Designer</p>
      </div>

      <div className="p-6 space-y-8 flex-1">
        {/* Category */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Box className="w-4 h-4" /> Category
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(GearCategory).map((cat) => (
              <button
                key={cat}
                onClick={() => setState({ ...state, category: cat })}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  state.category === cat 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Style */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Design Concept
          </label>
          <select
            value={state.style}
            onChange={(e) => setState({ ...state, style: e.target.value as DesignStyle })}
            className="w-full bg-slate-800 border-none rounded-lg p-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.values(DesignStyle).map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </section>

        {/* Materials */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4" /> Primary Material
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(MaterialType).map((mat) => (
              <button
                key={mat}
                onClick={() => setState({ ...state, material: mat })}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-all border ${
                  state.material === mat 
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-200' 
                  : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Palette className="w-4 h-4" /> Color Palette
          </label>
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Primary</span>
              <input 
                type="color" 
                value={state.mainColor} 
                onChange={(e) => setState({...state, mainColor: e.target.value})}
                className="w-full h-10 bg-transparent rounded cursor-pointer border-none"
              />
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Accent</span>
              <input 
                type="color" 
                value={state.accentColor} 
                onChange={(e) => setState({...state, accentColor: e.target.value})}
                className="w-full h-10 bg-transparent rounded cursor-pointer border-none"
              />
            </div>
          </div>
        </section>

        {/* Scenarios */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Context Scene
          </label>
          <select
            value={state.scenario}
            onChange={(e) => setState({ ...state, scenario: e.target.value as Scenario })}
            className="w-full bg-slate-800 border-none rounded-lg p-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.values(Scenario).map((scen) => (
              <option key={scen} value={scen}>{scen}</option>
            ))}
          </select>
        </section>
      </div>

      <div className="p-6 sticky bottom-0 bg-slate-900 border-t border-slate-800">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            isLoading 
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/40'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Design
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
