document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    items: DataStore.loadItems(),
    statusFilter: 'all', // 'all' | 'unread' | 'favorite' | 'archived'
    selectedSources: new Set(),
    selectedLabels: new Set(),
    searchQuery: '',
    sortBy: 'newest',
    viewMode: 'grid',
    activeItemId: null
  };

  // DOM References
  const dom = {
    cardsGrid: document.getElementById('cardsGrid'),
    sourceFiltersList: document.getElementById('sourceFiltersList'),
    labelFiltersList: document.getElementById('labelFiltersList'),
    clearFiltersBtn: document.getElementById('clearFiltersBtn'),
    searchInput: document.getElementById('searchInput'),
    sortSelect: document.getElementById('sortSelect'),
    viewTitle: document.getElementById('viewTitle'),
    activeFilterSummary: document.getElementById('activeFilterSummary'),
    clearSamplesBtn: document.getElementById('clearSamplesBtn'),
    saveModal: document.getElementById('saveModal'),
    saveForm: document.getElementById('saveForm'),
    readerDrawer: document.getElementById('readerDrawer'),
    drawerBody: document.getElementById('drawerBody')
  };

  // Persistence Helper
  function commit() {
    DataStore.saveItems(state.items);
    renderAll();
  }

  // Filter & Sort Pipeline
  function getFilteredItems() {
    return state.items
      .filter((item) => {
        if (state.statusFilter === 'unread' && item.archived) return false;
        if (state.statusFilter === 'favorite' && !item.favorite) return false;
        if (state.statusFilter === 'archived' && !item.archived) return false;

        if (state.selectedSources.size > 0 && !state.selectedSources.has(item.source)) {
          return false;
        }

        if (state.selectedLabels.size > 0) {
          const hasAllLabels = [...state.selectedLabels].every((lbl) => item.labels.includes(lbl));
          if (!hasAllLabels) return false;
        }

        if (state.searchQuery) {
          const q = state.searchQuery.toLowerCase();
          const haystack = [
            item.title,
            item.author,
            item.source,
            item.content,
            item.notes,
            ...item.labels.map((l) => `#${l}`)
          ].join(' ').toLowerCase();
          if (!haystack.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (state.sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (state.sortBy === 'title') return a.title.localeCompare(b.title);
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }

  // Render Cycle
  function renderAll() {
    // 1. Update Sidebar Counts
    document.getElementById('count-all').textContent = state.items.length;
    document.getElementById('count-unread').textContent = state.items.filter((i) => !i.archived).length;
    document.getElementById('count-favorite').textContent = state.items.filter((i) => i.favorite).length;
    document.getElementById('count-archived').textContent = state.items.filter((i) => i.archived).length;

    // 2. Aggregate Sources & Labels
    const sourceMap = new Map();
    const labelMap = new Map();
    state.items.forEach((item) => {
      sourceMap.set(item.source, (sourceMap.get(item.source) || 0) + 1);
      item.labels.forEach((lbl) => labelMap.set(lbl, (labelMap.get(lbl) || 0) + 1));
    });

    UIRenderer.renderFilterList(
      dom.sourceFiltersList,
      [...sourceMap.entries()].sort((a, b) => b[1] - a[1]),
      state.selectedSources,
      '',
      (source) => {
        state.selectedSources.has(source) ? state.selectedSources.delete(source) : state.selectedSources.add(source);
        renderAll();
      }
    );

    UIRenderer.renderFilterList(
      dom.labelFiltersList,
      [...labelMap.entries()].sort((a, b) => b[1] - a[1]),
      state.selectedLabels,
      '#',
      (label) => {
        state.selectedLabels.has(label) ? state.selectedLabels.delete(label) : state.selectedLabels.add(label);
        renderAll();
      }
    );

    const hasActiveExtraFilters = state.selectedSources.size > 0 || state.selectedLabels.size > 0;
    dom.clearFiltersBtn.hidden = !hasActiveExtraFilters;

    // 3. Toggle Sample Data Button
    const hasSamples = state.items.some((i) => i.isSample);
    dom.clearSamplesBtn.hidden = !hasSamples;

    // 4. Render Main Cards
    const filtered = getFilteredItems();
    UIRenderer.renderCards(dom.cardsGrid, filtered, openReaderDrawer);

    // 5. Update Header Summary
    const titles = {
      all: 'All Saves',
      unread: 'To Research',
      favorite: 'Favorites',
      archived: 'Archived'
    };
    dom.viewTitle.textContent = titles[state.statusFilter];
    dom.activeFilterSummary.textContent = `Showing ${filtered.length} of ${state.items.length} saved resources`;
  }

  // Reader Drawer Logic
  function openReaderDrawer(id) {
    const item = state.items.find((i) => i.id === id);
    if (!item) return;
    state.activeItemId = id;

    document.getElementById('drawerFavBtn').textContent = item.favorite ? '★ Favorited' : '☆ Favorite';
    document.getElementById('drawerArchiveBtn').textContent = item.archived ? '📤 Unarchive' : '📥 Archive';
    document.getElementById('drawerOriginalLink').href = item.url;

    UIRenderer.renderDrawer(
      dom.drawerBody,
      item,
      (itemId, notes) => {
        const target = state.items.find((i) => i.id === itemId);
        if (target) {
          target.notes = notes;
          DataStore.saveItems(state.items);
        }
      },
      (itemId, newTag) => {
        const target = state.items.find((i) => i.id === itemId);
        if (target && !target.labels.includes(newTag)) {
          target.labels.push(newTag);
          commit();
          openReaderDrawer(itemId);
        }
      },
      (itemId, tagToRemove) => {
        const target = state.items.find((i) => i.id === itemId);
        if (target) {
          target.labels = target.labels.filter((t) => t !== tagToRemove);
          commit();
          openReaderDrawer(itemId);
        }
      },
      (itemId) => {
        state.items = state.items.filter((i) => i.id !== itemId);
        dom.readerDrawer.hidden = true;
        commit();
      }
    );

    dom.readerDrawer.hidden = false;
  }

  // Event Listeners: Navigation & Filters
  document.querySelectorAll('[data-filter-status]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-status]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.statusFilter = btn.dataset.filterStatus;
      renderAll();
    });
  });

  dom.clearFiltersBtn.addEventListener('click', () => {
    state.selectedSources.clear();
    state.selectedLabels.clear();
    renderAll();
  });

  dom.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    renderAll();
  });

  dom.sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderAll();
  });

  dom.clearSamplesBtn.addEventListener('click', () => {
    state.items = state.items.filter((i) => !i.isSample);
    commit();
  });

  // View & Theme Toggles
  document.getElementById('viewToggleBtn').addEventListener('click', () => {
    state.viewMode = state.viewMode === 'grid' ? 'list' : 'grid';
    dom.cardsGrid.classList.toggle('list-view', state.viewMode === 'list');
  });

  document.getElementById('themeToggleBtn').addEventListener('click', (e) => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    e.target.textContent = isDark ? '🌙' : '☀️';
  });

  // Save Modal Controls
  document.getElementById('openSaveModalBtn').addEventListener('click', () => {
    dom.saveForm.reset();
    dom.saveModal.hidden = false;
  });

  const closeSaveModal = () => { dom.saveModal.hidden = true; };
  document.getElementById('closeSaveModalBtn').addEventListener('click', closeSaveModal);
  document.getElementById('cancelSaveBtn').addEventListener('click', closeSaveModal);

  document.getElementById('quickFillBtn').addEventListener('click', () => {
    document.getElementById('urlInput').value = 'https://www.linkedin.com/posts/ai-testing-workflows';
    document.getElementById('titleInput').value = 'Building Self-Healing E2E Pipelines with LLMs';
    document.getElementById('authorInput').value = 'Sarah Jenkins';
    document.getElementById('labelsInput').value = 'ai-agents, testing, ci-cd';
    document.getElementById('contentInput').value = 'Flaky selectors cost engineering teams hours every week. Here is a lightweight pattern for fallback locator resolution...';
  });

  dom.saveForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = document.getElementById('urlInput').value.trim();
    const rawLabels = document.getElementById('labelsInput').value;
    const labels = [...new Set(
      rawLabels.split(',')
        .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean)
    )];

    const newItem = {
      id: `item-${Date.now()}`,
      url,
      source: DataStore.detectSource(url),
      title: document.getElementById('titleInput').value.trim(),
      author: document.getElementById('authorInput').value.trim(),
      labels,
      content: document.getElementById('contentInput').value.trim(),
      notes: document.getElementById('notesInput').value.trim(),
      favorite: false,
      archived: false,
      isSample: false,
      createdAt: new Date().toISOString()
    };

    state.items.unshift(newItem);
    closeSaveModal();
    commit();
  });

  // Drawer Controls
  document.getElementById('closeDrawerBtn').addEventListener('click', () => {
    dom.readerDrawer.hidden = true;
    renderAll();
  });

  document.getElementById('drawerFavBtn').addEventListener('click', () => {
    const item = state.items.find((i) => i.id === state.activeItemId);
    if (item) {
      item.favorite = !item.favorite;
      commit();
      openReaderDrawer(item.id);
    }
  });

  document.getElementById('drawerArchiveBtn').addEventListener('click', () => {
    const item = state.items.find((i) => i.id === state.activeItemId);
    if (item) {
      item.archived = !item.archived;
      commit();
      openReaderDrawer(item.id);
    }
  });

  // Mobile Sidebar
  document.getElementById('openSidebarBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
  });
  document.getElementById('closeSidebarBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
  });

  // JSON Export / Import
  document.getElementById('exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state.items, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `linkvault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  });

  document.getElementById('importInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          state.items = imported;
          commit();
        }
      } catch {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  });

  // Initial Render
  renderAll();
});