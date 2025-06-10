"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, ArrowLeft, Upload, Link as LinkIcon, Globe } from "lucide-react";
import Link from "next/link";

export default function OpenAPIImportPage() {
    const [importMethod, setImportMethod] = React.useState("url");
    const [file, setFile] = React.useState(null);
    const [url, setUrl] = React.useState("");

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        setFile(droppedFile);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <div className="min-h-screen py-12 px-8 sm:px-12 lg:px-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/dashboard">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 hover:bg-muted"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 text-xs font-mono font-medium tracking-wider uppercase text-yellow-900 bg-yellow-200 rounded-full">
                                📋 OpenAPI Integration
                            </span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-foreground mb-6 sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                        Import OpenAPI Specification
                        <br />
                        <span className="text-primary">Document Your APIs</span>
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl font-light" style={{ fontFamily: "'Product Sans', sans-serif", fontWeight: 300 }}>
                        Import from a URL or upload a file directly to generate comprehensive mock API data from your OpenAPI specifications.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {/* Import Method Selection */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                Import Method
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Choose how you want to import your OpenAPI specification
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setImportMethod("url")}
                                className={`p-6 border-2 rounded-lg text-left transition-colors ${importMethod === "url"
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                    }`}
                            >                                <div className="flex items-center gap-3 mb-3">
                                    <LinkIcon className="w-6 h-6 text-primary" />
                                    <span className="text-lg font-semibold" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                        From URL
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Import from a public URL or API endpoint
                                </p>
                            </button>

                            <button
                                onClick={() => setImportMethod("file")}
                                className={`p-6 border-2 rounded-lg text-left transition-colors ${importMethod === "file"
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <Upload className="w-6 h-6 text-primary" />
                                    <span className="text-lg font-semibold" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                        Upload File
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Upload JSON, YAML, or YML file
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* URL Import */}
                    {importMethod === "url" && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                    Specification URL
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Enter the URL where your OpenAPI specification is hosted
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Input
                                    placeholder="https://api.example.com/swagger.json"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="h-12 text-base"
                                    style={{ fontFamily: "'Product Sans', sans-serif" }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Common formats: /swagger.json, /openapi.yaml, /docs/openapi.yml
                                </p>
                            </div>
                        </div>
                    )}

                    {/* File Upload */}
                    {importMethod === "file" && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                    Upload Specification File
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Drag and drop your file or click to browse
                                </p>
                            </div>
                            <div
                                className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                {file ? (
                                    <div>
                                        <p className="text-lg font-medium mb-2 text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                            {file.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setFile(null)}
                                            style={{ fontFamily: "'Product Sans', sans-serif" }}
                                        >
                                            Remove File
                                        </Button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-lg font-medium mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                            Drop your OpenAPI file here
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Supports JSON, YAML, and YML formats (max 10MB)
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => document.getElementById('file-input').click()}
                                            style={{ fontFamily: "'Product Sans', sans-serif" }}
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Choose File
                                        </Button>
                                        <input
                                            id="file-input"
                                            type="file"
                                            accept=".json,.yaml,.yml"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Preview/Validation */}
                    {((importMethod === "url" && url) || (importMethod === "file" && file)) && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                    Import Preview
                                </h3>
                            </div>
                            <div className="border border-border rounded-lg p-6 bg-muted/20">
                                <div className="flex items-start gap-4">
                                    {importMethod === "url" ? (
                                        <Globe className="w-6 h-6 text-muted-foreground mt-1" />
                                    ) : (
                                        <FileText className="w-6 h-6 text-muted-foreground mt-1" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xl font-semibold text-foreground mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                            {importMethod === "url" ? "URL Import" : file?.name}
                                        </h4>
                                        <p className="text-base text-muted-foreground mb-3">
                                            {importMethod === "url"
                                                ? url
                                                : `${(file?.size / 1024).toFixed(1)} KB • ${file?.type || 'Unknown format'}`
                                            }
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Source:</span>
                                                <p className="font-medium">{importMethod === "url" ? "URL" : "File Upload"}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Format:</span>
                                                <p className="font-medium">
                                                    {importMethod === "url"
                                                        ? url.includes('.json') ? 'JSON' : url.includes('.yaml') || url.includes('.yml') ? 'YAML' : 'Auto-detect'
                                                        : file?.name?.includes('.json') ? 'JSON' : file?.name?.includes('.yaml') || file?.name?.includes('.yml') ? 'YAML' : 'Unknown'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-8">
                        <Link href="/dashboard">
                            <Button
                                variant="outline"
                                className="px-6 border-2 border-border"
                                style={{ fontFamily: "'Product Sans', sans-serif" }}
                            >
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            className="px-8 h-12 text-base font-medium border-2 border-black bg-background text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: "'Product Sans', sans-serif" }}
                            disabled={importMethod === "url" ? !url : !file}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Import Specification →
                        </Button>
                    </div>

                    {/* Additional Info */}
                    <div className="text-center pt-8">
                        <p className="text-sm text-muted-foreground font-mono">
                            Supports OpenAPI 2.0, 3.0, and 3.1 specifications
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
