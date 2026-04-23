/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SeoOutput } from '../types';
import { Check, Copy, TrendingUp, TrendingDown, Hash, Key, MousePointerClick, MessageSquare, Info, Zap, Sparkles, BarChart3, Facebook, Twitter, Linkedin, Users, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OutputPanelProps {
  data: SeoOutput | null;
  isLoading: boolean;
  onRefine: (modifier: string) => void;
  loadingMessage?: string;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ data, isLoading, onRefine, loadingMessage }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<string | null>(null);
  const [activeKeyword, setActiveKeyword] = React.useState<string | null>(null);
  const [refinementText, setRefinementText] = React.useState('');

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementText.trim()) return;
    onRefine(refinementText.trim());
    setRefinementText('');
  };

  const shareContent = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (!data) return;
    
    // Construct a brief shareable preview (Hook + First 2 hashtags)
    const text = `${data.hooks[0]}\n\n#sociallift #contentstrategy`;
    const url = window.location.href;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleKeyword = (term: string) => {
    setActiveKeyword(activeKeyword === term ? null : term);
  };

  if (isLoading) {
    return (
      <div id="output-loading" className="flex flex-col items-center justify-center h-[600px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-blue-100 dark:border-zinc-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h3 className="text-xl font-semibold mb-2 dark:text-white">{loadingMessage || 'AI Strategy in Progress'}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
          Analyzing viral patterns, mapping keywords, and crafting hooks for your specific niche...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div id="output-empty" className="flex flex-col items-center justify-center h-[600px] bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
        <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-zinc-100 dark:border-zinc-700">
          <TrendingUp className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-medium mb-1 dark:text-white">Ready to Optimize?</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-center mb-8">Fill in the details on the left to generate viral content.</p>
        
        {/* Social Proof Badge in Empty State */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 20}`} 
                  alt="User avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
              +12k
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-[11px] font-medium">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>Trusted by <span className="font-bold text-zinc-900 dark:text-white">12,400+</span> content creators</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="output-panel" className="space-y-8 no-scrollbar pb-10">
      {/* Social Proof Header */}
      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Trusted Content Hub</div>
            <div className="text-xs font-medium text-blue-900 dark:text-blue-100">Used by <span className="font-bold">12,402</span> creators today</div>
          </div>
        </div>
        <div className="hidden sm:flex -space-x-1.5">
          {[1, 2, 3].map((i) => (
            <img 
              key={i}
              className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900" 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=social${i}`} 
              alt="User" 
            />
          ))}
        </div>
      </div>

      {/* AI Refine Assistant */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">AI Refine Assistant</h4>
          <span className="text-[8px] font-black text-slate-600 uppercase italic flex items-center gap-1">
            <Zap className="w-2 h-2" /> Live Intelligence
          </span>
        </div>
        
        <form onSubmit={handleRefineSubmit} className="relative group">
          <input 
            type="text"
            value={refinementText}
            onChange={(e) => setRefinementText(e.target.value)}
            placeholder="e.g., 'make it punchier' or 'add a CTA for my bio'"
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-5 pr-14 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all shadow-xl"
          />
          <button 
            type="submit"
            disabled={!refinementText.trim()}
            className="absolute right-2 top-2 p-2.5 bg-blue-600 text-white rounded-xl active:scale-95 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-blue-900/40"
          >
            <Zap className="w-4 h-4" />
          </button>
        </form>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
          {[
            { label: "🚀 Viral", modifier: "Rewrite purely for extreme virality" },
            { label: "✂️ Shorter", modifier: "Make all captions much shorter and punchier" },
            { label: "📖 Stories", modifier: "Expand into long-form storytelling" },
            { label: "📣 Action", modifier: "Add a much stronger and clearer call to action" }
          ].map((action, idx) => (
            <button 
              key={idx}
              onClick={() => onRefine(action.modifier)}
              className="shrink-0 bg-slate-800/50 hover:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white px-4 py-2.5 rounded-xl border border-slate-700/50 transition-all active:scale-95"
            >
              {action.label}
            </button>
          ))}
        </div>
      </section>

      <div className="space-y-8">
        {/* Viral Hooks Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Viral Hooks</h4>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => copyToClipboard(data.hooks.join('\n\n'), 'hooks-all')}
                className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md transition-all flex items-center gap-1.5 border border-slate-700"
              >
                {copiedIndex === 'hooks-all' ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copiedIndex === 'hooks-all' ? 'Copied' : 'Copy All'}</span>
              </button>
              <span className="text-[8px] font-black text-slate-600 uppercase italic">Scroll-stoppers</span>
            </div>
          </div>
          <div className="space-y-3">
            {data.hooks.map((hook, i) => (
              <div key={i} className="group relative glass p-5 rounded-[2rem] text-sm border-l-4 border-l-blue-600 leading-snug text-slate-100 shadow-lg shadow-blue-900/5">
                <p className="pr-10 font-bold">{hook}</p>
                <button 
                  onClick={() => copyToClipboard(hook, `hook-${i}`)}
                  className="absolute top-4 right-4 p-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl active:scale-110 shadow-lg"
                >
                  {copiedIndex === `hook-${i}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Captions Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">SEO Optimized Captions</h4>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => copyToClipboard(data.captions.join('\n\n---\n\n'), 'captions-all')}
                className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md transition-all flex items-center gap-1.5 border border-slate-700"
              >
                {copiedIndex === 'captions-all' ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copiedIndex === 'captions-all' ? 'Copied' : 'Copy All'}</span>
              </button>
              <span className="text-[8px] font-black text-slate-600 uppercase italic">Algorithmic Match</span>
            </div>
          </div>
          <div className="space-y-4">
            {data.captions.slice(0, 3).map((caption, i) => (
              <div key={i} className="group relative glass p-6 rounded-[2rem] text-sm leading-relaxed text-slate-300 border-slate-800 shadow-xl">
                <button 
                  onClick={() => copyToClipboard(caption, `caption-${i}`)}
                  className="absolute top-4 right-4 p-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl active:scale-110 shadow-lg"
                >
                  {copiedIndex === `caption-${i}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                </button>
                <div className="whitespace-pre-wrap font-medium">{caption}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Tags Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Smart Hashtag Set</h4>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => copyToClipboard(data.hashtags.map((t: any) => `#${t.tag}`).join(' '), 'hashtags-all')}
                className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md transition-all flex items-center gap-1.5 border border-slate-700"
              >
                {copiedIndex === 'hashtags-all' ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copiedIndex === 'hashtags-all' ? 'Copied' : 'Copy All'}</span>
              </button>
              <span className="text-[8px] font-black text-slate-600 uppercase italic">Algorithmic Reach metrics</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {data.hashtags.map((tag: any, i) => (
              <div 
                key={i} 
                className="group p-3 rounded-2xl bg-slate-900 border border-slate-800 transition-all active:bg-slate-800 relative shadow-lg shadow-black/50"
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black text-white uppercase tracking-tight">#{tag.tag}</span>
                    {tag.trendingVelocity === 'Exploding' && <TrendingUp className="w-3 h-3 text-emerald-400 animate-pulse" />}
                    {tag.trendingVelocity === 'Rising' && <Zap className="w-3 h-3 text-blue-400" />}
                    {tag.trendingVelocity === 'Emerging' && <Sparkles className="w-3 h-3 text-amber-400" />}
                    {tag.trendingVelocity === 'Peak' && <BarChart3 className="w-3 h-3 text-purple-400" />}
                    {tag.trendingVelocity === 'Declining' && <TrendingDown className="w-3 h-3 text-rose-400" />}
                    {tag.trendingVelocity === 'Steady' && <Check className="w-3 h-3 text-slate-500" />}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tag.competition === 'High' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />}
                    {tag.competition === 'Medium' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />}
                    {tag.competition === 'Low' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />}
                    <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{tag.competition}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[7px] font-black uppercase tracking-widest border-t border-white/5 pt-1.5">
                   <span className="text-blue-500/80">Reach: {tag.potentialReach}</span>
                   <span className="text-slate-600">Rel: {Math.round((tag.relevanceScore || 0) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Keywords Map */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Keyword Indexing</h4>
          <div className="glass p-6 rounded-[2rem] border-slate-800 space-y-3 shadow-2xl">
            {[...data.keywords.primary, ...data.keywords.secondary].map((kw: any, i) => {
              const term = typeof kw === 'string' ? kw : kw.term;
              const explanation = typeof kw === 'string' ? '' : kw.explanation;
              const isPrimary = data.keywords.primary.some((p: any) => (typeof p === 'string' ? p === term : p.term === term));

              return (
                <div key={i} className="py-3 border-b border-white/5 last:border-0 group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-white uppercase tracking-tight">{term}</span>
                      {explanation && (
                        <button 
                          onClick={() => toggleKeyword(term)}
                          className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                            activeKeyword === term 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <Info className="w-3 h-3" />
                          <span>{activeKeyword === term ? 'Hide' : 'Learn More'}</span>
                        </button>
                      )}
                    </div>
                    <span className={`uppercase text-[8px] font-black tracking-widest px-2 py-0.5 rounded-md ${
                      isPrimary ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-800 text-slate-600'
                    }`}>
                      {isPrimary ? 'Priority' : 'Supporting'}
                    </span>
                  </div>
                  
                  <AnimatePresence>
                    {activeKeyword === term && explanation && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-blue-500/5 rounded-xl p-3 border border-blue-500/10">
                          <p className="text-[10px] text-blue-400/90 font-bold leading-relaxed italic">
                            {explanation}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Global Distribution */}
        <section className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Global Distribution</h4>
            <span className="text-[8px] font-black text-slate-600 uppercase italic">Push to Feed</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => shareContent('facebook')}
              className="flex flex-col items-center justify-center gap-2 p-4 glass rounded-3xl hover:bg-slate-800 transition-all border border-slate-800 group"
            >
              <div className="w-10 h-10 bg-[#1877F2]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Facebook className="w-5 h-5 text-[#1877F2] fill-[#1877F2]/20" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Facebook</span>
            </button>
            <button 
              onClick={() => shareContent('twitter')}
              className="flex flex-col items-center justify-center gap-2 p-4 glass rounded-3xl hover:bg-slate-800 transition-all border border-slate-800 group"
            >
              <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Twitter className="w-5 h-5 text-white" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Twitter (X)</span>
            </button>
            <button 
              onClick={() => shareContent('linkedin')}
              className="flex flex-col items-center justify-center gap-2 p-4 glass rounded-3xl hover:bg-slate-800 transition-all border border-slate-800 group"
            >
              <div className="w-10 h-10 bg-[#0A66C2]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform text-[#0A66C2]">
                <Linkedin className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">LinkedIn</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
