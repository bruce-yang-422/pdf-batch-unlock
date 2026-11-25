function openToolbox() {
  return chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
}

chrome.action.onClicked.addListener(() => openToolbox().catch(console.error));
