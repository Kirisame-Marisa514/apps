import { GoogleGenAI, Type } from "@google/genai";
import { RiddleData, Language } from "../types";

const apiKey = process.env.API_KEY || '';

// Fallback riddle in case API fails or key is missing
const FALLBACK_RIDDLE_EN: RiddleData = {
  question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
  options: ["An Echo", "A Ghost", "A Cloud", "A Bat"],
  answer: "An Echo"
};

const FALLBACK_RIDDLE_ZH: RiddleData = {
  question: "千条线，万条线，掉到水里看不见。是什么？",
  options: ["雨", "头发", "针", "鱼线"],
  answer: "雨"
};

export const fetchMorningRiddle = async (language: Language = 'en'): Promise<RiddleData> => {
  if (!apiKey) {
    console.warn("No API Key found, using fallback riddle.");
    return language === 'zh' ? FALLBACK_RIDDLE_ZH : FALLBACK_RIDDLE_EN;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const langPrompt = language === 'zh' ? 'Chinese (Simplified)' : 'English';
    const contents = `Generate a clever, short morning riddle to wake someone up in ${langPrompt}. Provide the question, 4 distinct options (one correct), and the correct answer string. Ensure the output is in ${langPrompt}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            answer: { type: Type.STRING }
          },
          required: ["question", "options", "answer"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as RiddleData;
    }
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Gemini API Error:", error);
    return language === 'zh' ? FALLBACK_RIDDLE_ZH : FALLBACK_RIDDLE_EN;
  }
};