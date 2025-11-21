# Career Coast Soundwalk

A minimal, static web experience for an audio soundwalk called **Career Coast Soundwalk**. Built with Vite, React, and TypeScript.

## Getting started

```bash
npm install
npm run dev
```

- `npm run dev` starts a local dev server (default: http://localhost:5173).
- `npm run build` produces a production-ready build in `dist/`.
- `npm run preview` serves the built files for a quick check.

## Project structure

```
root/
├─ index.html
├─ config/
│  └─ stops.json        # Soundwalk stop definitions
├─ public/
│  ├─ audio/            # Place audio files here
│  └─ img/              # Optional images
├─ src/
│  ├─ main.tsx          # App entry + simple routing
│  └─ styles.css        # Coastal-inspired styling
├─ package.json
└─ README.md
```

## Adding stops

1. Open `config/stops.json` and add or edit stop objects. Each stop requires:
   - `id` (string): used in URLs like `/stop/<id>`.
   - `title` (string)
   - `shortDescription` (string)
   - `audioFile` (string): relative URL such as `/audio/stop-01.mp3`.
   - `transcript` (string): text content or an external URL.
2. Put the audio files in `public/audio/` so they are available at `/audio/<filename>`.
3. (Optional) Add images or other assets to `public/img/` and reference them from your content.

### Example `stops.json`

```json
[
  {
    "id": "shoreline-prologue",
    "title": "Shoreline Prologue",
    "shortDescription": "Waves set the rhythm for a new career adventure.",
    "audioFile": "/audio/shoreline-prologue.mp3",
    "transcript": "Welcome to the Career Coast. Take a deep breath, listen to the surf, and get ready for three stories of reinvention."
  },
  {
    "id": "lighthouse-insight",
    "title": "Lighthouse Insight",
    "shortDescription": "A mentor’s light guides a course correction.",
    "audioFile": "/audio/lighthouse-insight.mp3",
    "transcript": "A former teacher finds a new calling in UX research after a chance meeting at a coastal lighthouse."
  },
  {
    "id": "pier-promise",
    "title": "Pier of Promise",
    "shortDescription": "Courage to launch something new from the pier.",
    "audioFile": "/audio/pier-promise.mp3",
    "transcript": "https://example.com/transcripts/pier-promise"
  }
]
```

## Deployment notes

- The site is static and can be deployed to GitHub Pages or any static host.
- Each stop is reachable at `/stop/<id>` for QR codes. If hosting from a sub-path, set `base` in `vite.config.ts` or configure your hosting to serve `index.html` for unmatched routes.

## Attribution

All stories, voices and code of this soundwalk were generated with AI.
