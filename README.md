# SonicSync — YouTube to MP3 Converter

A fast, clean, self-hosted web app that converts any YouTube video to a high-quality MP3 file. Built with Next.js 14, TypeScript, Tailwind CSS, and yt-dlp.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Features

- **Real MP3 conversion** — uses yt-dlp + ffmpeg to extract audio at 320 kbps
- **Accurate metadata** — pulls the real title, artist, album, duration, and thumbnail from YouTube
- **Correct filename** — downloaded file is named after the video (e.g. `SHAYAD - badkrazy.mp3`)
- **Session library** — tracks everything you converted in the current browser session
- **Download history** — sign in to save your history across sessions (stored locally)
- **Developer API** — built-in `/api/convert` endpoint usable from any script or app
- **Dark UI** — clean, minimal dark-mode interface

---

## Screenshots

| Converter | Success | History |
|-----------|---------|---------|
| Paste a YouTube URL and hit Convert | Shows real metadata + download button | All past conversions saved per account |

---

## Prerequisites

You need the following installed on your machine before running the app:

### 1. Node.js (v18 or later)
Download from [nodejs.org](https://nodejs.org)

### 2. yt-dlp
```bash
# Windows (via pip)
pip install yt-dlp

# macOS
brew install yt-dlp

# Linux
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

### 3. ffmpeg
```bash
# Windows (via winget)
winget install ffmpeg

# macOS
brew install ffmpeg

# Linux (Ubuntu/Debian)
sudo apt install ffmpeg
```

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/DakshMohan020/SonicSync-Converter.git
cd SonicSync-Converter

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

1. You paste a YouTube URL and click **Convert to MP3**
2. The server calls `yt-dlp --print` to fetch metadata (title, artist, duration, thumbnail) — fast, no download yet
3. yt-dlp downloads the audio stream and ffmpeg converts it to a 320 kbps MP3, saved temporarily to `/tmp`
4. The success page shows the real metadata and a download button
5. Clicking **Download MP3** hits `/api/download/[id]?filename=Song_Name` which streams the file to your browser with the correct filename

---

## Project Structure

```
SonicSync-Converter/
├── app/
│   ├── api/
│   │   ├── convert/route.ts      # POST /api/convert — runs yt-dlp, returns metadata
│   │   └── download/[id]/route.ts # GET /api/download/[id] — streams the MP3 file
│   ├── auth/page.tsx             # Sign up / Sign in page
│   ├── history/page.tsx          # Download history (requires sign in)
│   ├── library/page.tsx          # This session's conversions
│   ├── settings/page.tsx         # Audio quality and preferences
│   ├── api-hub/page.tsx          # API documentation
│   ├── success/page.tsx          # Shown after a successful conversion
│   ├── page.tsx                  # Home — URL input
│   └── layout.tsx                # Root layout + Navigation
├── components/
│   └── Navigation.tsx            # Top nav bar
├── store/
│   └── useSyncStore.ts           # Zustand global state + localStorage persistence
├── .env.example                  # Template for environment variables
└── README.md
```

---

## API Usage

SonicSync exposes a simple REST API. No authentication required.

### Convert a YouTube video

```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

**Response:**
```json
{
  "id": "sync-a3f9bc",
  "title": "Never Gonna Give You Up",
  "artist": "Rick Astley",
  "album": "Single",
  "duration": "3:33",
  "fileSize": "8.2 MB",
  "coverUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/...",
  "downloadUrl": "/api/download/sync-a3f9bc",
  "timestamp": "2026-06-01"
}
```

### Download the converted file

```
GET /api/download/{id}?filename=Song_Title_-_Artist
```

---

## Authentication

Sign in / Sign Up is handled client-side using `localStorage`. Accounts and download history are stored in your browser — there is no backend database. This is intentional for a self-hosted setup with no external dependencies.

---

## Notes

- Converted MP3 files are stored temporarily in `/tmp` on the server and are **not** automatically cleaned up. You may want to add a cron job to delete old files periodically:
  ```bash
  find /tmp -name "sync-*.mp3" -mmin +60 -delete
  ```
- Downloading YouTube audio may violate YouTube's Terms of Service. This app is intended for personal and development use only.
- The app does not work on cloud sandboxes where YouTube's IP is blocked — it must be run on your local machine or a server with unrestricted internet access.

---

## Built With

- [Next.js 14](https://nextjs.org/) — React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Zustand](https://zustand-demo.pmnd.rs/) — global state management
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) — YouTube audio extraction
- [ffmpeg](https://ffmpeg.org/) — audio conversion
- [Lucide React](https://lucide.dev/) — icons

---

## License

MIT — see [LICENSE](./LICENSE)
