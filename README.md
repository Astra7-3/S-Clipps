# S/Clipps ✂️

**S/Clipps** is a full-stack video auto-clipping web application that automatically divides uploaded videos into 3-minute clips ready to download.

## Features

- 🎬 **Drag-and-drop video upload** — supports MP4, MOV, AVI, WebM, MKV (up to 500 MB)
- ✂️ **Automatic 3-minute clip generation** powered by FFmpeg
- 🖼️ **Thumbnail previews** for each clip
- 📥 **Individual clip downloads**
- 🎨 **Purple, Black, Red & Green color theme** with "Tilt Prism" font
- 📱 **Responsive** for mobile and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Axios, CSS3 |
| Backend | Node.js, Express, Multer |
| Video | FFmpeg (fluent-ffmpeg) |
| Deployment | Vercel |

## Prerequisites

- **Node.js** ≥ 18
- **FFmpeg** installed on the server machine:
  - macOS: `brew install ffmpeg`
  - Linux: `sudo apt-get install ffmpeg`
  - Windows: [Download from ffmpeg.org](https://ffmpeg.org/download.html)

## Project Structure

```
S-Clipps/
├── client/          # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── App.js
│       └── index.css
├── server/          # Node.js backend
│   ├── routes/
│   ├── middleware/
│   ├── uploads/     # Temp uploaded video storage
│   ├── clips/       # Processed clip output
│   ├── thumbnails/  # Clip thumbnails
│   └── index.js
├── vercel.json
└── package.json
```

## Local Setup

```bash
# Clone the repo
git clone https://github.com/Astra7-3/S-Clipps.git
cd S-Clipps

# Install all dependencies
npm run install:all

# Configure environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Start both frontend and backend in development mode
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload a video file |
| POST | `/api/process` | Process video into 3-min clips |
| GET | `/api/clips/:videoId` | Get clips for a video |
| GET | `/api/download/:clipId` | Download a specific clip |
| GET | `/api/health` | Server health check |

## Deployment to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy

> **Note:** Vercel's serverless environment has limited support for FFmpeg. For production use with large files, consider a dedicated server (Railway, Render, or a VPS).

## Color Theme

| Color | Hex | Usage |
|-------|-----|-------|
| Purple | `#9D4EDD` | Primary accent, buttons |
| Black | `#1A1A1A` | Background |
| Red | `#FF006E` | Highlights, gradients |
| Green | `#00D084` | Success states, download buttons |
