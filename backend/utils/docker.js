import Docker from "dockerode";
import os from "os";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const docker = new Docker();

const getDockerFile = ({ mainFile, dependencies, files }) => {
    return `FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
RUN echo '{"name":"app","version":"1.0.0","description":"","main":"index.js","scripts":{"start":"node ${mainFile}"},"dependencies":{}}' > package.json
RUN npm install ${dependencies.join(" ")}

FROM node:lts-alpine AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY . .
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["npm", "start"]`;
};

const buildDockerImage = async (projectId, { mainFile, dependencies, files }, userGhAcc) => {
    const dockerFileContent = getDockerFile({ mainFile, dependencies, files });
    const imageTag = `${process.env.DOCKER_REGISTRY}/${userGhAcc}/mock-api-server-${projectId}:latest`.toLowerCase();

    const tempDir = fs.mkdirSync(
        path
            .join(path.dirname(), "/projects", imageTag.split(":")[0] + "-")
            .replaceAll(/[^a-z0-9-]/g, "-")
    );
    const dockerFilePath = path.join(tempDir, "Dockerfile");
    fs.writeFileSync(dockerFilePath, dockerFileContent);
    for (const file of files) {
        const filePath = path.join(tempDir, file.fileName);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, file.contents);
    }
    console.log(
        fs.readdirSync(tempDir).map((file) => path.join(tempDir, file))
    );
    const contents = fs.readFileSync(dockerFilePath, "utf8");
    console.log("Dockerfile contents:", contents);

    const build = new Promise((resolve, reject) => {
        docker.buildImage(
            {
                context: tempDir,
                src: ["Dockerfile", ...files.map((file) => file.fileName)],
            },
            { t: imageTag },
            (err, stream) => {
                if (err) {
                    console.error("Error building Docker image:", err);
                    reject(err);
                } else {
                    stream.on("data", (data) => {
                        try {
                            const message = JSON.parse(data.toString());
                            if (message.error) {
                                reject(new Error(message.error));
                            }
                        } catch (parseError) {}
                    });
                    stream.on("end", () => {
                        console.log("Docker image built successfully");
                        resolve(imageTag);
                    });
                    stream.on("error", (err) => {
                        console.error("Error in Docker build stream:", err);
                        reject(err);
                    });
                }
            }
        );
    });
    
    return build
}

const pushDockerImage = async (imageName) => {
    const authConfig = {
        username: process.env.DOCKER_USERNAME,
        password: process.env.DOCKER_PASSWORD,
        serveraddress: process.env.DOCKER_REGISTRY,
    };

    const stream = await docker
        .getImage(imageName)
        .push({ authconfig: authConfig });

    return new Promise((resolve, reject) => {
        stream.on("data", (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.error) {
                    console.error("Error pushing Docker image:", message.error);
                    reject(new Error(message.error));
                }
            } catch (err) {}
        });
        stream.on("end", () => resolve("Image pushed successfully"));
        stream.on("error", (err) => reject(err));
    });
};

export { buildDockerImage, pushDockerImage, getDockerFile };