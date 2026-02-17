# Smart Bookmark App

A simple, real-time bookmark manager built with **Next.js**, **Supabase**, and **Tailwind CSS** — featuring Google OAuth sign-in, per-user private bookmarks, and live syncing across tabs.

## Live Demo

🔗 **Vercel URL**: smart-bookmark-app-two-lac.vercel.app

## Features

- **Google OAuth** — Sign in/out with your Google account (no email/password)
- **Add bookmarks** — Save any URL with a title
- **Delete bookmarks** — Remove bookmarks you no longer need
- **Private** — Each user can only see/manage their own bookmarks
- **Real-time sync** — Changes appear instantly in all open tabs (Supabase Realtime)
- **Responsive** — Works great on desktop and mobile

## Tech Stack

| Layer       | Technology                         |
| ----------- | ---------------------------------- |
| Framework   | Next.js 15 (App Router)           |
| Auth        | Supabase Auth (Google OAuth)       |
| Database    | Supabase (PostgreSQL)              |
| Realtime    | Supabase Realtime                  |
| Styling     | Tailwind CSS                       |
| Deployment  | Vercel                             |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A [Supabase](https://supabase.com) project

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd smart-bookmark-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the **SQL Editor** and run the schema from [`supabase/schema.sql`](./supabase/schema.sql)
3. Enable **Google OAuth**:
   - Go to **Authentication → Providers → Google**
   - Toggle it ON
   - Add your Google Client ID and Client Secret ([Google Cloud Console](https://console.cloud.google.com/apis/credentials))
   - Set the redirect URL to: `https://<your-supabase-ref>.supabase.co/auth/v1/callback`
4. Enable **Realtime**:
   - Go to **Database → Replication**
   - Make sure the `bookmarks` table has realtime enabled (the schema SQL already adds it)

### 4. Configure environment variables

Copy `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Deploy to Vercel

```bash
npx vercel --prod
```

Make sure to add the same environment variables in your Vercel project settings.

## Project Structure

```
├── app/
│   ├── auth/callback/route.ts    # OAuth callback handler
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with navbar
│   └── page.tsx                  # Main page (hero + dashboard)
├── components/
│   ├── AddBookmark.tsx           # Bookmark add form
│   ├── AuthButton.tsx            # Google sign-in/out button
│   ├── BookmarkDashboard.tsx     # Dashboard wrapper
│   └── BookmarkList.tsx          # Bookmark list with realtime
├── lib/supabase/
│   ├── client.ts                 # Browser Supabase client
│   ├── middleware.ts             # Session refresh helper
│   └── server.ts                 # Server Supabase client
├── middleware.ts                 # Next.js middleware
└── supabase/
    └── schema.sql                # Database schema + RLS
```

## Problems I Ran Into & How I Solved Them

### 1. Supabase SSR Cookie Handling
Setting up Supabase auth with Next.js App Router required careful cookie management. The `@supabase/ssr` package provides `createBrowserClient` and `createServerClient` which handle this, but the server client needs explicit `getAll`/`setAll` cookie methods that work with Next.js `cookies()` API. The middleware must call `auth.getUser()` on every request to refresh expired sessions.

### 2. Real-time Subscription Filtering
Supabase Realtime sends events for all rows in a table by default. To ensure privacy, I used the `filter` option (`user_id=eq.${userId}`) in the channel subscription so each user only receives events for their own bookmarks. Combined with RLS policies on the database, this creates a double layer of security.

### 3. Duplicate Prevention on Realtime INSERT
When a user adds a bookmark, the local state updates AND the realtime subscription fires, potentially causing duplicates. I handle this by checking if a bookmark with the same ID already exists before adding it to state.

### 4. Next.js App Router + Supabase Auth Flow
The OAuth callback must go through a route handler (`app/auth/callback/route.ts`) that exchanges the authorization code for a session, then redirects to the home page. The middleware ensures the session stays fresh on subsequent requests.
