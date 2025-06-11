import { Github, FileText, Calendar, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";

export default function ProjectCard({ project }) {
    return (
        <a href={`/dashboard/schema/${project.id}`} className="no-underline">
            <div className="border-2 border-border rounded-lg p-4 bg-background hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-1 truncate" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                            {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2" style={{ fontFamily: "'Product Sans', sans-serif", fontWeight: 300 }}>
                            {project.description}
                        </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${project.status === 'SchemaGenerated' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {project.status}
                    </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        {project.type === 'GitHub Repository' ? (
                            <Github className="w-3 h-3" />
                        ) : (
                            <FileText className="w-3 h-3" />
                        )}
                        <span className="truncate">{project.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(project.updatedAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        })}</span>                </div>
                </div>

                <div className="flex items-center justify-between">
                    <a href={`/dashboard/schema/${project.id}`} className="flex-1 mr-2">


                        <Button
                            variant="outline"
                            size="sm"
                            className="border border-black h-7 px-2 text-xs"
                            style={{ fontFamily: "'Product Sans', sans-serif" }}
                        >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                        </Button>
                    </a>
                </div>
            </div>
        </a>
    );
}