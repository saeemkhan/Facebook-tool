/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, BarChart3, History, CreditCard } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'optimize' | 'results' | 'history' | 'pricing';
  setActiveTab: (tab: 'optimize' | 'results' | 'history' | 'pricing') => void;
  hasResults: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, hasResults }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 px-6 flex items-center justify-between z-50 pb-safe">
      <button 
        onClick={() => setActiveTab('optimize')}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'optimize' ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[7px] font-black uppercase tracking-widest">Build</span>
      </button>

      <button 
        onClick={() => setActiveTab('results')}
        className={`flex flex-col items-center gap-1 transition-all ${!hasResults ? 'opacity-30 cursor-not-allowed' : ''} ${activeTab === 'results' ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
        disabled={!hasResults}
      >
        <BarChart3 className="w-5 h-5" />
        <span className="text-[7px] font-black uppercase tracking-widest">Feed</span>
      </button>

      <button 
        onClick={() => setActiveTab('history')}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <History className="w-5 h-5" />
        <span className="text-[7px] font-black uppercase tracking-widest">Logs</span>
      </button>

      <button 
        onClick={() => setActiveTab('pricing')}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'pricing' ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <CreditCard className="w-5 h-5" />
        <span className="text-[7px] font-black uppercase tracking-widest">Elite</span>
      </button>
    </nav>
  );
};
