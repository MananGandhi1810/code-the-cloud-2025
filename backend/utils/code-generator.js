import { GoogleGenAI, Type } from "@google/genai";
import { config } from "dotenv";
config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

const generateCodeFromEndpoints = async (endpoints, prompt = "") => {
    const expectedOutput = {
        responseMimeType: "application/json",
    };
    const modelName = "gemini-2.0-flash";

    const response = await ai.models.generateContent({
        model: modelName,
        contents: `JSON MODE ON
You are an expert JavaScript Express.js developer. Your task is to create a Mock API server using the provided API endpoints.
Use Dummy data for the responses, and ensure that the API server can handle all the specified endpoints.
Use proper error handling and return appropriate HTTP status codes.
ONLY USE EXPRESS.JS FOR THE MOCK API SERVER.
Write all files required to run the server, including the main server file and any necessary route files.
Do not create a package.json file or any other configuration file, just write the requirements into the output schema.
I am going to Dockerize the server using my own Dockerfile, so do not include any Docker-related code that may cause conflicts.
NEVER GIVE INCOMPLETE OR PARTIAL RESPONSES. Always provide the complete code for the server, no matter how many endpoints are provided.
Just focus on the API endpoints and their responses.
THIS IS A MOCK API SERVER, so do not implement any real business logic or database connections.
If you need to simulate a database or business logic, use an object to store data in memory.
Always create a /details endpoint that returns the server details, including the endpoints and their descriptions.
If a route requires business logic, use random variables or dummy data to simulate the response.
Adhere to the query parameters, body parameters, and response schemas as specified in the endpoints.
DO NOT JUST LOOP THROUGH THE ENDPOINTS AND RETURN A SINGLE RESPONSE.
Create individual route handlers for each endpoint with the specified HTTP methods and simulated responses.
Check the port number in environment variables and .env file, and if not found, use port 3000.
Set up default data such as OTP = 123456 or 1a2b3c4d5e6f7g8h9i0j for the server.
If the project needs authenticated routes, check if a bearer token is provided in the request headers but don't implement any authentication logic.
Do not nest the files in any directories, just create all files in the root directory.
Randomly inject delay in the responses to simulate real-world API behavior, but only upto 200ms.
Randomly inject errors in the responses to simulate real-world API behavior, but only upto 2% of the time.
The endpoints are provided below:\n\n${JSON.stringify(endpoints, null, 2)}
Initial User Prompt: ${prompt}
Expected Output Schema: {
        files: [
            {
                fileName: "api.js",
                contents: "export const apiEndpoints = ${JSON.stringify(endpoints, null, 2)};"
            },...
        dependencies: [
            "express",
            "body-parser",
            "cors",
        ],
        mainFile: "server.js",
        details: Any additional details or instructions for the server setup, or default data such as OTP = 123456
    ]
}`,
        config: expectedOutput,
    });

    const generatedCode = response.text
        .trim()
        .replace(/^\s*```json\s*|\s*```$/g, "");
    return JSON.parse(generatedCode);;
};

export { generateCodeFromEndpoints };