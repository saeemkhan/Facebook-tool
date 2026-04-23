import { GoogleGenAI, Type } from "@google/genai";
import { UserInputs, SeoOutput, VideoContext, Tone } from "../types";
import { VOICES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeVideoMedia(file: File): Promise<VideoContext> {
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        text: `Analyze this video for a Facebook content strategy. 
        Extract the following details as a JSON object:
        - visualElements: string[] (lighting, framing, colors, subjects)
        - audioElements: string[] (music vibe, voiceover presence, sound effects)
        - editingStyle: string[] (cut speed, transitions, text overlays, zoom effects)
        
        Return ONLY valid JSON with these keys.`
      },
      {
        inlineData: {
          mimeType: file.type,
          data: base64Data
        }
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          visualElements: { type: Type.ARRAY, items: { type: Type.STRING } },
          audioElements: { type: Type.ARRAY, items: { type: Type.STRING } },
          editingStyle: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["visualElements", "audioElements", "editingStyle"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse video analysis response", e);
    // Fallback if AI fails
    return {
      visualElements: ['Standard lighting', 'Mobile framing'],
      audioElements: ['Original audio detected'],
      editingStyle: ['Standard cuts']
    };
  }
}

async function callAIsWithRetry(
  prompt: string, 
  systemInstruction: any, 
  retries: number = 5, 
  delay: number = 3000,
  onRetry?: (attempt: number, delay: number) => void
): Promise<any> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      }
    });
    return response;
  } catch (error: any) {
    const errorMsg = error.message?.toLowerCase() || '';
    const isRetryable = 
      errorMsg.includes('429') || 
      errorMsg.includes('resource_exhausted') || 
      errorMsg.includes('high demand') || 
      errorMsg.includes('spike') ||
      error.status === 429;

    if (retries > 0 && isRetryable) {
      const jitter = delay * 0.2 * (Math.random() * 2 - 1);
      const finalDelay = delay + jitter;
      
      if (onRetry) onRetry(6 - retries, Math.round(finalDelay));
      
      console.warn(`[AI Strategy] 429 High Demand Detected. Retrying in ${Math.round(finalDelay)}ms... (${retries} attempts left)`);
      
      await new Promise(resolve => setTimeout(resolve, finalDelay));
      return callAIsWithRetry(prompt, systemInstruction, retries - 1, delay * 1.5, onRetry);
    }
    
    console.error("[AI Strategy] Critical API Error:", error);
    throw error;
  }
}

export async function generateFacebookSeoData(inputs: UserInputs, onRetry?: (attempt: number, waitTime: number) => void): Promise<SeoOutput> {
  const systemInstruction = VOICES[inputs.tone] || VOICES[Tone.Viral];

  const prompt = `
    Conduct deep real-time research into top-performing Facebook and social media content for:
    - Niche/Category: "${inputs.category}"
    - Content Format: "${inputs.contentType}"
    - Topic: "${inputs.topic}"
    - Target Audience: "${inputs.targetAudience}"
    - Tone/Style: "${inputs.tone}"
    - Language Requirements: "${inputs.language}"
    ${inputs.videoContext ? `
    - AI VIDEO ANALYSIS DATA:
        - Visual Elements: ${inputs.videoContext.visualElements.join(', ')}
        - Audio Cues: ${inputs.videoContext.audioElements.join(', ')}
        - Current Editing Style: ${inputs.videoContext.editingStyle.join(', ')}
    ` : ''}
    
    RESEARCH TASKS:
    1. Identify the 5 most viral Facebook posts/reels in this niche from last 30 days.
    2. Analyze their "Hooks" (first 3 seconds / first 2 lines): Identify the specific psychological mechanism (e.g., Negative Bias, Social Proof, Mystery, or Counter-Intuitive Claim).
    3. Study the comment sections to identify "Emotional Hotspots"—topics that triggered the highest density of shares and long-form comments.
    
    GENERATION GUIDELINES:
    ${inputs.videoContext ? `
    IMPORTANT: You MUST prioritize the "AI VIDEO ANALYSIS DATA" provided above. The generated content must be a direct extension of the video's technical DNA.
    
    HOW TO INFLUENCE CONTENT:
    1. Visuals -> Tone & Imagery: Use detected visual elements (e.g., lighting, color) to dictate the "vibe" of the hooks and captions. If visuals are "High-contrast," the tone should be "Bold/Dramatic."
    2. Audio -> Pacing & Language: Use audio cues (e.g., rhythmic, clear voiceover) to influence sentence length and rhythm. Upbeat audio demands punchy, short-sentence captions.
    3. Style -> Structure & Hook Type: Match the editing style (e.g., rough cut, dynamic zoom) to the hook archetype. A "Rough Cut" style pairs perfectly with an "Authentic/Vulnerable" hook.
    ` : ''}
    - Generate 3 high-impact hooks (Maximum 15 words each) using these archetypes:
        a) Curiosity-Driven (The "Zeigarnik Effect"): Create a mental itch that can only be scratched by reading the caption. Use an "Open Loop" that shares a result but hides the method. ${inputs.videoContext ? 'Reference specific visual cues or audio triggers found in the video analysis.' : ''}
        b) Emotionally Resonant (The "Primal Mirror"): Tap into a core human emotion (Status, Fear, Belonging, or Freedom) specifically for "${inputs.targetAudience}". ${inputs.videoContext ? 'Align this emotion with the detected visual mood.' : ''}
        c) Pattern Interrupt (The "Grip"): A declarative statement that violates the audience's typical scrolling expectations by challenging a universal industry "truth." ${inputs.videoContext ? 'Use the identified editing style (e.g. fast cuts or dynamic zoom) as the technical foundation for this interruption.' : ''}
    - Captions: Provide 5 SEO-optimized captions utilizing a hybrid of viral storytelling and algorithmic keyword placement. ${inputs.videoContext ? 'The narrative must explicitly complement the visual elements and rhythmic audio cues detected in the video.' : ''}
    ${inputs.videoContext ? `
    - PRODUCTION STRATEGY (VIDEO-DRIVEN): 
        1. Audio Sync: Suggest 3 trending audio tracks (specific genres or vibes) that harmonize perfectly with the detected visual mood (${inputs.videoContext.visualElements.join(', ')}).
        2. Visual Synergy: Recommend 2 specific transitions or visual effects that complement and elevate the identified editing style (${inputs.videoContext.editingStyle.join(', ')}).
        3. Strategic Angle: Propose a unique content angle or narrative hook that directly leverages these visual and audio patterns to maximize engagement specifically for "${inputs.targetAudience}" interested in "${inputs.topic}". 
        4. Engagement Link: For each suggestion, briefly explain HOW it drives retention (e.g., "fast cuts keep Gen Z focus") and shareability on Facebook.
    ` : ''}
    - Curate 20 trending hashtags. Analyze them for nuanced competition (High, Medium, Low), a relevance score (0.0 to 1.0) indicating niche-specific fit, and estimated potential reach. ${inputs.videoContext ? 'Include tags related to the cinematic visuals and editing style detected.' : ''} Crucially, include a "trendingVelocity" to indicate the life-cycle of the tag on Facebook's Discover/Reels feed:
        - 'Exploding': Viral breakout, massive sudden volume.
        - 'Rising': Consistent growth in engagement.
        - 'Steady': Established, reliable reach.
        - 'Emerging': Early signs of traction in specific micro-niches.
        - 'Peak': Maximum saturation, high competition, about to cool.
        - 'Declining': Dropping in relevance/velocity.
    - Map Primary and Secondary Keywords for Facebook SEO, providing a brief (1-sentence) explanation for each WHY it helps index this specific content for Facebook's search algorithm.
    - Design 3-5 high-conversion CTAs.
    - Provide a detailed Content Score (0-100) with technical improvement tips.
    - Include a specific Trend Analysis summarizing the current "winning" content formula for this topic.
    
    IMPORTANT: You must return ONLY a valid JSON object following this interface:
    {
      "captions": string[],
      "hooks": string[],
      "hashtags": { tag: string, competition: "High"|"Medium"|"Low", relevanceScore: number, potentialReach: string, trendingVelocity: "Exploding"|"Rising"|"Steady"|"Emerging"|"Peak"|"Declining" }[],
      "keywords": {
        "primary": { "term": string, "explanation": string }[],
        "secondary": { "term": string, "explanation": string }[]
      },
      "ctas": string[],
      "score": {
        "total": number,
        "breakdown": { "keywordUsage": number, "engagementPotential": number, "readability": number, "hashtagQuality": number, "hookStrength": number },
        "suggestions": string[]
      },
      "trendAnalysis": { "suggestedAngle": string, "bestPostingTime": string, "contentPattern": string }
    }
  `;

  const response = await callAIsWithRetry(prompt, systemInstruction, 5, 3000, onRetry);

  try {
    const text = response.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("AI Response Parsing Error:", e);
    console.log("Raw Response:", response.text);
    throw new Error("Failed to generate valid SEO optimization data.");
  }
}
