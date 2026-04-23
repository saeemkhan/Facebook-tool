/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export async function createSubscription(plan: 'pro' | 'business') {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan }),
    });

    const session = await response.json();
    
    if (session.url) {
      window.location.href = session.url;
      return;
    }

    const stripe = await stripePromise;
    if (stripe && session.id) {
       const result = await (stripe as any).redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
    }
  } catch (error) {
    console.error("Subscription Error:", error);
    throw error;
  }
}

export function getSubscriptionStatus(): 'free' | 'pro' | 'business' {
  // Simple simulation using localStorage and URL params
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  
  if (status === 'success') {
    localStorage.setItem('fb_seo_plan', 'pro');
  }

  return (localStorage.getItem('fb_seo_plan') as any) || 'free';
}
