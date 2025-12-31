import React from 'react';
import { Microscope } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Microscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">ResearchData Extractor</h1>
            <p className="text-xs text-slate-500 font-medium">Powered by Gemini 3 Pro</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <a 
                href="#" 
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                onClick={(e) => e.preventDefault()}
            >
                Documentation
            </a>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">v1.0.0</span>
        </div>
      </div>
    </header>
  );
};
