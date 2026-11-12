/**
 * HomeOS - Music View
 * Clean, Frameless Architecture floating directly on Matte Desktop Wallpaper
 * EXACT replica of Movies View format tailored for YouTube Music
 */

import { 
  MUSIC_CONTINUE_LISTENING, 
  MUSIC_LISTENLIST,
  YOUTUBE_MUSIC_TOP_10,
  MUSIC_CATEGORIES,
  LISTEN_NOW_MUSIC_LIBRARY
} from './musicData.js';

let currentMusicTop10 = [...YOUTUBE_MUSIC_TOP_10];
let currentMusicLibrary = [...LISTEN_NOW_MUSIC_LIBRARY];
let activeMusicCategoryFilter = null;

export function initMusicView() {
  const overlay = document.getElementById('music-overlay');
  if (!overlay) return;

  overlay.innerHTML = `
    <!-- 1. Continue Listening Block (Orange Glow) -->
    <div class="movies-cw-section" id="music-cw-section">
      <!-- Top Supertitle Tag: MUSIC BLOCK -->
      <div class="movie-block-top">
        <span class="movie-block-tag">MUSIC BLOCK</span>
      </div>

      <!-- Hairline divider with downward ORANGE glow -->
      <div class="movie-block-divider-wrap cw-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line cw-divider-line"></div>
        <div class="movie-block-divider-glow cw-divider-glow"></div>
      </div>

      <!-- Continue Listening Header -->
      <div class="movies-cw-header">
        <div class="movies-cw-header-left">
          <h2 class="movies-cw-title">Continue Listening</h2>
        </div>
      </div>

      <!-- Horizontal Expanding Accordion Rail (Hidden Scrollbar + Anchored First/Last) -->
      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-cw="prev" aria-label="Previous track" title="Previous track">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="movies-cw-rail" id="music-cw-rail" role="region" aria-label="Continue Listening Tracks">
          ${renderContinueWatchingCards(MUSIC_CONTINUE_LISTENING)}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-cw="next" aria-label="Next track" title="Next track">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 2. Listenlist Priority Section (Golden Amber Glow) -->
    <div class="movies-platform-section movies-watchlist-section" id="music-watchlist-section">
      <!-- Hairline divider with downward GOLDEN AMBER glow -->
      <div class="movie-block-divider-wrap watchlist-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line watchlist-divider-line"></div>
        <div class="movie-block-divider-glow watchlist-divider-glow"></div>
      </div>

      <!-- Section Title: Listenlist with count badge -->
      <div class="movies-section-header">
        <div class="watchlist-header-left">
          <h2 class="movies-section-title">Listenlist</h2>
          <span class="watchlist-count-pill" id="music-watchlist-count-pill">${MUSIC_LISTENLIST.length} Saved</span>
        </div>
      </div>

      <!-- Listenlist Rail with Floating Arrows -->
      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-target="music-watchlist-rail" aria-label="Scroll left" title="Scroll left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="watchlist-rail" id="music-watchlist-rail" role="region" aria-label="My Saved Listenlist">
          ${renderWatchlistCards(MUSIC_LISTENLIST)}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="music-watchlist-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 3. YouTube Music Top 10 Hits Section with Hairline Divider & Downward RED Glow -->
    <div class="movies-platform-section movies-netflix-section" id="music-ytmusic-section">
      <div class="movie-block-divider-wrap ytmusic-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line ytmusic-divider-line"></div>
        <div class="movie-block-divider-glow ytmusic-divider-glow"></div>
      </div>

      <div class="movies-section-header">
        <div class="netflix-header-left">
          <h2 class="movies-section-title">YouTube Music</h2>
        </div>
      </div>

      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-target="music-ytmusic-rail" aria-label="Scroll left" title="Scroll left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="platform-top10-rail netflix-top10-rail" id="music-ytmusic-rail" role="region" aria-label="Top 10 Tracks on YouTube Music">
          ${renderPlatformTop10Rail(currentMusicTop10, 'ytmusic', 'YouTube Music')}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="music-ytmusic-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 4. Listen Now Section (Genres & Full YouTube Music Library) -->
    <div class="movies-platform-section movies-watchnow-section" id="music-watchnow-section">
      <div class="movie-block-divider-wrap categories-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line categories-divider-line"></div>
        <div class="movie-block-divider-glow categories-divider-glow"></div>
      </div>

      <div class="movies-section-header watchnow-section-header">
        <div class="watchnow-header-left">
          <h2 class="movies-section-title">Listen Now</h2>
          <span class="watchnow-status-pill" id="music-watchnow-status-pill">Library • ${currentMusicLibrary.length} Tracks & Albums</span>
        </div>
        <div class="watchnow-header-actions" id="music-watchnow-header-actions" style="display: none;">
          <button type="button" class="watchnow-clear-btn" id="music-watchnow-clear-btn" title="Reset filter to view all music">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>Reset to All</span>
          </button>
        </div>
      </div>

      <!-- Categories 3-Row Stacked Grid (6 Genres in Row 1, 6 Genres in Row 2, 6 Languages in Row 3) -->
      <div class="categories-grid" id="music-categories-grid" role="region" aria-label="Music Categories & Genres">
        ${renderCategoryCards(MUSIC_CATEGORIES)}
      </div>

      <div class="watchnow-grid" id="music-watchnow-grid" role="region" aria-label="Listen Now YouTube Music Library">
        ${renderWatchNowLibrary(null)}
      </div>
    </div>
  `;

  attachContinueWatchingEvents();
  attachWatchlistEvents();
  attachRailNavigationEvents();
  attachCategoryEvents();
  attachWatchNowEvents();
  attachInAppMusicPlayerEvents();
  loadLiveMusicContent();

  setTimeout(() => {
    const activeCard = document.querySelector('#music-cw-rail .movies-cw-card.is-active');
    if (activeCard) {
      centerCard(activeCard, false);
    }
  }, 100);
}

  setTimeout(() => {
    const activeCard = document.querySelector('#music-cw-rail .movies-cw-card.is-active');
    if (activeCard) {
      centerCard(activeCard, false);
    }
  }, 100);
}

function renderContinueWatchingCards(tracks) {
  const cardsHtml = tracks.map((track, index) => {
    const isActive = index === 0 ? 'is-active' : '';
    return `
      <div class="movies-cw-card ${isActive}" data-id="${track.id}" data-index="${index}" tabindex="0" role="button" aria-expanded="${index === 0}">
        <!-- Widescreen Backdrop for Active Expanded State -->
        <div class="cw-card-backdrop-wrap">
          <img class="cw-card-backdrop-img" src="${track.backdrop || track.poster}" alt="${track.title} Backdrop" loading="lazy" />
          <div class="cw-card-scrim-left"></div>
          <div class="cw-card-scrim-bottom"></div>
        </div>

        <!-- Vertical Poster for Collapsed State -->
        <div class="cw-card-poster-wrap">
          <img class="cw-card-poster-img" src="${track.poster}" alt="${track.title} Poster" loading="lazy" />
          <div class="cw-card-poster-scrim"></div>
        </div>

        <!-- Expanded Card Content (Visible when is-active) -->
        <div class="cw-card-expanded-content">
          <div class="cw-card-badge-row">
            <span class="cw-card-badge">CONTINUE LISTENING</span>
            <span class="cw-card-provider-pill ${track.providerBadgeClass}">${track.providerName}</span>
          </div>

          <h3 class="cw-card-title">${track.title}</h3>

          <div class="cw-card-meta-row">
            <span>${track.year}</span>
            <span class="meta-dot">•</span>
            <span>${track.duration}</span>
            <span class="meta-dot">•</span>
            <span>${(track.genres || []).join(', ')}</span>
            <span class="meta-dot">•</span>
            <span class="cw-card-director">Artist: ${track.director}</span>
          </div>

          <p class="cw-card-synopsis">${track.synopsis}</p>

          <div class="cw-card-progress-box">
            <div class="cw-card-progress-bar">
              <div class="cw-card-progress-fill fill-music" style="width: ${track.progress}%;"></div>
            </div>
            <div class="cw-card-progress-labels">
              <span class="cw-card-time-left">${track.timeLeft}</span>
              <span class="cw-card-percent">${track.progress}%</span>
            </div>
          </div>

          <div class="cw-card-actions">
            <a href="${track.streamUrl}" target="_blank" rel="noopener noreferrer" class="cw-card-play-btn" title="Listen on ${track.providerName}">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Continue Listening</span>
            </a>
          </div>
        </div>

        <!-- Collapsed Card Content (Visible when collapsed vertical rectangle) -->
        <div class="cw-card-collapsed-content">
          <span class="cw-collapsed-title">${track.title}</span>
          <div class="cw-collapsed-progress-bar">
            <div class="cw-collapsed-progress-fill fill-music" style="width: ${track.progress}%;"></div>
          </div>
          <span class="cw-collapsed-time-left">${track.timeLeft}</span>
        </div>
      </div>
    `;
  }).join('');

  return `${cardsHtml}<div class="cw-rail-end-spacer" aria-hidden="true"></div>`;
}

function renderPlatformTop10Rail(tracks, platformKey, platformName) {
  const cardsHtml = tracks.map((track) => {
    const isTen = track.rank === 10;
    return `
      <a href="${track.streamUrl}" target="_blank" rel="noopener noreferrer" class="platform-top10-item platform-item-${platformKey}" title="Listen #${track.rank} ${track.title} on ${platformName}">
        <div class="platform-rank-wrap ${isTen ? 'is-ten' : ''}">
          <span class="platform-rank-num ${isTen ? 'platform-rank-ten' : ''}">${track.rank}</span>
        </div>

        <div class="platform-poster-card">
          <img 
            class="platform-poster-img" 
            src="${track.poster}" 
            alt="${track.title} Poster" 
            loading="lazy"
            onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';" 
          />
          <div class="platform-card-scrim"></div>

          <div class="platform-card-info">
            <span class="platform-card-title">${track.title}</span>
            <div class="platform-card-meta">
              <span>${track.year}</span>
              <span class="meta-dot">•</span>
              <span>${track.language}</span>
              <span class="meta-dot">•</span>
              <span class="platform-rating">★ ${track.rating}</span>
            </div>
          </div>
        </div>
      </a>
    `;
  }).join('');

  return `${cardsHtml}<div class="cw-rail-end-spacer" aria-hidden="true"></div>`;
}

function renderWatchlistCards(tracks) {
  if (!tracks || !tracks.length) {
    return `<div class="watchlist-empty-state"><p>Your listenlist is currently empty.</p></div>`;
  }

  const cardsHtml = tracks.map((track) => {
    return `
      <div class="watchlist-card" data-id="${track.id}" id="music-wl-card-${track.id}">
        <img 
          class="wl-card-poster" 
          src="${track.poster}" 
          alt="${track.title} Poster" 
          loading="lazy"
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';" 
        />
        <div class="wl-card-scrim"></div>

        <div class="wl-card-top-row">
          <div class="wl-bookmark-badge" title="Saved to Listenlist" aria-label="Saved to Listenlist">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
        </div>

        <div class="wl-hover-overlay">
          <a href="${track.streamUrl}" target="_blank" rel="noopener noreferrer" class="wl-play-btn" title="Stream ${track.title} on ${track.providerName}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Stream</span>
          </a>
          <button type="button" class="wl-remove-btn" data-id="${track.id}" title="Remove from Listenlist" aria-label="Remove ${track.title} from Listenlist">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>Remove</span>
          </button>
        </div>

        <div class="wl-card-info">
          <span class="wl-card-title">${track.title}</span>
          <div class="wl-card-meta">
            <span>${track.year}</span>
            <span class="meta-dot">•</span>
            <span>${track.duration}</span>
            <span class="meta-dot">•</span>
            <span class="wl-rating">★ ${track.rating}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `${cardsHtml}<div class="cw-rail-end-spacer" aria-hidden="true"></div>`;
}

let activeMusicCategoryFilter = null;

function renderCategoryCards(categories) {
  const cardsHtml = categories.map(cat => `
    <div class="category-card" data-genre="${cat.id}" data-genre-title="${cat.name}" style="--cat-accent: ${cat.color}; --cat-rgb: ${cat.rgb};" role="button" tabindex="0" title="Filter Listen Now by ${cat.name}">
      <div class="cat-card-ambient" aria-hidden="true"></div>
      <div class="cat-card-body">
        <div class="cat-card-content">
          <span class="cat-card-tag">${cat.count}</span>
          <h3 class="cat-card-title">${cat.name}</h3>
          <span class="cat-card-sub">${cat.subtitle}</span>
        </div>
        <div class="cat-card-emoji-wrap" aria-hidden="true">
          ${cat.svg}
        </div>
      </div>
    </div>
  `).join('');

  return cardsHtml;
}

function renderWatchNowLibrary(categoryFilter = null) {
  if (!categoryFilter) {
    return currentMusicLibrary.map(track => renderWatchNowCard(track, false)).join('');
  }

  const normalize = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const isLanguage = categoryFilter.categoryType === 'language';
  const filterId = categoryFilter.id.toLowerCase();
  const normF = normalize(filterId);

  const matched = [];
  const others = [];

  currentMusicLibrary.forEach(track => {
    let isMatch = false;
    if (isLanguage) {
      const trackLang = (track.language || '').toLowerCase();
      if (filterId === 'punjabi') {
        isMatch = trackLang.includes('punjabi') || (!['malayalam', 'hindi', 'kannada', 'tamil', 'english'].some(l => trackLang.includes(l)));
      } else {
        isMatch = trackLang === filterId;
      }
    } else {
      isMatch = (track.genres || []).some(g => {
        const normG = normalize(g);
        return normG === normF || normG.includes(normF) || normF.includes(normG);
      });
    }

    if (isMatch) {
      matched.push(track);
    } else {
      others.push(track);
    }
  });

  const matchedHtml = matched.map(track => renderWatchNowCard(track, true)).join('');
  const othersHtml = others.map(track => renderWatchNowCard(track, false)).join('');

  if (others.length === 0) {
    return matchedHtml;
  }

  const dividerHtml = `
    <div class="watchnow-dotted-divider" aria-hidden="true">
      <div class="watchnow-dotted-line"></div>
      <div class="watchnow-dotted-pill">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 8v8"></path>
          <path d="M8 12h8"></path>
        </svg>
        <span>OTHER TITLES IN LIBRARY (${others.length})</span>
      </div>
      <div class="watchnow-dotted-line"></div>
    </div>
  `;

  return `${matchedHtml}${dividerHtml}${othersHtml}`;
}

function renderWatchNowCard(track, isDirectMatch = false) {
  const matchClass = isDirectMatch ? 'is-matched-category' : '';
  const genreList = Array.isArray(track.genres) ? track.genres.slice(0, 2).join(' • ') : '';

  return `
    <div class="watchnow-card ${matchClass}" data-id="${track.id}" role="article" tabindex="0">
      <div class="watchnow-poster-wrap">
        <img class="watchnow-poster-img" src="${track.poster}" alt="${track.title} Poster" loading="lazy" />
        <div class="watchnow-poster-scrim"></div>

        <div class="watchnow-top-badges">
          <span class="watchnow-provider-pill ${track.providerBadgeClass || 'badge-ytmusic'}">${track.providerName || 'YouTube Music'}</span>
          <span class="watchnow-lang-pill">${track.language || 'Music'}</span>
        </div>

        ${isDirectMatch ? `<div class="watchnow-match-ribbon"><span>MATCH</span></div>` : ''}

        <div class="watchnow-hover-overlay">
          <a href="${track.streamUrl}" target="_blank" rel="noopener noreferrer" class="watchnow-stream-btn" title="Stream ${track.title} on ${track.providerName || 'YouTube Music'}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Listen Now</span>
          </a>
        </div>
      </div>

      <div class="watchnow-card-info">
        <h4 class="watchnow-card-title" title="${track.title}">${track.title}</h4>
        <div class="watchnow-card-meta">
          <span>${track.year}</span>
          <span class="meta-dot">•</span>
          <span>${track.duration}</span>
          <span class="meta-dot">•</span>
          <span class="watchnow-rating">★ ${track.rating}</span>
        </div>
        <span class="watchnow-genres">${genreList}</span>
      </div>
    </div>
  `;
}

function filterWatchNow(category) {
  const grid = document.getElementById('music-watchnow-grid');
  const statusPill = document.getElementById('music-watchnow-status-pill');
  const clearActions = document.getElementById('music-watchnow-header-actions');
  const categoryCards = document.querySelectorAll('#music-categories-grid .category-card');

  if (!category) {
    activeMusicCategoryFilter = null;
    categoryCards.forEach(c => c.classList.remove('is-selected'));
    if (grid) grid.innerHTML = renderWatchNowLibrary(null);
    if (statusPill) statusPill.textContent = `Library • ${LISTEN_NOW_MUSIC_LIBRARY.length} Tracks & Albums`;
    if (clearActions) clearActions.style.display = 'none';
    if (window.showToast) window.showToast('Showing all library music');
    return;
  }

  if (activeMusicCategoryFilter && activeMusicCategoryFilter.id === category.id) {
    filterWatchNow(null);
    return;
  }

  activeMusicCategoryFilter = category;

  categoryCards.forEach(c => {
    if (c.dataset.genre === category.id) {
      c.classList.add('is-selected');
    } else {
      c.classList.remove('is-selected');
    }
  });

  if (grid) {
    grid.innerHTML = renderWatchNowLibrary(category);
  }

  const normalize = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const isLanguage = category.categoryType === 'language';
  const filterId = category.id.toLowerCase();
  const normF = normalize(filterId);
  const matchedCount = LISTEN_NOW_MUSIC_LIBRARY.filter(t => {
    if (isLanguage) {
      const tl = (t.language || '').toLowerCase();
      if (filterId === 'punjabi') {
        return tl.includes('punjabi') || (!['malayalam', 'hindi', 'kannada', 'tamil', 'english'].some(l => tl.includes(l)));
      }
      return tl === filterId;
    }
    return (t.genres || []).some(g => {
      const normG = normalize(g);
      return normG === normF || normG.includes(normF) || normF.includes(normG);
    });
  }).length;

  if (statusPill) {
    statusPill.innerHTML = `<strong>${category.name}</strong> (${matchedCount} Matches) • Plus Library`;
  }

  if (clearActions) {
    clearActions.style.display = 'flex';
  }

  if (window.showToast) {
    window.showToast(`Filtered by ${category.name} (${matchedCount} tracks)`);
  }

  const section = document.getElementById('music-watchnow-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function attachCategoryEvents() {
  const cards = document.querySelectorAll('#music-categories-grid .category-card');
  cards.forEach(card => {
    const handleSelect = () => {
      const genreId = card.dataset.genre;
      const category = MUSIC_CATEGORIES.find(c => c.id === genreId);
      if (category) {
        filterWatchNow(category);
      }
    };

    card.addEventListener('click', handleSelect);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect();
      }
    });
  });
}

function attachWatchNowEvents() {
  const clearBtn = document.getElementById('music-watchnow-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filterWatchNow(null);
    });
  }
}

function playTrackInApp(track) {
  if (window.playHomeOSMusic) {
    window.playHomeOSMusic(track);
  } else if (track.streamUrl) {
    window.open(track.streamUrl, '_blank', 'noopener,noreferrer');
  }
}

function attachInAppMusicPlayerEvents() {
  const overlay = document.getElementById('music-overlay');
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    // 1. Continue Listening play button
    const cwPlay = e.target.closest('.cw-card-play-btn');
    if (cwPlay) {
      e.preventDefault();
      e.stopPropagation();
      const card = cwPlay.closest('.movies-cw-card');
      const trackId = card?.dataset.id;
      const track = MUSIC_CONTINUE_LISTENING.find(t => t.id === trackId);
      if (track) playTrackInApp(track);
      return;
    }

    // 2. Watchlist / Listenlist play button
    const wlPlay = e.target.closest('.wl-play-btn');
    if (wlPlay) {
      e.preventDefault();
      e.stopPropagation();
      const card = wlPlay.closest('.watchlist-card');
      const trackId = card?.dataset.id;
      const track = MUSIC_LISTENLIST.find(t => t.id === trackId);
      if (track) playTrackInApp(track);
      return;
    }

    // 3. YouTube Music Top 10 items
    const top10Item = e.target.closest('.platform-item-ytmusic');
    if (top10Item) {
      e.preventDefault();
      e.stopPropagation();
      const title = top10Item.querySelector('.platform-card-title')?.textContent?.trim();
      const track = currentMusicTop10.find(t => t.title === title) || {
        title: title || 'YouTube Music Hit',
        artist: 'Top Chart India',
        poster: top10Item.querySelector('.platform-poster-img')?.src,
        streamUrl: top10Item.getAttribute('href')
      };
      playTrackInApp(track);
      return;
    }

    // 4. Listen Now Library stream button or card click
    const streamBtn = e.target.closest('.watchnow-stream-btn') || e.target.closest('.watchnow-card');
    if (streamBtn) {
      const card = streamBtn.closest('.watchnow-card');
      const trackId = card?.dataset.id;
      const track = currentMusicLibrary.find(t => t.id === trackId);
      if (track) {
        e.preventDefault();
        e.stopPropagation();
        playTrackInApp(track);
      }
    }
  });
}

async function loadLiveMusicContent() {
  try {
    const res = await fetch('/api/content');
    if (res.ok) {
      const data = await res.json();
      if (data && data.music) {
        if (data.music.top10 && data.music.top10.length > 0) {
          currentMusicTop10 = data.music.top10;
          const rail = document.getElementById('music-ytmusic-rail');
          if (rail) {
            rail.innerHTML = renderPlatformTop10Rail(currentMusicTop10, 'ytmusic', 'YouTube Music');
          }
        }
        if (data.music.library && data.music.library.length > 0) {
          currentMusicLibrary = data.music.library;
          const grid = document.getElementById('music-watchnow-grid');
          if (grid && !activeMusicCategoryFilter) {
            grid.innerHTML = renderWatchNowLibrary(null);
          }
          const pill = document.getElementById('music-watchnow-status-pill');
          if (pill) {
            pill.textContent = `Library • ${currentMusicLibrary.length} Tracks & Albums`;
          }
        }
      }
    }
  } catch (e) {
    console.log('[HomeOS] Using bundled YouTube Music dataset');
  }
}

function attachWatchlistEvents() {
  const rail = document.getElementById('music-watchlist-rail');
  if (!rail) return;

  rail.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.wl-remove-btn');
    if (removeBtn) {
      e.preventDefault();
      e.stopPropagation();
      const trackId = removeBtn.dataset.id;
      const card = document.getElementById(`music-wl-card-${trackId}`);
      if (card) {
        card.classList.add('is-removing');
        setTimeout(() => {
          card.remove();
          const remaining = rail.querySelectorAll('.watchlist-card').length;
          const countPill = document.getElementById('music-watchlist-count-pill');
          if (countPill) {
            countPill.textContent = `${remaining} Saved`;
          }
          if (remaining === 0) {
            rail.innerHTML = `<div class="watchlist-empty-state"><p>Your listenlist is currently empty.</p></div>`;
          }
        }, 280);
      }
    }
  });
}

function attachRailNavigationEvents() {
  const overlay = document.getElementById('music-overlay');
  if (!overlay) return;

  overlay.querySelectorAll('.rail-arrow-float').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (btn.dataset.cw) {
        const cards = Array.from(overlay.querySelectorAll('.movies-cw-card'));
        if (!cards.length) return;
        const activeIdx = cards.findIndex(c => c.classList.contains('is-active'));
        if (btn.dataset.cw === 'prev' && activeIdx > 0) {
          setActiveCard(cards[activeIdx - 1], true);
        } else if (btn.dataset.cw === 'next' && activeIdx < cards.length - 1) {
          setActiveCard(cards[activeIdx + 1], true);
        }
        updateContinueWatchingNavArrows();
        return;
      }

      const targetId = btn.dataset.target;
      if (!targetId) return;
      const rail = document.getElementById(targetId);
      if (!rail) return;

      const isPrev = btn.classList.contains('rail-arrow-left');
      const scrollStep = Math.max(380, Math.floor(rail.clientWidth * 0.72));

      rail.scrollBy({
        left: isPrev ? -scrollStep : scrollStep,
        behavior: 'smooth'
      });
    });
  });

  const rails = overlay.querySelectorAll('.watchlist-rail, .platform-top10-rail');
  rails.forEach(rail => {
    const updateArrows = () => {
      const parent = rail.closest('.movies-platform-section');
      if (!parent) return;

      const prevButtons = parent.querySelectorAll('.rail-arrow-left');
      const nextButtons = parent.querySelectorAll('.rail-arrow-right');

      const isStart = rail.scrollLeft <= 12;
      const isEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 16;

      prevButtons.forEach(b => {
        if (isStart) b.classList.add('is-disabled');
        else b.classList.remove('is-disabled');
      });

      nextButtons.forEach(b => {
        if (isEnd) b.classList.add('is-disabled');
        else b.classList.remove('is-disabled');
      });
    };

    rail.addEventListener('scroll', updateArrows, { passive: true });
    setTimeout(updateArrows, 120);
    setTimeout(updateArrows, 400);
  });

  updateContinueWatchingNavArrows();
}

function updateContinueWatchingNavArrows() {
  const cwSection = document.getElementById('music-cw-section');
  if (!cwSection) return;
  const cards = Array.from(cwSection.querySelectorAll('.movies-cw-card'));
  const activeIdx = cards.findIndex(c => c.classList.contains('is-active'));

  const prevBtns = cwSection.querySelectorAll('[data-cw="prev"]');
  const nextBtns = cwSection.querySelectorAll('[data-cw="next"]');

  prevBtns.forEach(b => {
    if (activeIdx <= 0) b.classList.add('is-disabled');
    else b.classList.remove('is-disabled');
  });

  nextBtns.forEach(b => {
    if (activeIdx >= cards.length - 1) b.classList.add('is-disabled');
    else b.classList.remove('is-disabled');
  });
}

export function setActiveCard(card, smooth = true) {
  if (!card) return;
  const overlay = document.getElementById('music-overlay');
  if (!overlay) return;

  const currentActive = overlay.querySelector('.movies-cw-card.is-active');
  if (currentActive === card) return;

  if (currentActive) {
    currentActive.classList.remove('is-active');
    currentActive.setAttribute('aria-expanded', 'false');
  }

  card.classList.add('is-active');
  card.setAttribute('aria-expanded', 'true');

  const trackId = card.dataset.id;
  const trackData = MUSIC_CONTINUE_LISTENING.find(t => t.id === trackId);
  if (trackData) {
    updateBentoContinueMusicCard({
      title: trackData.title,
      timeLeft: trackData.timeLeft,
      progress: trackData.progress,
      poster: trackData.poster,
      url: trackData.streamUrl,
      providerName: trackData.providerName,
      artist: trackData.director
    });
  }

  centerCard(card, smooth);
  updateContinueWatchingNavArrows();
}

function centerCard(card, smooth = true) {
  if (!card) return;
  const rail = document.getElementById('music-cw-rail');
  if (!rail) return;

  const cards = Array.from(rail.querySelectorAll('.movies-cw-card'));
  const cardIndex = cards.indexOf(card);

  const performScroll = () => {
    if (cardIndex === 0) {
      rail.scrollTo({
        left: 0,
        behavior: smooth ? 'smooth' : 'auto'
      });
      return;
    }

    if (cardIndex === cards.length - 1) {
      rail.scrollTo({
        left: Math.max(0, rail.scrollWidth - rail.clientWidth),
        behavior: smooth ? 'smooth' : 'auto'
      });
      return;
    }

    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
    const targetScroll = cardCenter - (rail.clientWidth / 2);

    rail.scrollTo({
      left: Math.max(0, Math.min(rail.scrollWidth - rail.clientWidth, targetScroll)),
      behavior: smooth ? 'smooth' : 'auto'
    });
  };

  performScroll();
  setTimeout(performScroll, 120);
  setTimeout(performScroll, 280);
}

function attachContinueWatchingEvents() {
  const rail = document.getElementById('music-cw-rail');
  if (!rail) return;

  const cards = rail.querySelectorAll('.movies-cw-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.cw-card-play-btn')) {
        return;
      }
      setActiveCard(card, true);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveCard(card, true);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('music-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;

    const allCards = Array.from(overlay.querySelectorAll('.movies-cw-card'));
    const activeIdx = allCards.findIndex(c => c.classList.contains('is-active'));

    if (e.key === 'ArrowRight' && activeIdx < allCards.length - 1) {
      e.preventDefault();
      setActiveCard(allCards[activeIdx + 1], true);
    } else if (e.key === 'ArrowLeft' && activeIdx > 0) {
      e.preventDefault();
      setActiveCard(allCards[activeIdx - 1], true);
    }
  });
}

export function openMusicView() {
  const overlay = document.getElementById('music-overlay');
  const moviesOverlay = document.getElementById('movies-overlay');
  const showsOverlay = document.getElementById('shows-overlay');
  const bento = document.getElementById('bento-dashboard');
  if (!overlay) return;

  if (moviesOverlay) moviesOverlay.classList.remove('active');
  if (showsOverlay) showsOverlay.classList.remove('active');

  if (bento) {
    bento.classList.add('view-hidden');
  }

  overlay.classList.add('active');
  overlay.scrollTop = 0;

  setTimeout(() => {
    const activeCard = document.querySelector('#music-cw-rail .movies-cw-card.is-active');
    if (activeCard) {
      centerCard(activeCard, false);
    }
  }, 80);
}

export function closeMusicView() {
  const overlay = document.getElementById('music-overlay');
  const bento = document.getElementById('bento-dashboard');
  if (!overlay) return;

  overlay.classList.remove('active');

  if (bento) {
    bento.classList.remove('view-hidden');
  }

  const dockItems = document.querySelectorAll('.dock-item');
  const profileItem = document.getElementById('nav-profile');
  if (dockItems && profileItem) {
    dockItems.forEach(i => i.classList.remove('active'));
    profileItem.classList.add('active');
    if (window.syncActiveDockIndicator) {
      window.syncActiveDockIndicator(profileItem, true);
    }
  }
}

export function updateBentoContinueMusicCard(data) {
  const musicCard = document.getElementById('cw-item-music');
  const bentoPlayer = document.getElementById('card-music');

  if (musicCard && data) {
    const titleEl = musicCard.querySelector('.cw-item-title');
    const timeLeftEl = musicCard.querySelector('.cw-time-remaining');
    const progressFill = musicCard.querySelector('.cw-progress-fill');
    const posterImg = musicCard.querySelector('.cw-poster-img');
    const resumeBtn = document.getElementById('btn-play-music-cw');

    if (titleEl && data.title) {
      titleEl.innerHTML = `${data.title} <span class="cw-sub-detail">• ${data.artist || ''}</span>`;
    }
    if (timeLeftEl && (data.timeLeft || data.duration)) {
      timeLeftEl.textContent = data.timeLeft || data.duration;
    }
    if (progressFill && data.progress) {
      progressFill.style.width = `${data.progress}%`;
    }
    if (posterImg && (data.poster || data.backdrop)) {
      posterImg.src = data.poster || data.backdrop;
      posterImg.alt = data.title || 'Music Track';
    }
    if (resumeBtn) {
      resumeBtn.title = `Resume ${data.title} on YouTube Music`;
      resumeBtn.onclick = (e) => {
        e.stopPropagation();
        if (data.url || data.streamUrl) {
          window.open(data.url || data.streamUrl, '_blank', 'noopener,noreferrer');
        }
      };
    }
  }

  // Also sync in-page Bento ambient player
  if (bentoPlayer && data) {
    const musicTitle = document.getElementById('music-title');
    const musicArtist = document.getElementById('music-artist');
    const musicFill = document.getElementById('music-progress-fill');
    const musicScrubber = document.getElementById('music-scrubber');

    if (musicTitle && data.title) musicTitle.textContent = data.title;
    if (musicArtist && (data.artist || data.director)) musicArtist.textContent = data.artist || data.director;
    if (musicFill && data.progress) musicFill.style.width = `${data.progress}%`;
    if (musicScrubber && data.progress) musicScrubber.style.left = `${data.progress}%`;
  }
}
