/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, Zap, Crown, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { createSubscription } from '../services/subscriptionService';

export const PricingScreen: React.FC = () => {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleSubscribe = async (plan: 'pro' | 'business') => {
    setLoading(plan);
    try {
      await createSubscription(plan);
    } catch (error) {
      alert("Billing portal unavailable. Check environment variables.");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'pro',
      name: 'Pro Viral',
      price: '19',
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      features: [
        '50 AI Generations / mo',
        'Real-time Trend Grounding',
        'Advanced Keyword Analysis',
        'History Sync',
        'Priority AI Queue'
      ]
    },
    {
      id: 'business',
      name: 'Agency Elite',
      price: '49',
      icon: <Crown className="w-6 h-6 text-amber-500" />,
      features: [
        'Unlimited Generations',
        'Batch Optimization',
        'Team Collaboration',
        'Custom Tone Voices',
        'White-label Reports'
      ],
      popular: true
    }
  ];

  return (
    <div className="space-y-8 no-scrollbar pb-10">
      <div className="space-y-2 text-center py-4">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none italic">Choose Your Plan</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Unlock unlimited viral potential</p>
      </div>

      <div className="space-y-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative glass p-8 rounded-[3rem] border-2 transition-all ${
              plan.popular ? 'border-blue-600/50 shadow-blue-900/10' : 'border-slate-800'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-blue-900/20">
                Most Popular
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800">
                {plan.icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">${plan.price}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">/ month</span>
                </div>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                  <Check className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="uppercase tracking-tight">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id as any)}
              disabled={!!loading}
              className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-2 ${
                plan.popular 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              } active:scale-95 disabled:opacity-50`}
            >
              <Rocket className="w-4 h-4" />
              {loading === plan.id ? 'Connecting...' : 'Upgrade Now'}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="text-center p-6 glass rounded-full border-slate-800">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-loose">
          Secure Payment via Stripe • Cancel Anytime • 7-Day Money Back Guarantee
        </p>
      </div>
    </div>
  );
};
