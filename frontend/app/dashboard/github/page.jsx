"use client";
import * as React from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Github, CheckIcon, ChevronsUpDownIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation";

export default function GitHubImportPage() {
    const [repos, setRepos] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [search, setSearch] = React.useState("");
    const [branch, setBranch] = React.useState("");
    const [selectedRepo, setSelectedRepo] = React.useState(null);
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");

    const router = useRouter();



    React.useEffect(() => {
        async function fetchRepos() {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/repos`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                    },
                });
                setRepos(res.data.data.repositories || []);
            } catch (e) {
                setRepos([]);
            }
            setLoading(false);
        }
        fetchRepos();
    }, []);

    const filteredRepos = repos.filter(
        (repo) =>
            repo.name.toLowerCase().includes(search.toLowerCase()) ||
            repo.owner?.login?.toLowerCase().includes(search.toLowerCase())
    );

    const handleImport = async () => {
        try {
            const token = sessionStorage.getItem("accessToken");
            if (!token) {
                alert("Access token not found.");
                return;
            }

            const payload = {
                title: title || selectedRepo.name,
                description: description,
                githubUrl: selectedRepo.url.replace(/\.git$/, ""),
                prompt: `Generate a REST API for this ${selectedRepo.name}.`
            };
            console.log("Payload:", payload);

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/project`,
                payload,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log("Response:", res);

            // alert("Project imported successfully!");
            router.push('/dashboard');
        } catch (err) {
            console.error(err);
            alert("Failed to import project.");
        }
    }



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
                                🔗 GitHub Integration
                            </span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-foreground mb-6 sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                        Import GitHub Repository
                        <br />
                        <span className="text-primary">Connect Your Code</span>
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl font-light" style={{ fontFamily: "'Product Sans', sans-serif", fontWeight: 300 }}>
                        Select a repository from your GitHub account to generate mock API data and streamline your development workflow.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {/* Repository Selection */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                Select Repository
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Choose from your GitHub repositories to import
                            </p>
                        </div>                        {loading ? (
                            <Skeleton className="h-12 w-full rounded-lg" />
                        ) : (
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className={cn(
                                            "w-full h-12 justify-between border-2 border-border text-foreground rounded-lg shadow-sm hover:bg-muted focus:ring-2 focus:ring-primary text-base px-4",
                                            !selectedRepo && "text-muted-foreground"
                                        )}
                                        style={{ fontFamily: "'Product Sans', sans-serif", fontWeight: 400 }}
                                    >
                                        {selectedRepo
                                            ? (
                                                <span>
                                                    <span className="font-medium">{selectedRepo.name}</span>
                                                </span>
                                            )
                                            : "Select a repository..."}
                                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-2 border-border rounded-lg">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search repositories..."
                                            value={search}
                                            onValueChange={setSearch}
                                            className="h-10 text-sm border-0"
                                            style={{ fontFamily: "'Product Sans', sans-serif" }}
                                        />
                                        <CommandList className="max-h-60">
                                            <CommandEmpty>No repositories found.</CommandEmpty>
                                            <CommandGroup>
                                                {filteredRepos.map((repo) => (
                                                    <CommandItem
                                                        key={repo.id}
                                                        value={repo.full_name}
                                                        onSelect={(currentValue) => {
                                                            setValue(currentValue === value ? "" : currentValue);
                                                            setOpen(false);
                                                            setSelectedRepo(repo);
                                                            setSearch("");
                                                        }}
                                                        className="flex flex-col items-start py-2 px-3 hover:bg-muted cursor-pointer"
                                                    >
                                                        <div className="flex items-center w-full">
                                                            <CheckIcon
                                                                className={cn(
                                                                    "mr-2 h-4 w-4 text-primary",
                                                                    value === repo.full_name ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <span className="font-medium text-sm" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                                                {repo.name}
                                                            </span>
                                                        </div>
                                                        <span className="ml-6 text-xs text-muted-foreground font-mono">
                                                            {repo.owner?.login}
                                                        </span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                Project Metadata
                            </h3>
                            <p className="text-sm text-muted-foreground">Enter a title and description for your new project</p>
                        </div>

                        <Input
                            placeholder="Project Title*"
                            value={selectedRepo ? selectedRepo.name : title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-12 text-base max-w-md border-2 border-border"
                            style={{ fontFamily: "'Product Sans', sans-serif" }}
                            required
                        />
                        <Textarea
                            placeholder="Project Description"
                            value={description}
                            as="textarea"
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-32 text-base max-w-md border-2 border-border"
                            style={{ fontFamily: "'Product Sans', sans-serif" }}
                            required
                        />
                    </div>
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
                            disabled={!selectedRepo}
                            onClick={handleImport}
                        >
                            <Github className="w-4 h-4 mr-2" />
                            Import {selectedRepo?.name || 'Repository'} →
                        </Button>
                    </div>

                    {/* Repository Count */}
                    {repos.length > 0 && (
                        <div className="text-center pt-8">
                            <p className="text-sm text-muted-foreground font-mono">
                                {repos.length} repositories available
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

