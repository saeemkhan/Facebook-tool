/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SeoOutput } from '../types';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SeoScorerProps {
  data: SeoOutput | null;
}

export const SeoScorer: React.FC<SeoScorerProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div id="seo-scorer" className="bg-transparent mb-4">
      <div className="glass p-6 rounded-[2.5rem] border-slate-800 flex items-center gap-6">
        {/* Score Ring */}
        <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-800"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={226}
              initial={{ strokeDashoffset: 226 }}
              animate={{ strokeDashoffset: 226 - (226 * data.score.total) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-blue-500"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-2xl font-black text-white">{data.score.total}</span>
            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Score</p>
          </div>
        </div>

        {/* Report Summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Targeting: {data.trendAnalysis.contentPattern}</h3>
          </div>
          <p className="text-[10px] text-slate-400 font-bold leading-relaxed line-clamp-2 uppercase">
            {data.score.suggestions[0]}
          </p>
          
          <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
            {Object.entries(data.score.breakdown).map(([key, value]) => (
              <span key={key} className="shrink-0 px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-tighter">
                {key.replace(/([A-Z])/g, ' $1').trim()}: {value}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
