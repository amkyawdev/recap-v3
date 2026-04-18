# Recap App

A web-based subtitle editing and video processing application built with Next.js 14, Tailwind CSS, and Framer Motion.

## Features

- 📝 Full SRT subtitle editor (add/edit/delete lines)
- 🎬 Video preview with custom subtitles
- 🎨 Subtitle styling options (position, colours, font)
- 🌐 Myanmar font selector (Pyidaungsu, Noto Sans Myanmar, Masterpiece, Zawgyi)
- 📦 File uploads (.srt, .txt, .svc, .bin)
- 🎥 Video upload (.mp4, .mkv, .avi, .mov)
- 🖼️ Logo upload for video branding
- 🔧 Extract embedded subtitles from video
- ➗ Combine video + SRT (client-side FFmpeg WASM)
- 🔔 Alarm notification system
- 📄 Smooth page transitions with Framer Motion

## Tech Stack

- Next.js 14 (App Router) with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- FFmpeg WASM for video processing
- React Dropzone for file uploads

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your/recap-app.git
cd recap-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Environment Variables (Optional)

If using Supabase for database:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with app introduction |
| `/recap` | Subtitle editor |
| `/preview-movie` | Video preview with subtitles |
| `/language-translate` | External translation links |
| `/docs` | Documentation |
| `/about` | About the app |

## Project Structure

```
recap-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (index)
│   │   ├── globals.css
│   │   ├── recap/page.tsx
│   │   ├── preview-movie/page.tsx
│   │   ├── language-translate/page.tsx
│   │   ├── docs/page.tsx
│   │   └── about/page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── MagicMenu.tsx
│   │   │   ├── StrawberryMenu.tsx
│   │   │   ├── SideMenu.tsx
│   │   │   ├── AlarmToast.tsx
│   │   │   ├── AnimatedText.tsx
│   │   │   └── PageTransition.tsx
│   │   ├── subtitle/
│   │   │   ├── SubtitleEditor.tsx
│   │   │   ├── SubtitleDialog.tsx
│   │   │   ├── SrtParser.ts
│   │   │   └── SrtExporter.ts
│   │   ├── video/
│   │   │   ├── VideoUploader.tsx
│   │   │   ├── LogoUploader.tsx
│   │   │   └── SubtitleExtractor.tsx
│   │   └── file/
│   │       ├── MultiFileUpload.tsx
│   │       └── RewrapMuxer.ts
│   ├── hooks/
│   │   ├── useSmoothAnimation.ts
│   │   └── useAlarm.ts
│   ├── lib/
│   │   ├── supabaseClient.ts
│   │   └── ffmpegLoader.ts
│   └── types/
│       └── subtitle.ts
├── public/
│   ├── fonts/
│   └── icons/
├── tailwind.config.js
├── next.config.js
├── package.json
└── tsconfig.json
```

## Deployment on Vercel

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Recap App"
git remote add origin https://github.com/your/recap-app.git
git push -u origin main
```

2. Deploy on Vercel:

**Option A: Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Click Deploy

### Environment Variables on Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Usage

### Subtitle Editor
1. Upload .srt or .txt file, or create new lines
2. Edit timestamps and text
3. Click "Style Options" to customize appearance
4. Export as .srt

### Video Preview
1. Upload video file (.mp4, etc.)
2. Upload logo (optional)
3. Upload subtitle file (.srt)
4. Click "Extract Subtitles" if video has embedded subs
5. Preview with play/pause controls

### Combine Video + SRT
1. In Preview Movie page, after uploading video and SRT
2. Click "Combine Video + SRT"
3. Download the processed video

## License

MIT