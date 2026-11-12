/**
 * HomeOS - Shows View
 * Clean, Frameless Architecture floating directly on Matte Desktop Wallpaper
 * EXACT replica of Movies View format tailored for TV Shows
 */

import { 
  SHOWS_CONTINUE_WATCHING, 
  SHOWS_WATCHLIST,
  NETFLIX_TOP_10_SHOWS,
  PRIME_TOP_10_SHOWS,
  HOTSTAR_TOP_10_SHOWS,
  SHOWS_CATEGORIES,
  WATCH_NOW_SHOWS_LIBRARY
} from './showsData.js';

export function initShowsView() {
  const overlay = document.getElementById('shows-overlay');
  if (!overlay) return;

  overlay.innerHTML = `
    <!-- 1. Continue Watching Block (Orange Glow) -->
    <div class="movies-cw-section" id="shows-cw-section">
      <!-- Top Supertitle Tag: SHOWS BLOCK -->
      <div class="movie-block-top">
        <span class="movie-block-tag">SHOWS BLOCK</span>
      </div>

      <!-- Hairline divider with downward ORANGE glow -->
      <div class="movie-block-divider-wrap cw-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line cw-divider-line"></div>
        <div class="movie-block-divider-glow cw-divider-glow"></div>
      </div>

      <!-- Continue Watching Header -->
      <div class="movies-cw-header">
        <div class="movies-cw-header-left">
          <h2 class="movies-cw-title">Continue Watching</h2>
        </div>
      </div>

      <!-- Horizontal Expanding Accordion Rail (Hidden Scrollbar + Anchored First/Last) -->
      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-cw="prev" aria-label="Previous show" title="Previous show">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="movies-cw-rail" id="shows-cw-rail" role="region" aria-label="Continue Watching TV Shows">
          ${renderContinueWatchingCards(SHOWS_CONTINUE_WATCHING)}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-cw="next" aria-label="Next show" title="Next show">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 2. Watchlist Priority Section (Golden Amber Glow) -->
    <div class="movies-platform-section movies-watchlist-section" id="shows-watchlist-section">
      <!-- Hairline divider with downward GOLDEN AMBER glow -->
      <div class="movie-block-divider-wrap watchlist-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line watchlist-divider-line"></div>
        <div class="movie-block-divider-glow watchlist-divider-glow"></div>
      </div>

      <!-- Section Title: Watchlist with count badge -->
      <div class="movies-section-header">
        <div class="watchlist-header-left">
          <h2 class="movies-section-title">Watchlist</h2>
          <span class="watchlist-count-pill" id="shows-watchlist-count-pill">${SHOWS_WATCHLIST.length} Saved</span>
        </div>
      </div>

      <!-- Watchlist Rail with Floating Arrows -->
      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-target="shows-watchlist-rail" aria-label="Scroll left" title="Scroll left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="watchlist-rail" id="shows-watchlist-rail" role="region" aria-label="My Saved Watchlist">
          ${renderWatchlistCards(SHOWS_WATCHLIST)}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="shows-watchlist-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 3. Netflix Section with Hairline Divider, Downward RED Glow, and "Netflix" Title -->
    <div class="movies-platform-section movies-netflix-section" id="shows-netflix-section">
      <div class="movie-block-divider-wrap netflix-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line netflix-divider-line"></div>
        <div class="movie-block-divider-glow netflix-divider-glow"></div>
      </div>

      <div class="movies-section-header">
        <div class="netflix-header-left">
          <h2 class="movies-section-title">Netflix</h2>
        </div>
      </div>

      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-target="shows-netflix-rail" aria-label="Scroll left" title="Scroll left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="platform-top10-rail netflix-top10-rail" id="shows-netflix-rail" role="region" aria-label="Top 10 Shows on Netflix">
          ${renderPlatformTop10Rail(NETFLIX_TOP_10_SHOWS, 'netflix', 'Netflix')}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="shows-netflix-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 4. Prime Video Section with Hairline Divider, Downward BLUE Glow, and "Prime Video" Title -->
    <div class="movies-platform-section movies-prime-section" id="shows-prime-section">
      <div class="movie-block-divider-wrap prime-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line prime-divider-line"></div>
        <div class="movie-block-divider-glow prime-divider-glow"></div>
      </div>

      <div class="movies-section-header">
        <div class="prime-header-left">
          <h2 class="movies-section-title">Prime Video</h2>
        </div>
      </div>

      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-target="shows-prime-rail" aria-label="Scroll left" title="Scroll left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="platform-top10-rail prime-top10-rail" id="shows-prime-rail" role="region" aria-label="Top 10 Shows on Prime Video">
          ${renderPlatformTop10Rail(PRIME_TOP_10_SHOWS, 'prime', 'Prime Video')}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="shows-prime-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 5. Hotstar Section with Hairline Divider, Downward PURPLE Glow, and "Hotstar" Title -->
    <div class="movies-platform-section movies-hotstar-section" id="shows-hotstar-section">
      <div class="movie-block-divider-wrap hotstar-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line hotstar-divider-line"></div>
        <div class="movie-block-divider-glow hotstar-divider-glow"></div>
      </div>

      <div class="movies-section-header">
        <div class="hotstar-header-left">
          <h2 class="movies-section-title">Hotstar</h2>
        </div>
      </div>

      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-target="shows-hotstar-rail" aria-label="Scroll left" title="Scroll left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="platform-top10-rail hotstar-top10-rail" id="shows-hotstar-rail" role="region" aria-label="Top 10 Shows on Hotstar">
          ${renderPlatformTop10Rail(HOTSTAR_TOP_10_SHOWS, 'hotstar', 'Hotstar')}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="shows-hotstar-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 6. Watch Now Section (Genres & Full Library) -->
    <div class="movies-platform-section movies-watchnow-section" id="shows-watchnow-section">
      <div class="movie-block-divider-wrap categories-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line categories-divider-line"></div>
        <div class="movie-block-divider-glow categories-divider-glow"></div>
      </div>

      <div class="movies-section-header watchnow-section-header">
        <div class="watchnow-header-left">
          <h2 class="movies-section-title">Watch Now</h2>
          <span class="watchnow-status-pill" id="shows-watchnow-status-pill">Library • ${WATCH_NOW_SHOWS_LIBRARY.length} TV Shows</span>
        </div>
        <div class="watchnow-header-actions" id="shows-watchnow-header-actions" style="display: none;">
          <button type="button" class="watchnow-clear-btn" id="shows-watchnow-clear-btn" title="Reset filter to view all TV shows">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>Reset to All</span>
          </button>
        </div>
      </div>

      <!-- Categories 3-Row Stacked Grid (6 Genres in Row 1, 6 Genres in Row 2, 6 Languages in Row 3) -->
      <div class="categories-grid" id="shows-categories-grid" role="region" aria-label="Show Categories & Languages">
        ${renderCategoryCards(SHOWS_CATEGORIES)}
      </div>

      <div class="watchnow-grid" id="shows-watchnow-grid" role="region" aria-label="Watch Now Library TV Shows">
        ${renderWatchNowLibrary(null)}
      </div>
    </div>
  `;

  attachContinueWatchingEvents();
  attachWatchlistEvents();
  attachRailNavigationEvents();
  attachCategoryEvents();
  attachWatchNowEvents();

  setTimeout(() => {
    const activeCard = document.querySelector('#shows-cw-rail .movies-cw-card.is-active');
    if (activeCard) {
      centerCard(activeCard, false);
    }
  }, 100);
}

function renderContinueWatchingCards(shows) {
  const cardsHtml = shows.map((show, index) => {
    const isActive = index === 0 ? 'is-active' : '';
    return `
      <div class="movies-cw-card ${isActive}" data-id="${show.id}" data-index="${index}" tabindex="0" role="button" aria-expanded="${index === 0}">
        <!-- Widescreen Backdrop for Active Expanded State -->
        <div class="cw-card-backdrop-wrap">
          <img class="cw-card-backdrop-img" src="${show.backdrop || show.poster}" alt="${show.title} Backdrop" loading="lazy" />
          <div class="cw-card-scrim-left"></div>
          <div class="cw-card-scrim-bottom"></div>
        </div>

        <!-- Vertical Poster for Collapsed State -->
        <div class="cw-card-poster-wrap">
          <img class="cw-card-poster-img" src="${show.poster}" alt="${show.title} Poster" loading="lazy" />
          <div class="cw-card-poster-scrim"></div>
        </div>

        <!-- Expanded Card Content (Visible when is-active) -->
        <div class="cw-card-expanded-content">
          <div class="cw-card-badge-row">
            <span class="cw-card-badge">CONTINUE WATCHING</span>
            <span class="cw-card-provider-pill ${show.providerBadgeClass}">${show.providerName}</span>
          </div>

          <h3 class="cw-card-title">${show.title}</h3>

          <div class="cw-card-meta-row">
            <span>${show.year}</span>
            <span class="meta-dot">•</span>
            <span>${show.duration}</span>
            <span class="meta-dot">•</span>
            <span>${(show.genres || []).join(', ')}</span>
            <span class="meta-dot">•</span>
            <span class="cw-card-director">Creator: ${show.director || 'Showrunner'}</span>
          </div>

          <p class="cw-card-synopsis">${show.synopsis}</p>

          <div class="cw-card-progress-box">
            <div class="cw-card-progress-bar">
              <div class="cw-card-progress-fill" style="width: ${show.progress}%;"></div>
            </div>
            <div class="cw-card-progress-labels">
              <span class="cw-card-time-left">${show.timeLeft}</span>
              <span class="cw-card-percent">${show.progress}%</span>
            </div>
          </div>

          <div class="cw-card-actions">
            <a href="${show.streamUrl}" target="_blank" rel="noopener noreferrer" class="cw-card-play-btn" title="Resume on ${show.providerName}">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Continue Watching</span>
            </a>
          </div>
        </div>

        <!-- Collapsed Card Content (Visible when collapsed vertical rectangle) -->
        <div class="cw-card-collapsed-content">
          <span class="cw-collapsed-title">${show.title}</span>
          <div class="cw-collapsed-progress-bar">
            <div class="cw-collapsed-progress-fill" style="width: ${show.progress}%;"></div>
          </div>
          <span class="cw-collapsed-time-left">${show.timeLeft}</span>
        </div>
      </div>
    `;
  }).join('');

  return `${cardsHtml}<div class="cw-rail-end-spacer" aria-hidden="true"></div>`;
}

function renderPlatformTop10Rail(shows, platformKey, platformName) {
  const cardsHtml = shows.map((show) => {
    const isTen = show.rank === 10;
    return `
      <a href="${show.streamUrl}" target="_blank" rel="noopener noreferrer" class="platform-top10-item platform-item-${platformKey}" title="Watch #${show.rank} ${show.title} on ${platformName}">
        <div class="platform-rank-wrap ${isTen ? 'is-ten' : ''}">
          <span class="platform-rank-num ${isTen ? 'platform-rank-ten' : ''}">${show.rank}</span>
        </div>

        <div class="platform-poster-card">
          <img 
            class="platform-poster-img" 
            src="${show.poster}" 
            alt="${show.title} Poster" 
            loading="lazy"
            onerror="this.onerror=null; this.src='assets/posters/dune-2.jpg';" 
          />
          <div class="platform-card-scrim"></div>

          <div class="platform-card-info">
            <span class="platform-card-title">${show.title}</span>
            <div class="platform-card-meta">
              <span>${show.year}</span>
              <span class="meta-dot">•</span>
              <span>${show.language}</span>
              <span class="meta-dot">•</span>
              <span class="platform-rating">★ ${show.rating}</span>
            </div>
          </div>
        </div>
      </a>
    `;
  }).join('');

  return `${cardsHtml}<div class="cw-rail-end-spacer" aria-hidden="true"></div>`;
}

function renderWatchlistCards(shows) {
  if (!shows || !shows.length) {
    return `<div class="watchlist-empty-state"><p>Your watchlist is currently empty.</p></div>`;
  }

  const cardsHtml = shows.map((show) => {
    return `
      <div class="watchlist-card" data-id="${show.id}" id="shows-wl-card-${show.id}">
        <img 
          class="wl-card-poster" 
          src="${show.poster}" 
          alt="${show.title} Poster" 
          loading="lazy"
          onerror="this.onerror=null; this.src='assets/posters/dune-2.jpg';" 
        />
        <div class="wl-card-scrim"></div>

        <div class="wl-card-top-row">
          <div class="wl-bookmark-badge" title="Saved to Watchlist" aria-label="Saved to Watchlist">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
        </div>

        <div class="wl-hover-overlay">
          <a href="${show.streamUrl}" target="_blank" rel="noopener noreferrer" class="wl-play-btn" title="Stream ${show.title} on ${show.providerName}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Stream</span>
          </a>
          <button type="button" class="wl-remove-btn" data-id="${show.id}" title="Remove from Watchlist" aria-label="Remove ${show.title} from Watchlist">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>Remove</span>
          </button>
        </div>

        <div class="wl-card-info">
          <span class="wl-card-title">${show.title}</span>
          <div class="wl-card-meta">
            <span>${show.year}</span>
            <span class="meta-dot">•</span>
            <span>${show.duration}</span>
            <span class="meta-dot">•</span>
            <span class="wl-rating">★ ${show.rating}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `${cardsHtml}<div class="cw-rail-end-spacer" aria-hidden="true"></div>`;
}

let activeShowsCategoryFilter = null;

function renderCategoryCards(categories) {
  const cardsHtml = categories.map(cat => `
    <div class="category-card" data-genre="${cat.id}" data-genre-title="${cat.name}" style="--cat-accent: ${cat.color}; --cat-rgb: ${cat.rgb};" role="button" tabindex="0" title="Filter Watch Now by ${cat.name}">
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
    return WATCH_NOW_SHOWS_LIBRARY.map(show => renderWatchNowCard(show, false)).join('');
  }

  const normalize = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const isLanguage = categoryFilter.categoryType === 'language';
  const filterId = categoryFilter.id.toLowerCase();
  const normF = normalize(filterId);

  const matched = [];
  const others = [];

  WATCH_NOW_SHOWS_LIBRARY.forEach(show => {
    let isMatch = false;
    if (isLanguage) {
      const showLang = (show.language || '').toLowerCase();
      if (filterId === 'others') {
        isMatch = showLang && !['malayalam', 'hindi', 'kannada', 'tamil', 'english'].includes(showLang);
      } else {
        isMatch = showLang === filterId;
      }
    } else {
      isMatch = (show.genres || []).some(g => {
        const normG = normalize(g);
        return normG === normF || normG.includes(normF) || normF.includes(normG);
      });
    }

    if (isMatch) {
      matched.push(show);
    } else {
      others.push(show);
    }
  });

  const matchedHtml = matched.map(show => renderWatchNowCard(show, true)).join('');
  const othersHtml = others.map(show => renderWatchNowCard(show, false)).join('');

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

function renderWatchNowCard(show, isDirectMatch = false) {
  const matchClass = isDirectMatch ? 'is-matched-category' : '';
  const genreList = Array.isArray(show.genres) ? show.genres.slice(0, 2).join(' • ') : '';

  return `
    <div class="watchnow-card ${matchClass}" data-id="${show.id}" role="article" tabindex="0">
      <div class="watchnow-poster-wrap">
        <img class="watchnow-poster-img" src="${show.poster}" alt="${show.title} Poster" loading="lazy" />
        <div class="watchnow-poster-scrim"></div>

        <div class="watchnow-top-badges">
          <span class="watchnow-provider-pill ${show.providerBadgeClass || 'badge-streaming'}">${show.providerName || 'Streaming'}</span>
          <span class="watchnow-lang-pill">${show.language || 'Series'}</span>
        </div>

        ${isDirectMatch ? `<div class="watchnow-match-ribbon"><span>MATCH</span></div>` : ''}

        <div class="watchnow-hover-overlay">
          <a href="${show.streamUrl}" target="_blank" rel="noopener noreferrer" class="watchnow-stream-btn" title="Stream ${show.title} on ${show.providerName || 'Streaming'}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Watch Now</span>
          </a>
        </div>
      </div>

      <div class="watchnow-card-info">
        <h4 class="watchnow-card-title" title="${show.title}">${show.title}</h4>
        <div class="watchnow-card-meta">
          <span>${show.year}</span>
          <span class="meta-dot">•</span>
          <span>${show.duration}</span>
          <span class="meta-dot">•</span>
          <span class="watchnow-rating">★ ${show.rating}</span>
        </div>
        <span class="watchnow-genres">${genreList}</span>
      </div>
    </div>
  `;
}

function filterWatchNow(category) {
  const grid = document.getElementById('shows-watchnow-grid');
  const statusPill = document.getElementById('shows-watchnow-status-pill');
  const clearActions = document.getElementById('shows-watchnow-header-actions');
  const categoryCards = document.querySelectorAll('#shows-categories-grid .category-card');

  if (!category) {
    activeShowsCategoryFilter = null;
    categoryCards.forEach(c => c.classList.remove('is-selected'));
    if (grid) grid.innerHTML = renderWatchNowLibrary(null);
    if (statusPill) statusPill.textContent = `Library • ${WATCH_NOW_SHOWS_LIBRARY.length} TV Shows`;
    if (clearActions) clearActions.style.display = 'none';
    if (window.showToast) window.showToast('Showing all library TV shows');
    return;
  }

  if (activeShowsCategoryFilter && activeShowsCategoryFilter.id === category.id) {
    filterWatchNow(null);
    return;
  }

  activeShowsCategoryFilter = category;

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
  const matchedCount = WATCH_NOW_SHOWS_LIBRARY.filter(s => {
    if (isLanguage) {
      const sl = (s.language || '').toLowerCase();
      return filterId === 'others' 
        ? sl && !['malayalam', 'hindi', 'kannada', 'tamil', 'english'].includes(sl)
        : sl === filterId;
    }
    return (s.genres || []).some(g => {
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
    window.showToast(`Filtered by ${category.name} (${matchedCount} shows)`);
  }

  const section = document.getElementById('shows-watchnow-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function attachCategoryEvents() {
  const cards = document.querySelectorAll('#shows-categories-grid .category-card');
  cards.forEach(card => {
    const handleSelect = () => {
      const genreId = card.dataset.genre;
      const category = SHOWS_CATEGORIES.find(c => c.id === genreId);
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
  const clearBtn = document.getElementById('shows-watchnow-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filterWatchNow(null);
    });
  }
}

function attachWatchlistEvents() {
  const rail = document.getElementById('shows-watchlist-rail');
  if (!rail) return;

  rail.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.wl-remove-btn');
    if (removeBtn) {
      e.preventDefault();
      e.stopPropagation();
      const showId = removeBtn.dataset.id;
      const card = document.getElementById(`shows-wl-card-${showId}`);
      if (card) {
        card.classList.add('is-removing');
        setTimeout(() => {
          card.remove();
          const remaining = rail.querySelectorAll('.watchlist-card').length;
          const countPill = document.getElementById('shows-watchlist-count-pill');
          if (countPill) {
            countPill.textContent = `${remaining} Saved`;
          }
          if (remaining === 0) {
            rail.innerHTML = `<div class="watchlist-empty-state"><p>Your watchlist is currently empty.</p></div>`;
          }
        }, 280);
      }
    }
  });
}

function attachRailNavigationEvents() {
  const overlay = document.getElementById('shows-overlay');
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
  const cwSection = document.getElementById('shows-cw-section');
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
  const overlay = document.getElementById('shows-overlay');
  if (!overlay) return;

  const currentActive = overlay.querySelector('.movies-cw-card.is-active');
  if (currentActive === card) return;

  if (currentActive) {
    currentActive.classList.remove('is-active');
    currentActive.setAttribute('aria-expanded', 'false');
  }

  card.classList.add('is-active');
  card.setAttribute('aria-expanded', 'true');

  const showId = card.dataset.id;
  const showData = SHOWS_CONTINUE_WATCHING.find(s => s.id === showId);
  if (showData) {
    updateBentoContinueShowsCard({
      title: showData.title,
      timeLeft: showData.timeLeft,
      progress: showData.progress,
      poster: showData.poster,
      url: showData.streamUrl,
      providerName: showData.providerName,
      duration: showData.duration
    });
  }

  centerCard(card, smooth);
  updateContinueWatchingNavArrows();
}

function centerCard(card, smooth = true) {
  if (!card) return;
  const rail = document.getElementById('shows-cw-rail');
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
  const rail = document.getElementById('shows-cw-rail');
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
    const overlay = document.getElementById('shows-overlay');
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

export function openShowsView() {
  const overlay = document.getElementById('shows-overlay');
  const moviesOverlay = document.getElementById('movies-overlay');
  const musicOverlay = document.getElementById('music-overlay');
  const bento = document.getElementById('bento-dashboard');
  if (!overlay) return;

  if (moviesOverlay) moviesOverlay.classList.remove('active');
  if (musicOverlay) musicOverlay.classList.remove('active');

  if (bento) {
    bento.classList.add('view-hidden');
  }

  overlay.classList.add('active');
  overlay.scrollTop = 0;

  setTimeout(() => {
    const activeCard = document.querySelector('#shows-cw-rail .movies-cw-card.is-active');
    if (activeCard) {
      centerCard(activeCard, false);
    }
  }, 80);
}

export function closeShowsView() {
  const overlay = document.getElementById('shows-overlay');
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

export function updateBentoContinueShowsCard(data) {
  const showCard = document.getElementById('cw-item-show') || document.getElementById('cw-item-shows');
  if (showCard && data) {
    const titleEl = showCard.querySelector('.cw-item-title');
    const timeLeftEl = showCard.querySelector('.cw-time-remaining');
    const progressFill = showCard.querySelector('.cw-progress-fill');
    const posterImg = showCard.querySelector('.cw-poster-img');
    const resumeBtn = document.getElementById('btn-play-show-cw');

    if (titleEl && data.title) {
      titleEl.innerHTML = `${data.title} <span class="cw-sub-detail">• ${data.duration || ''}</span>`;
    }
    if (timeLeftEl && data.timeLeft) {
      timeLeftEl.textContent = data.timeLeft;
    }
    if (progressFill && data.progress) {
      progressFill.style.width = `${data.progress}%`;
    }
    if (posterImg && (data.poster || data.backdrop)) {
      posterImg.src = data.poster || data.backdrop;
      posterImg.alt = data.title || 'TV Show';
    }
    if (resumeBtn) {
      resumeBtn.title = `Resume ${data.title || 'Show'} on ${data.providerName || 'Streaming'}`;
      resumeBtn.onclick = (e) => {
        e.stopPropagation();
        if (data.url || data.streamUrl) {
          window.open(data.url || data.streamUrl, '_blank', 'noopener,noreferrer');
        }
      };
    }
  }
}
