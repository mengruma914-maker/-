
import React, { useRef, useEffect } from 'react';
import { KeyPoint } from '../types';

interface CanvasProps {
  imageUrl: string | null;
  keypoints: KeyPoint[];
  showPoints: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ imageUrl, keypoints, showPoints }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!imageUrl) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 border-2 border-dashed border-slate-800 m-8 rounded-3xl bg-slate-900/30">
        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-slate-300">Upload a photo to start designing</p>
        <p className="text-sm mt-1">AI will automatically detect functional parts and structures</p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden group">
      <div ref={containerRef} className="relative max-w-full max-h-full rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
        <img 
          src={imageUrl} 
          alt="Design Preview" 
          className="max-w-full max-h-[70vh] object-contain transition-transform duration-500"
        />
        
        {showPoints && keypoints.map((kp, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 group/kp cursor-help"
            style={{ left: `${kp.x * 100}%`, top: `${kp.y * 100}%` }}
          >
            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-md animate-pulse ${
              kp.type === 'joint' ? 'bg-orange-500' : kp.type === 'strap' ? 'bg-indigo-500' : 'bg-emerald-500'
            }`} />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover/kp:opacity-100 transition-opacity bg-slate-900/90 text-[10px] text-white py-1 px-2 rounded whitespace-nowrap backdrop-blur-sm border border-slate-700">
              {kp.label}
            </div>
          </div>
        ))}

        <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-semibold border border-white/10">
                <div className="w-2 h-2 rounded-full bg-orange-500" /> Joints
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-semibold border border-white/10">
                <div className="w-2 h-2 rounded-full bg-indigo-500" /> Straps
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-semibold border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Padding
            </span>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
