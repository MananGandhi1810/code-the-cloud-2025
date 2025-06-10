import { GoogleGenAI, Type } from "@google/genai";
import { config } from "dotenv";
config();

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GENAI_API_KEY});

export async function generateFakeData(schema) {
    const response = await ai.generate({
        model: "gemini-2.0-flash",
        prompt: `Generate fake data based on the following schema: ${JSON.stringify(schema)}`,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                data: {
                    name: Type.STRING,
                    value: {
                        type: Type.STRING,
                    }
                }
            }
        }
    });

    return response.data;
}