"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Code, Eye } from "lucide-react";
import Link from "next/link";
import CodeVisualizer from "@/components/dashboard/CodeVisualizer";

// Mock schema data - replace with actual data fetching
const mockSchema = {
    id: "1",
    name: "E-commerce API",
    type: "OpenAPI",
    status: "pending_approval",
    schema: `{
  "openapi": "3.0.0",
  "info": {
    "title": "E-commerce API",
    "version": "1.0.0",
    "description": "A comprehensive e-commerce API for managing products, orders, and users"
  },
  "servers": [
    {
      "url": "https://api.ecommerce.com/v1",
      "description": "Production server"
    }
  ],
  "paths": {
    "/products": {
      "get": {
        "summary": "Get all products",
        "description": "Retrieve a list of all products with optional filtering",
        "parameters": [
          {
            "name": "category",
            "in": "query",
            "description": "Filter by product category",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Limit the number of results",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "products": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Product"
                      }
                    },
                    "total": {
                      "type": "integer"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Create a new product",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ProductInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Product created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Product"
                }
              }
            }
          }
        }
      }
    },
    "/products/{id}": {
      "get": {
        "summary": "Get product by ID",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Product"
                }
              }
            }
          },
          "404": {
            "description": "Product not found"
          }
        }
      }
    },
    "/orders": {
      "get": {
        "summary": "Get all orders",
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Order"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Create a new order",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/OrderInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Order created successfully"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Product": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique product identifier"
          },
          "name": {
            "type": "string",
            "description": "Product name"
          },
          "description": {
            "type": "string",
            "description": "Product description"
          },
          "price": {
            "type": "number",
            "minimum": 0,
            "description": "Product price in USD"
          },
          "category": {
            "type": "string",
            "description": "Product category"
          },
          "inStock": {
            "type": "boolean",
            "description": "Whether the product is in stock"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": ["id", "name", "price", "category"]
      },
      "ProductInput": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "price": {
            "type": "number",
            "minimum": 0
          },
          "category": {
            "type": "string"
          },
          "inStock": {
            "type": "boolean"
          }
        },
        "required": ["name", "price", "category"]
      },
      "Order": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "userId": {
            "type": "string"
          },
          "products": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "productId": {
                  "type": "string"
                },
                "quantity": {
                  "type": "integer",
                  "minimum": 1
                }
              }
            }
          },
          "total": {
            "type": "number"
          },
          "status": {
            "type": "string",
            "enum": ["pending", "processing", "shipped", "delivered", "cancelled"]
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "OrderInput": {
        "type": "object",
        "properties": {
          "userId": {
            "type": "string"
          },
          "products": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "productId": {
                  "type": "string"
                },
                "quantity": {
                  "type": "integer",
                  "minimum": 1
                }
              }
            }
          }
        },
        "required": ["userId", "products"]
      }
    }
  }
}`,
    generatedAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
};

export default function SchemaPage({ params }) {
    const [prompt, setPrompt] = React.useState("");
    const [isRegenerating, setIsRegenerating] = React.useState(false);
    const [viewMode, setViewMode] = React.useState("formatted"); // formatted or raw

    const handleApprove = () => {
        // Handle schema approval
        console.log("Schema approved");
    };

    const handleReject = () => {
        // Handle schema rejection
        console.log("Schema rejected");
    };

    const handleRegenerate = async () => {
        if (!prompt.trim()) return;

        setIsRegenerating(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsRegenerating(false);
        setPrompt("");
    };

    return (
        <div className="min-h-screen ">
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
                                    {mockSchema.name} Schema
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Generated schema for review and approval
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${mockSchema.status === 'pending_approval'
                                ? 'bg-yellow-100 text-yellow-800'
                                : mockSchema.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {mockSchema.status.replace('_', ' ').toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-4 h-[calc(100vh-8rem)] px-4">
                {/* Left Panel - Controls */}
                <div className="w-2/5 border-2 border-black/20/40 p-8 overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-sm thin-scrollbar">
                    <div className="space-y-8">
                        {/* Schema Info */}
                        <div className="space-y-6">
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 text-xs font-mono font-medium tracking-wider uppercase text-blue-900 bg-blue-100 rounded-full mb-3">
                                    📋 Schema Details
                                </span>
                                <h3 className="text-2xl font-medium text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                    Schema Information
                                </h3>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Type</span>
                                    <p className="text-lg font-medium text-foreground mt-1" style={{ fontFamily: "'Product Sans', sans-serif" }}>{mockSchema.type}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Generated</span>
                                    <p className="text-sm font-mono text-foreground mt-1 bg-white px-2 py-1 rounded border">
                                        {new Date(mockSchema.generatedAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Status</span>
                                    <p className="text-lg font-medium capitalize mt-1" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                        {mockSchema.status.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Approval Actions */}
                        {mockSchema.status === 'pending_approval' && (
                            <div className="space-y-6">
                                <div className="mb-4">
                                    <span className="inline-block px-3 py-1 text-xs font-mono font-medium tracking-wider uppercase text-green-900 bg-green-100 rounded-full mb-3">
                                        ✅ Review Required
                                    </span>
                                    <h3 className="text-2xl font-medium text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                        Review Actions
                                    </h3>
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        onClick={handleApprove}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg py-6 border-2 border-green-700 font-medium"
                                        style={{ fontFamily: "'Product Sans', sans-serif" }}
                                    >
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Approve Schema
                                    </Button>
                                    <Button
                                        onClick={handleReject}
                                        variant="destructive"
                                        className="flex-1 text-lg py-6 border-2 border-red-600 font-medium"
                                        style={{ fontFamily: "'Product Sans', sans-serif" }}
                                    >
                                        <XCircle className="w-5 h-5 mr-2" />
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Regeneration */}
                        <div className="space-y-6">
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 text-xs font-mono font-medium tracking-wider uppercase text-purple-900 bg-purple-100 rounded-full mb-3">
                                    🔄 Modify Schema
                                </span>
                                <h3 className="text-2xl font-medium text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                    Regenerate Schema
                                </h3>
                                <p className="text-lg text-gray-600 leading-relaxed font-light" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                    Provide feedback to improve and regenerate the schema with your specific requirements.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <Input
                                    placeholder="e.g., Add user authentication endpoints, include rate limiting..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="h-14 text-base border-2 border-black/20 rounded-xl px-4"
                                    style={{ fontFamily: "'Product Sans', sans-serif" }}
                                />
                                <Button
                                    onClick={handleRegenerate}
                                    disabled={!prompt.trim() || isRegenerating}
                                    className="w-full text-lg px-8 font-medium py-6 border-2 border-black/20"
                                    style={{ fontFamily: "'Product Sans', sans-serif" }}
                                >
                                    {isRegenerating ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                            Regenerating Schema...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-5 h-5 mr-2" />
                                            Regenerate Schema →
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* View Options */}
                        <div className="space-y-6">
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 text-xs font-mono font-medium tracking-wider uppercase text-orange-900 bg-orange-100 rounded-full mb-3">
                                    👁️ Display Options
                                </span>
                                <h3 className="text-2xl font-medium text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                    View Options
                                </h3>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant={viewMode === "formatted" ? "default" : "outline"}
                                    size="lg"
                                    onClick={() => setViewMode("formatted")}
                                    className="flex-1 py-4 text-base font-medium border-2 border-black/20"
                                    style={{ fontFamily: "'Product Sans', sans-serif" }}
                                >
                                    <Eye className="w-5 h-5 mr-2" />
                                    Formatted
                                </Button>
                                <Button
                                    variant={viewMode === "raw" ? "default" : "outline"}
                                    size="lg"
                                    onClick={() => setViewMode("raw")}
                                    className="flex-1 py-4 text-base font-medium border-2 border-black/20"
                                    style={{ fontFamily: "'Product Sans', sans-serif" }}
                                >
                                    <Code className="w-5 h-5 mr-2" />
                                    Raw JSON
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Code Visualizer */}
                <div className="w-3/5">
                    <CodeVisualizer
                        code={mockSchema.schema}
                        language="json"
                        viewMode={viewMode}
                    />
                </div>
            </div>
        </div>
    );
}
