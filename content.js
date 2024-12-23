console.log('Content script loaded');

let isIndexing = false;
let currentFolderName = null;

// Store indexing state in chrome.storage
async function setIndexingState(state) {
  await chrome.storage.local.set({
    isIndexing: state.isIndexing,
    folderName: state.folderName
  });
}

// Check if we should continue indexing on page load
async function checkIndexingState() {
  const state = await chrome.storage.local.get(['isIndexing', 'folderName']);
  if (state.isIndexing) {
    currentFolderName = state.folderName;
    console.log('Continuing indexing for folder:', currentFolderName);
    // Small delay to ensure page is fully loaded
    setTimeout(() => startIndexing(true), 2000);
  }
}

async function stopIndexing() {
  isIndexing = false;
  await setIndexingState({
    isIndexing: false,
    folderName: null
  });
  console.log('Indexing stopped by user');
}

async function startIndexing(isContinuation = false) {
  if (isIndexing) return;
  isIndexing = true;

  if (!isContinuation) {
    currentFolderName = `roic_transcripts_${Date.now()}`;
    await setIndexingState({
      isIndexing: true,
      folderName: currentFolderName
    });
  }

  try {
    while (isIndexing) {
      await downloadPageData(currentFolderName);

      if (!isIndexing) break;

      // Check if transcript not found
      if (document.querySelector('.transcript-not-found')) {
        console.log('Transcript not found, stopping indexing');
        await setIndexingState({ isIndexing: false, folderName: null });
        alert('Indexing completed - transcript not found!');
        return;
      }

      if (!isIndexing) break;

      const nextUrl = getNextUrl(window.location.href);
      if (!nextUrl) {
        console.log('No more URLs to process');
        await setIndexingState({ isIndexing: false, folderName: null });
        alert('Indexing completed - reached end of URLs!');
        return;
      }

      if (!isIndexing) break;

      console.log('Navigating to:', nextUrl);
      window.location.href = nextUrl;
      break;
    }
  } catch (error) {
    console.error('Error during indexing:', error);
    await setIndexingState({ isIndexing: false, folderName: null });
    alert('Error during indexing: ' + error.message);
  }
}

function parseUrl(url) {
  const match = url.match(/\/(\d{4})-year\/(\d)-quarter/);
  if (!match) return null;
  return {
    year: parseInt(match[1]),
    quarter: parseInt(match[2])
  };
}

function getNextUrl(currentUrl) {
  const urlInfo = parseUrl(currentUrl);
  if (!urlInfo) return null;

  let { year, quarter } = urlInfo;
  
  if (quarter > 1) {
    quarter--;
  } else {
    year--;
    quarter = 4;
  }

  return currentUrl.replace(
    /(\d{4})-year\/(\d)-quarter/,
    `${year}-year/${quarter}-quarter`
  );
}

async function downloadPageData(folderName) {
  // Extract transcript content
  const transcriptData = {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    transcript: []
  };

  try {
    // Find all transcript entries
    const transcriptEntries = document.querySelectorAll('.transcript-content .transcript-entry');
    
    transcriptEntries.forEach(entry => {
      const speaker = entry.querySelector('.speaker')?.textContent?.trim() || '';
      const content = entry.querySelector('.content')?.textContent?.trim() || '';
      
      if (speaker && content) {
        transcriptData.transcript.push({
          speaker: speaker,
          content: content
        });
      }
    });

    // Add metadata if available
    const metaData = {
      company: document.querySelector('.company-name')?.textContent?.trim(),
      date: document.querySelector('.transcript-date')?.textContent?.trim(),
      title: document.querySelector('.transcript-title')?.textContent?.trim()
    };

    if (Object.values(metaData).some(value => value)) {
      transcriptData.metadata = metaData;
    }

    transcriptData.hasTranscript = transcriptData.transcript.length > 0;

  } catch (error) {
    console.error('Error parsing transcript:', error);
    transcriptData.error = 'Failed to parse transcript';
    transcriptData.hasTranscript = false;
  }

  // Format filename as "YYYY_Q#.json"
  const urlInfo = parseUrl(window.location.href);
  if (!urlInfo) {
    throw new Error('Invalid URL format');
  }
  const filename = `${folderName}/${urlInfo.year}_Q${urlInfo.quarter}.json`;
  
  const blob = new Blob([JSON.stringify(transcriptData, null, 2)], { type: 'application/json' });
  
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      action: 'downloadFile',
      data: {
        url: URL.createObjectURL(blob),
        filename: filename
      }
    }, resolve);
  });
}

// Initialize on page load
checkIndexingState();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  if (request.action === 'startIndexing') {
    console.log('Starting indexing process');
    startIndexing();
  } else if (request.action === 'stopIndexing') {
    console.log('Stopping indexing process');
    stopIndexing();
  }
}); 