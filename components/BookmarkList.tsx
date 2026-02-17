"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { RealtimePostgresInsertPayload, RealtimePostgresDeletePayload, RealtimePostgresUpdatePayload } from "@supabase/supabase-js";

interface Bookmark {
    id: string;
    url: string;
    title: string;
    created_at: string;
    user_id: string;
}

interface BookmarkListProps {
    userId: string;
    refreshKey?: number;
}

export default function BookmarkList({ userId, refreshKey }: BookmarkListProps) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const supabase = useMemo(() => createClient(), []);
    const refreshKeyRef = useRef(refreshKey);

    const fetchBookmarks = useCallback(async () => {
        const { data, error } = await supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setBookmarks(data);
        }
        setLoading(false);
    }, [supabase, userId]);

    // Re-fetch when refreshKey changes (from AddBookmark callback)
    useEffect(() => {
        if (refreshKeyRef.current !== refreshKey) {
            refreshKeyRef.current = refreshKey;
            fetchBookmarks();
        }
    }, [refreshKey, fetchBookmarks]);

    // Stable realtime subscription — only set up once per userId
    useEffect(() => {
        fetchBookmarks();

        const channel = supabase
            .channel(`bookmarks-sync-${userId}-${Date.now()}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${userId}`,
                },
                (payload: RealtimePostgresInsertPayload<Bookmark>) => {
                    const newBookmark = payload.new as Bookmark;
                    setBookmarks((prev) => {
                        if (prev.some((b) => b.id === newBookmark.id)) return prev;
                        return [newBookmark, ...prev];
                    });
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "bookmarks",
                },
                (payload: RealtimePostgresDeletePayload<Bookmark>) => {
                    const deleted = payload.old as Partial<Bookmark>;
                    if (deleted.id) {
                        setBookmarks((prev) => prev.filter((b) => b.id !== deleted.id));
                    }
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${userId}`,
                },
                (payload: RealtimePostgresUpdatePayload<Bookmark>) => {
                    const updated = payload.new as Bookmark;
                    setBookmarks((prev) =>
                        prev.map((b) => (b.id === updated.id ? updated : b))
                    );
                }
            )
            .subscribe((status: string) => {
                console.log("Realtime subscription status:", status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, userId, fetchBookmarks]);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        // Optimistic delete
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        const { error } = await supabase.from("bookmarks").delete().eq("id", id);
        if (error) {
            console.error("Failed to delete bookmark:", error.message);
            fetchBookmarks();
        }
        setDeletingId(null);
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="h-20 bg-white/5 rounded-xl animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                    <svg
                        className="w-8 h-8 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                    </svg>
                </div>
                <p className="text-gray-400 text-lg">No bookmarks yet</p>
                <p className="text-gray-600 text-sm mt-1">
                    Add your first bookmark above to get started
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200"
                >
                    <div className="flex-1 min-w-0 mr-4">
                        <h3 className="text-white font-medium truncate">
                            {bookmark.title}
                        </h3>
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 text-sm truncate block transition-colors duration-200"
                        >
                            {bookmark.url}
                        </a>
                        <p className="text-gray-600 text-xs mt-1">
                            {new Date(bookmark.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                    <button
                        onClick={() => handleDelete(bookmark.id)}
                        disabled={deletingId === bookmark.id}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
                        title="Delete bookmark"
                    >
                        {deletingId === bookmark.id ? (
                            <svg
                                className="animate-spin h-5 w-5"
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
                        ) : (
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
}
