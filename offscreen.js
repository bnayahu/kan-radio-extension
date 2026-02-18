// Offscreen document for background audio playback
const audioPlayer = document.getElementById('audio-player');
let hls = null;
let currentStation = null;
let isPlaying = false;

console.log('Offscreen document loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Offscreen received message:', message);

  switch (message.action) {
    case 'play':
      playStation(message.url, message.name, message.volume);
      sendResponse({ success: true });
      break;
    case 'stop':
      stopStation();
      sendResponse({ success: true });
      break;
    case 'setVolume':
      audioPlayer.volume = message.volume;
      sendResponse({ success: true });
      break;
    case 'getStatus':
      sendResponse({
        isPlaying,
        currentStation
      });
      break;
    default:
      sendResponse({ error: 'Unknown action' });
  }

  return true; // Keep message channel open for async response
});

function playStation(url, name, volume) {
  console.log('Playing station:', name, url);

  // Clean up existing HLS instance
  if (hls) {
    hls.destroy();
    hls = null;
  }

  // Stop current playback
  audioPlayer.pause();
  audioPlayer.src = '';

  // Set volume
  if (volume !== undefined) {
    audioPlayer.volume = volume;
  }

  // Update state
  currentStation = { url, name };

  // Check if HLS is supported
  if (Hls.isSupported()) {
    console.log('Using HLS.js');

    // Create new HLS instance
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });

    // Attach media element
    hls.attachMedia(audioPlayer);

    // Handle HLS events
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log('Media attached, loading source');
      hls.loadSource(url);
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('Manifest parsed, attempting to play');
      audioPlayer.play()
        .then(() => {
          console.log('Playback started successfully');
          isPlaying = true;
          notifyPopup();
        })
        .catch(err => {
          console.error('Error starting playback:', err);
          isPlaying = false;
          notifyPopup();
        });
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS error:', data);

      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.error('Fatal network error, trying to recover');
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.error('Fatal media error, trying to recover');
            hls.recoverMediaError();
            break;
          default:
            console.error('Fatal error, cannot recover');
            hls.destroy();
            hls = null;
            isPlaying = false;
            notifyPopup();
            break;
        }
      }
    });

  } else if (audioPlayer.canPlayType('application/vnd.apple.mpegurl')) {
    // For Safari and other browsers with native HLS support
    console.log('Using native HLS support');
    audioPlayer.src = url;
    audioPlayer.play()
      .then(() => {
        isPlaying = true;
        notifyPopup();
      })
      .catch(err => {
        console.error('Error playing audio:', err);
        isPlaying = false;
        notifyPopup();
      });
  }
}

function stopStation() {
  console.log('Stopping station');

  if (hls) {
    hls.destroy();
    hls = null;
  }

  audioPlayer.pause();
  audioPlayer.src = '';
  isPlaying = false;
  notifyPopup();
}

function notifyPopup() {
  // Send status update to popup (if it's open)
  chrome.runtime.sendMessage({
    action: 'statusUpdate',
    isPlaying,
    currentStation
  }).catch(() => {
    // Popup might not be open, that's okay
  });
}

// Handle audio events
audioPlayer.addEventListener('playing', () => {
  console.log('Audio playing event');
  isPlaying = true;
  notifyPopup();
});

audioPlayer.addEventListener('pause', () => {
  console.log('Audio pause event');
  if (isPlaying) {
    isPlaying = false;
    notifyPopup();
  }
});

audioPlayer.addEventListener('ended', () => {
  console.log('Audio ended event');
  if (isPlaying) {
    // Try to restart for live streams
    playStation(currentStation.url, currentStation.name, audioPlayer.volume);
  }
});

audioPlayer.addEventListener('error', (e) => {
  console.error('Audio error:', audioPlayer.error);
  isPlaying = false;
  notifyPopup();
});

console.log('Offscreen audio player ready');
