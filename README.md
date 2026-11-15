# 🔖 Willy's Bookmark Pocket — Web & LinkedIn Research Library

**Bookmark's Pocket** is a lightweight, distraction-free bookmark manager and research repository inspired by Pocket. Built with zero-dependency vanilla web technologies, it allows you to save LinkedIn posts, GitHub repositories, YouTube videos, and web articles—complete with offline text excerpts, custom `#labels`, source auto-detection, and live-saving research notes.

Designed with a **dual-mode architecture**, Willy's Bookmark Pocket runs seamlessly both as a **standalone web application** (hostable for free on GitHub Pages/Netlify) and as a **Chrome Extension (Manifest V3)** with right-click context-menu saving.

---

## ✨ Key Features

* **Dual-Mode Storage Adapter:** Automatically detects its runtime environment—using `chrome.storage.local` when running as a Chrome Extension (syncing with background context menus) and falling back to browser `localStorage` when opened as a standalone web page.
* **Automatic Source Detection:** Intelligently categorizes and badges saved links by platform (`LinkedIn`, `GitHub`, `YouTube`, `X / Twitter`, `Substack`, `Medium`, or `Web Article`).
* **Multi-Dimensional Filtering:** Filter your library simultaneously by status (*All Saves*, *To Research*, *Favorites*, *Archived*), source platform, and multiple custom `#labels`.
* **Editorial Research Reader:** Clicking any card opens a distraction-free slide-over reader with serif typography (`Newsreader`) for comfortable reading, inline label management, and auto-saving research notes.
* **1-Click Context Menu Save (Extension Mode):** Right-click anywhere on a webpage or link and select **"Save to Pocket"** to capture it immediately without leaving your tab.
* **Data Portability:** Full **JSON Export & Import** built into the sidebar so you can back up your research vault or transfer it across devices.
* **Responsive & Themeable:** Clean Light and Dark modes powered by CSS custom properties, plus Grid and Editorial List view toggles.

---

## 📁 Project Structure

```text
my_bookmarks_pocket/
├── manifest.json       # Chrome Extension Manifest V3 configuration
├── background.js       # Service worker for browser right-click context menus
├── index.html          # Semantic HTML layout, save modal, and reader drawer
├── style.css           # Design tokens (CSS variables), light/dark themes, and responsive grid
├── README.md           # Project documentation
└── js/
    ├── data.js         # Storage adapter (Chrome Storage / LocalStorage) & source detection
    ├── ui.js           # Pure DOM rendering functions for cards, filters, and reader view
    └── app.js          # Application state controller, search/filter pipeline, and event handlers
```

---

## 🚀 Getting Started

### Option 1: Run as a Chrome Extension (Recommended)

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click **Load unpacked** in the top-left toolbar.
4. Select the root folder of this project (`my_bookmarks_pocket/`).
5. Pin **LinkVault** to your toolbar for quick access, or right-click any page and choose **Save to LinkVault**.

> **Tip for Developers:** Whenever you modify `index.html`, `style.css`, or any file inside `js/`, click the **Reload** icon on the LinkVault card in `chrome://extensions/` to apply your changes.

### Option 2: Run as a Standalone Web App

Because Willy's Bookmark Pocket requires no build step, bundlers, or backend servers:

* **Locally:** Open `index.html` directly in any modern web browser (or use the *Live Server* extension in VS Code).
* **Free Cloud Hosting:** Deploy the folder directly to **GitHub Pages**, **Netlify Drop**, or **Vercel** for instant personal access from any browser.

---

## 🛠️ Customization Guide

The codebase is modularized so you can easily customize specific parts without touching unrelated logic:

| Goal | File to Edit |
| :--- | :--- |
| **Change colors, fonts, or popup dimensions** | `style.css` (modify the `:root` CSS variables or `body` dimensions) |
| **Add new website badges/platforms** | `js/data.js` (update `detectSource()`) & `js/ui.js` (`SOURCE_ICONS`) |
| **Modify card layout or reader drawer UI** | `js/ui.js` |
| **Adjust search, sorting, or keyboard shortcuts** | `js/app.js` |

---

## 📄 License

This project is open-source and free to use, modify, and self-host for personal or commercial workflows.