"use client";
import * as React from "react";
import { ChevronDown, ChevronRight, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EndpointCard({ endpoint, isExpanded, onToggle }) {
    const [copied, setCopied] = React.useState(false);

    const handleCopyEndpoint = async () => {
        try {
            await navigator.clipboard.writeText(`${endpoint.method} ${endpoint.name}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy endpoint:', err);
        }
    };

    const getMethodColor = (method) => {
        switch (method) {
            case 'GET':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'POST':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'PUT':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'DELETE':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'PATCH':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        if (status >= 200 && status < 300) {
            return 'bg-green-100 text-green-800 border-green-200';
        } else if (status >= 300 && status < 400) {
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        } else if (status >= 400) {
            return 'bg-red-100 text-red-800 border-red-200';
        }
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <div className={`border rounded-xl transition-all ${isExpanded
            ? 'border-blue-300 bg-blue-50/50 shadow-sm'
            : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
            }`}>
            {/* Header - Always Visible */}
            <div
                className="p-5 cursor-pointer"
                onClick={onToggle}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center">
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                            )}
                        </div>
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-md border ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                        </span>
                        <span className="font-mono text-lg font-medium text-gray-900" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                            {endpoint.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(endpoint.expectedStatusCode)}`}>
                            {endpoint.expectedStatusCode}
                        </span>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopyEndpoint();
                            }}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                        >
                            {copied ? (
                                <span className="text-green-600 text-xs">✓</span>
                            ) : (
                                <Copy className="w-3 h-3" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-5 pb-5 space-y-4 border-t border-gray-200/50">
                    {/* Query Parameters */}
                    {endpoint.queryParams && endpoint.queryParams.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                Query Parameters ({endpoint.queryParams.length})
                            </h4>
                            <div className="space-y-2">
                                {endpoint.queryParams.map((param, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-sm font-semibold text-gray-900">{param.name}</span>
                                         
                                            {param.required && (
                                                <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                                    required
                                                </span>
                                            )}
                                        </div>
                                        {param && (
                                            <p className="text-sm text-gray-600">{JSON.stringify(param)}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Body Parameters */}
                    {endpoint.bodyParams && endpoint.bodyParams.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                Body Parameters ({endpoint.bodyParams.length})
                            </h4>
                            <div className="space-y-2">
                                {endpoint.bodyParams.map((param, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-sm font-semibold text-gray-900">{param.name}</span>
                                       
                                            {param.required && (
                                                <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                                    required
                                                </span>
                                            )}
                                        </div>
                                        {param && Object.entries(param).map(([key, value]) => (
                                            <p key={key} className="text-sm text-gray-600">
                                                <span className="font-mono text-blue-800 font-semibold">{key}</span>:{" "}
                                                <span className="text-gray-700 italic">{value}</span>
                                            </p>
                                        ))}

                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Response Schema */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Response Schema
                        </h4>
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                            <pre className="text-sm font-mono overflow-x-auto whitespace-pre-wrap text-gray-800">
                                {JSON.stringify(endpoint.returnSchema, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                        <div className="text-xs text-blue-800 space-y-1">
                            <div><strong>Endpoint ID:</strong> <span className="font-mono">{endpoint.id}</span></div>
                            <div><strong>Project ID:</strong> <span className="font-mono">{endpoint.projectId}</span></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
