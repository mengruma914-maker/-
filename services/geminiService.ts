
import { GoogleGenAI, Type } from "@google/genai";
import { DesignState, KeyPoint } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeGearImage = async (base64Image: string): Promise<{ 
  category: string; 
  analysis: string;
  keypoints: KeyPoint[];
}> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: 'Analyze this protective gear. Identify its category, functional regions, and key design elements. Provide a JSON response with category name, detailed analysis text, and normalized coordinates (0-1) for keypoints like joints, straps, and protective padding.' }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          analysis: { type: Type.STRING },
          keypoints: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                label: { type: Type.STRING },
                type: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateDesignVariant = async (
  baseImage: string, 
  config: DesignState
): Promise<string> => {
  const prompt = `Professional product design update for this ${config.category}. 
    Style: ${config.style}. 
    Materials: Primary material should be ${config.material}.
    Colors: Main color ${config.mainColor}, accents in ${config.accentColor}.
    Setting: Place the product in a ${config.scenario} background.
    Requirements: Maintain the functional structure and proportions of the original gear. Enhance the aesthetic with professional lighting, crisp textures, and clean background. Focus on ${config.style === 'Geometric/Futuristic' ? 'geometric facets and sharp lines' : 'ergonomic curves and high-performance textiles'}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: baseImage, mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    }
  });

  let imageUrl = '';
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }
  return imageUrl;
};
