
"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FileText, X, ArrowLeft, Upload, Link, Globe } from "lucide-react";

export default function OpenAPIImportModal() {
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
        <DialogContent className="max-w-full max-h-full h-screen w-screen m-0 p-0 rounded-none border-0">
            <div className="flex flex-col h-full bg-background">
                {/* Header */}
                <div className="border-b border-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 hover:bg-muted"
                                onClick={() => document.querySelector('[data-state="open"]')?.click()}
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                    Import OpenAPI Specification
                                </DialogTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Import from a URL or upload a file directly
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 hover:bg-muted"
                            onClick={() => document.querySelector('[data-state="open"]')?.click()}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="max-w-4xl mx-auto space-y-8">
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
                                    className={`p-4 border-2 rounded-lg text-left transition-colors ${importMethod === "url"
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <Link className="w-5 h-5 text-primary" />
                                        <span className="font-medium" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                            From URL
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Import from a public URL or API endpoint
                                    </p>
                                </button>

                                <button
                                    onClick={() => setImportMethod("file")}
                                    className={`p-4 border-2 rounded-lg text-left transition-colors ${importMethod === "file"
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <Upload className="w-5 h-5 text-primary" />
                                        <span className="font-medium" style={{ fontFamily: "'Product Sans', sans-serif" }}>
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
                                            <p className="text-base font-medium mb-2 text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
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
                                            <p className="text-base font-medium mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
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
                                <div className="border border-border rounded-lg p-4 bg-muted/20">
                                    <div className="flex items-start gap-3">
                                        {importMethod === "url" ? (
                                            <Globe className="w-5 h-5 text-muted-foreground mt-1" />
                                        ) : (
                                            <FileText className="w-5 h-5 text-muted-foreground mt-1" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                                {importMethod === "url" ? "URL Import" : file?.name}
                                            </h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {importMethod === "url"
                                                    ? url
                                                    : `${(file?.size / 1024).toFixed(1)} KB • ${file?.type || 'Unknown format'}`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border px-6 py-4 bg-muted/10">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            <span className="font-mono">
                                Supports OpenAPI 2.0, 3.0, and 3.1 specifications
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="px-6"
                                style={{ fontFamily: "'Product Sans', sans-serif" }}
                                onClick={() => document.querySelector('[data-state="open"]')?.click()}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="px-6 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ fontFamily: "'Product Sans', sans-serif" }}
                                disabled={importMethod === "url" ? !url : !file}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Import Specification
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}