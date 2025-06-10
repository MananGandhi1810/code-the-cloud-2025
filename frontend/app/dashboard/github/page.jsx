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

export default function GitHubImportPage() {
    const [repos, setRepos] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [search, setSearch] = React.useState("");
    const [branch, setBranch] = React.useState("");

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

    const selectedRepo = repos.find((repo) => repo.full_name === value);

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
                                                    <span className="ml-2 text-sm text-muted-foreground">by {selectedRepo.owner?.login}</span>
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

                    {/* Branch Selection */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                Branch Selection
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Specify which branch to import (optional, defaults to main)
                            </p>
                        </div>                        <Input
                            placeholder="main"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="h-12 text-base max-w-md border-2 border-border"
                            style={{ fontFamily: "'Product Sans', sans-serif" }}
                        />
                    </div>

                    {/* Repository Info */}
                    {selectedRepo && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                    Repository Details
                                </h3>
                            </div>
                            <div className="border border-border rounded-lg p-6 bg-muted/20">
                                <div className="flex items-start gap-4">
                                    <Github className="w-6 h-6 text-muted-foreground mt-1" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xl font-semibold text-foreground mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                            {selectedRepo.name}
                                        </h4>
                                        <p className="text-base text-muted-foreground mb-3">
                                            {selectedRepo.description || "No description provided"}
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Repository:</span>
                                                <p className="font-mono text-xs">{selectedRepo.full_name}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Language:</span>
                                                <p className="font-medium">{selectedRepo.language || "Unknown"}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Visibility:</span>
                                                <p className="font-medium">{selectedRepo.private ? "Private" : "Public"}</p>
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
                            disabled={!selectedRepo}
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
