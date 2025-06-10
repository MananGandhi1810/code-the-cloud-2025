import { GoogleGenAI, Type } from "@google/genai";
import { config } from "dotenv";
config();

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GENAI_API_KEY});

const expectedOutput = {
        responseMimeType: "application/json",
        responseSchema: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,

            properties: {
                routeName: {
                    type: Type.STRING,
                },

                method: {
                    type: Type.STRING,
                },

                expectedStatusCode: {
                    type: Type.INTEGER,
                },

                queryParams: {
                    type: Type.ARRAY,
                    items: {
                        properties: {
                            value: {
                                type: Type.STRING,
                            },

                            required: {
                                type: Type.BOOLEAN,
                            },
                        }

                    },
                },

                bodyParams: {
                    type: Type.ARRAY,
                    items: {
                        properties: {
                            value: {
                                type: Type.STRING,
                            },

                            required: {
                                type: Type.BOOLEAN,
                            },
                        }

                    },
                },

                expectedSchema: {
                    type: Type.ARRAY,
                    items: {
                    type: Type.STRING,
                    },
                },
            },
        },

        },

    }

export async function parseOpenAPI(OpenAPI) {
    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents:
        `Provided with a OpenAPI specification from a backend service, extract the API routes present along with their allowed HTTP methods, successful output status code, expected input query parameters from the frontend, expected body parameters that the frontend would normally pass, and the response schemas from the backend in case of success or failure. The OpenAPI specification is provided below:\n\n${OpenAPI}`,
    config: 
        expectedOutput
    });

    return response;
}

export async function parseCodeBase(codeBase) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Provided with the codebase of a project, you are expected to find out certain technical details regarding a web application where you need to throughly go through them and find out: extract the API routes that are potentially called from the frontend, response expected status code, query parameter being passed along with request, body parameters that the frontend passes to the backend, and the response schemas that the frontend would expect from the backend server. The codebase is provided below:\n\n${codeBase}`,
        config: expectedOutput
    });

    return response;
}