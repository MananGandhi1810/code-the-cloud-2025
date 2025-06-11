import { PrismaClient } from "@prisma/client";
import { getRepoCodeBase } from "../utils/github-api.js";
import { parseCodeBase, parseOpenAPI } from "../utils/schema-generator.js";
import sendEmail from "../utils/email.js";

const prisma = new PrismaClient();

const prepareSchemaData = async (githubUrl, openAPISpec, token = "") => {
    let data = "";
    if (githubUrl) {
        data = (await getRepoCodeBase(githubUrl, token))
            .map((file) => `${file.fileName}:\n${file.contents}`)
            .join("\n\n");
    }
    else if (openAPISpec) {
        data = JSON.stringify(openAPISpec);
    } else {
        throw new Error("Either githubUrl or openAPISpec must be provided");
    }
    return data;
};


const generateSchema = async ({ projectId, userId, prompt = "" }) => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId, userId: userId },
            select: {
                title: true,
                githubUrl: true,
                openAPISpec: true,
                user: true,
                prompt: true,
                endpoints: true,
            },
        });

        if (!project) {
            throw new Error("Project not found");
        }

        if (prompt) {
            const currentSchema = JSON.stringify(project.endpoints) || "";
            prompt = `Current Schema:\n${currentSchema}\n\nModify the schema based on the following prompt:\n${prompt}`;
        }

        await prisma.project.update({
            where: { id: projectId },
            data: {
                prompt,
                status: "SchemaGenerating",
            },
        });

        const { githubUrl, openAPISpec } = project;

        const data = await prepareSchemaData(
            githubUrl,
            openAPISpec,
            githubUrl != null ? project.user.ghAccessToken : null
        );

        let endpoints;
        if (githubUrl) {
            endpoints = await parseCodeBase(data, project.prompt, prompt);
        } else if (openAPISpec) {
            endpoints = await parseOpenAPI(data, project.prompt, prompt);
        } else {
            throw new Error("Either githubUrl or openAPISpec must be provided");
        }
        console.log("Endpoints extracted:", JSON.stringify(endpoints, null, 2));

        await prisma.project.update({
            where: { id: projectId },
            data: {
                status: "SchemaGenerated",
                endpoints: {
                    create: endpoints.map((endpoint) => ({
                        name: endpoint.routeName,
                        method: endpoint.method,
                        bodyParams: endpoint.bodyParams ?? [],
                        queryParams: endpoint.queryParams ?? [],
                        expectedStatusCode: endpoint.expectedStatusCode,
                        returnSchema: endpoint.returnSchema,
                    })),
                },
            },
        });
        await sendEmail(
            project.user.email,
            "Schema Generation Complete",
            `Your schema has been successfully generated for the project "${project.title}". The project is now waiting for your approval to proceed with code generation. Please check your dashboard for more details.`
        );
        console.log("Schema generation completed successfully.");
    } catch (error) {
        console.error("Error generating schema:", error);
        await prisma.project.update({
            where: { id: projectId },
            data: {
                status: "SchemaGenerationFailed",
            },
        });
    }
};


export default generateSchema;