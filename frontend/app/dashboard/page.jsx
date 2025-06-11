"use client";
import ProjectCard from "@/components/dashboard/ProjectCard";
import * as React from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Github, FileText } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const [search, setSearch] = React.useState("");
    const [projects, setProjects] = React.useState([]);
    const [filteredProjects, setFilteredProjects] = React.useState([]);
    const router = useRouter();

    React.useEffect(() => {
        async function fetchProjects() {
            try {
                const token = sessionStorage.getItem("accessToken");
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/project`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Projects response:", res);
                // Adapt to backend: res.data.data is an array of projects
                setProjects(res.data.data.projects || []);
                setFilteredProjects(res.data.data.projects || []);
            } catch (err) {
                console.error("Failed to fetch projects:", err);
                setProjects([]);
                setFilteredProjects([]);
            }
        }
        fetchProjects();
    }, []);
 React.useEffect(() => {
        let intervalId;
        async function fetchProjects() {
            try {
                const token = sessionStorage.getItem("accessToken");
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/project`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Projects response:", res);
                setProjects(res.data.data.projects || []);
                setFilteredProjects(res.data.data.projects || []);
            } catch (err) {
                console.error("Failed to fetch projects:", err);
                setProjects([]);
                setFilteredProjects([]);
            }
        }
        fetchProjects();
        intervalId = setInterval(fetchProjects, 3500); // Poll every 3.5 seconds
        return () => clearInterval(intervalId);
    }, []);
    React.useEffect(() => {
        const filtered = projects.filter(project =>
            (project.title || "").toLowerCase().includes(search.toLowerCase()) ||
            (project.description || "").toLowerCase().includes(search.toLowerCase()) ||
            (project.type || "").toLowerCase().includes(search.toLowerCase())
        );
        setFilteredProjects(filtered);
    }, [search, projects]);

    const handleImportSelect = (value) => {
        if (value === "github") {
            router.push('/dashboard/github');
        } else if (value === "openapi") {
            router.push('/dashboard/openapi');
        }
    };

    return (
        <div className="min-h-screen py-12 px-8 sm:px-12 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="text-left mb-12">
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 text-xs font-mono font-medium tracking-wider uppercase text-yellow-900 bg-yellow-200 rounded-full">
                            🚀 Your Projects
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-foreground mb-6 sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                        Project Dashboard
                        <br />
                        <span className="text-primary">Manage Your APIs</span>
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl font-light" style={{ fontFamily: "'Product Sans', sans-serif", fontWeight: 300 }}>
                        View, manage, and monitor all your API projects in one place. Import new repositories or specifications to get started.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1 relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 pl-10 text-sm border-2 border-border"
                            style={{ fontFamily: "'Product Sans', sans-serif" }}
                        />
                    </div>
                    <Select onValueChange={handleImportSelect}>
                        <SelectTrigger className="w-full sm:w-40 h-10 border-2 border-border text-sm" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                            <div className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                <SelectValue placeholder="Import New" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="github" className="text-sm py-2">
                                <div className="flex items-center gap-2">
                                    <Github className="w-4 h-4" />
                                    GitHub Repository
                                </div>
                            </SelectItem>
                            <SelectItem value="openapi" className="text-sm py-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    OpenAPI Spec
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                            No projects found
                        </h3>
                        <p className="text-muted-foreground" style={{ fontFamily: "'Product Sans', sans-serif", fontWeight: 300 }}>
                            Try adjusting your search or import a new project
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}