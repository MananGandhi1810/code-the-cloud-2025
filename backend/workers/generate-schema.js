import { PrismaClient } from "@prisma/client";
import { getRepoCodeBase } from "../utils/github-api.js";

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
    const project = await prisma.project.findUnique({
        where: { id: projectId, userId: userId },
        select: {
            githubUrl: true,
            openAPISpec: true,
            user: true,
        },
    });

    if (!project) {
        throw new Error("Project not found");
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
    console.log("Data prepared for schema generation:", data);
    console.log("Project Initial Prompt:", project.prompt);
    console.log("Update Prompt:", prompt);

    const endpoints = {};

    await prisma.project.update({
        where: { id: projectId },
        data: {
            status: "SchemaGenerated",
            endpoints: {
                create: Object.entries(endpoints).map(([endpoint]) => ({
                    name: endpoint.routeName,
                    method: details.method,
                    bodyParams: details.bodyParams,
                    queryParams: details.queryParams,
                    expectedStatusCode: details.expectedStatusCode,
                    returnSchema: details.returnSchema,
                })),
            },
        },
    });
};


export default generateSchema