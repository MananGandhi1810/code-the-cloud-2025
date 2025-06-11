"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Copy, FileText, Play, Archive, Check, ChevronDown, ChevronUp, Terminal } from "lucide-react";
import Link from "next/link";
import CodeVisualizer from "@/components/dashboard/CodeVisualizer";
import { Tree, Folder, File } from "@/components/magicui/file-tree";

// Mock project data - replace with actual data fetching
const mockProjectData = {
    id: "1",
    name: "Astro Blog Project",
    description: "A modern blog built with Astro framework",
    status: "completed",
    language: "javascript",
    framework: "astro",
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    files: [
        {
            id: "1",
            name: "src",
            type: "folder",
            children: [
                {
                    id: "2",
                    name: "pages",
                    type: "folder",
                    children: [
                        {
                            id: "3",
                            name: "index.astro",
                            type: "file",
                            content: `---
// Component Script (runs at build time)
import Layout from '../layouts/Layout.astro';
import Card from '../components/Card.astro';
---

<Layout title="Welcome to Astro.">
    <main>
        <h1>Welcome to <span class="text-gradient">Astro</span></h1>
        <p class="instructions">
            To get started, open the directory <code>src/pages</code> in your project.<br />
            <strong>Code Challenge:</strong> Tweak the "Welcome to Astro" message above.
        </p>
        <ul role="list" class="link-card-grid">
            <Card
                href="https://docs.astro.build/"
                title="Documentation"
                body="Learn how Astro works and explore the official API docs."
            />
            <Card
                href="https://astro.build/integrations/"
                title="Integrations"
                body="Supercharge your project with new frameworks and libraries."
            />
        </ul>
    </main>
</Layout>

<style>
    main {
        margin: auto;
        padding: 1.5rem;
        max-width: 60ch;
    }
    h1 {
        font-size: 3rem;
        font-weight: 800;
        margin: 0;
    }
    .text-gradient {
        background-image: var(--accent-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-size: 400%;
        background-position: 0%;
    }
    .instructions {
        line-height: 1.6;
        margin: 1rem 0;
        border: 1px solid rgba(var(--accent), 25%);
        background-color: white;
        padding: 1rem;
        border-radius: 0.4rem;
    }
    .link-card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(24ch, 1fr));
        gap: 1rem;
        padding: 0;
    }
</style>`
                        },
                        {
                            id: "4",
                            name: "about.astro",
                            type: "file",
                            content: `---
import Layout from '../layouts/Layout.astro';
---

<Layout title="About - Astro Blog">
    <main>
        <h1>About Us</h1>
        <p>This is a sample about page for our Astro blog.</p>
    </main>
</Layout>`
                        }
                    ]
                },
                {
                    id: "5",
                    name: "components",
                    type: "folder",
                    children: [
                        {
                            id: "6",
                            name: "Card.astro",
                            type: "file",
                            content: `---
export interface Props {
    title: string;
    body: string;
    href: string;
}

const { href, title, body } = Astro.props;
---

<li class="link-card">
    <a href={href}>
        <h2>
            {title}
            <span>&rarr;</span>
        </h2>
        <p>
            {body}
        </p>
    </a>
</li>
<style>
    .link-card {
        list-style: none;
        display: flex;
        padding: 0.15rem;
        background-color: white;
        background-image: none;
        background-size: 400%;
        border-radius: 0.6rem;
        background-position: 100%;
        transition: background-position 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    }

    .link-card > a {
        width: 100%;
        text-decoration: none;
        line-height: 1.4;
        padding: 1rem 1.3rem;
        border-radius: 0.35rem;
        color: #111;
        background-color: white;
        opacity: 0.8;
    }
    h2 {
        margin: 0;
        font-size: 1.25rem;
        transition: color 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }
    p {
        margin-top: 0.5rem;
        margin-bottom: 0;
        color: #444;
    }
    .link-card:is(:hover, :focus-within) {
        background-position: 0;
        background-image: var(--accent-gradient);
    }
    .link-card:is(:hover, :focus-within) h2 {
        color: rgb(var(--accent));
    }
</style>`
                        }
                    ]
                },
                {
                    id: "7",
                    name: "layouts",
                    type: "folder",
                    children: [
                        {
                            id: "8",
                            name: "Layout.astro",
                            type: "file",
                            content: `---
export interface Props {
    title: string;
}

const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="description" content="Astro description">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="generator" content={Astro.generator} />
        <title>{title}</title>
    </head>
    <body>
        <slot />
    </body>
</html>
<style is:global>
    :root {
        --accent: 124, 58, 237;
        --accent-gradient: linear-gradient(45deg, rgb(var(--accent)), #da62c4 30%, white 60%);
    }
    html {
        font-family: system-ui, sans-serif;
    }
    code {
        font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
            Bitstream Vera Sans Mono, Courier New, monospace;
    }
</style>`
                        }
                    ]
                }
            ]
        },
        {
            id: "9",
            name: "package.json",
            type: "file",
            content: `{
  "name": "astro-blog",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^2.0.0"
  }
}`
        },
        {
            id: "10",
            name: "astro.config.mjs",
            type: "file",
            content: `import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({});`
        },
        {
            id: "11",
            name: "Dockerfile",
            type: "file",
            content: `FROM node:18-alpine AS base
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Copy built application
COPY --from=base /app/dist ./dist
COPY --from=base /app/package*.json ./

# Install production dependencies
RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]`
        }
    ]
};

export default function ProjectPage({ params }) {
    const [selectedFileId, setSelectedFileId] = React.useState("3"); // Default to index.astro
    const [projectData, setProjectData] = React.useState(mockProjectData);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null); const [copied, setCopied] = React.useState({ dockerfile: false, gcloud: false, dockerCommands: false });
    const [expandedSections, setExpandedSections] = React.useState({ docker: false, gcloud: false });
    const [copiedCommand, setCopiedCommand] = React.useState(null);

    // Function to fetch real project data from backend
    const fetchProjectData = async (projectId) => {
        try {
            setIsLoading(true);
            setError(null);

            // For now, simulate API call and use mock data
            // TODO: Uncomment when backend API is ready
            /*
            const response = await fetch(`/api/projects/${projectId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch project data');
            }

            const data = await response.json();
            setProjectData(data);
            */

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Use mock data with the provided ID
            const transformedProject = {
                ...mockProjectData,
                id: projectId,
                name: `Project ${projectId}`
            };

            setProjectData(transformedProject);

        } catch (err) {
            console.error('Error fetching project data:', err);
            setError(err.message);
            // Fallback to mock data
            setProjectData(mockProjectData);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when component mounts or params change
    React.useEffect(() => {
        if (params?.id) {
            fetchProjectData(params.id);
        } else {
            setProjectData(mockProjectData);
        }
    }, [params?.id]);

    // Find selected file
    const findFileById = (files, id) => {
        for (const file of files) {
            if (file.id === id) {
                return file;
            }
            if (file.children) {
                const found = findFileById(file.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedFile = findFileById(projectData.files, selectedFileId);

    // Convert file tree to magicui format
    const convertToTreeElements = (files) => {
        return files.map(file => ({
            id: file.id,
            name: file.name,
            children: file.children ? convertToTreeElements(file.children) : undefined,
            isSelectable: true,
        }));
    };

    const treeElements = convertToTreeElements(projectData.files);

    // Get file language for syntax highlighting
    const getFileLanguage = (fileName) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const languageMap = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'astro': 'html',
            'html': 'html',
            'css': 'css',
            'scss': 'scss',
            'json': 'json',
            'md': 'markdown',
            'py': 'python',
            'dockerfile': 'dockerfile',
            'yml': 'yaml',
            'yaml': 'yaml',
        };
        return languageMap[extension] || 'text';
    };

    // Handle file selection
    const handleFileSelect = (fileId) => {
        setSelectedFileId(fileId);
    };    // Copy functions
    const handleCopyDockerfile = async () => {
        const dockerFile = findFileById(projectData.files, "11");
        if (dockerFile) {
            try {
                await navigator.clipboard.writeText(dockerFile.content);
                setCopied(prev => ({ ...prev, dockerfile: true }));
                setTimeout(() => setCopied(prev => ({ ...prev, dockerfile: false })), 2000);
            } catch (err) {
                console.error('Failed to copy Dockerfile:', err);
            }
        }
    };

    const handleCopyDockerCommands = async () => {
        const dockerCommands = `# Build Docker image
docker build -t ${projectData.name.toLowerCase().replace(/\s+/g, '-')} .

# Run Docker container
docker run -p 3000:3000 ${projectData.name.toLowerCase().replace(/\s+/g, '-')}

# Tag for registry (optional)
docker tag ${projectData.name.toLowerCase().replace(/\s+/g, '-')} your-registry/${projectData.name.toLowerCase().replace(/\s+/g, '-')}:latest

# Push to registry (optional)
docker push your-registry/${projectData.name.toLowerCase().replace(/\s+/g, '-')}:latest`;

        try {
            await navigator.clipboard.writeText(dockerCommands);
            setCopied(prev => ({ ...prev, dockerCommands: true }));
            setTimeout(() => setCopied(prev => ({ ...prev, dockerCommands: false })), 2000);
        } catch (err) {
            console.error('Failed to copy Docker commands:', err);
        }
    };

    const handleCopyGCloudCommand = async () => {
        const gcloudCommand = `# Build and deploy to Google Cloud Run
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/${projectData.name.toLowerCase().replace(/\s+/g, '-')}
gcloud run deploy ${projectData.name.toLowerCase().replace(/\s+/g, '-')} \\
  --image gcr.io/YOUR_PROJECT_ID/${projectData.name.toLowerCase().replace(/\s+/g, '-')} \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated`;

        try {
            await navigator.clipboard.writeText(gcloudCommand);
            setCopied(prev => ({ ...prev, gcloud: true }));
            setTimeout(() => setCopied(prev => ({ ...prev, gcloud: false })), 2000);
        } catch (err) {
            console.error('Failed to copy GCloud command:', err);
        }
    }; const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleCopyCommand = async (command, index) => {
        try {
            await navigator.clipboard.writeText(command);
            setCopiedCommand(index);
            setTimeout(() => setCopiedCommand(null), 2000);
        } catch (err) {
            console.error('Failed to copy command:', err);
        }
    };

    const handleDownloadZip = () => {
        // TODO: Implement zip download functionality
        console.log('Download ZIP clicked');
        // This would typically trigger a download from your backend
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-2 hover:bg-muted"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-medium text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                    {projectData.name}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {isLoading
                                        ? 'Loading project...'
                                        : error
                                            ? 'Using mock data - API unavailable'
                                            : projectData.description
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {!isLoading && (
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${projectData.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : projectData.status === 'in_progress'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {projectData.status.replace('_', ' ').toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                            Loading project data...
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4 h-[calc(100vh-8rem)] px-4">
                    {/* Error Banner */}
                    {error && (
                        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg shadow-md">
                            <p className="text-sm font-medium">⚠️ {error} - Showing mock data</p>
                        </div>
                    )}

                    {/* Left Panel - Actions */}
                    <div className="w-2/5 border-2 border-black/20 p-8 overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-sm thin-scrollbar">
                        <div className="space-y-8">
                            {/* Project Info */}
                            <div className="space-y-6">
                                <div className="mb-4">
                                    <span className="inline-block px-3 py-1 text-xs font-mono font-medium tracking-wider uppercase text-blue-900 bg-blue-100 rounded-full mb-3">
                                        📋 Project Details
                                    </span>
                                    <h3 className="text-2xl font-medium text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                        Project Information
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Framework</span>
                                        <p className="text-lg font-medium text-foreground mt-1" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                            {projectData.framework || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Language</span>
                                        <p className="text-lg font-medium text-foreground mt-1" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                            {projectData.language || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Files</span>
                                        <p className="text-lg font-medium text-foreground mt-1" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                            {projectData.files.length} items
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Created</span>
                                        <p className="text-sm font-mono text-foreground mt-1 bg-white px-2 py-1 rounded border">
                                            {new Date(projectData.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>                            {/* Dockerfile Actions */}
                            <div className="space-y-6">
                                <div className="mb-4">
                                    <span className="inline-block px-3 py-1 text-xs font-mono font-medium tracking-wider uppercase text-purple-900 bg-purple-100 rounded-full mb-3">
                                        🐳 Docker Actions
                                    </span>
                                    <h3 className="text-2xl font-medium text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                        Deployment Options
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {/* Copy Dockerfile Button */}
                                    <Button
                                        onClick={handleCopyDockerfile}
                                        className="w-full text-lg px-8 font-medium py-6 border-2 border-black/20"
                                        style={{ fontFamily: "'Product Sans', sans-serif" }}
                                    >
                                        {copied.dockerfile ? (
                                            <>
                                                <Check className="w-5 h-5 mr-2" />
                                                Dockerfile Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-5 h-5 mr-2" />
                                                Copy Dockerfile
                                            </>
                                        )}
                                    </Button>

                                    {/* Docker Commands Section */}
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleSection('docker')}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Terminal className="w-5 h-5 text-gray-600" />
                                                <span className="font-medium text-gray-900" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                                    Docker Commands
                                                </span>
                                            </div>
                                            {expandedSections.docker ? (
                                                <ChevronUp className="w-5 h-5 text-gray-600" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-600" />
                                            )}
                                        </button>

                                        {expandedSections.docker && (
                                            <div className="border-t border-gray-200 bg-white">
                                                {/* Commands List */}
                                                <div className="p-4 space-y-3">
                                                    {[
                                                        `docker build -t ${projectData.name.toLowerCase().replace(/\s+/g, '-')} .`,
                                                        `docker run -p 3000:3000 ${projectData.name.toLowerCase().replace(/\s+/g, '-')}`,
                                                        `docker tag ${projectData.name.toLowerCase().replace(/\s+/g, '-')} your-registry/${projectData.name.toLowerCase().replace(/\s+/g, '-')}:latest`,
                                                        `docker push your-registry/${projectData.name.toLowerCase().replace(/\s+/g, '-')}:latest`].map((command, index) => (
                                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                                <code className="text-sm font-mono text-gray-800 flex-1 mr-3">
                                                                    {command}
                                                                </code>
                                                                <button
                                                                    onClick={() => handleCopyCommand(command, `docker-${index}`)}
                                                                    className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                                                                    title="Copy command"
                                                                >
                                                                    {copiedCommand === `docker-${index}` ? (
                                                                        <Check className="w-4 h-4 text-green-600" />
                                                                    ) : (
                                                                        <Copy className="w-4 h-4 text-gray-600" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        ))}
                                                </div>

                                                {/* Copy All Commands Button */}
                                                <div className="p-4 border-t border-gray-200 bg-gray-50">
                                                    <Button
                                                        onClick={handleCopyDockerCommands}
                                                        variant="outline"
                                                        className="w-full"
                                                        style={{ fontFamily: "'Product Sans', sans-serif" }}
                                                    >
                                                        {copied.dockerCommands ? (
                                                            <>
                                                                <Check className="w-4 h-4 mr-2" />
                                                                All Commands Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-4 h-4 mr-2" />
                                                                Copy All Commands
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>                            {/* Google Cloud Actions */}
                            <div className="space-y-6">
                                <div className="mb-4">
                                    <span className="inline-block px-3 py-1 text-xs font-mono font-medium tracking-wider uppercase text-green-900 bg-green-100 rounded-full mb-3">
                                        ☁️ Cloud Deployment
                                    </span>
                                    <h3 className="text-2xl font-medium text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                        Google Cloud Run
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {/* GCloud Commands Section */}
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleSection('gcloud')}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Play className="w-5 h-5 text-gray-600" />
                                                <span className="font-medium text-gray-900" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                                    GCloud Commands
                                                </span>
                                            </div>
                                            {expandedSections.gcloud ? (
                                                <ChevronUp className="w-5 h-5 text-gray-600" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-600" />
                                            )}
                                        </button>

                                        {expandedSections.gcloud && (
                                            <div className="border-t border-gray-200 bg-white">
                                                {/* Commands List */}
                                                <div className="p-4 space-y-3">
                                                    {[
                                                        `gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/${projectData.name.toLowerCase().replace(/\s+/g, '-')}`,
                                                        `gcloud run deploy ${projectData.name.toLowerCase().replace(/\s+/g, '-')} --image gcr.io/YOUR_PROJECT_ID/${projectData.name.toLowerCase().replace(/\s+/g, '-')} --platform managed --region us-central1 --allow-unauthenticated`].map((command, index) => (
                                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                                <code className="text-sm font-mono text-gray-800 flex-1 mr-3 break-all">
                                                                    {command}
                                                                </code>
                                                                <button
                                                                    onClick={() => handleCopyCommand(command, `gcloud-${index}`)}
                                                                    className="p-2 hover:bg-gray-200 rounded-md transition-colors flex-shrink-0"
                                                                    title="Copy command"
                                                                >
                                                                    {copiedCommand === `gcloud-${index}` ? (
                                                                        <Check className="w-4 h-4 text-green-600" />
                                                                    ) : (
                                                                        <Copy className="w-4 h-4 text-gray-600" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        ))}
                                                </div>

                                                {/* Copy All Commands Button */}
                                                <div className="p-4 border-t border-gray-200 bg-gray-50">
                                                    <Button
                                                        onClick={handleCopyGCloudCommand}
                                                        variant="outline"
                                                        className="w-full"
                                                        style={{ fontFamily: "'Product Sans', sans-serif" }}
                                                    >
                                                        {copied.gcloud ? (
                                                            <>
                                                                <Check className="w-4 h-4 mr-2" />
                                                                All Commands Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-4 h-4 mr-2" />
                                                                Copy All Commands
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Download Actions */}
                            <div className="space-y-6">
                                <div className="mb-4">
                                    <span className="inline-block px-3 py-1 text-xs font-mono font-medium tracking-wider uppercase text-orange-900 bg-orange-100 rounded-full mb-3">
                                        📦 Download
                                    </span>
                                    <h3 className="text-2xl font-medium text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                        Export Project
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <Button
                                        onClick={handleDownloadZip}
                                        className="w-full text-lg px-8 font-medium py-6 border-2 border-black/20"
                                        style={{ fontFamily: "'Product Sans', sans-serif" }}
                                    >
                                        <Archive className="w-5 h-5 mr-2" />
                                        Download ZIP
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - File Explorer and Code Viewer */}
                    <div className="w-3/5 flex gap-4">
                        {/* File Tree */}
                        <div className="w-1/3 border border-black/40 rounded-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-black/20">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground font-mono">
                                        Project Files
                                    </span>
                                </div>
                            </div>
                            <div className="h-[calc(100%-4rem)] p-4">
                                <Tree
                                    className="h-full"
                                    elements={treeElements}
                                    initialSelectedId={selectedFileId}
                                    initialExpandedItems={["1", "2", "5", "7"]}
                                >
                                    {treeElements.map((element) => (
                                        <TreeNode
                                            key={element.id}
                                            element={element}
                                            onFileSelect={handleFileSelect}
                                            selectedFileId={selectedFileId}
                                        />
                                    ))}
                                </Tree>
                            </div>
                        </div>

                        {/* Code Viewer */}
                        <div className="w-2/3">
                            {selectedFile && selectedFile.type === 'file' ? (
                                <CodeVisualizer
                                    code={selectedFile.content || '// No content available'}
                                    language={getFileLanguage(selectedFile.name)}
                                    viewMode="formatted"
                                />
                            ) : (
                                <div className="h-full border border-black/40 rounded-2xl bg-white/95 backdrop-blur-sm flex items-center justify-center">
                                    <div className="text-center">
                                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                            Select a file to view its content
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// TreeNode component for recursive rendering
function TreeNode({ element, onFileSelect, selectedFileId }) {
    const handleFileClick = React.useCallback(() => {
        if (element.type === 'file' || (!element.children || element.children.length === 0)) {
            onFileSelect(element.id);
        }
    }, [element.id, element.type, element.children, onFileSelect]);

    if (element.children && element.children.length > 0) {
        return (
            <Folder element={element.name} value={element.id}>
                {element.children.map((child) => (
                    <TreeNode
                        key={child.id}
                        element={child}
                        onFileSelect={onFileSelect}
                        selectedFileId={selectedFileId}
                    />
                ))}
            </Folder>
        );
    } else {
        return (
            <div onClick={handleFileClick} className="cursor-pointer">
                <File
                    value={element.id}
                    isSelect={selectedFileId === element.id}
                    className={`${selectedFileId === element.id ? "bg-blue-100 border-blue-300" : ""} hover:bg-gray-100`}
                >
                    {element.name}
                </File>
            </div>
        );
    }
}
