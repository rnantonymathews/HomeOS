/**
 * HomeOS - Interactive Vanilla JS Webapp & PWA
 */

document.addEventListener('DOMContentLoaded', () => {
  initServiceWorker();
  initOrientationLock();
  initBentoMusicPlayer();
  initBentoWeatherAndDate();
  initBentoPills();
  initPwaInstall();
});

/* ==========================================================================
   1. Bento Music Player (In-Page Audio Engine)
   ========================================================================== */
function initBentoMusicPlayer() {
  const cardMusic = document.getElementById('card-music');
  const btnPlay = document.getElementById('btn-play');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const titleEl = document.getElementById('music-title');
  const artistEl = document.getElementById('music-artist');
  const fillEl = document.getElementById('music-progress-fill');
  const scrubberEl = document.getElementById('music-scrubber');
  const progressWrapper = document.getElementById('music-progress-wrapper');
  const playIcon = document.getElementById('play-icon');

  if (!cardMusic || !btnPlay) return;

  const playlist = [
    { title: 'After Hours', artist: 'The Weeknd', duration: 361 },
    { title: 'Starboy', artist: 'The Weeknd ft. Daft Punk', duration: 230 },
    { title: 'Resonance', artist: 'HOME', duration: 212 },
    { title: 'Midnight City', artist: 'M83', duration: 243 }
  ];

  let currentTrackIdx = 0;
  let isPlaying = false;
  let currentProgressPercent = 32;
  let progressTimer = null;
  let audioCtx = null;
  let synthInterval = null;

  // Web Audio Synth for instant, zero-latency ambient soundscape
  function startSynthAmbient() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Play soft warm lofi Rhodes chord progression
      const chords = [
        [220, 277.18, 329.63, 415.3], // A major 7
        [185, 233.08, 277.18, 349.23], // F# min 7
        [164.81, 207.65, 246.94, 311.13], // E maj 7
        [146.83, 185.0, 220.0, 277.18]   // D maj 7
      ];
      let chordIndex = 0;

      function playChord(notes) {
        if (!isPlaying || !audioCtx) return;
        notes.forEach(freq => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

          gain.gain.setValueAtTime(0, audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.028, audioCtx.currentTime + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.8);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start();
          osc.stop(audioCtx.currentTime + 4.0);
        });
      }

      playChord(chords[chordIndex]);
      synthInterval = setInterval(() => {
        chordIndex = (chordIndex + 1) % chords.length;
        playChord(chords[chordIndex]);
      }, 4000);

    } catch (e) {
      console.warn('[HomeOS] Web Audio initialization:', e);
    }
  }

  function stopSynthAmbient() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  function setProgress(percent) {
    currentProgressPercent = Math.max(0, Math.min(100, percent));
    if (fillEl) fillEl.style.width = `${currentProgressPercent}%`;
    if (scrubberEl) scrubberEl.style.left = `${currentProgressPercent}%`;
  }

  function togglePlay() {
    isPlaying = !isPlaying;

    if (isPlaying) {
      cardMusic.classList.add('playing');
      startSynthAmbient();

      // Switch SVG icon to Pause double-bar
      if (playIcon) {
        playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
      }

      // Smooth progress timer
      progressTimer = setInterval(() => {
        currentProgressPercent += 0.25;
        if (currentProgressPercent >= 100) {
          nextTrack();
        } else {
          setProgress(currentProgressPercent);
        }
      }, 300);

    } else {
      cardMusic.classList.remove('playing');
      stopSynthAmbient();

      // Switch SVG icon to Play triangle
      if (playIcon) {
        playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
      }

      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
    }
  }

  function updateTrackDisplay() {
    const track = playlist[currentTrackIdx];
    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;
    setProgress(0);
    if (isPlaying) {
      stopSynthAmbient();
      startSynthAmbient();
    }
  }

  function nextTrack() {
    currentTrackIdx = (currentTrackIdx + 1) % playlist.length;
    updateTrackDisplay();
  }

  function prevTrack() {
    currentTrackIdx = (currentTrackIdx - 1 + playlist.length) % playlist.length;
    updateTrackDisplay();
  }

  btnPlay.addEventListener('click', togglePlay);
  if (btnNext) btnNext.addEventListener('click', nextTrack);
  if (btnPrev) btnPrev.addEventListener('click', prevTrack);

  // Scrubber click/drag
  if (progressWrapper) {
    progressWrapper.addEventListener('click', (e) => {
      const rect = progressWrapper.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = (clickX / rect.width) * 100;
      setProgress(pct);
    });
  }
}

/* ==========================================================================
   2. Bento Weather & Date Synchronization
   ========================================================================== */
function initBentoWeatherAndDate() {
  const dayEl = document.getElementById('date-day');
  const weekdayEl = document.getElementById('date-weekday');
  const monthEl = document.getElementById('date-month');

  const cityEl = document.getElementById('weather-city');
  const tempEl = document.getElementById('weather-temp');
  const humidityEl = document.getElementById('weather-humidity');
  const condEl = document.getElementById('weather-condition');
  const rangeEl = document.getElementById('weather-range');

  // Update Date
  function updateDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
    const month = now.toLocaleDateString(undefined, { month: 'long' });

    if (dayEl) dayEl.textContent = day;
    if (weekdayEl) weekdayEl.textContent = weekday;
    if (monthEl) monthEl.textContent = month;
  }

  updateDate();
  setInterval(updateDate, 60000);

  // Fetch Live Weather for Bangalore, Ejipura
  async function updateWeather() {
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=12.9382&longitude=77.6299&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FKolkata');
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.current) {
        const c = data.current;
        if (tempEl) tempEl.textContent = `${Math.round(c.temperature_2m)}°`;
        if (humidityEl) humidityEl.textContent = `Humidity ${c.relative_humidity_2m}%`;
        if (cityEl) cityEl.textContent = 'Ejipura';

        // Conditions
        const code = c.weather_code;
        let condText = 'Partly cloudy';
        if (code === 0) condText = 'Clear sky';
        else if (code === 1 || code === 2) condText = 'Partly cloudy';
        else if (code === 3) condText = 'Overcast';
        else if ([51, 53, 55, 61, 63, 65].includes(code)) condText = 'Rainy';
        else if ([80, 81, 82, 95].includes(code)) condText = 'Thunderstorm';

        if (condEl) condEl.textContent = condText;
        if (rangeEl) {
          const lo = Math.round(c.temperature_2m - 4);
          const hi = Math.round(c.temperature_2m + 5);
          rangeEl.textContent = `L: ${lo}°   H: ${hi}°`;
        }
      }
    } catch (err) {
      console.warn('[HomeOS] Live weather sync:', err);
    }
  }

  updateWeather();
  setInterval(updateWeather, 10 * 60 * 1000);
}

/* ==========================================================================
   3. Quick Bento Category Pills
   ========================================================================== */
function initBentoPills() {
  const pills = document.querySelectorAll('.bento-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('pill-accent'));
      pill.classList.add('pill-accent');
    });
  });
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

