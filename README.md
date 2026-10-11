# VidCompress — AI Video Compression & Speaker Analysis Demo UI

A modern, sleek, zero-dependency web interface designed for investor demonstrations of neural video compression and acoustic speaker profiling.

Built with **pure Vanilla HTML5, CSS3, and JavaScript** — **No React, no Node.js, and zero `node_modules`**! Lightweight, portable, and ready to share.

---

## 🚀 How to Run Locally

### On Windows
1. Double-click [`start.bat`](start.bat).
2. It automatically starts a local server and opens your browser at **`http://localhost:8000`**.
*(Or run `start.bat` from Command Prompt / PowerShell).*

### On Linux & macOS
1. Run in your terminal:
   ```bash
   ./start.sh
   ```
2. It will automatically launch the server and open your default browser.
*(Or run manually: `python3 -m http.server 8000`).*

### Direct Browser Mode (Zero Server)
- Double-click [`index.html`](index.html) in any browser (Chrome, Edge, Firefox). Built-in offline dataset fallbacks ensure all demonstration flows work smoothly even under strict browser `file://` security policies.

---

## 📂 Demo Setup & Mapping Rules

### 1. Where to Keep the `compressed` Folder
Pre-computed compression outputs belong in the `compressed/` directory structured by sample ID:

```
compressed/
└── compressed 1/
    ├── compressed 1.mp4        # The optimized video stream
    ├── speaker_profile.json    # Acoustic profiling metrics (voice type, pitch, etc.)
    └── transcript.txt          # (Optional) speech transcript
```

For testing additional demo samples (e.g. sample `2`), developers can add a sibling folder:
```
compressed/compressed 2/
├── compressed 2.mp4
└── speaker_profile.json
```

### 2. Live Upload Rule (Do NOT pre-place `original 1` in the folder)
- **Do not pre-place `original 1.mp4` in the project directory before starting.**
- Instead, keep your original video file on your desktop or downloads, launch the UI, and **upload it live through the Page 1 upload dropzone**.
- This demonstrates the real-time upload ingestion progress bar, original file size inspection in MB, video duration extraction, and player preview to investors.

### 3. File Naming & Mapping Rules
The demo engine automatically links uploaded videos to pre-existing compressed packages using naming convention:

| Uploaded Video File | Matched Compressed Folder | Loaded Video File | Loaded Acoustic Profile |
| :--- | :--- | :--- | :--- |
| **`original 1.mp4`** | `compressed/compressed 1/` | `compressed 1.mp4` | `speaker_profile.json` |
| **`original 2.mp4`** | `compressed/compressed 2/` | `compressed 2.mp4` | `speaker_profile.json` |
| **`original X.mp4`** | `compressed/compressed X/` | `compressed X.mp4` | `speaker_profile.json` |

*Rule*: Name your upload `original X.mp4` (where `X` is any positive integer). The engine extracts integer `X`, automatically targets `compressed/compressed X/`, plays `compressed X.mp4`, and parses `speaker_profile.json` for acoustic metrics (`voice_type` and `median_pitch_hz`). If no number is detected in the filename, it defaults to `1`.

---

## 📁 Repository Structure
```
vidui/
├── index.html              # Main application markup (Investor-ready SPA)
├── style.css               # Modern dark glassmorphic styling (Orange/Blue/Black)
├── player.js               # Reusable custom video player controller
├── app.js                  # Application state, upload simulation, 3s demo modal, profile loader
├── start.sh                # 1-click launcher for Linux & macOS
├── start.bat               # 1-click launcher for Windows
├── .gitignore              # Ignores OS files, caches, and test artifacts
├── original/               # Empty upload target directory (contains .gitkeep)
├── compressed/             # Pre-existing compression target directory
│   └── compressed 1/       # Demo sample 1 assets
│       ├── compressed 1.mp4
│       ├── speaker_profile.json
│       └── transcript.txt
└── README.md
```

---

## 🎨 Color Palette & Aesthetics
- **Primary (Orange)**: `#FF6B00` / `#FF8533` — CTAs, glowing highlight badge, timeline scrubber, and primary metrics.
- **Secondary (Blue)**: `#0070F3` / `#00C2FF` — Acoustic intelligence telemetry, waveform indicators, and compressed stream tags.
- **Tertiary (Black)**: `#07090E` / `#0E121B` — Deep obsidian dark mode with glassmorphic cards and subtle ambient neon glows.

---

## 🌟 Demo Workflow Features

### Page 1: Video Ingestion & Source Preview
- **Interactive Drag-and-Drop Zone**: Clean, investor-facing video upload zone (MP4, MOV, WebM, MKV).
- **Upload Progress Bar**: Smooth real-time upload progress with transfer metrics.
- **Original Video Metrics**: Displays File Size (in MB), Duration (`mm:ss`), Resolution dimensions, and Encoding Format (`H.264 / AAC`).
- **Custom Modern Video Player**: Built from scratch with play/pause center overlay, timeline scrubber, time formatting, volume, playback speed presets, and fullscreen.
- **Compression CTA**: Glowing "Compress Video" button.

### 3-Second Processing Demo Modal
- Displays a **3.0-second progress bar** demonstrating processing time before transitioning to Page 2.
- Multi-step live telemetry updates:
  1. *Extracting audio track & speech boundaries*
  2. *Profiling voice type & median pitch (Hz)*
  3. *Optimizing neural video bitrate encoding*
  4. *Finalizing compressed video package*

### Page 2: Compression Verification & Speaker Profile
- **Highlighted % Size Decrease**: Prominent glowing badge showcasing storage savings alongside a proportional visual comparison meter.
- **Compressed Video Player**: Reuses the custom modern video player to playback the optimized stream.
- **Full Compression Stats**:
  - Compressed Video Size (in MB and exact bytes)
  - Video Length (`mm:ss`)
  - Clearly highlighted **% Decrease**
  - **Audio Fidelity** preservation indicator
- **Acoustic Speaker Profile**:
  - **Voice Type**: Prominently displayed (e.g. `Normal`)
  - **Median Pitch**: Prominently displayed in Hz (e.g. `304.1 Hz`)
  - Extended acoustic metrics: Speaking Rate (`wpm`), SNR (`dB`), Pitch Variability, Speech Noise (`dB`)
- **Side-by-Side Comparison**: Synchronized viewer to inspect Original vs Compressed footage side by side.
