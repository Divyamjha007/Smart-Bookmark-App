import { createClient } from "@/lib/supabase/server";
import BookmarkDashboard from "@/components/BookmarkDashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Hero section */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-8 shadow-2xl shadow-indigo-500/25">
            <svg
              className="w-10 h-10 text-white"
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
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Smart Bookmark Manager
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Save, organize, and access your bookmarks from anywhere.
            Real-time sync across all your devices.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-medium text-sm">Private & Secure</h3>
              <p className="text-gray-500 text-xs mt-1">Your bookmarks, only yours</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-medium text-sm">Real-time Sync</h3>
              <p className="text-gray-500 text-xs mt-1">Instant updates everywhere</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-5 h-5 text-pink-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-medium text-sm">Simple & Fast</h3>
              <p className="text-gray-500 text-xs mt-1">No clutter, just bookmarks</p>
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            Sign in with Google to get started →
          </p>
        </div>
      </div>
    );
  }

  return <BookmarkDashboard userId={user.id} />;
}
