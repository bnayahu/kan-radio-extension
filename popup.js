// Get DOM elements
const playBtn = document.getElementById('play-btn');
const stopBtn = document.getElementById('stop-btn');
const volumeSlider = document.getElementById('volume');
const currentStationEl = document.getElementById('current-station');
const stationButtons = document.querySelectorAll('.station-btn');

// State
let currentStation = null;
let isPlaying = false;

// Initialize volume from storage or default
let currentVolume = 0.7;

// Load saved volume from storage
chrome.storage.local.get(['volume', 'currentStation', 'isPlaying'], (result) => {
  if (result.volume !== undefined) {
    currentVolume = result.volume;
    volumeSlider.value = currentVolume * 100;
  }

  // Restore previous station state
  if (result.currentStation) {
    currentStation = result.currentStation;
    currentStationEl.textContent = currentStation.name;
    playBtn.disabled = false;

    // Highlight active station
    stationButtons.forEach(btn => {
      if (btn.dataset.url === currentStation.url) {
        btn.classList.add('active');
      }
    });
  }

  // Get current playing status from offscreen document
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (response && response.isPlaying) {
      isPlaying = true;
      updateUI();
    }
  });
});

// Volume control
volumeSlider.addEventListener('input', (e) => {
  currentVolume = e.target.value / 100;
  chrome.storage.local.set({ volume: currentVolume });

  // Update offscreen document volume
  chrome.runtime.sendMessage({
    action: 'setVolume',
    volume: currentVolume
  });
});

// Station selection
stationButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.dataset.url;
    const name = btn.dataset.name;

    // Update active state
    stationButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update current station
    currentStation = { url, name };
    currentStationEl.textContent = name;

    // Save to storage
    chrome.storage.local.set({ currentStation });

    // Enable controls
    playBtn.disabled = false;

    // Auto-play on station selection
    playStation();
  });
});

// Play button
playBtn.addEventListener('click', playStation);

// Stop button
stopBtn.addEventListener('click', stopStation);

function playStation() {
  if (!currentStation) return;

  console.log('Sending play command to offscreen document');

  // Send play command to offscreen document
  chrome.runtime.sendMessage({
    action: 'play',
    url: currentStation.url,
    name: currentStation.name,
    volume: currentVolume
  }, (response) => {
    if (response && response.success) {
      console.log('Play command sent successfully');
      isPlaying = true;
      chrome.storage.local.set({ isPlaying: true });
      updateUI();
    } else {
      console.error('Failed to play station');
      alert('שגיאה בהפעלת התחנה. נסה שוב.');
    }
  });
}

function stopStation() {
  console.log('Sending stop command to offscreen document');

  chrome.runtime.sendMessage({
    action: 'stop'
  }, (response) => {
    if (response && response.success) {
      console.log('Stop command sent successfully');
      isPlaying = false;
      chrome.storage.local.set({ isPlaying: false });
      updateUI();
    }
  });
}

function updateUI() {
  if (isPlaying) {
    playBtn.disabled = true;
    stopBtn.disabled = false;
    playBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
      </svg>
    `;
  } else {
    playBtn.disabled = currentStation ? false : true;
    stopBtn.disabled = true;
    playBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    `;
  }
}

// Listen for status updates from offscreen document
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'statusUpdate') {
    console.log('Received status update:', message);
    isPlaying = message.isPlaying;

    if (message.currentStation) {
      currentStation = message.currentStation;
      currentStationEl.textContent = currentStation.name;
    }

    updateUI();
  }
});

console.log('Kan Radio Player popup initialized');
