/**
 * HomeOS - Interactive Vanilla JS Bento Desktop
 */

import { initMoviesView, openMoviesView, closeMoviesView, updateBentoContinueWatchingCard } from './moviesView.js';

document.addEventListener('DOMContentLoaded', () => {
  initServiceWorker();
  initOrientationLock();
  initClockAndDate();
  initWeatherLive();
  initMusicPlayer();
  initNewsFeed();
  initContinueWatching();
  initVerticalDock();
  initMoviesView();
});

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, duration = 3200) {
  const toast = document.getElementById('homeos-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

window.showToast = showToast;

/* ==========================================================================
   1. Live Digital Clock & Calendar Date
   ========================================================================== */
function initClockAndDate() {
  const hoursEl = document.getElementById('time-hours');
  const minutesEl = document.getElementById('time-minutes');
  const ampmEl = document.getElementById('time-ampm');
  const secondsBar = document.getElementById('seconds-bar');

  const dayEl = document.getElementById('date-day');
  const weekdayEl = document.getElementById('date-weekday');
  const monthYearEl = document.getElementById('date-month-year');

  function updateClockAndDate() {
    const now = new Date();

    // Clock calculations
    let rawHours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = now.getSeconds();
    const ampm = rawHours >= 12 ? 'PM' : 'AM';
    rawHours = rawHours % 12;
    const hours = String(rawHours ? rawHours : 12).padStart(2, '0');

    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (ampmEl) ampmEl.textContent = ampm;
    if (secondsBar) {
      const pct = (seconds / 59) * 100;
      secondsBar.style.width = `${pct}%`;
    }

    // Date calculations
    const day = String(now.getDate()).padStart(2, '0');
    const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
    const month = now.toLocaleDateString(undefined, { month: 'long' });
    const year = now.getFullYear();

    if (dayEl) dayEl.textContent = day;
    if (weekdayEl) weekdayEl.textContent = weekday;
    if (monthYearEl) monthYearEl.textContent = `${month} ${year}`;
  }

  updateClockAndDate();
  setInterval(updateClockAndDate, 1000);
}

/* ==========================================================================
   2. Live Weather, AQI, Rain & Week Forecast (Ejipura, Bangalore)
   ========================================================================== */
async function initWeatherLive() {
  const cityEl = document.getElementById('weather-city');
  const tempEl = document.getElementById('weather-temp');
  const rangeEl = document.getElementById('weather-range');
  const condEl = document.getElementById('weather-condition');
  const aqiEl = document.getElementById('weather-aqi');
  const rainEl = document.getElementById('weather-rain');

  const LAT = 12.9382; // Ejipura, Bangalore
  const LON = 77.6299;

  async function fetchForecast() {
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,weather_code,precipitation_probability&hourly=temperature_2m,weather_code,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=Asia%2FKolkata&forecast_days=1`;
      const res = await fetch(weatherUrl);
      if (!res.ok) return;
      const data = await res.json();

      if (data && data.current) {
        const c = data.current;
        const currentTemp = Math.round(c.temperature_2m);
        if (tempEl) tempEl.textContent = `${currentTemp}°`;
        if (cityEl) cityEl.textContent = 'Ejipura';

        // Condition text
        const code = c.weather_code;
        let condText = 'Partly cloudy';
        if (code === 0) condText = 'Clear sky';
        else if (code === 1 || code === 2) condText = 'Partly cloudy';
        else if (code === 3) condText = 'Overcast';
        else if ([51, 53, 55, 61, 63, 65].includes(code)) condText = 'Light rain';
        else if ([80, 81, 82, 95].includes(code)) condText = 'Thunderstorm';

        if (condEl) condEl.textContent = condText;

        // Rain Probability
        const rainProb = c.precipitation_probability !== undefined
          ? c.precipitation_probability
          : (data.daily && data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[0] : 15);
        if (rainEl) rainEl.textContent = `${rainProb || 15}%`;

        // Range
        if (data.daily && data.daily.temperature_2m_max) {
          const hi = Math.round(data.daily.temperature_2m_max[0]);
          const lo = Math.round(data.daily.temperature_2m_min[0]);
          if (rangeEl) rangeEl.textContent = `H: ${hi}°   L: ${lo}°`;
        }

        // 4 Daily Time Slots: 3 AM, 9 AM, 3 PM, 9 PM
        if (data.hourly && data.hourly.temperature_2m) {
          const slotConfigs = [
            { id: '3am', hour: 3, isNight: true },
            { id: '9am', hour: 9, isNight: false },
            { id: '3pm', hour: 15, isNight: false },
            { id: '9pm', hour: 21, isNight: true }
          ];

          const currentHour = new Date().getHours();
          // Determine closest slot: 0-5 => 3am, 6-11 => 9am, 12-17 => 3pm, 18-23 => 9pm
          let activeSlotId = '3am';
          if (currentHour >= 6 && currentHour < 12) activeSlotId = '9am';
          else if (currentHour >= 12 && currentHour < 18) activeSlotId = '3pm';
          else if (currentHour >= 18 || currentHour < 0) activeSlotId = '9pm';

          slotConfigs.forEach(slot => {
            const hTemp = data.hourly.temperature_2m[slot.hour] !== undefined
              ? Math.round(data.hourly.temperature_2m[slot.hour])
              : null;
            const hCode = data.hourly.weather_code && data.hourly.weather_code[slot.hour] !== undefined
              ? data.hourly.weather_code[slot.hour]
              : 0;

            let icon = slot.isNight ? '🌙' : '☀️';
            if (hCode === 1 || hCode === 2) icon = slot.isNight ? '☁️' : '🌤️';
            else if (hCode === 3) icon = slot.isNight ? '☁️' : '⛅';
            else if ([51, 53, 55, 61, 63, 65].includes(hCode)) icon = '🌧️';
            else if ([80, 81, 82, 95].includes(hCode)) icon = '⛈️';

            const iconEl = document.getElementById(`slot-icon-${slot.id}`);
            const tempEl = document.getElementById(`slot-temp-${slot.id}`);
            const colEl = document.getElementById(`slot-${slot.id}`);

            if (iconEl) iconEl.textContent = icon;
            if (tempEl && hTemp !== null) tempEl.textContent = `${hTemp}°`;
            if (colEl) {
              if (slot.id === activeSlotId) colEl.classList.add('active-slot');
              else colEl.classList.remove('active-slot');
            }
          });
        }
      }
    } catch (err) {
      console.warn('[HomeOS] Live weather sync:', err);
    }
  }

  async function fetchAirQuality() {
    try {
      const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LON}&current=us_aqi,european_aqi`;
      const res = await fetch(aqiUrl);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.current) {
        const val = data.current.us_aqi || data.current.european_aqi || 42;
        if (aqiEl) aqiEl.textContent = `AQI ${val}`;
      }
    } catch (err) {
      console.warn('[HomeOS] Live AQI sync:', err);
    }
  }

  fetchForecast();
  fetchAirQuality();
  setInterval(() => {
    fetchForecast();
    fetchAirQuality();
  }, 10 * 60 * 1000);
}

/* ==========================================================================
   3. In-Page Ambient Music Player Widget (Web Audio Engine)
   ========================================================================== */
function initMusicPlayer() {
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
    { title: 'After Hours', artist: 'The Weeknd' },
    { title: 'Starboy', artist: 'The Weeknd ft. Daft Punk' },
    { title: 'Resonance', artist: 'HOME' },
    { title: 'Midnight City', artist: 'M83' }
  ];

  let currentTrackIdx = 0;
  let isPlaying = false;
  let currentProgressPercent = 32;
  let progressTimer = null;
  let audioCtx = null;
  let synthInterval = null;

  function startSynthAmbient() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Warm ambient Rhodes chord progression
      const chords = [
        [220, 277.18, 329.63, 415.3],   // A maj 7
        [185, 233.08, 277.18, 349.23],  // F# min 7
        [164.81, 207.65, 246.94, 311.13],// E maj 7
        [146.83, 185.0, 220.0, 277.18]  // D maj 7
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
          gain.gain.linearRampToValueAtTime(0.026, audioCtx.currentTime + 0.35);
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
      console.warn('[HomeOS] Web Audio error:', e);
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

      if (playIcon) {
        playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
      }

      showToast(`Playing "${playlist[currentTrackIdx].title}"`);

      progressTimer = setInterval(() => {
        currentProgressPercent += 0.3;
        if (currentProgressPercent >= 100) {
          nextTrack();
        } else {
          setProgress(currentProgressPercent);
        }
      }, 300);

    } else {
      cardMusic.classList.remove('playing');
      stopSynthAmbient();

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
      showToast(`Now playing: ${track.title}`);
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
   4. Today's News Feed (Auto-Refreshes Every 30 Seconds with 2 Intl, 2 Nat, 2 BLR)
   ========================================================================== */
function initNewsFeed() {
  const container = document.getElementById('news-feed-container');
  const badge = document.getElementById('news-refresh-badge');
  const btnRefresh = document.getElementById('news-refresh-btn');
  const itemsWrapIntl = document.getElementById('news-items-intl');
  const itemsWrapNat = document.getElementById('news-items-nat');
  const itemsWrapBlr = document.getElementById('news-items-blr');

  if (!container) return;

  const NEWS_POOLS = {
    international: [
      { source: 'Reuters', baseMins: 12, headline: 'Global fusion energy milestone achieved with historic net power benchmark', query: 'fusion energy milestone net power' },
      { source: 'ESA / NASA', baseMins: 45, headline: 'James Webb Telescope detects atmospheric markers on temperate exoplanet', query: 'James Webb telescope exoplanet atmosphere' },
      { source: 'MIT Tech Review', baseMins: 18, headline: 'DeepMind unveils generative model predicting crystal structures for solid-state batteries', query: 'DeepMind crystal structures solid state batteries' },
      { source: 'Bloomberg', baseMins: 28, headline: 'Global maritime shipping adopts zero-emission green ammonia freighters', query: 'green ammonia ships maritime' },
      { source: 'Nature', baseMins: 36, headline: 'CERN announces High-Luminosity LHC upgrade enters final commissioning phase', query: 'CERN High Luminosity LHC upgrade' },
      { source: 'Science', baseMins: 24, headline: 'Next-gen quantum processor demonstrates fault-tolerant logical qubit cluster', query: 'quantum processor logical qubit cluster' },
      { source: 'SpaceNews', baseMins: 52, headline: 'ESA Hera planetary defense probe returns first high-res asteroid rendezvous imagery', query: 'ESA Hera asteroid mission imagery' },
      { source: 'Financial Times', baseMins: 60, headline: 'Global clean energy investments outpace fossil fuels by 2-to-1 in landmark annual audit', query: 'clean energy investment outpaces fossil fuels' }
    ],
    national: [
      { source: 'The Hindu', baseMins: 18, headline: 'ISRO readies autonomous landing mission for reusable space shuttle RLV-LEX', query: 'ISRO RLV autonomous landing mission' },
      { source: 'Economic Times', baseMins: 40, headline: 'India semiconductor corridor begins trial commercial silicon runs at Sanand', query: 'India semiconductor corridor Sanand silicon' },
      { source: 'Indian Express', baseMins: 22, headline: 'Vande Bharat sleeper trainsets clear 180 km/h high-speed trial runs', query: 'Vande Bharat sleeper train speed trial' },
      { source: 'LiveMint', baseMins: 35, headline: 'India’s UPI international payments grid links with three new ASEAN central banks', query: 'UPI international payments ASEAN central banks' },
      { source: 'PIB India', baseMins: 50, headline: 'National Green Hydrogen Mission approves 8 gigawatt electrolyser manufacturing clusters', query: 'National Green Hydrogen Mission electrolyser manufacturing' },
      { source: 'The Hindu', baseMins: 29, headline: 'LIGO-India gravitational wave observatory breaks ground in Hingoli', query: 'LIGO India gravitational wave observatory Hingoli' },
      { source: 'Business Standard', baseMins: 44, headline: 'India’s open digital public infrastructure adopted by five additional nations', query: 'India DPI digital public infrastructure global adoption' },
      { source: 'ISRO', baseMins: 15, headline: 'Gaganyaan crew module clears supersonic atmospheric drogue parachute test', query: 'Gaganyaan parachute drop test ISRO' }
    ],
    bengaluru: [
      { source: 'Deccan Herald', baseMins: 25, headline: 'Namma Metro Pink Line underground tunneling crosses 90% milestone', query: 'Namma Metro Pink line underground tunneling' },
      { source: 'Bangalore Mirror', baseMins: 55, headline: 'Karnataka deploys AI traffic sensor grid across Silk Board and ORR', query: 'Bengaluru AI traffic sensor Silk Board ORR' },
      { source: 'The Hindu', baseMins: 20, headline: 'Bengaluru Suburban Rail Project awards major civil contract for Corridor-4 Kanaka Line', query: 'Bengaluru Suburban Rail Corridor 4 Kanaka Line' },
      { source: 'Deccan Herald', baseMins: 32, headline: 'BMRCL greenlights driverless CBTC signalling upgrade for Yellow Line rollout', query: 'BMRCL driverless CBTC yellow line' },
      { source: 'Bangalore Mirror', baseMins: 48, headline: 'HAL delivers series-production Tejas Mk1A fighter to IAF from Bengaluru base', query: 'HAL Tejas Mk1A IAF Bengaluru' },
      { source: 'Praja Bengaluru', baseMins: 28, headline: 'Bengaluru tech corridors roll out 24x7 electric feeder buses for Metro stations', query: 'Bengaluru electric feeder buses metro' },
      { source: 'Times of India', baseMins: 62, headline: 'Cubbon Park and Lalbagh biodiversity census identifies 45 rare urban bird species', query: 'Cubbon park Lalbagh biodiversity census' },
      { source: 'Deccan Herald', baseMins: 16, headline: 'KIAL Bengaluru Terminal 2 awarded global UNESCO Prix Versailles for architecture', query: 'KIAL Terminal 2 Bengaluru Prix Versailles' }
    ]
  };

  let intlIdx = 0;
  let natIdx = 0;
  let blrIdx = 0;
  let countdownSecs = 30;
  let elapsedSeconds = 0;

  function formatAgo(baseMins) {
    const totalMins = baseMins + Math.floor(elapsedSeconds / 60);
    if (totalMins < 60) return `${totalMins}m ago`;
    const hrs = Math.floor(totalMins / 60);
    const rem = totalMins % 60;
    return rem > 0 ? `${hrs}h ${rem}m ago` : `${hrs}h ago`;
  }

  function renderSection(wrapEl, pool, startIdx) {
    if (!wrapEl) return;
    const itemA = pool[startIdx % pool.length];
    const itemB = pool[(startIdx + 1) % pool.length];

    wrapEl.innerHTML = `
      <div class="news-item">
        <span class="news-item-source">${itemA.source} • ${formatAgo(itemA.baseMins)}</span>
        <a href="https://news.google.com/search?q=${encodeURIComponent(itemA.query)}" target="_blank" rel="noopener noreferrer"
          class="news-item-headline" data-headline="${itemA.headline}">${itemA.headline}</a>
      </div>
      <div class="news-item">
        <span class="news-item-source">${itemB.source} • ${formatAgo(itemB.baseMins)}</span>
        <a href="https://news.google.com/search?q=${encodeURIComponent(itemB.query)}" target="_blank" rel="noopener noreferrer"
          class="news-item-headline" data-headline="${itemB.headline}">${itemB.headline}</a>
      </div>
    `;

    // Bind toast click
    wrapEl.querySelectorAll('.news-item-headline').forEach(a => {
      a.addEventListener('click', () => {
        showToast('Opening story in Google News...');
      });
    });
  }

  function cycleNews(animate = true, isManual = false) {
    if (animate) {
      container.classList.add('news-fading');
    }

    // Advance indices by 2 (next pair of stories)
    intlIdx = (intlIdx + 2) % NEWS_POOLS.international.length;
    natIdx = (natIdx + 2) % NEWS_POOLS.national.length;
    blrIdx = (blrIdx + 2) % NEWS_POOLS.bengaluru.length;

    setTimeout(() => {
      renderSection(itemsWrapIntl, NEWS_POOLS.international, intlIdx);
      renderSection(itemsWrapNat, NEWS_POOLS.national, natIdx);
      renderSection(itemsWrapBlr, NEWS_POOLS.bengaluru, blrIdx);

      if (animate) {
        container.classList.remove('news-fading');
      }

      if (isManual) {
        if (btnRefresh) {
          btnRefresh.classList.add('spinning');
          setTimeout(() => btnRefresh.classList.remove('spinning'), 650);
        }
        showToast('News feed refreshed');
      }
    }, animate ? 160 : 0);
  }

  // Initial render (already in HTML, but wire up event listeners)
  renderSection(itemsWrapIntl, NEWS_POOLS.international, intlIdx);
  renderSection(itemsWrapNat, NEWS_POOLS.national, natIdx);
  renderSection(itemsWrapBlr, NEWS_POOLS.bengaluru, blrIdx);

  // Manual refresh button
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      countdownSecs = 30;
      if (badge) badge.textContent = '30s';
      cycleNews(true, true);
    });
  }

  // 1-second countdown ticker for 30s auto-refresh
  setInterval(() => {
    elapsedSeconds++;
    countdownSecs--;

    if (countdownSecs <= 0) {
      countdownSecs = 30;
      cycleNews(true, false);
    }

    if (badge) {
      badge.textContent = `${countdownSecs}s`;
    }
  }, 1000);
}

/* ==========================================================================
   5. Continue Hub Actions (Movies, Shows, Music) & LocalStorage Restore
   ========================================================================== */
function initContinueWatching() {
  const movieItem = document.getElementById('cw-item-movie');
  const showItem = document.getElementById('cw-item-show');
  const musicItem = document.getElementById('cw-item-music');

  const btnMovie = document.getElementById('btn-play-movie-cw');
  const btnShow = document.getElementById('btn-play-show-cw');
  const btnMusic = document.getElementById('btn-play-music-cw');

  // Check saved continue watching state from Movies catalog
  try {
    const saved = localStorage.getItem('homeos_continue_watching');
    if (saved) {
      updateBentoContinueWatchingCard(JSON.parse(saved));
    }
  } catch (e) {
    console.warn('LocalStorage continue watching read failed:', e);
  }

  // 1. Movie Resume: Dune Part Two (or pinned movie)
  function resumeMovie() {
    try {
      const saved = localStorage.getItem('homeos_continue_watching');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.url) {
          showToast(`Resuming "${data.title}" on ${data.providerName || 'Streaming'}...`);
          window.open(data.url, '_blank', 'noopener,noreferrer');
          return;
        }
      }
    } catch (e) { }

    showToast('Resuming Dune: Part Two on JioHotstar...');
    window.open('https://www.hotstar.com/in/explore?search_query=Dune+Part+Two', '_blank', 'noopener,noreferrer');
  }

  // 2. Show Resume: Severance S1:E4 on Apple TV+
  function resumeShow() {
    showToast('Resuming Severance (S1:E4) on Apple TV+...');
    window.open('https://tv.apple.com/search?term=Severance', '_blank', 'noopener,noreferrer');
  }

  // 3. Music Resume: After Hours • The Weeknd
  function resumeMusic() {
    const playBtn = document.getElementById('btn-play');
    if (playBtn) {
      playBtn.click();
    }
    showToast('Resuming After Hours • The Weeknd');
  }

  if (btnMovie) btnMovie.addEventListener('click', (e) => { e.stopPropagation(); resumeMovie(); });
  if (movieItem) movieItem.addEventListener('click', resumeMovie);

  if (btnShow) btnShow.addEventListener('click', (e) => { e.stopPropagation(); resumeShow(); });
  if (showItem) showItem.addEventListener('click', resumeShow);

  if (btnMusic) btnMusic.addEventListener('click', (e) => { e.stopPropagation(); resumeMusic(); });
  if (musicItem) musicItem.addEventListener('click', resumeMusic);
}

/* ==========================================================================
   6. Vertical Left Navigation Dock (Reference Replication)
   ========================================================================== */
function initVerticalDock() {
  const dock = document.getElementById('vertical-dock');
  const pill = document.getElementById('dock-active-pill');
  const bloom = document.getElementById('dock-active-bloom');
  const dockItems = document.querySelectorAll('.dock-item');

  if (!dock || dockItems.length === 0) return;

  function syncActiveIndicator(item, animate = true) {
    if (!item || !pill) return;
    const itemTop = item.offsetTop;
    const itemHeight = item.offsetHeight;

    const pillY = itemTop + (itemHeight - 16) / 2;
    const bloomY = itemTop + (itemHeight - 50) / 2;

    if (!animate) {
      pill.style.transition = 'none';
      if (bloom) bloom.style.transition = 'none';
    } else {
      pill.style.transition = 'transform 0.34s cubic-bezier(0.16, 1, 0.3, 1)';
      if (bloom) bloom.style.transition = 'transform 0.34s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    pill.style.transform = `translateY(${pillY}px)`;
    if (bloom) bloom.style.transform = `translateY(${bloomY}px)`;
  }

  window.syncActiveDockIndicator = syncActiveIndicator;

  dockItems.forEach(item => {
    item.addEventListener('click', () => {
      dockItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      syncActiveIndicator(item, true);

      const target = item.dataset.nav;

      if (target === 'movie') {
        openMoviesView();
        showToast('Movies: Unified Library');
        return;
      }

      if (target === 'profile') {
        closeMoviesView();
        showToast('Profile: Aaron Antony');
        return;
      }

      if (target === 'shows') {
        // Can open Movies view filtered to shows or show toast
        openMoviesView();
        showToast('Shows: Unified Series Library');
        return;
      }

      const toastMessages = {
        music: 'Music & Audio Experience'
      };

      if (toastMessages[target]) {
        showToast(toastMessages[target]);
      }
    });
  });

  // Initial indicator position
  window.addEventListener('load', () => {
    const activeItem = document.querySelector('.dock-item.active') || dockItems[0];
    syncActiveIndicator(activeItem, false);
  });
  window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.dock-item.active') || dockItems[0];
    syncActiveIndicator(activeItem, false);
  });

  setTimeout(() => {
    const activeItem = document.querySelector('.dock-item.active') || dockItems[0];
    syncActiveIndicator(activeItem, false);
  }, 100);
}

/* ==========================================================================
   7. Orientation Lock & Service Worker
   ========================================================================== */
function initOrientationLock() {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(() => { });
  }
  window.addEventListener('click', () => {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => { });
    }
  }, { once: true });
}

function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[HomeOS] Service Worker active:', reg.scope);
        })
        .catch((err) => {
          console.warn('[HomeOS] Service Worker registration:', err);
        });
    });
  }
}
