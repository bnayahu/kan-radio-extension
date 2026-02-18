// Service worker (background script) for managing offscreen document

let creating; // Stores a promise for offscreen document creation

async function setupOffscreenDocument() {
  // Check if offscreen document already exists
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT']
  });

  if (existingContexts.length > 0) {
    return;
  }

  // Create offscreen document
  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Playing Kan radio streams in the background'
    });
    await creating;
    creating = null;
  }
}

// Ensure offscreen document exists when extension starts
chrome.runtime.onStartup.addListener(setupOffscreenDocument);
chrome.runtime.onInstalled.addListener(setupOffscreenDocument);

// Forward messages from popup to offscreen document
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // If message is from popup to control audio
  if (message.action === 'play' || message.action === 'stop' ||
      message.action === 'setVolume' || message.action === 'getStatus') {

    setupOffscreenDocument().then(() => {
      // Forward message to offscreen document
      chrome.runtime.sendMessage(message).then(sendResponse);
    });

    return true; // Keep message channel open for async response
  }

  // If message is a status update from offscreen document
  if (message.action === 'statusUpdate') {
    // Popup will receive this automatically
    return false;
  }
});

console.log('Background service worker initialized');
