"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useMemo } from "react";

interface AddBookmarkProps {
    userId: string;
    onBookmarkAdded?: () => void;
}

export default function AddBookmark({ userId, onBookmarkAdded }: AddBookmarkProps) {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = useMemo(() => createClient(), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim() || !title.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const { error: insertError } = await supabase.from("bookmarks").insert({
                url: url.trim(),
                title: title.trim(),
                user_id: userId,
            });

            if (insertError) throw insertError;

            setUrl("");
            setTitle("");
            onBookmarkAdded?.();

            // Notify other tabs about the new bookmark
            try {
                const channel = new BroadcastChannel("bookmarks-sync");
                channel.postMessage({ type: "BOOKMARK_CHANGED" });
                channel.close();
            } catch {
                // BroadcastChannel not supported, ignore
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to add bookmark";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Bookmark title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                />
                <input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg
                                className="animate-spin h-4 w-4"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Adding...
                        </span>
                    ) : (
                        "Add Bookmark"
                    )}
                </button>
            </div>
            {error && (
                <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg">
                    {error}
                </p>
            )}
        </form>
    );
}
