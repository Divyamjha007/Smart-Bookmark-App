import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AuthButton from "@/components/AuthButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Bookmark App",
  description: "A simple, real-time bookmark manager with Google sign-in",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} font-sans antialiased bg-gray-950 text-white min-h-screen`}
      >
        {/* Gradient background effect */}
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-950/50 via-gray-950 to-purple-950/30 pointer-events-none" />

        <div className="relative z-10">
          {/* Navbar */}
          <nav className="border-b border-white/10 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Smart Bookmarks
                </span>
              </div>
              <AuthButton />
            </div>
          </nav>

          {/* Main content */}
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
