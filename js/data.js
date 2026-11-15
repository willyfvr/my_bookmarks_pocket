const DataStore = (() => {
  const STORAGE_KEY = 'linkvault_items_v2';

  const SAMPLE_ITEMS = [
    {
      id: 'sample-1',
      url: 'https://www.linkedin.com/posts/software-architecture-event-driven',
      source: 'LinkedIn',
      title: 'Why Most Microservices Fail at Eventual Consistency',
      author: 'Martin Kleppmann (Shared Commentary)',
      labels: ['architecture', 'distributed-systems', 'backend'],
      content: 'Distributed transactions across microservices often introduce hidden coupling. Instead of 2PC, consider the Transactional Outbox pattern paired with idempotent consumers...',
      notes: 'Compare this approach with our current message broker setup before Q4 planning.',
      favorite: true,
      archived: false,
      isSample: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'sample-2',
      url: 'https://github.com/microsoft/playwright-mcp',
      source: 'GitHub',
      title: 'Playwright MCP — Model Context Protocol for Browser Automation',
      author: 'microsoft',
      labels: ['playwright', 'ai-agents', 'qa-automation'],
      content: 'A Model Context Protocol (MCP) server that provides browser automation capabilities using Playwright, enabling LLMs to interact with web pages via structured accessibility snapshots.',
      notes: 'Test token cost vs raw DOM scraping on our regression suite.',
      favorite: true,
      archived: false,
      isSample: true,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 'sample-3',
      url: 'https://martinfowler.com/articles/practical-test-pyramid.html',
      source: 'Web Article',
      title: 'The Practical Test Pyramid',
      author: 'Ham Vocke',
      labels: ['qa-automation', 'testing', 'best-practices'],
      content: 'Write tests with different granularity. The more high-level you get, the fewer tests you should have. Stick to the pyramid shape to come up with a healthy, fast and maintainable test suite.',
      notes: 'Great reference diagram for onboarding junior QA engineers.',
      favorite: false,
      archived: false,
      isSample: true,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
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

  function loadItems() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveItems(SAMPLE_ITEMS);
      return [...SAMPLE_ITEMS];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  return {
    detectSource,
    loadItems,
    saveItems
  };
})();