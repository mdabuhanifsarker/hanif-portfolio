import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

export function getGemini() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Using mock responses.");
      return null;
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function getTravelRecommendation(projectType: string): Promise<string> {
  const gemini = getGemini();
  if (!gemini) {
    return "Based on your project, I recommend a 'Cinematic Noir' grade with 24fps rhythmic cuts to emphasize the high-end luxury feel.";
  }

  try {
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a world-class Video Editor. Recommend a specific post-production "Cinematic Recipe" (Editing style, Color Palette, and Sound Mood) for a project of type: ${projectType}. Keep it under 180 characters and sound technical yet inspiring.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "A sleek, high-contrast visual style with rhythmic sound design would elevate this piece.";
  }
}
