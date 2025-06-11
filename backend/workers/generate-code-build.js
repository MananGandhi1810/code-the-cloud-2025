import { PrismaClient } from "@prisma/client";
import { generateCodeFromEndpoints } from "../utils/code-generator.js";
import { buildDockerImage, pushDockerImage } from "../utils/docker.js";

const prisma = new PrismaClient();

const generateCode = async ({ projectId, userId }) => {
    let project = await prisma.project.findUnique({
        where: { id: projectId, userId: userId },
        select: {
            endpoints: true,
            prompt: true,
            user: {
                select: {
                    ghAccessToken: true,
                },
            },
        },
    });
    try {
        if (!project) {
            throw new Error("Project not found");
        }
        const { endpoints } = project;
        if (!endpoints || endpoints.length === 0) {
            throw new Error("No endpoints found for the project");
        }
        await prisma.project.update({
            where: { id: projectId },
            data: {
                status: "GeneratingCode",
            },
        });
        const code = await generateCodeFromEndpoints(endpoints, project.prompt);
        if (!code) {
            throw new Error("Failed to generate code from endpoints");
        }
        console.log("Generated code:", code);
        await prisma.project.update({
            where: { id: projectId },
            data: {
                generatedCode: code,
                status: "BuildingImage",
            },
        });
    } catch (error) {
        console.error("Error generating code:", error);
        await prisma.project.update({
            where: { id: projectId },
            data: {
                status: "CodeGenerationFailed",
            },
        });
        return;
    }
    project = await prisma.project.findUnique({
        where: { id: projectId, userId: userId },
        select: {
            generatedCode: true,
            user: {
                select: {
                    ghUsername: true,
                },
            },
        },
    });
    try {
        const image = await buildDockerImage(
            projectId,
            project.generatedCode,
            project.user.ghUsername
        );
        await pushDockerImage(image);
        await prisma.project.update({
            where: { id: projectId },
            data: {
                status: "ImagePublished",
                dockerImageName: image,
            },
        });
    }
    catch (error) {
        console.error("Error building Docker image:", error);
        await prisma.project.update({
            where: { id: projectId },
            data: {
                status: "ImageBuildFailed",
            },
        });
        return;
    }
};

export default generateCode;