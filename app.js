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
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,weather_code,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=Asia%2FKolkata`;
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

          // 5-Day Forecast Row
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          for (let i = 0; i < 5; i++) {
            const dateStr = data.daily.time[i];
            const d = new Date(dateStr);
            const dName = i === 0 ? 'Today' : dayNames[d.getDay()];
            const dCode = data.daily.weather_code[i];
            const dMax = Math.round(data.daily.temperature_2m_max[i]);

            let icon = '☀️';
            if (dCode === 1 || dCode === 2) icon = '⛅';
            else if (dCode === 3) icon = '🌤️';
            else if ([51, 53, 55, 61, 63, 65].includes(dCode)) icon = '🌧️';
            else if ([80, 81, 82, 95].includes(dCode)) icon = '⛈️';

            const fDayEl = document.getElementById(`f-day-${i}`);
            const fIconEl = document.getElementById(`f-icon-${i}`);
            const fTempEl = document.getElementById(`f-temp-${i}`);

            if (fDayEl) fDayEl.textContent = dName;
            if (fIconEl) fIconEl.textContent = icon;
            if (fTempEl) fTempEl.textContent = `${dMax}°`;
          }
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
   4. Today's News Feed (2 News from Intl, National, Bengaluru)
   ========================================================================== */
function initNewsFeed() {
  const newsItems = document.querySelectorAll('.news-item-headline');
  newsItems.forEach(item => {
    item.addEventListener('click', () => {
      showToast('Opening news in Google News...');
    });
  });
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
