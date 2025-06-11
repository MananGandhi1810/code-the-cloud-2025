"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Code, Eye, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import CodeVisualizer from "@/components/dashboard/CodeVisualizer";
import EndpointCard from "@/components/dashboard/EndpointCard";
import axios from "axios";
import { useRouter } from "next/navigation";

const mockSchemaData = {
  success: true,
  message: "Project schema fetched successfully",
  data: {
    endpoints: [
      {
        id: "cmbrnio9s001jujm6oie79vu9",
        name: "/rss.xml",
        method: "GET",
        bodyParams: [],
        queryParams: [],
        expectedStatusCode: 200,
        returnSchema: {
          site: "https://naitiksfirstastro.netlify.app/",
          items: "array of blog post metadata",
          title: "Astro Learner | Blog",
          customData: "<language>en-us</language>",
          description: "My journey learning Astro"
        },
        projectId: "cmbrnim8g001iujm6fs93le2s"
      },
      {
        id: "cmbrnio9s001jujm6oie79vu8",
        name: "/api/posts",
        method: "GET",
        bodyParams: [],
        queryParams: [
          { name: "limit", type: "number", description: "Number of posts to return" },
          { name: "offset", type: "number", description: "Number of posts to skip" }
        ],
        expectedStatusCode: 200,
        returnSchema: {
          posts: "array",
          total: "number",
          hasMore: "boolean"
        },
        projectId: "cmbrnim8g001iujm6fs93le2s"
      }
    ]
  }
};

const mockSchema = {
  id: "1",
  name: "Astro Blog API",
  type: "REST API",
  status: "pending_approval",
  endpoints: mockSchemaData.data.endpoints,
  generatedAt: new Date().toISOString(),
  lastModified: new Date().toISOString()
};

export default function SchemaPage({ params }) {
  const [prompt, setPrompt] = React.useState("");
  const [isRegenerating, setIsRegenerating] = React.useState(false);
  const [viewMode, setViewMode] = React.useState("structured");
  const [selectedEndpoint, setSelectedEndpoint] = React.useState(null);
  const [schemaData, setSchemaData] = React.useState(mockSchema);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [projectInfo, setProjectInfo] = React.useState(null);
  const { id } = React.use(params);
  const router = useRouter();


  // Fetch project and schema data from backend
  const fetchProjectAndSchema = async (projectId) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = sessionStorage.getItem("accessToken");

      // Fetch project info
      const projectRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjectInfo(projectRes.data.data);
      // Fetch schema info
      const schemaRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/project/${projectId}/schema`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Assume schemaRes.data.data has endpoints, status, etc.
      const schema = schemaRes.data.data;
      console.log("Fetched schema:", schema);
      setSchemaData({
        id: projectId,
        name: projectRes.data.data?.title || `Project Schema ${projectId}`,
        type: schema?.type || "REST API",
        status: schema?.status || "pending_approval",
        endpoints: schema?.endpoints || [],
        generatedAt: schema?.generatedAt || new Date().toISOString(),
        lastModified: schema?.lastModified || new Date().toISOString()
      });
    } catch (err) {
      console.error('Error fetching project/schema:', err);
      setError("Failed to fetch from backend, using mock data.");
      setSchemaData(mockSchema);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) {
      fetchProjectAndSchema(id);
    } else {
      setSchemaData(mockSchema);
    }
    // eslint-disable-next-line
  }, [id]);


  const handleApprove = async () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      console.error("No token found in sessionStorage");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/project/${id}/schema/approve`,
        {}, // No body for this request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Schema approved:', response.data);
    
      router.push(`/dashboard`)
    } catch (error) {
      console.error('Error approving schema:', error);
      throw error;
    }
  };

  const handleReject = () => {
    // Handle schema rejection
    console.log("Schema rejected");
  };
  const handleRegenerate = async () => {
    if (!prompt.trim()) return;

    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    setIsRegenerating(true);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/project/${id}/schema`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Refresh schema data after regeneration

      console.log("Schema regenerated:", response.data);
      setTimeout(() => {
        fetchProjectAndSchema(id);
      }, 1000); // Delay to allow backend processing  
    } catch (error) {
      console.error("Failed to regenerate schema:", error?.response?.data || error.message);
    } finally {
      setIsRegenerating(false);
      setPrompt("");
    }
    setTimeout(() => {
      fetchProjectAndSchema(id);
    }, 2000);
  };

  // Generate the schema for visualization
  const getSchemaForVisualization = () => {
    if (viewMode === "structured") {
      return null;
    }
    if (viewMode === "raw") {
      return JSON.stringify({
        success: true,
        message: "Project schema fetched successfully",
        data: {
          endpoints: schemaData.endpoints
        }
      }, null, 2);
    }
    // Formatted view - create a more readable structure
    const formattedData = {
      projectName: schemaData.name,
      type: schemaData.type,
      totalEndpoints: schemaData.endpoints.length,
      endpoints: schemaData.endpoints.map(endpoint => ({
        endpoint: `${endpoint.method} ${endpoint.name}`,
        status: endpoint.expectedStatusCode,
        queryParams: endpoint.queryParams.length,
        bodyParams: endpoint.bodyParams.length,
        response: endpoint.returnSchema
      }))
    };
    return JSON.stringify(formattedData, null, 2);
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
                  {schemaData.name} Schema
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isLoading
                    ? 'Loading schema...'
                    : error
                      ? 'Using mock data - API unavailable'
                      : 'Generated schema for review and approval'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isLoading && (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${schemaData.status === 'pending_approval'
                  ? 'bg-yellow-100 text-yellow-800'
                  : schemaData.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {schemaData.status.replace('_', ' ').toUpperCase()}
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
              Loading schema data...
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
                    <p className="text-lg font-medium text-foreground mt-1" style={{ fontFamily: "'Product Sans', sans-serif" }}>{schemaData.type}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Endpoints</span>
                    <p className="text-lg font-medium text-foreground mt-1" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                      {schemaData.endpoints.length} endpoint{schemaData.endpoints.length !== 1 ? 's' : ''} detected
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Generated</span>
                    <p className="text-sm font-mono text-foreground mt-1 bg-white px-2 py-1 rounded border">
                      {new Date(schemaData.generatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Status</span>
                    <p className="text-lg font-medium capitalize mt-1" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                      {schemaData.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
              {/* Approval Actions */}
              {schemaData.status === 'pending_approval' && (
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
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "structured" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("structured")}
                    className="flex-1 py-3 text-sm font-medium border-2 border-black/20"
                    style={{ fontFamily: "'Product Sans', sans-serif" }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Structured
                  </Button>
                  <Button
                    variant={viewMode === "formatted" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("formatted")}
                    className="flex-1 py-3 text-sm font-medium border-2 border-black/20"
                    style={{ fontFamily: "'Product Sans', sans-serif" }}
                  >
                    <Code className="w-4 h-4 mr-1" />
                    Clean
                  </Button>
                  <Button
                    variant={viewMode === "raw" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("raw")}
                    className="flex-1 py-3 text-sm font-medium border-2 border-black/20"
                    style={{ fontFamily: "'Product Sans', sans-serif" }}
                  >
                    Raw
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Right Panel - Schema Visualization */}
          <div className="w-3/5">
            {viewMode === "structured" ? (
              <div className="h-full border border-black/40 rounded-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-black/20">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">
                      {schemaData.endpoints.length} endpoints detected
                    </span>
                  </div>
                </div>
                {/* Endpoints List */}
                <div className="p-4 h-[calc(100%-4rem)] overflow-y-auto thin-scrollbar space-y-3">
                  {schemaData.endpoints.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <Code className="w-12 h-12 mx-auto" />
                      </div>
                      <p className="text-gray-500" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                        No endpoints detected in this schema
                      </p>
                    </div>
                  ) : (
                    schemaData.endpoints.map((endpoint, index) => (
                      <EndpointCard
                        key={endpoint.id}
                        endpoint={endpoint}
                        isExpanded={selectedEndpoint === endpoint.id}
                        onToggle={() => setSelectedEndpoint(selectedEndpoint === endpoint.id ? null : endpoint.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : (
              <CodeVisualizer
                code={getSchemaForVisualization()}
                language="json"
                viewMode="formatted"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}