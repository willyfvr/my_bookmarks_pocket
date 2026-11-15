const STORAGE_KEY = 'linkvault_items_v2';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-to-linkvault",
    title: "Save to LinkVault",
    contexts: ["page", "link"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-to-linkvault") {
    const targetUrl = info.linkUrl || info.pageUrl;
    const targetTitle = tab.title || targetUrl;

    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const items = result[STORAGE_KEY] || [];
      
      const newItem = {
        id: `item-${Date.now()}`,
        url: targetUrl,
        source: targetUrl.includes('linkedin.com') ? 'LinkedIn' : 'Web Article',
        title: targetTitle,
        author: new URL(targetUrl).hostname,
        labels: ['quick-save'],
        content: '',
        notes: 'Saved via Chrome extension context menu.',
        favorite: false,
        archived: false,
        isSample: false,
        createdAt: new Date().toISOString()
      };

      items.unshift(newItem);
      chrome.storage.local.set({ [STORAGE_KEY]: items }, () => {
        console.log('Successfully saved to LinkVault storage!');
      });
    });
  }
});