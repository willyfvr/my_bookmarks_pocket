const UIRenderer = (() => {
  const SOURCE_ICONS = {
    'LinkedIn': '💼',
    'GitHub': '🐙',
    'YouTube': '▶️',
    'X / Twitter': '𝕏',
    'Substack': '📰',
    'Medium': '✍️',
    'Web Article': '🌐'
  };

  function escapeHTML(str = '') {
    return str.replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function renderCards(container, items, onCardClick) {
    if (!items.length) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No matching resources found</h3>
          <p>Try clearing your active filters or save a new link to your vault.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map((item) => {
      const icon = SOURCE_ICONS[item.source] || '🌐';
      const tagsHTML = item.labels
        .map((tag) => `<span class="tag-pill">#${escapeHTML(tag)}</span>`)
        .join('');

      return `
        <article class="bookmark-card" data-id="${item.id}">
          <div>
            <div class="card-meta-top">
              <span class="source-pill">${icon} ${escapeHTML(item.source)}</span>
              <span>${item.favorite ? '★' : ''} ${formatDate(item.createdAt)}</span>
            </div>
            <h3 class="card-title">${escapeHTML(item.title)}</h3>
            ${item.author ? `<div class="card-author">by ${escapeHTML(item.author)}</div>` : ''}
          </div>

          <p class="card-excerpt">${escapeHTML(item.content || item.notes || item.url)}</p>

          <div>
            <div class="card-tags">${tagsHTML}</div>
            <div class="card-footer">
              <span>${item.notes ? '📝 Has research notes' : 'Click to read & annotate'}</span>
              <span>${item.archived ? 'Archived' : 'Active'}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    container.querySelectorAll('.bookmark-card').forEach((card) => {
      card.addEventListener('click', () => onCardClick(card.dataset.id));
    });
  }

  function renderFilterList(container, entries, activeSet, prefix, onToggle) {
    if (!entries.length) {
      container.innerHTML = `<span class="subtitle" style="font-size:0.8rem;padding:0.25rem 0.5rem;">None yet</span>`;
      return;
    }

    container.innerHTML = entries.map(([name, count]) => {
      const isActive = activeSet.has(name);
      return `
        <button class="nav-item ${isActive ? 'active' : ''}" data-value="${escapeHTML(name)}">
          <span>${prefix}${escapeHTML(name)}</span>
          <span class="badge">${count}</span>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.nav-item').forEach((btn) => {
      btn.addEventListener('click', () => onToggle(btn.dataset.value));
    });
  }

  function renderDrawer(container, item, onUpdateNotes, onAddLabel, onRemoveLabel, onDelete) {
    const icon = SOURCE_ICONS[item.source] || '🌐';
    const tagsHTML = item.labels.map((tag) => `
      <span class="tag-pill">
        #${escapeHTML(tag)}
        <button type="button" class="remove-tag-btn" data-tag="${escapeHTML(tag)}" style="border:none;background:none;cursor:pointer;color:inherit;margin-left:4px;">×</button>
      </span>
    `).join('');

    container.innerHTML = `
      <div class="card-meta-top">
        <span class="source-pill">${icon} ${escapeHTML(item.source)}</span>
        <span>Saved ${formatDate(item.createdAt)}</span>
      </div>

      <h2 class="reader-title">${escapeHTML(item.title)}</h2>
      ${item.author ? `<p class="card-author">Author / Source: <strong>${escapeHTML(item.author)}</strong></p>` : ''}

      <div class="card-tags" style="margin: 1rem 0;">
        ${tagsHTML}
      </div>

      <form id="drawerAddTagForm" style="display:flex;gap:0.5rem;max-width:300px;margin-bottom:1.25rem;">
        <input type="text" id="drawerNewTagInput" placeholder="+ Add label..." style="flex:1;padding:0.35rem 0.6rem;border-radius:6px;border:1px solid var(--border-color);background:var(--bg-app);color:var(--text-primary);font-size:0.82rem;" />
        <button type="submit" class="btn-ghost small">Add</button>
      </form>

      <div class="reader-content">${escapeHTML(item.content || 'No offline text excerpt saved for this link. Click "Open Original" above to view the live page.')}</div>

      <div class="reader-notes-box">
        <label for="drawerNotesArea" style="font-weight:600;font-size:0.85rem;">📝 Research Notes (Auto-saves)</label>
        <textarea id="drawerNotesArea" rows="5" placeholder="Write your key takeaways, follow-up ideas, or summary...">${escapeHTML(item.notes || '')}</textarea>
      </div>

      <div style="margin-top:2rem;display:flex;justify-content:flex-end;">
        <button type="button" class="btn-ghost small" id="drawerDeleteBtn" style="color:var(--accent);">Delete Resource</button>
      </div>
    `;

    container.querySelector('#drawerNotesArea').addEventListener('input', (e) => {
      onUpdateNotes(item.id, e.target.value);
    });

    container.querySelector('#drawerAddTagForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = container.querySelector('#drawerNewTagInput');
      const val = input.value.trim().toLowerCase().replace(/^#/, '');
      if (val) {
        onAddLabel(item.id, val);
        input.value = '';
      }
    });

    container.querySelectorAll('.remove-tag-btn').forEach((btn) => {
      btn.addEventListener('click', () => onRemoveLabel(item.id, btn.dataset.tag));
    });

    container.querySelector('#drawerDeleteBtn').addEventListener('click', () => {
      if (confirm('Delete this saved link permanently?')) {
        onDelete(item.id);
      }
    });
  }

  return {
    renderCards,
    renderFilterList,
    renderDrawer
  };
})();