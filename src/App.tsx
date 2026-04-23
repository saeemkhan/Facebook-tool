/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { SeoScorer } from './components/SeoScorer';
import { HistorySidebar } from './components/HistorySidebar';
import { ThemeToggle } from './components/ThemeToggle';
import { BottomNav } from './components/BottomNav';
import { PricingScreen } from './components/PricingScreen';
import { UserInputs, SeoOutput, HistoryItem } from './types';
import { generateFacebookSeoData } from './services/aiService';
import { getSubscriptionStatus } from './services/subscriptionService';
import { Share2, Plus, LayoutPanelTop, Menu, X, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState("Synthesizing Strategy...");
  const [currentResult, setCurrentResult] = React.useState<SeoOutput | null>(null);
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = React.useState<'optimize' | 'results' | 'history' | 'pricing'>('optimize');
  const [userPlan, setUserPlan] = React.useState<'free' | 'pro' | 'business'>('free');

  // Load history and subscription status
  React.useEffect(() => {
    setUserPlan(getSubscriptionStatus());
    const saved = localStorage.getItem('fb_seo_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleGenerate = async (inputs: UserInputs, modifier?: string) => {
    setIsLoading(true);
    setLoadingMessage("Analyzing Viral Trends...");

    try {
      let finalInputs = { ...inputs };
      if (modifier) {
        finalInputs.topic = `${inputs.topic} (Note: ${modifier})`;
      }

      const data = await generateFacebookSeoData(finalInputs, (attempt, wait) => {
        setLoadingMessage(`Model Busy (Attempt ${attempt}/5). Retrying in ${Math.round(wait/1000)}s...`);
      });

      setCurrentResult(data);
      setActiveTab('results');
      
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        inputs: finalInputs,
        output: data
      };
      
      const updatedHistory = [newHistoryItem, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      localStorage.setItem('fb_seo_history', JSON.stringify(updatedHistory));
    } catch (error: any) {
      console.error(error);
      const isQuota = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('high demand');
      
      if (isQuota) {
        alert("The AI model is currently under extreme load. Please wait a few minutes and try again.");
      } else {
        alert("Something went wrong while generating content. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage("Synthesizing Strategy...");
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentResult(item.output);
    setActiveTab('results');
  };

  const handleDeleteHistory = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('fb_seo_history', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear all history?")) {
      setHistory([]);
      localStorage.removeItem('fb_seo_history');
    }
  };

  const handleRefine = (modifier: string) => {
    if (history.length > 0) {
      handleGenerate(history[0].inputs, modifier);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] font-sans selection:bg-blue-900/30 overflow-hidden text-slate-200 mobile-app-shell">
      
      {/* Mobile Top Header */}
      <header className="h-16 shrink-0 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Share2 className="text-white w-4 h-4" />
          </div>
          <span className="text-xs font-black tracking-widest text-slate-300 uppercase">SocialLift</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">
              {userPlan === 'business' ? 'UNLIMITED' : userPlan === 'pro' ? '50 CREDITS' : '5 CREDITS'}
            </div>
            <div className={`w-16 h-1 rounded-full mt-1 overflow-hidden ${userPlan !== 'free' ? 'bg-blue-900' : 'bg-slate-800'}`}>
              <div className={`h-full rounded-full ${userPlan !== 'free' ? 'w-full bg-blue-400' : 'w-1/4 bg-blue-500'}`}></div>
            </div>
          </div>
          {userPlan !== 'free' && (
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Zap className="w-3 h-3 text-blue-500 fill-blue-500" />
            </div>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Screen Feed */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 pt-4 px-4 bg-gradient-to-b from-slate-950 to-black">
        <AnimatePresence mode="wait">
          {activeTab === 'optimize' && (
            <motion.div
              key="optimize"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto"
            >
              <InputPanel onGenerate={handleGenerate} isLoading={isLoading} loadingMessage={loadingMessage} />
            </motion.div>
          )}

          {activeTab === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-md mx-auto space-y-6"
            >
              {currentResult ? (
                <>
                  <SeoScorer data={currentResult} />
                  <OutputPanel 
                    data={currentResult} 
                    isLoading={isLoading} 
                    onRefine={handleRefine}
                    loadingMessage={loadingMessage}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 glass rounded-3xl">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No active strategy</h3>
                  <p className="text-sm text-slate-400">Generate a strategy in the Optimize tab to see your results here.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-md mx-auto"
            >
              <HistorySidebar 
                history={history} 
                onSelect={handleSelectHistory} 
                onClear={handleClearHistory}
                onDelete={handleDeleteHistory}
              />
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-md mx-auto"
            >
              <PricingScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Fixed Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasResults={!!currentResult}
      />
    </div>
  );
}
