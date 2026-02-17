"use client";

import { useState } from "react";
import AddBookmark from "@/components/AddBookmark";
import BookmarkList from "@/components/BookmarkList";

interface BookmarkDashboardProps {
    userId: string;
}

export default function BookmarkDashboard({ userId }: BookmarkDashboardProps) {
    // Incrementing this key forces BookmarkList to re-fetch
    const [refreshKey, setRefreshKey] = useState(0);

    const handleBookmarkAdded = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">My Bookmarks</h1>
                <p className="text-gray-500 text-sm">
                    Save and manage your favorite links
                </p>
            </div>

            {/* Add bookmark form */}
            <div className="mb-8 p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
                <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
                    Add New Bookmark
                </h2>
                <AddBookmark userId={userId} onBookmarkAdded={handleBookmarkAdded} />
            </div>

            {/* Bookmark list */}
            <div>
                <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
                    Your Collection
                </h2>
                <BookmarkList userId={userId} refreshKey={refreshKey} />
            </div>
        </div>
    );
}
