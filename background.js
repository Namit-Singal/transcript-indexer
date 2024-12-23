chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'downloadFile') {
    chrome.downloads.download({
      url: request.data.url,
      filename: request.data.filename
    }, sendResponse);
    return true;
  }
}); 