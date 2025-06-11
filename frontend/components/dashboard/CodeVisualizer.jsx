"use client";
import * as React from "react";
import { createHighlighter } from "shiki";
import { Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CodeVisualizer({ code, language = "json", viewMode = "formatted" }) {
    const [highlightedCode, setHighlightedCode] = React.useState("");
    const [copied, setCopied] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null); React.useEffect(() => {
        const initializeHighlighter = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fallback to basic syntax highlighting if shiki fails
                if (!code) {
                    setHighlightedCode('');
                    setIsLoading(false);
                    return;
                }

                try {
                    const highlighter = await createHighlighter({
                        themes: ['github-light'],
                        langs: ['json', 'javascript', 'typescript', 'yaml', 'xml', 'html', 'css', 'markdown', 'python', 'dockerfile', 'text']
                    });

                    let codeToHighlight = code;

                    // Format JSON if in formatted mode
                    if (viewMode === "formatted" && language === "json") {
                        try {
                            const parsed = JSON.parse(code);
                            codeToHighlight = JSON.stringify(parsed, null, 2);
                        } catch (e) {
                            // If JSON parsing fails, use raw code
                            codeToHighlight = code;
                        }
                    }

                    const html = highlighter.codeToHtml(codeToHighlight, {
                        lang: language === 'astro' ? 'html' : language,
                        theme: 'github-light'
                    });

                    setHighlightedCode(html);
                } catch (shikiError) {
                    console.error('Shiki error:', shikiError);
                    // Fallback to plain text with basic formatting
                    let codeToHighlight = code;
                    if (viewMode === "formatted" && language === "json") {
                        try {
                            const parsed = JSON.parse(code);
                            codeToHighlight = JSON.stringify(parsed, null, 2);
                        } catch (e) {
                            codeToHighlight = code;
                        }
                    }

                    // Create basic HTML for fallback
                    const escapedCode = codeToHighlight
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');

                    setHighlightedCode(`<pre><code>${escapedCode}</code></pre>`);
                }

            } catch (err) {
                console.error('Error initializing highlighter:', err);
                setError('Failed to load syntax highlighter');

                // Final fallback - just show plain text
                const escapedCode = code
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                setHighlightedCode(`<pre><code>${escapedCode}</code></pre>`);
            } finally {
                setIsLoading(false);
            }
        };

        initializeHighlighter();
    }, [code, language, viewMode]);

    const handleCopy = async () => {
        try {
            let textToCopy = code;

            if (viewMode === "formatted" && language === "json") {
                try {
                    const parsed = JSON.parse(code);
                    textToCopy = JSON.stringify(parsed, null, 2);
                } catch (e) {
                    textToCopy = code;
                }
            }

            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const handleDownload = () => {
        try {
            let textToDownload = code;

            if (viewMode === "formatted" && language === "json") {
                try {
                    const parsed = JSON.parse(code);
                    textToDownload = JSON.stringify(parsed, null, 2);
                } catch (e) {
                    textToDownload = code;
                }
            }

            const blob = new Blob([textToDownload], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `schema.${language}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download code:', err);
        }
    }; if (isLoading) {
        return (
            <div className="h-full bg-background  - flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 -b-2 -primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                        Loading syntax highlighter...
                    </p>
                </div>
            </div>
        );
    } if (error) {
        return (
            <div className="h-full bg-background  - flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive mb-4" style={{ fontFamily: "'Product Sans', sans-serif" }}>
                        {error}
                    </p>
                    <pre className="text-foreground text-sm bg-muted p-4 rounded  overflow-auto max-h-96">
                        {code}
                    </pre>
                </div>
            </div>
        );
    } return (
        <div className="h-full flex flex-col border border-black/40 rounded-2xl bg-background">
            {/* Header with actions */}
            <div className="flex items-center justify-between p-4 border-b border-black/20 ">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">
                        schema.{language}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleCopy}
                        size="sm"
                        variant="ghost"
                        className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-muted"
                        style={{ fontFamily: "'Product Sans', sans-serif" }}
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-1" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={handleDownload}
                        size="sm"
                        variant="ghost"
                        className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-muted"
                        style={{ fontFamily: "'Product Sans', sans-serif" }}
                    >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                    </Button>
                </div>
            </div>            {/* Code content */}
            <div className="flex-1 overflow-auto thin-scrollbar">
                <div
                    className="p-4 h-full"
                    style={{
                        fontFamily: "'Geist Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', monospace",
                        fontSize: '14px',
                        lineHeight: '1.5'
                    }}
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
            </div>
        </div>
    );
}
