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
  initSpotlightCard();
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
   4. Fresh Drops Spotlight (One-at-a-Time 4-Part Vertical Tier)
   ========================================================================== */
function initSpotlightCard() {
  const card = document.getElementById('card-spotlight');
  if (!card) return;

  const SPOTLIGHT_DROPS = [
    {
      id: 'dune-2',
      category: 'OTT',
      contextTag: 'LATEST OTT RELEASE',
      badgeClass: 'badge-ott-release',
      title: 'Dune: Part Two',
      meta: 'Denis Villeneuve • 2024 • Sci-Fi / Adventure',
      rating: '★ 8.6',
      platform: 'JioHotstar',
      format: '4K UHD • Atmos',
      poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
      synopsis: "Paul Atreides unites with Chani and the Fremen to wage war against House Harkonnen in Denis Villeneuve's acclaimed sci-fi epic.",
      btnText: 'Stream on JioHotstar ↗',
      btnClass: 'btn-theme-hotstar',
      btnIcon: '▶',
      url: 'https://www.hotstar.com/in/movies/dune-part-two/1271318044',
      glowColor: 'radial-gradient(circle, rgba(14, 165, 233, 0.35) 0%, rgba(12, 32, 68, 0.15) 50%, rgba(0, 0, 0, 0) 75%)'
    },
    {
      id: 'severance-s2',
      category: 'OTT',
      contextTag: 'TOP SHOW IN INDIA TODAY',
      badgeClass: 'badge-top-show',
      title: 'Severance',
      meta: 'Ben Stiller • Season 2 • Sci-Fi / Thriller',
      rating: '★ 8.7',
      platform: 'Apple TV+',
      format: '4K HDR • Vision',
      poster: 'https://image.tmdb.org/t/p/w500/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg',
      synopsis: 'Mark Scout leads a team at Lumon Industries whose memories have been surgically divided between their work and personal lives.',
      btnText: 'Watch on Apple TV+ ↗',
      btnClass: 'btn-theme-apple',
      btnIcon: '▶',
      url: 'https://tv.apple.com/in/show/severance/umc.cmc.1srk2goyh2q2zdxcx60pfw6cd',
      glowColor: 'radial-gradient(circle, rgba(167, 139, 250, 0.35) 0%, rgba(109, 40, 217, 0.15) 50%, rgba(0, 0, 0, 0) 75%)'
    },
    {
      id: 'hit-me-hard',
      category: 'MUSIC',
      contextTag: 'ALBUM RELEASE',
      badgeClass: 'badge-album-release',
      title: 'HIT ME HARD AND SOFT',
      meta: 'Billie Eilish • 2024 • Alternative Pop',
      rating: '★ 9.1',
      platform: 'Spotify',
      format: 'Lossless • Spatial',
      poster: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/600x600bb.jpg',
      synopsis: "Billie Eilish's critically acclaimed third studio album featuring chart-topping singles 'LUNCH', 'BIRDS OF A FEATHER' and 'CHIHIRO'.",
      btnText: 'Listen on Spotify ♫',
      btnClass: 'btn-theme-spotify',
      btnIcon: '♫',
      url: 'https://open.spotify.com/album/7aJuG4My1svFuBkDC4TCAc',
      glowColor: 'radial-gradient(circle, rgba(29, 185, 84, 0.35) 0%, rgba(16, 185, 129, 0.15) 50%, rgba(0, 0, 0, 0) 75%)'
    },
    {
      id: 'the-penguin',
      category: 'OTT',
      contextTag: 'LATEST OTT RELEASE',
      badgeClass: 'badge-ott-release',
      title: 'The Penguin',
      meta: 'Colin Farrell • Miniseries • Crime / Noir',
      rating: '★ 8.8',
      platform: 'JioHotstar',
      format: '4K UHD • Atmos',
      poster: 'https://image.tmdb.org/t/p/w500/vOWcqC4oDQws1doDWLO7d3dh5qc.jpg',
      synopsis: "Oz Cobb fights ruthlessly to seize control of Gotham City's criminal underworld following the devastating aftermath of The Batman.",
      btnText: 'Stream on JioHotstar ↗',
      btnClass: 'btn-theme-hotstar',
      btnIcon: '▶',
      url: 'https://www.hotstar.com/in/shows/the-penguin/1271324834',
      glowColor: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(30, 58, 138, 0.15) 50%, rgba(0, 0, 0, 0) 75%)'
    },
    {
      id: 'radical-optimism',
      category: 'MUSIC',
      contextTag: 'MUSIC RELEASE',
      badgeClass: 'badge-music-release',
      title: 'Radical Optimism',
      meta: 'Dua Lipa • 2024 • Psychedelic Dance',
      rating: '★ 8.2',
      platform: 'Apple Music',
      format: 'Spatial Audio • Hi-Res',
      poster: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bd/d3/2c/bdd32c8c-bba7-def3-4e1f-2992550b2d16/5021732379115.jpg/600x600bb.jpg',
      synopsis: "Dua Lipa channels UK rave culture and 90s psychedelia with anthemic tracks 'Houdini', 'Training Season' and 'Illusion'.",
      btnText: 'Listen on Apple Music ♫',
      btnClass: 'btn-theme-apple',
      btnIcon: '♫',
      url: 'https://music.apple.com/in/album/radical-optimism/1735578768',
      glowColor: 'radial-gradient(circle, rgba(244, 114, 182, 0.35) 0%, rgba(219, 39, 119, 0.15) 50%, rgba(0, 0, 0, 0) 75%)'
    },
    {
      id: 'gladiator-2',
      category: 'THEATER',
      contextTag: 'THEATER RELEASE',
      badgeClass: 'badge-theater-release',
      title: 'Gladiator II',
      meta: 'Ridley Scott • 2024 • Historical Epic',
      rating: '★ 7.9',
      platform: 'Theaters / IMAX',
      format: 'IMAX • Dolby Cinema',
      poster: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
      synopsis: "Years after witnessing the fall of Maximus, Lucius must enter the Colosseum to fight for the future of Rome against tyrannical emperors.",
      btnText: 'View Theaters & Showtimes ↗',
      btnClass: 'btn-theme-theater',
      btnIcon: '🎟',
      url: 'https://in.bookmyshow.com/movies/gladiator-ii/ET00392813',
      glowColor: 'radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, rgba(194, 65, 12, 0.15) 50%, rgba(0, 0, 0, 0) 75%)'
    },
    {
      id: 'squid-game-2',
      category: 'OTT',
      contextTag: 'TOP SHOW IN INDIA TODAY',
      badgeClass: 'badge-top-show',
      title: 'Squid Game',
      meta: 'Hwang Dong-hyuk • Season 2 • Survival Thriller',
      rating: '★ 8.5',
      platform: 'Netflix',
      format: '4K UHD • Atmos',
      poster: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
      synopsis: 'Three years after winning Squid Game, Player 456 gives up going to the states and returns with a brand-new resolve in his mind.',
      btnText: 'Watch on Netflix ↗',
      btnClass: 'btn-theme-netflix',
      btnIcon: '▶',
      url: 'https://www.netflix.com/title/81040344',
      glowColor: 'radial-gradient(circle, rgba(229, 9, 20, 0.35) 0%, rgba(153, 27, 27, 0.15) 50%, rgba(0, 0, 0, 0) 75%)'
    },
    {
      id: 'hurry-up-tomorrow',
      category: 'MUSIC',
      contextTag: 'ALBUM RELEASE',
      badgeClass: 'badge-album-release',
      title: 'Hurry Up Tomorrow',
      meta: 'The Weeknd • 2025 • Synthwave / R&B',
      rating: '★ 8.9',
      platform: 'Spotify',
      format: 'Lossless • Atmos',
      poster: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/13/fd/a3/13fda38d-fc63-ddc3-1cf2-c09251adc532/25UMGIM09489.rgb.jpg/600x600bb.jpg',
      synopsis: "The highly anticipated finale to The Weeknd's blockbuster album trilogy, featuring 'Dancing in the Flames' and 'Timeless'.",
      btnText: 'Listen on Spotify ♫',
      btnClass: 'btn-theme-spotify',
      btnIcon: '♫',
      url: 'https://open.spotify.com/album/2wGv5fU4b2WkIvhJ4WqL0t',
      glowColor: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(126, 34, 206, 0.15) 50%, rgba(0, 0, 0, 0) 75%)'
    }
  ];

  let currentIdx = 0;
  let autoTimer = null;

  const cardInner = card.querySelector('.spotlight-card-inner');
  const glow = document.getElementById('spotlight-glow');
  const typeChip = document.getElementById('spotlight-type-chip');
  const counter = document.getElementById('spotlight-counter');
  const btnPrev = document.getElementById('spotlight-btn-prev');
  const btnNext = document.getElementById('spotlight-btn-next');

  const posterImg = document.getElementById('spotlight-poster-img');
  const platformName = document.getElementById('spotlight-platform-name');
  const formatText = document.getElementById('spotlight-format-text');

  const mainTitle = document.getElementById('spotlight-main-title');
  const metaInfo = document.getElementById('spotlight-meta-info');
  const ratingEl = document.getElementById('spotlight-rating');

  const contextBadge = document.getElementById('spotlight-context-badge');
  const synopsisEl = document.getElementById('spotlight-synopsis');
  const actionBtn = document.getElementById('spotlight-action-btn');
  const btnIcon = document.getElementById('spotlight-btn-icon');
  const btnLabel = document.getElementById('spotlight-btn-label');

  function renderDrop(idx, animate = true) {
    const drop = SPOTLIGHT_DROPS[idx];
    if (!drop) return;

    if (animate && cardInner) {
      cardInner.classList.add('spotlight-animating');
    }

    setTimeout(() => {
      // 1. Header & Counter
      if (counter) counter.textContent = `${idx + 1} / ${SPOTLIGHT_DROPS.length}`;
      if (typeChip) typeChip.textContent = drop.category;

      // 2. Parts 1 & 2: Poster & Badges
      if (posterImg) {
        posterImg.src = drop.poster;
        posterImg.alt = `${drop.title} Artwork`;
      }
      if (platformName) platformName.textContent = drop.platform;
      if (formatText) formatText.textContent = drop.format;

      // 3. Part 3: Title & Creator Metadata
      if (mainTitle) mainTitle.textContent = drop.title;
      if (metaInfo) metaInfo.textContent = drop.meta;
      if (ratingEl) ratingEl.textContent = drop.rating;

      // 4. Part 4: Context Tag & 2-Line Synopsis & Action Button
      if (contextBadge) {
        contextBadge.textContent = drop.contextTag;
        contextBadge.className = `spotlight-context-badge ${drop.badgeClass}`;
      }
      if (synopsisEl) {
        synopsisEl.textContent = drop.synopsis;
      }
      if (actionBtn) {
        actionBtn.href = drop.url;
        actionBtn.className = `spotlight-action-btn ${drop.btnClass}`;
      }
      if (btnIcon) btnIcon.textContent = drop.btnIcon;
      if (btnLabel) btnLabel.textContent = drop.btnText;

      // Dynamic ambient glow
      if (glow && drop.glowColor) {
        glow.style.background = drop.glowColor;
      }

      if (animate && cardInner) {
        cardInner.classList.remove('spotlight-animating');
      }
    }, animate ? 140 : 0);
  }

  function nextDrop() {
    currentIdx = (currentIdx + 1) % SPOTLIGHT_DROPS.length;
    renderDrop(currentIdx, true);
    resetAutoCycle();
  }

  function prevDrop() {
    currentIdx = (currentIdx - 1 + SPOTLIGHT_DROPS.length) % SPOTLIGHT_DROPS.length;
    renderDrop(currentIdx, true);
    resetAutoCycle();
  }

  function startAutoCycle() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      currentIdx = (currentIdx + 1) % SPOTLIGHT_DROPS.length;
      renderDrop(currentIdx, true);
    }, 12000);
  }

  function resetAutoCycle() {
    startAutoCycle();
  }

  // Button navigation listeners
  if (btnPrev) btnPrev.addEventListener('click', prevDrop);
  if (btnNext) btnNext.addEventListener('click', nextDrop);

  // Pause on hover
  card.addEventListener('mouseenter', () => clearInterval(autoTimer));
  card.addEventListener('mouseleave', () => startAutoCycle());

  // Action button toast feedback
  if (actionBtn) {
    actionBtn.addEventListener('click', () => {
      const drop = SPOTLIGHT_DROPS[currentIdx];
      showToast(`Opening "${drop.title}" on ${drop.platform}...`);
    });
  }

  // Initial render
  renderDrop(currentIdx, false);
  startAutoCycle();
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
