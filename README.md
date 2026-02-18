# Kan Radio Player - Chrome Extension

A Chrome extension for listening to Israeli Kan radio channels directly from your browser.

## Features

- 8 Kan radio channels:
  - כאן בית (Kan Bet) - 95.5FM
  - כאן גימל (Kan Gimmel) - 97.8FM
  - כאן 88 - 88.0FM
  - כאן מורשת (Kan Moreshet) - 98.8FM
  - כאן קול המוזיקה (Kan Kol HaMusica) - 95.0FM
  - מכאן (Makan) - 102FM
  - כאן תרבות (Kan Tarbut) - 100.4FM
  - כאן רקע (Kan Reka) - 104.5FM

- Simple and intuitive Hebrew interface (RTL)
- Volume control with persistence
- Play/Stop controls
- **Audio continues playing when popup is closed** 🎵
- Remembers your last station and volume
- Beautiful gradient design

## Installation

### Option 1: Load Unpacked Extension (Developer Mode)

1. **Download or clone this repository** to your computer

2. **Create icons** (required before loading):
   - You need three icon sizes: 16x16, 48x48, and 128x128 pixels
   - Save them as `icon16.png`, `icon48.png`, and `icon128.png` in the `icons/` folder
   - You can create simple icons online at: https://www.favicon-generator.org/
   - Or use any image editor to create PNG files with the radio emoji 📻 or "כאן" text

3. **Open Chrome** and navigate to `chrome://extensions/`

4. **Enable Developer Mode** (toggle switch in the top-right corner)

5. **Click "Load unpacked"**

6. **Select the extension folder** (`/home/bnayahu/work/jbworks/radio-plugin`)

7. The extension should now appear in your Chrome toolbar!

### Creating Simple Icons (Quick Method)

If you don't want to create custom icons, you can generate simple ones with ImageMagick:

```bash
# Install ImageMagick if needed
sudo apt-get install imagemagick

# Create simple colored icons
cd icons
convert -size 16x16 xc:#667eea icon16.png
convert -size 48x48 xc:#667eea icon48.png
convert -size 128x128 xc:#667eea icon128.png
```

Or use this online tool to convert any image:
- https://www.favicon-generator.org/

## Usage

1. Click the extension icon in your Chrome toolbar
2. Select a radio station from the list
3. The station will start playing automatically
4. Use the play/stop buttons to control playback
5. Adjust volume with the slider

## Technical Details

- **Streaming Protocol**: HLS (HTTP Live Streaming) - m3u8 format
- **Stream URLs**: Official from `kancdn.medonecdn.net` (Kan's official CDN)
- **Player Library**: hls.js for HLS playback support in Chrome
- **Manifest Version**: 3 (latest Chrome extension standard)
- **Stream Source**: Extracted from official kan.org.il player
- **Background Audio**: Uses offscreen document API to keep audio playing when popup is closed
- **Persistence**: Saves your last station and volume preferences using Chrome storage

### Architecture

The extension consists of three main components:

1. **popup.html/popup.js** - User interface for selecting stations and controlling playback
2. **background.js** - Service worker that manages the offscreen document
3. **offscreen.html/offscreen.js** - Hidden document that hosts the audio player and keeps it running in the background

This architecture allows the radio to continue playing even when you close the popup or navigate to other tabs!

## Troubleshooting

**Extension won't load:**
- Make sure all three icon files exist in the `icons/` folder
- Check that manifest.json is valid JSON
- Verify you're in Developer Mode

**Audio won't play:**
- Check your internet connection
- The Kan servers might be down temporarily
- Try a different station
- Check Chrome's audio permissions

**No sound:**
- Verify the volume slider is not at 0
- Check your system volume
- Make sure Chrome is not muted in your system's volume mixer

## License

This is an unofficial fan-made extension. All radio content is owned by the Israeli Public Broadcasting Corporation (כאן - התאגיד הישראלי לשידור).

## Credits

Radio streams provided by [Kan - Israeli Public Broadcasting](https://www.kan.org.il/)
