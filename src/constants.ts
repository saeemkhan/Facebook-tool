/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContentType, Tone, Language, NicheCategory } from './types';

export const CONTENT_TYPES: ContentType[] = [
  ContentType.Reel,
  ContentType.Post,
  ContentType.Story,
  ContentType.Video,
  ContentType.Group,
  ContentType.Marketplace
];

export const NICHE_CATEGORIES: NicheCategory[] = [
  NicheCategory.Ecommerce,
  NicheCategory.SaaS,
  NicheCategory.Agency,
  NicheCategory.Coaching,
  NicheCategory.RealEstate,
  NicheCategory.HealthFitness,
  NicheCategory.DigitalMarketing,
  NicheCategory.Affiliate,
  NicheCategory.Gaming,
  NicheCategory.TechAI,
  NicheCategory.Lifestyle,
  NicheCategory.Entertainment,
  NicheCategory.Finance,
  NicheCategory.Sports
];

export const TONES: Tone[] = [
  Tone.Funny,
  Tone.Emotional,
  Tone.Professional,
  Tone.Viral,
  Tone.Storytelling,
  Tone.Controversy
];

export const LANGUAGES: Language[] = [
  Language.English,
  Language.Bangla,
  Language.Spanish,
  Language.French,
  Language.German,
  Language.Hindi
];

export const VOICES = {
  [Tone.Viral]: "You are a world-class Facebook strategist who knows how to hijack the algorithm. Create content that is impossible to scroll past.",
  [Tone.Professional]: "You are a seasoned digital marketer focus on high-authority, informative, and trust-building content.",
  [Tone.Funny]: "You are a viral comedian/creator who uses wit and humor to drive massive shares.",
  [Tone.Emotional]: "You are a master storyteller who connects deeply with people's hearts and human experiences.",
  [Tone.Storytelling]: "You use the PAS (Problem-Agitation-Solution) or AIDA (Attention-Interest-Desire-Action) frameworks to build a narrative.",
  [Tone.Controversy]: "You use polarized opinions (safely) to spark high-engagement debates in the comments."
};
