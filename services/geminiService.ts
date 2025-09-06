import { GoogleGenAI, Type } from "@google/genai";
import type { DiseaseInfo } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      const mimeType = result.split(';')[0].split(':')[1];
      if (base64 && mimeType) {
        resolve({ base64, mimeType });
      } else {
        reject(new Error("Failed to read file as base64."));
      }
    };
    reader.onerror = error => reject(error);
  });
};

const diseaseInfoSchema = {
  type: Type.OBJECT,
  properties: {
    isHealthy: { type: Type.BOOLEAN, description: "True if the plant is healthy.", nullable: true },
    healthyMessage: { type: Type.STRING, description: "A message if the plant is healthy.", nullable: true },
    diseaseName: { type: Type.STRING, description: "The common name of the identified disease.", nullable: true },
    description: { type: Type.STRING, description: "A detailed description of the disease.", nullable: true },
    treatmentSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of actionable treatment suggestions.",
      nullable: true
    },
    preventativeCare: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of tips for preventing this disease in the future.",
      nullable: true
    },
    error: { type: Type.STRING, description: "An error message if analysis is not possible.", nullable: true },
  },
};

export const analyzePlantImage = async (base64Image: string, mimeType: string): Promise<DiseaseInfo> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: "You are an expert agricultural botanist specializing in plant pathology. Analyze this image of a plant leaf. Identify any diseases or pests. Respond ONLY in JSON format matching the schema. If a disease is found, provide its name, description, treatments, and prevention tips. If the plant is healthy, set isHealthy to true. If the image isn't a plant or is unclear, provide an error message.",
                    },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: diseaseInfoSchema,
            },
        });

        const text = response.text.trim();
        const parsedJson = JSON.parse(text) as DiseaseInfo;

        if (parsedJson.error) {
            throw new Error(parsedJson.error);
        }

        return parsedJson;

    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to analyze the image. The AI model may be unavailable or the image could not be processed. Please try again later.");
    }
};
