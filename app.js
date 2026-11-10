/**
 * HomeOS - Interactive Vanilla JS Webapp & PWA
 */

document.addEventListener('DOMContentLoaded', () => {
  initServiceWorker();
  initOrientationLock();
  initGreeting();
  initSpatialNavigation();
  initPwaInstall();
});

function initGreeting() {
  const nameEl = document.getElementById('username-display');
  if (!nameEl) return;
  const stored = localStorage.getItem('homeos_username');
  if (stored) {
    nameEl.textContent = stored;
  }
}

function initOrientationLock() {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(() => { });
  }
  // Try locking on first touch / click gesture
  window.addEventListener('click', () => {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => { });
    }
  }, { once: true });
}

/* ==========================================================================
   1. Service Worker & PWA Support
   ========================================================================== */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[HomeOS] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[HomeOS] Service Worker registration failed:', err);
        });
    });
  }
}

let deferredInstallPrompt = null;
function initPwaInstall() {
  const installBtn = document.getElementById('install-btn');
  if (!installBtn) return;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    deferredInstallPrompt = e;
    installBtn.style.display = 'inline-flex';
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log(`[HomeOS] User response to install prompt: ${outcome}`);
    deferredInstallPrompt = null;
    installBtn.style.display = 'none';
  });

  window.addEventListener('appinstalled', () => {
    console.log('[HomeOS] PWA was installed successfully');
    installBtn.style.display = 'none';
    deferredInstallPrompt = null;
  });
}

/* ==========================================================================
   2. Live Clock & Calendar Widget
   ========================================================================== */
function initClock() {
  const dateEl = document.getElementById('date-display');
  const timeEl = document.getElementById('time-display');
  if (!dateEl || !timeEl) return;

  function update() {
    const now = new Date();

    // Format Date: "Tue, Nov 10"
    const optionsDate = { weekday: 'short', month: 'short', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString(undefined, optionsDate);

    // Format Time: "12:51 PM"
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12

    timeEl.textContent = `${hours}:${minutes} ${ampm}`;
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. Floating Dock Magnification Physics (macOS-style)
   ========================================================================== */
/* ==========================================================================
   3. Spatial Floating Navigation Hub (VisionOS & B&O Inspired)
   ========================================================================== */
function initSpatialNavigation() {
  const island = document.getElementById('spatial-island');
  const items = Array.from(document.querySelectorAll('.spatial-nav-item'));
  const indicator = document.getElementById('nav-indicator');

  if (!island || items.length === 0 || !indicator) return;

  function updateIndicator(targetItem, animate = true) {
    if (!targetItem) return;
    const islandRect = island.getBoundingClientRect();
    const itemRect = targetItem.getBoundingClientRect();

    const left = itemRect.left - islandRect.left;
    const width = itemRect.width;

    if (!animate) {
      indicator.style.transition = 'none';
    } else {
      indicator.style.transition = 'left 0.36s cubic-bezier(0.16, 1, 0.3, 1), width 0.36s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    indicator.style.left = `${left}px`;
    indicator.style.width = `${width}px`;
    indicator.style.opacity = '1';
  }

  function setActive(targetItem) {
    items.forEach((item) => item.classList.remove('active'));
    targetItem.classList.add('active');
    targetItem.classList.add('activating');
    setTimeout(() => targetItem.classList.remove('activating'), 300);
    updateIndicator(targetItem, true);

    const category = targetItem.dataset.category;
    console.log(`[HomeOS] Active media category: ${category}`);
  }

  // Click & Touch handler
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      setActive(item);
    });
  });

  // TV / Projector Keyboard Navigation: ArrowLeft / ArrowRight / Enter
  window.addEventListener('keydown', (e) => {
    const currentIndex = items.findIndex((i) => i.classList.contains('active'));
    if (e.key === 'ArrowRight' || e.key === 'Right') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % items.length;
      setActive(items[nextIndex]);
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      setActive(items[prevIndex]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (currentIndex !== -1) {
        setActive(items[currentIndex]);
      }
    }
  });

  // Window resize to maintain indicator alignment
  window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.spatial-nav-item.active') || items[0];
    updateIndicator(activeItem, false);
  });

  // Initial positioning after layout calculation
  setTimeout(() => {
    const activeItem = document.querySelector('.spatial-nav-item.active') || items[0];
    updateIndicator(activeItem, false);
  }, 120);
}

/* ==========================================================================
   5. Spotlight Search & Keyboard Navigation
   ========================================================================== */
function initSpotlightSearch() {
  const searchBtn = document.getElementById('search-btn');
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('app-search-input');
  const resultsContainer = document.getElementById('search-results');
  const dockItems = Array.from(document.querySelectorAll('.dock-item'));

  if (!overlay || !input || !resultsContainer) return;

  // Collect app registry from dock
  const apps = dockItems.map((item) => ({
    name: item.getAttribute('data-name') || '',
    category: item.getAttribute('data-category') || 'App',
    url: item.getAttribute('href') || '#',
    iconSrc: item.querySelector('img')?.getAttribute('src') || ''
  }));

  function openSearch() {
    overlay.classList.add('active');
    input.value = '';
    renderResults('');
    setTimeout(() => input.focus(), 80);
  }

  function closeSearch() {
    overlay.classList.remove('active');
    input.blur();
  }

  function renderResults(filterText) {
    resultsContainer.innerHTML = '';
    const query = filterText.toLowerCase().trim();
    const filtered = apps.filter((app) =>
      app.name.toLowerCase().includes(query) ||
      app.category.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.style.padding = '24px';
      empty.style.textAlign = 'center';
      empty.style.color = 'rgba(255, 255, 255, 0.45)';
      empty.style.fontSize = '14px';
      empty.textContent = `No apps matching "${filterText}"`;
      resultsContainer.appendChild(empty);
      return;
    }

    filtered.forEach((app, index) => {
      const a = document.createElement('a');
      a.className = `search-result-item ${index === 0 ? 'selected' : ''}`;
      a.href = app.url;
      a.target = '_self';
      a.innerHTML = `
        <img src="${app.iconSrc}" alt="${app.name}">
        <div class="search-result-info">
          <span class="search-result-title">${app.name}</span>
          <span class="search-result-category">${app.category}</span>
        </div>
      `;
      a.addEventListener('click', () => {
        closeSearch();
      });
      resultsContainer.appendChild(a);
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
  }

  input.addEventListener('input', (e) => {
    renderResults(e.target.value);
  });

  input.addEventListener('keydown', (e) => {
    const items = resultsContainer.querySelectorAll('.search-result-item');
    let currentIndex = Array.from(items).findIndex((el) => el.classList.contains('selected'));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (items.length > 0) {
        if (currentIndex >= 0) items[currentIndex].classList.remove('selected');
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add('selected');
        items[currentIndex].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (items.length > 0) {
        if (currentIndex >= 0) items[currentIndex].classList.remove('selected');
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        items[currentIndex].classList.add('selected');
        items[currentIndex].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'Enter') {
      if (currentIndex >= 0 && items[currentIndex]) {
        e.preventDefault();
        items[currentIndex].click();
      }
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeSearch();
    }
  });

  // Global keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    // Escape closes search or toggles clean mode off
    if (e.key === 'Escape') {
      if (overlay.classList.contains('active')) {
        closeSearch();
      } else if (document.body.classList.contains('clean-mode')) {
        document.body.classList.remove('clean-mode');
      }
    }
    // Slash '/' opens search if not currently focusing an input
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      openSearch();
    }
  });
}

/* ==========================================================================
   6. Clean Mode & Fullscreen Controls
   ========================================================================== */
function initControls() {
  const cleanBtn = document.getElementById('clean-view-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const desktop = document.getElementById('desktop');

  // Toggle Clean Wallpaper Mode
  function toggleCleanMode() {
    document.body.classList.toggle('clean-mode');
  }

  if (cleanBtn) {
    cleanBtn.addEventListener('click', toggleCleanMode);
  }

  // Clicking on desktop when in clean mode restores UI
  if (desktop) {
    desktop.addEventListener('click', () => {
      if (document.body.classList.contains('clean-mode')) {
        document.body.classList.remove('clean-mode');
      }
    });
  }

  // Keyboard shortcut 'H' for hide/clean mode
  window.addEventListener('keydown', (e) => {
    if ((e.key === 'h' || e.key === 'H') && document.activeElement.tagName !== 'INPUT') {
      toggleCleanMode();
    }
    if ((e.key === 'f' || e.key === 'F') && document.activeElement.tagName !== 'INPUT') {
      toggleFullscreen();
    }
  });

  // Fullscreen
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => { });
        }
      }).catch(() => { });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
    }
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }
}

