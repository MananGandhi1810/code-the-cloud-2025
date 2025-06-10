
import * as React from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Github, CheckIcon, ChevronsUpDownIcon, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GitHubImportModal() {
    const [repos, setRepos] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [search, setSearch] = React.useState("");

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
                                    Import GitHub Repository
                                </DialogTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Select a repository from your GitHub account to import
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
                        {/* Repository Selection */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                    Select Repository
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Choose from your GitHub repositories to import
                                </p>
                            </div>

                            {loading ? (
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
                                    <PopoverContent className="w-full min-w-[600px] p-0 border-2 border-border rounded-lg">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search repositories..."
                                                value={search}
                                                onValueChange={setSearch}
                                                className="h-10 text-sm"
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
                                                                setValue(currentValue);
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
                            </div>
                            <Input
                                placeholder="main"
                                className="h-12 text-base max-w-md"
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
                                <div className="border border-border rounded-lg p-4 bg-muted/20">
                                    <div className="flex items-start gap-3">
                                        <Github className="w-5 h-5 text-muted-foreground mt-1" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                                                {selectedRepo.name}
                                            </h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {selectedRepo.description || "No description provided"}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2 font-mono">
                                                {selectedRepo.full_name}
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
                            {repos.length > 0 && (
                                <span className="font-mono">{repos.length} repositories available</span>
                            )}
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
                                disabled={!selectedRepo}
                            >
                                <Github className="w-4 h-4 mr-2" />
                                Import {selectedRepo?.name || 'Repository'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}
