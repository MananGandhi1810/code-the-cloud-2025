"use client";
import * as React from "react";
import axios from "axios";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
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

    // Filter repos based on search input
    const filteredRepos = repos.filter(
        (repo) =>
            repo.name.toLowerCase().includes(search.toLowerCase()) ||
            repo.owner?.login?.toLowerCase().includes(search.toLowerCase())
    );

    const selectedRepo = repos.find((repo) => repo.full_name === value);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#1e1e23] flex flex-col items-center py-20">
            <div className="bg-[#23232a] border border-[#2e2e38] rounded-2xl shadow-2xl p-10 w-full max-w-lg flex flex-col items-center">
                <h1 className="text-3xl font-bold text-white mb-2 text-center">
                    Select a Repository
                </h1>
                <p className="text-[#b0b0c3] mb-8 text-center">
                    Choose a GitHub repository to generate or manage your mock API data.
                </p>
                <div className="w-full mb-6">
                    {loading ? (
                        <Skeleton className="h-12 w-full rounded-xl" />
                    ) : (
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className={cn(
                                        "w-full h-12 justify-between bg-[#23232a] border border-[#363646] text-white rounded-xl shadow-sm hover:bg-[#23232a] focus:ring-2 focus:ring-[#43c6ac]",
                                        !selectedRepo && "text-[#b0b0c3]"
                                    )}
                                >
                                    {selectedRepo
                                        ? (
                                            <span>
                                                <span className="font-medium">{selectedRepo.name}</span>
                                                <span className="ml-2 text-xs text-[#b0b0c3]">{selectedRepo.owner?.login}</span>
                                            </span>
                                        )
                                        : "Select a repository..."}
                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full min-w-[320px] p-0 bg-[#23232a] border border-[#363646] text-white rounded-xl">
                                <Command>
                                    <CommandInput
                                        placeholder="Search repositories..."
                                        value={search}
                                        onValueChange={setSearch}
                                    />
                                    <CommandList>
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
                                                    className="flex flex-col items-start"
                                                >
                                                    <div className="flex items-center w-full">
                                                        <CheckIcon
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                value === repo.full_name ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <span className="font-medium">{repo.name}</span>
                                                    </div>
                                                    <span className="ml-6 text-xs text-[#b0b0c3]">{repo.owner?.login}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
                <Button
                    className="w-full h-12 bg-gradient-to-r from-[#f8ffae] to-[#43c6ac] text-black font-semibold text-lg rounded-xl shadow-lg hover:from-[#43c6ac] hover:to-[#f8ffae] transition-all border-none"
                    size="lg"
                    disabled={!selectedRepo}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}