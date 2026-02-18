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

2. **Open Chrome** and navigate to `chrome://extensions/`

3. **Enable Developer Mode** (toggle switch in the top-right corner)

4. **Click "Load unpacked"**

5. **Select the extension folder** (`/home/bnayahu/work/jbworks/radio-plugin`)

6. The extension should now appear in your Chrome toolbar!

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
