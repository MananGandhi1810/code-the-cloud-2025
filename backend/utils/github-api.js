import axios from "axios";
import { exists, get, set } from "./keyvalue-db.js";
import tar from 'tar-stream'; 
import { Readable } from 'stream'; 
import zlib from "zlib";

const allowedFileExtensions = [
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".py",
    ".java",
    ".c",
    ".cpp",
    ".cs",
    ".go",
    ".php",
    ".rb",
    ".swift",
    ".kotlin",
    ".html",
    ".css",
    ".json",
    ".md",
    ".yaml",
    ".yml",
    ".dart",
    ".kt",
    ".vue",
    ".svelte",
]
const blacklist = [
    "node_modules",
    ".git",
    ".github",
    ".vscode",
    ".idea",
    ".DS_Store",
    "dist",
    "build",
    "coverage",
    "out",
    "bin",
    "obj",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "composer.lock",
    "Gemfile.lock",
    "Cargo.lock",
    "pubspec.lock",
    "vendor",
    "bower_components",
    "tmp",
];

const getAccessToken = async (code) => {
    return await axios.post(
        `https://github.com/login/oauth/access_token?client_id=${process.env.GH_CLIENT_ID}&client_secret=${process.env.GH_CLIENT_SECRET}&code=${code}`,
        {},
        {
            headers: {
                accept: "application/json",
            },
            validateStatus: false,
        },
    );
};

const getUserDetails = async (token) => {
    return await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: "Bearer " + token,
            "X-OAuth-Scopes": "repo, user",
            "X-Accepted-OAuth-Scopes": "user",
        },
        validateStatus: false,
    });
};

const getUserEmails = async (token) => {
    return await axios.get("https://api.github.com/user/emails", {
        headers: {
            Authorization: "Bearer " + token,
            "X-OAuth-Scopes": "repo, user",
            "X-Accepted-OAuth-Scopes": "user",
        },
        validateStatus: false,
    });
};

const getUserRepositories = async (token) => {
    const response = await axios.get(
        "https://api.github.com/user/repos?per_page=1000",
        {
            headers: {
                Authorization: "Bearer " + token,
                "X-OAuth-Scopes": "repo, user",
                "X-Accepted-OAuth-Scopes": "user",
            },
            validateStatus: false,
        }
    );
    if (response.status >= 400 || !response.data) {
        return [];
    }
    const repositories = response.data.map((r) => ({
        name: r.full_name,
        url: r.clone_url,
    }));
    return repositories;
};


const getRepoCodeBase = async (repoUrl, token = "") => {
    if (!token) {
        const cachedCodeBase = await get(repoUrl);
        if (cachedCodeBase) {
            return cachedCodeBase;
        }
    }
    const repoProperties = await getProperties(repoUrl);
    if (!repoProperties) {
        console.error("Could not get repo properties for:", repoUrl);
        return null;
    }
    const response = await axios.get(
        `https://api.github.com/repos/${repoProperties.owner}/${repoProperties.name}/tarball`,
        {
            headers: {
                Authorization: "Bearer " + token,
            },
            responseType: 'arraybuffer',
            validateStatus: false,
        }
    );

    if (response.status >= 400 || !response.data) {
        console.error(`Failed to download tarball: ${response.status} for ${repoUrl}`);
        return null;
    }

    const files = [];
    return new Promise((resolve, reject) => {
        const gunzip = zlib.createGunzip();
        const extract = tar.extract();
        extract.on('entry', (header, stream, next) => {
            if (header.type === 'file') {
                const chunks = [];
                if (!allowedFileExtensions.some(ext => header.name.endsWith(ext))) {
                    stream.resume(); 
                    return next();
                }
                if (blacklist.some(blacklisted => header.name.includes(blacklisted))) {
                    stream.resume();
                    return next();
                }
                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('end', () => {
                    files.push({
                        fileName: header.name,
                        contents: Buffer.concat(chunks).toString('utf8'),
                    });
                    next();
                });
                stream.resume();
            } else {
                stream.resume();
                next();
            }
        });

        extract.on('finish', async () => {
            if (!token) {
                try {
                    await set(repoUrl, files);
                } catch (cacheError) {
                    console.error("Failed to cache codebase:", cacheError);
                }
            }
            resolve(files);
        });

        extract.on('error', (err) => {
            console.error("Error extracting tarball:", err);
            reject(err);
        });

        const readableStream = Readable.from(Buffer.from(response.data));
        readableStream.pipe(gunzip).pipe(extract);
    });
};


const getProperties = async (repoUrl) => {
    const githubRegex =
        /https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/;
    const match = repoUrl.match(githubRegex);
    if (!match || !match.groups) {
        return null;
    }
    const { owner, name } = match.groups;
    return {
        owner,
        name,
    };
};


export {
    getAccessToken,
    getUserDetails,
    getUserEmails,
    getUserRepositories,
    getRepoCodeBase,
};