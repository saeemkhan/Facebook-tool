/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Send, Loader2, Video, FileVideo } from 'lucide-react';
import { UserInputs, ContentType, Tone, Language, NicheCategory } from '../types';
import { CONTENT_TYPES, TONES, LANGUAGES, NICHE_CATEGORIES } from '../constants';
import { analyzeVideoMedia } from '../services/aiService';

interface InputPanelProps {
  onGenerate: (inputs: UserInputs) => void;
  isLoading: boolean;
  loadingMessage?: string;
}

export const InputPanel: React.FC<InputPanelProps> = ({ onGenerate, isLoading, loadingMessage }) => {
  const [formData, setFormData] = React.useState<UserInputs>({
    topic: '',
    contentType: ContentType.Post,
    category: NicheCategory.DigitalMarketing,
    targetAudience: '',
    tone: Tone.Viral,
    language: Language.English,
  });
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const videoContext = await analyzeVideoMedia(file);
      
      const analyzedTopic = `Video Analysis: ${file.name} - Visuals: ${videoContext.visualElements.join(', ')} - Audio: ${videoContext.audioElements.join(', ')} - Style: ${videoContext.editingStyle.join(', ')}`;
      
      const updatedFormData: UserInputs = {
        ...formData,
        topic: analyzedTopic,
        videoContext
      };
      
      setFormData(updatedFormData);
    } catch (error) {
      console.error("Video analysis failed:", error);
      // Fallback
      setFormData({
        ...formData,
        topic: `Video Uploaded: ${file.name} (Analysis failed, please describe the content)`
      });
    } finally {
      setIsAnalyzing(false);
      // Reset file input for next upload
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.topic.trim()) {
      onGenerate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Optimize Content</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Target Facebook's Algorithm</p>
      </div>

      <div className="space-y-6">
        {/* Main Topic */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pl-1">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Topic or Keywords</label>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all ${
                isAnalyzing 
                ? 'bg-blue-600/10 border-blue-500/50 text-blue-400 animate-pulse' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleVideoUpload} 
                accept="video/*" 
                className="hidden" 
              />
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  Analyzing Video...
                </>
              ) : (
                <>
                  <Video className="w-2.5 h-2.5" />
                  Analyze Video
                </>
              )}
            </button>
          </div>
          <textarea
            required
            placeholder="e.g. 5 steps to master React for beginners..."
            className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 text-sm text-white placeholder-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all min-h-[160px] resize-none leading-relaxed"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          />
        </div>

        {/* Primary Settings Group */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1">Type</label>
            <div className="relative">
              <select
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-xs font-bold text-white appearance-none transition-all focus:border-blue-600 cursor-pointer"
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value as any })}
              >
                {CONTENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1">Tone</label>
            <div className="relative">
              <select
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-xs font-bold text-white appearance-none transition-all focus:border-blue-600 cursor-pointer"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
              >
                {TONES.map(tone => {
                  const label = tone.charAt(0).toUpperCase() + tone.slice(1);
                  return <option key={tone} value={tone}>{label}</option>;
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Category Group */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1">Professional Niche</label>
          <div className="relative">
            <select
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-xs font-bold text-white appearance-none transition-all focus:border-blue-600 cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            >
              {NICHE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* Secondary Settings Group */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1">Audience</label>
            <input
              type="text"
              placeholder="Gen Z Creators"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-xs font-bold text-white placeholder-slate-700"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1">Language</label>
            <select
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-xs font-bold text-white appearance-none cursor-pointer"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            >
              {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || isAnalyzing || !formData.topic.trim()}
        className={`w-full py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-2xl ${
          isLoading || isAnalyzing 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 active:scale-95 active:shadow-inner'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-white/50" />
            {loadingMessage || 'Analyzing Patterns...'}
          </span>
        ) : isAnalyzing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-white/50" />
            Processing Video...
          </span>
        ) : 'Generate Strategy'}
      </button>

      <div className="pt-4 text-center">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">v1.2.0-SECURE • END-TO-END AI</p>
      </div>
    </form>
  );
};
