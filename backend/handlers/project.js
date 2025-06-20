import { PrismaClient } from "@prisma/client";
import { sendQueueMessage } from "../utils/queue-manager.js";
const prisma = new PrismaClient();

export const createProjectHandler = async (req, res) => {
    const { title, description, githubUrl, openAPISpec, prompt } = req.body;
    const userId = req.user.id;

    if (!title || !description) {
        return res.status(400).json({
            success: false,
            message: "Title and description are required",
            data: null,
        });
    }

    if (!githubUrl && !openAPISpec) {
        return res.status(400).json({
            success: false,
            message: "Either githubUrl or openAPISpec must be provided",
            data: null,
        });
    }

    if (githubUrl && openAPISpec) {
        return res.status(400).json({
            success: false,
            message: "Provide either githubUrl or openAPISpec, not both",
            data: null,
        });
    }

    const data = {
        title,
        description,
        prompt: prompt || "",
        userId,
        status: "Created",
    };

    if (githubUrl) {
        data.githubUrl = githubUrl;
    } else if (openAPISpec) {
        data.openAPISpec = openAPISpec;
    }

    const newProject = await prisma.project.create({
        data,
    });
    await sendQueueMessage(
        "generate-schema",
        JSON.stringify({
            projectId: newProject.id,
            userId: userId,
        })
    );
    res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: { projectId: newProject.id },
    });
};

export const getProjectsHandler = async (req, res) => {
    const userId = req.user.id;

    const projects = await prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            endpoints: true,
        },
    });

    res.status(200).json({
        success: true,
        message: "Projects fetched successfully",
        data: { projects },
    });
};

export const getProjectByIdHandler = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
            userId: userId,
        },
        include: {
            endpoints: true,
        },
    });

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
            data: null,
        });
    }

    res.status(200).json({
        success: true,
        message: "Project fetched successfully",
        data: { project },
    });
};

export const getProjectStatusHandler = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
            userId: userId,
        },
        select: {
            status: true,
            endpoints: true,
        },
    });

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
            data: null,
        });
    }

    res.status(200).json({
        success: true,
        message: "Project status fetched successfully",
        data: { status: project.status },
    });
};

export const getProjectSchemaHandler = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
            userId: userId,
        },
        select: {
            endpoints: true,
        },
    });

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
            data: null,
        });
    }

    if (!project.endpoints || project.endpoints.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Project schema not found",
            data: null,
        });
    }

    res.status(200).json({
        success: true,
        message: "Project schema fetched successfully",
        data: {
            endpoints: project.endpoints,
        },
    });
};

export const updateProjectSchemaHandler = async (req, res) => {
    const { projectId } = req.params;
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({
            success: false,
            message: "Prompt is required",
            data: null,
        });
    }

    const userId = req.user.id;
    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
            userId: userId,
        },
    });
    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
            data: null,
        });
    }
    await sendQueueMessage(
        "generate-schema",
        JSON.stringify({
            prompt,
            projectId: projectId,
            userId: userId,
        })
    );
    res.status(200).json({
        success: true,
        message: "Project schema update requested successfully",
        data: null,
    });
};

export const approveProjectSchemaHandler = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;
    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
            userId: userId,
        },
    });
    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
            data: null,
        });
    }
    if (project.status !== "SchemaGenerated") {
        return res.status(400).json({
            success: false,
            message: "Project schema is not generated yet, or already approved",
            data: null,
        });
    }
    await sendQueueMessage(
        "generate-code",
        JSON.stringify({
            projectId: projectId,
            userId: userId,
        })
    );
    res.status(200).json({
        success: true,
        message: "Project schema approved and code generation requested",
        data: null,
    });
};

export const getProjectCodeHandler = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
            userId: userId,
        },
        select: {
            generatedCode: true,
            dockerImageName: true,
        },
    });

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
            data: null,
        });
    }

    if (!project.generatedCode) {
        return res.status(404).json({
            success: false,
            message: "Project code not generated yet",
            data: null,
        });
    }

    res.status(200).json({
        success: true,
        message: "Project code fetched successfully",
        data: {
            code: project.generatedCode,
            imageName: project.dockerImageName,
        },
    });
};
