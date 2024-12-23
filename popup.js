document.addEventListener('DOMContentLoaded', async () => {
  const indexButton = document.getElementById('indexButton');
  const stopButton = document.getElementById('stopButton');
  const statusDiv = document.getElementById('status');

  // Function to update UI based on indexing state
  async function updateUI() {
    const state = await chrome.storage.local.get(['isIndexing']);
    if (state.isIndexing) {
      indexButton.style.display = 'none';
      stopButton.style.display = 'block';
      statusDiv.textContent = 'Indexing in progress...';
      statusDiv.className = 'running';
    } else {
      indexButton.style.display = 'block';
      stopButton.style.display = 'none';
      statusDiv.textContent = 'Ready to start indexing';
      statusDiv.className = 'stopped';
    }
  }

  // Check initial state when popup opens
  await updateUI();
  
  indexButton.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ 
      active: true, 
      currentWindow: true 
    });

    if (!tab) {
      console.error('No active tab found');
      return;
    }

    if (!tab.url.startsWith('https://www.roic.ai/')) {
      alert('Please navigate to a ROIC.ai page first');
      return;
    }

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });

      await chrome.tabs.sendMessage(tab.id, { 
        action: 'startIndexing'
      });
      
      await updateUI();
    } catch (error) {
      console.error('Failed:', error);
      alert('Error: Make sure you are on a ROIC.ai page and try reloading the extension');
    }
  });

  stopButton.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ 
      active: true, 
      currentWindow: true 
    });

    if (tab) {
      try {
        await chrome.tabs.sendMessage(tab.id, { 
          action: 'stopIndexing'
        });
        await updateUI();
      } catch (error) {
        console.error('Failed to stop indexing:', error);
      }
    }
  });

  // Listen for state changes
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.isIndexing) {
      updateUI();
    }
  });
});