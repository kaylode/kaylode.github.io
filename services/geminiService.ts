
import { GoogleGenAI } from "@google/genai";
import { PROFILE_DATA, ACADEMIA_DATA, EXPERIENCES_DATA, BLOG_POSTS, TIMELINE_EVENTS, TRACKING_DATA } from "@/constants";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    if (!apiKey && typeof window !== 'undefined') {
      console.warn("Gemini API key is not set.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const askResearcher = async (question: string) => {
  const ai = getAI();
  // ... rest of the function
  const context = `
    You are an AI assistant for ${PROFILE_DATA.name}, an academic.
    Professional Background:
    - Bio: ${PROFILE_DATA.bio}
    - Key Milestones (Timeline): ${TIMELINE_EVENTS.map(t => `${t.date}: ${t.title} at ${t.institution || 'N/A'}`).join("; ")}
    - Recent Publications: ${ACADEMIA_DATA.publications.map(p => p.title).join(", ")}
    - Industry Roles: ${EXPERIENCES_DATA.industry.map(i => i.role + " at " + i.company).join(", ")}
    - Technical Skills: ${EXPERIENCES_DATA.keywords.join(", ")}
    
    Personal Progress & Tracking:
    - LeetCode Solved: ${TRACKING_DATA.leetcode.solved} (Streak: ${TRACKING_DATA.leetcode.streak} days)
    - GitHub Commits (Month): ${TRACKING_DATA.github.monthlyCommits}
    - Travel: ${TRACKING_DATA.travel.totalCountries} countries visited, including ${TRACKING_DATA.travel.countries.slice(0, 3).join(", ")}
    - Other Goals: ${TRACKING_DATA.goals.map(g => `${g.title}: ${g.current}/${g.total} ${g.unit}`).join("; ")}

    Answer the following question about their career journey, research, or personal milestones in a helpful, concise, and professional tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: context + "\n\nQuestion: " + question,
    });
    return response.text || "I'm sorry, I couldn't process that right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI assistant is temporarily offline.";
  }
};
