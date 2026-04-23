/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ContentType {
  Reel = 'Reel',
  Post = 'Post',
  Story = 'Story',
  Video = 'Video',
  Group = 'Group',
  Marketplace = 'Marketplace'
}
export enum Tone {
  Funny = 'funny',
  Emotional = 'emotional',
  Professional = 'professional',
  Viral = 'viral',
  Storytelling = 'storytelling',
  Controversy = 'controversy'
}

export enum Language {
  English = 'English',
  Bangla = 'Bangla',
  Spanish = 'Spanish',
  French = 'French',
  German = 'German',
  Hindi = 'Hindi'
}

export enum NicheCategory {
  Ecommerce = 'E-commerce',
  SaaS = 'SaaS',
  Agency = 'Agency',
  Coaching = 'Coaching',
  RealEstate = 'Real Estate',
  HealthFitness = 'Health/Fitness',
  DigitalMarketing = 'Digital Marketing',
  Affiliate = 'Affiliate',
  Gaming = 'Gaming',
  TechAI = 'Tech/AI',
  Lifestyle = 'Lifestyle',
  Entertainment = 'Entertainment',
  Finance = 'Finance',
  Sports = 'Sports'
}

export interface VideoContext {
  visualElements: string[];
  audioElements: string[];
  editingStyle: string[];
}

export interface UserInputs {
  topic: string;
  contentType: ContentType;
  category: NicheCategory;
  targetAudience: string;
  tone: Tone;
  language: Language;
  videoContext?: VideoContext;
}

export interface SeoOutput {
  captions: string[];
  hooks: string[];
  hashtags: {
    tag: string;
    competition: 'High' | 'Medium' | 'Low';
    relevanceScore: number;
    potentialReach: string;
    trendingVelocity: 'Steady' | 'Rising' | 'Exploding' | 'Emerging' | 'Peak' | 'Declining';
  }[];
  keywords: {
    primary: { term: string; explanation: string }[];
    secondary: { term: string; explanation: string }[];
  };
  ctas: string[];
  score: {
    total: number;
    breakdown: {
      keywordUsage: number;
      engagementPotential: number;
      readability: number;
      hashtagQuality: number;
      hookStrength: number;
    };
    suggestions: string[];
  };
  trendAnalysis: {
    suggestedAngle: string;
    bestPostingTime: string;
    contentPattern: string;
  };
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  inputs: UserInputs;
  output: SeoOutput;
}
