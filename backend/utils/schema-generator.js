import { GoogleGenAI, Type } from "@google/genai";
import { config } from "dotenv";
config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

const expectedOutput = {
    responseMimeType: "application/json",
};
const modelName = "gemini-2.0-flash";

export async function parseOpenAPI(
    OpenAPI,
    initialPrompt = "",
    modifyPrompt = ""
) {
    const response = await ai.models.generateContent({
        model: modelName,
        contents: `JSON MODE ON
Provided with a OpenAPI specification from a backend service, 
extract the API routes present along with their allowed HTTP methods, 
successful output status code, 
expected input query parameters from the frontend, 
expected body parameters that the frontend would normally pass, 
and the response schemas from the backend in case of success or failure. 
Method, route names and response schema are compulsory.
NEVER GIVE INCOMPLETE OR PARTIAL RESPONSES.
The OpenAPI specification is provided below:\n\n${OpenAPI}
Initial User Prompt: ${initialPrompt}
User Prompt for Modification: ${modifyPrompt}
Expected Output Schema: ${JSON.stringify(expectedOutput, null, 2)}
Example Output:
[
    {
        "routeName": "/api/users",
        "method": "GET",
        "expectedStatusCode": 200,
        "queryParams": [
            {
                "value": "page",
                "required": false
            },
            {
                "value": "limit",
                "required": false
            }
        ],
        "bodyParams": [],
        "expectedSchema": [
            {
                "type": "object",
                "properties": {
                    "id": { "type": "string" },
                    "name": { "type": "string" }
                }
            }
        ]
    }
]`,
        config: expectedOutput,
    });

    return JSON.parse(response.text);
}

export async function parseCodeBase(
    codeBase,
    initialPrompt = "",
    modifyPrompt = ""
) {
    const response = await ai.models.generateContent({
        model: modelName,
        contents: `JSON MODE ON
Provided with the codebase of a project, 
you are expected to find out certain technical details regarding a web application 
where you need to throughly go through them and find out: 
extract the API routes that are potentially called from the frontend, 
response expected status code, 
query parameter being passed along with request, 
body parameters that the frontend passes to the backend, 
and the response schemas that the frontend would expect from the backend server. 
Method, route names and response schema are compulsory.
The codebase is provided below:\n\n${codeBase}
Initial User Prompt: ${initialPrompt}
User Prompt for Modification: ${modifyPrompt}
Expected Output Schema: ${JSON.stringify(expectedOutput.responseSchema, null, 2)}
Example Output:
[
    {
        "routeName": "/api/users",
        "method": "GET",
        "expectedStatusCode": 200,
        "queryParams": [
            {
                "value": "page",
                "required": false
            },
            {
                "value": "limit",
                "required": false
            }
        ],
        "bodyParams": [],
        "expectedSchema": [
            {
                "type": "object",
                "properties": {
                    "id": { "type": "string" },
                    "name": { "type": "string" }
                }
            }
        ]
    }
]`,
        config: expectedOutput,
    });

    return JSON.parse(response.text);
}