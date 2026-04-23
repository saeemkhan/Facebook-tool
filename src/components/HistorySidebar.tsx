/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { History, Clock, ChevronRight, Trash2, Layout, Filter } from 'lucide-react';
import { HistoryItem } from '../types';
import { CONTENT_TYPES } from '../constants';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onClear, onDelete }) => {
  const [selectedType, setSelectedType] = React.useState<string>('All');

  const filteredHistory = selectedType === 'All' 
    ? history 
    : history.filter(item => item.inputs.contentType === selectedType);

  const filters = ['All', ...CONTENT_TYPES];

  return (
    <div id="history-screen" className="flex flex-col min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-black uppercase tracking-tight text-white">Strategy History</h2>
        </div>
        {history.length > 0 && (
          <button 
            onClick={onClear} 
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-500/20"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 shrink-0">
        <div className="flex items-center gap-2 px-3 bg-slate-900 border border-slate-800 rounded-xl mr-1">
          <Filter className="w-3 h-3 text-slate-500" />
        </div>
        {filters.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
              selectedType === type
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center glass rounded-3xl border-slate-800">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-slate-700" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {history.length === 0 ? "No optimizations yet" : `No history for ${selectedType}`}
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="group relative p-5 glass hover:bg-slate-900 border border-slate-800 rounded-3xl cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-base font-black text-white truncate pr-4">{item.inputs.topic}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded uppercase tracking-tighter shadow-lg shadow-blue-900/40">
                      {item.inputs.contentType}
                    </span>
                    <span className="text-[9px] font-black bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase tracking-tighter border border-slate-700">
                      {item.inputs.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    className="p-2 text-slate-500 hover:text-red-500 transition-all bg-slate-800 rounded-xl border border-slate-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-slate-700" />
                </div>
              </div>
              
              <div className="flex items-center gap-4 pt-3 border-t border-slate-800/50">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{item.output.score.total} Score</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{item.output.hashtags.length} Tags</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 p-6 glass rounded-3xl border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-500">
          <Layout className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">SocialLift Mobile v1.0</span>
        </div>
        <span className="text-[9px] font-black text-blue-500 uppercase">PRO ACTIVE</span>
      </div>
    </div>
  );
};
