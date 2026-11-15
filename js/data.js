const DataStore = (() => {
  const STORAGE_KEY = 'linkvault_items_v2';

  const SAMPLE_ITEMS = [
    {
      id: 'sample-1',
      url: 'https://www.linkedin.com/posts/software-architecture-event-driven',
      source: 'LinkedIn',
      title: 'Why Most Microservices Fail at Eventual Consistency',
      author: 'Martin Kleppmann',
      labels: ['architecture', 'distributed-systems', 'backend'],
      content: 'Distributed transactions across microservices often introduce hidden coupling...',
      notes: 'Compare this approach with our current message broker setup.',
      favorite: true,
      archived: false,
      isSample: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];

  function detectSource(urlString) {
    try {
      const hostname = new URL(urlString).hostname.replace('www.', '').toLowerCase();
      if (hostname.includes('linkedin.com')) return 'LinkedIn';
      if (hostname.includes('github.com')) return 'GitHub';
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'YouTube';
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'X / Twitter';
      if (hostname.includes('substack.com')) return 'Substack';
      if (hostname.includes('medium.com')) return 'Medium';
      return 'Web Article';
    } catch {
      return 'Web Article';
    }
  }

  // Unified storage getter supporting both Extension and Web
  async function loadItems() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
          const items = result[STORAGE_KEY];
          if (!items || !Array.isArray(items) || items.length === 0) {
            saveItems(SAMPLE_ITEMS).then(() => resolve([...SAMPLE_ITEMS]));
          } else {
            resolve(items);
          }
        });
      } else {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          saveItems(SAMPLE_ITEMS);
          resolve([...SAMPLE_ITEMS]);
        } else {
          try {
            resolve(JSON.parse(raw));
          } catch {
            resolve([]);
          }
        }
      }
    });
  }

  // Unified storage setter supporting both Extension and Web
  async function saveItems(items) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [STORAGE_KEY]: items }, () => resolve());
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        resolve();
      }
    });
  }

  return {
    detectSource,
    loadItems,
    saveItems
  };
})();