/**
 * HomeOS - Movies View
 * Clean, Frameless Architecture floating directly on Matte Desktop Wallpaper
 */

import { 
  CONTINUE_WATCHING_MOVIES, 
  MOVIES_CATALOG, 
  NETFLIX_TOP_10_INDIA,
  PRIME_TOP_10,
  HOTSTAR_TOP_10,
  WATCHLIST_MOVIES,
  MOVIE_CATEGORIES,
  WATCH_NOW_LIBRARY
} from './moviesData.js';

export function initMoviesView() {
  const overlay = document.getElementById('movies-overlay');
  if (!overlay) return;

  // Build the Movie Block Section & Netflix Section directly on the clean matte canvas
  overlay.innerHTML = `
    <!-- 1. Continue Watching Block (Orange Glow) -->
    <div class="movies-cw-section" id="movies-cw-section">
      <!-- Top Supertitle Tag: MOVIE BLOCK -->
      <div class="movie-block-top">
        <span class="movie-block-tag">MOVIE BLOCK</span>
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
        <button type="button" class="rail-arrow-float rail-arrow-left" data-cw="prev" aria-label="Previous movie" title="Previous movie">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="movies-cw-rail" id="movies-cw-rail" role="region" aria-label="Continue Watching Movies">
          ${renderContinueWatchingCards(CONTINUE_WATCHING_MOVIES)}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-cw="next" aria-label="Next movie" title="Next movie">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 2. Watchlist Priority Section (Golden Amber Glow, Clean Artwork, Quick Actions) -->
    <div class="movies-platform-section movies-watchlist-section" id="movies-watchlist-section">
      <!-- Hairline divider with downward GOLDEN AMBER glow -->
      <div class="movie-block-divider-wrap watchlist-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line watchlist-divider-line"></div>
        <div class="movie-block-divider-glow watchlist-divider-glow"></div>
      </div>

      <!-- Section Title: Watchlist with count badge -->
      <div class="movies-section-header">
        <div class="watchlist-header-left">
          <h2 class="movies-section-title">Watchlist</h2>
          <span class="watchlist-count-pill" id="watchlist-count-pill">${WATCHLIST_MOVIES.length} Saved</span>
        </div>
      </div>

      <!-- Watchlist Rail with Floating Arrows -->
      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-target="movies-watchlist-rail" aria-label="Scroll left" title="Scroll left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="watchlist-rail" id="movies-watchlist-rail" role="region" aria-label="My Saved Watchlist">
          ${renderWatchlistCards(WATCHLIST_MOVIES)}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="movies-watchlist-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 3. Netflix Section with Hairline Divider, Downward RED Glow, and "Netflix" Title (No Logo) -->
    <div class="movies-platform-section movies-netflix-section" id="movies-netflix-section">
      <!-- Hairline divider with downward RED glow -->
      <div class="movie-block-divider-wrap netflix-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line netflix-divider-line"></div>
        <div class="movie-block-divider-glow netflix-divider-glow"></div>
      </div>

      <!-- Section Title: Netflix -->
      <div class="movies-section-header">
        <div class="netflix-header-left">
          <h2 class="movies-section-title">Netflix</h2>
        </div>
      </div>

      <!-- Netflix Top 10 Movies Rail with Floating Arrows -->
      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-target="movies-netflix-rail" aria-label="Scroll left" title="Scroll left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="platform-top10-rail netflix-top10-rail" id="movies-netflix-rail" role="region" aria-label="Top 10 Movies on Netflix India">
          ${renderPlatformTop10Rail(NETFLIX_TOP_10_INDIA, 'netflix', 'Netflix')}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="movies-netflix-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 4. Prime Video Section with Hairline Divider, Downward BLUE Glow, and "Prime Video" Title (No Logo) -->
    <div class="movies-platform-section movies-prime-section" id="movies-prime-section">
      <!-- Hairline divider with downward BLUE glow -->
      <div class="movie-block-divider-wrap prime-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line prime-divider-line"></div>
        <div class="movie-block-divider-glow prime-divider-glow"></div>
      </div>

      <!-- Section Title: Prime Video -->
      <div class="movies-section-header">
        <div class="prime-header-left">
          <h2 class="movies-section-title">Prime Video</h2>
        </div>
      </div>

      <!-- Prime Video Top 10 Movies Rail with Floating Arrows -->
      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-target="movies-prime-rail" aria-label="Scroll left" title="Scroll left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="platform-top10-rail prime-top10-rail" id="movies-prime-rail" role="region" aria-label="Top 10 Movies on Prime Video">
          ${renderPlatformTop10Rail(PRIME_TOP_10, 'prime', 'Prime Video')}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="movies-prime-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 5. Hotstar Section with Hairline Divider, Downward PURPLE Glow, and "Hotstar" Title (No Logo) -->
    <div class="movies-platform-section movies-hotstar-section" id="movies-hotstar-section">
      <!-- Hairline divider with downward PURPLE glow -->
      <div class="movie-block-divider-wrap hotstar-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line hotstar-divider-line"></div>
        <div class="movie-block-divider-glow hotstar-divider-glow"></div>
      </div>

      <!-- Section Title: Hotstar -->
      <div class="movies-section-header">
        <div class="hotstar-header-left">
          <h2 class="movies-section-title">Hotstar</h2>
        </div>
      </div>

      <!-- Hotstar Top 10 Movies Rail with Floating Arrows -->
      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-target="movies-hotstar-rail" aria-label="Scroll left" title="Scroll left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="platform-top10-rail hotstar-top10-rail" id="movies-hotstar-rail" role="region" aria-label="Top 10 Movies on Hotstar">
          ${renderPlatformTop10Rail(HOTSTAR_TOP_10, 'hotstar', 'Hotstar')}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="movies-hotstar-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 6. Watch Now Section (Genres & Full Library) -->
    <div class="movies-platform-section movies-watchnow-section" id="movies-watchnow-section">
      <!-- Hairline divider with downward TEAL glow -->
      <div class="movie-block-divider-wrap categories-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line categories-divider-line"></div>
        <div class="movie-block-divider-glow categories-divider-glow"></div>
      </div>

      <!-- Section Title: Watch Now with Dynamic Filter Pills and Reset Action -->
      <div class="movies-section-header watchnow-section-header">
        <div class="watchnow-header-left">
          <h2 class="movies-section-title">Watch Now</h2>
          <span class="watchnow-status-pill" id="watchnow-status-pill">Library • ${WATCH_NOW_LIBRARY.length} Movies</span>
        </div>
        <div class="watchnow-header-actions" id="watchnow-header-actions" style="display: none;">
          <button type="button" class="watchnow-clear-btn" id="watchnow-clear-btn" title="Reset filter to view all movies">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>Reset to All</span>
          </button>
        </div>
      </div>

      <!-- Categories 3-Row Stacked Grid (6 Genres in Row 1, 6 Genres in Row 2, 6 Languages in Row 3) -->
      <div class="categories-grid" id="movies-categories-grid" role="region" aria-label="Movie Categories & Languages">
        ${renderCategoryCards(MOVIE_CATEGORIES)}
      </div>

      <!-- Watch Now Movie Grid Container (Library comes directly under genres) -->
      <div class="watchnow-grid" id="movies-watchnow-grid" role="region" aria-label="Watch Now Library Movies">
        ${renderWatchNowLibrary(null)}
      </div>
    </div>
  `;

  attachContinueWatchingEvents();
  attachWatchlistEvents();
  attachRailNavigationEvents();
  attachCategoryEvents();
  attachWatchNowEvents();

  // Initial position: 1st card stays naturally at the start
  setTimeout(() => {
    const activeCard = document.querySelector('.movies-cw-card.is-active');
    if (activeCard) {
      centerCard(activeCard, false);
    }
  }, 100);
}

function renderContinueWatchingCards(movies) {
  const cardsHtml = movies.map((movie, index) => {
    const isActive = index === 0 ? 'is-active' : '';
    return `
      <div class="movies-cw-card ${isActive}" data-id="${movie.id}" data-index="${index}" tabindex="0" role="button" aria-expanded="${index === 0}">
        <!-- Widescreen Backdrop for Active Expanded State -->
        <div class="cw-card-backdrop-wrap">
          <img class="cw-card-backdrop-img" src="${movie.backdrop}" alt="${movie.title} Backdrop" loading="lazy" />
          <div class="cw-card-scrim-left"></div>
          <div class="cw-card-scrim-bottom"></div>
        </div>

        <!-- Vertical Poster for Collapsed State -->
        <div class="cw-card-poster-wrap">
          <img class="cw-card-poster-img" src="${movie.poster}" alt="${movie.title} Poster" loading="lazy" />
          <div class="cw-card-poster-scrim"></div>
        </div>

        <!-- Expanded Card Content (Visible when is-active) -->
        <div class="cw-card-expanded-content">
          <div class="cw-card-badge-row">
            <span class="cw-card-badge">CONTINUE WATCHING</span>
            <span class="cw-card-provider-pill ${movie.providerBadgeClass}">${movie.providerName}</span>
          </div>

          <h3 class="cw-card-title">${movie.title}</h3>

          <div class="cw-card-meta-row">
            <span>${movie.year}</span>
            <span class="meta-dot">•</span>
            <span>${movie.duration}</span>
            <span class="meta-dot">•</span>
            <span>${movie.genres.join(', ')}</span>
            <span class="meta-dot">•</span>
            <span class="cw-card-director">Dir. ${movie.director}</span>
          </div>

          <p class="cw-card-synopsis">${movie.synopsis}</p>

          <div class="cw-card-progress-box">
            <div class="cw-card-progress-bar">
              <div class="cw-card-progress-fill" style="width: ${movie.progress}%;"></div>
            </div>
            <div class="cw-card-progress-labels">
              <span class="cw-card-time-left">${movie.timeLeft}</span>
              <span class="cw-card-percent">${movie.progress}%</span>
            </div>
          </div>

          <div class="cw-card-actions">
            <a href="${movie.streamUrl}" target="_blank" rel="noopener noreferrer" class="cw-card-play-btn" title="Resume on ${movie.providerName}">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Continue Watching</span>
            </a>
          </div>
        </div>

        <!-- Collapsed Card Content (Visible when collapsed vertical rectangle) -->
        <div class="cw-card-collapsed-content">
          <span class="cw-collapsed-title">${movie.title}</span>
          <div class="cw-collapsed-progress-bar">
            <div class="cw-collapsed-progress-fill" style="width: ${movie.progress}%;"></div>
          </div>
          <span class="cw-collapsed-time-left">${movie.timeLeft}</span>
        </div>
      </div>
    `;
  }).join('');

  return `${cardsHtml}<div class="cw-rail-end-spacer" aria-hidden="true"></div>`;
}

function renderPlatformTop10Rail(movies, platformKey, platformName) {
  const cardsHtml = movies.map((movie) => {
    const isTen = movie.rank === 10;
    return `
      <a href="${movie.streamUrl}" target="_blank" rel="noopener noreferrer" class="platform-top10-item platform-item-${platformKey}" title="Watch #${movie.rank} ${movie.title} on ${platformName}">
        <!-- Iconic Stylized Rank Numeral -->
        <div class="platform-rank-wrap ${isTen ? 'is-ten' : ''}">
          <span class="platform-rank-num ${isTen ? 'platform-rank-ten' : ''}">${movie.rank}</span>
        </div>

        <!-- Vertical Poster Card -->
        <div class="platform-poster-card">
          <img 
            class="platform-poster-img" 
            src="${movie.poster}" 
            alt="${movie.title} Poster" 
            loading="lazy"
            onerror="this.onerror=null; this.src='assets/posters/dune-2.jpg';" 
          />
          <div class="platform-card-scrim"></div>

          <div class="platform-card-info">
            <span class="platform-card-title">${movie.title}</span>
            <div class="platform-card-meta">
              <span>${movie.year}</span>
              <span class="meta-dot">•</span>
              <span>${movie.language}</span>
              <span class="meta-dot">•</span>
              <span class="platform-rating">★ ${movie.rating}</span>
            </div>
          </div>
        </div>
      </a>
    `;
  }).join('');

  return `${cardsHtml}<div class="cw-rail-end-spacer" aria-hidden="true"></div>`;
}

function renderWatchlistCards(movies) {
  if (!movies || !movies.length) {
    return `<div class="watchlist-empty-state"><p>Your watchlist is currently empty.</p></div>`;
  }

  const cardsHtml = movies.map((movie) => {
    return `
      <div class="watchlist-card" data-id="${movie.id}" id="wl-card-${movie.id}">
        <!-- High-Res Movie Poster -->
        <img 
          class="wl-card-poster" 
          src="${movie.poster}" 
          alt="${movie.title} Poster" 
          loading="lazy"
          onerror="this.onerror=null; this.src='assets/posters/dune-2.jpg';" 
        />
        <div class="wl-card-scrim"></div>

        <!-- Top Bookmark Pin (Clean Artwork with no provider capsule) -->
        <div class="wl-card-top-row">
          <div class="wl-bookmark-badge" title="Saved to Watchlist" aria-label="Saved to Watchlist">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
        </div>

        <!-- Hover Action Overlay (Stream Link + Quick Remove Button) -->
        <div class="wl-hover-overlay">
          <a href="${movie.streamUrl}" target="_blank" rel="noopener noreferrer" class="wl-play-btn" title="Stream ${movie.title} on ${movie.providerName}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Stream</span>
          </a>
          <button type="button" class="wl-remove-btn" data-id="${movie.id}" title="Remove from Watchlist" aria-label="Remove ${movie.title} from Watchlist">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>Remove</span>
          </button>
        </div>

        <!-- Bottom Metadata Info -->
        <div class="wl-card-info">
          <span class="wl-card-title">${movie.title}</span>
          <div class="wl-card-meta">
            <span>${movie.year}</span>
            <span class="meta-dot">•</span>
            <span>${movie.duration}</span>
            <span class="meta-dot">•</span>
            <span class="wl-rating">★ ${movie.rating}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `${cardsHtml}<div class="cw-rail-end-spacer" aria-hidden="true"></div>`;
}

let activeCategoryFilter = null;

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
    return WATCH_NOW_LIBRARY.map(movie => renderWatchNowCard(movie, false)).join('');
  }

  const normalize = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const isLanguage = categoryFilter.categoryType === 'language';
  const filterId = categoryFilter.id.toLowerCase();
  const normF = normalize(filterId);

  const matched = [];
  const others = [];

  WATCH_NOW_LIBRARY.forEach(movie => {
    let isMatch = false;
    if (isLanguage) {
      const movieLang = (movie.language || '').toLowerCase();
      if (filterId === 'others') {
        isMatch = movieLang && !['malayalam', 'hindi', 'kannada', 'tamil', 'english'].includes(movieLang);
      } else {
        isMatch = movieLang === filterId;
      }
    } else {
      isMatch = (movie.genres || []).some(g => {
        const normG = normalize(g);
        return normG === normF || normG.includes(normF) || normF.includes(normG);
      });
    }

    if (isMatch) {
      matched.push(movie);
    } else {
      others.push(movie);
    }
  });

  const matchedHtml = matched.map(movie => renderWatchNowCard(movie, true)).join('');
  const othersHtml = others.map(movie => renderWatchNowCard(movie, false)).join('');

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

function renderWatchNowCard(movie, isDirectMatch = false) {
  const matchClass = isDirectMatch ? 'is-matched-category' : '';
  const genreList = Array.isArray(movie.genres) ? movie.genres.slice(0, 2).join(' • ') : '';

  return `
    <div class="watchnow-card ${matchClass}" data-id="${movie.id}" role="article" tabindex="0">
      <div class="watchnow-poster-wrap">
        <img class="watchnow-poster-img" src="${movie.poster}" alt="${movie.title} Poster" loading="lazy" />
        <div class="watchnow-poster-scrim"></div>

        <!-- Top Badges: Provider & Language -->
        <div class="watchnow-top-badges">
          <span class="watchnow-provider-pill ${movie.providerBadgeClass || 'badge-streaming'}">${movie.providerName || 'Streaming'}</span>
          <span class="watchnow-lang-pill">${movie.language || 'Feature'}</span>
        </div>

        ${isDirectMatch ? `<div class="watchnow-match-ribbon"><span>MATCH</span></div>` : ''}

        <!-- Hover Stream Overlay -->
        <div class="watchnow-hover-overlay">
          <a href="${movie.streamUrl}" target="_blank" rel="noopener noreferrer" class="watchnow-stream-btn" title="Stream ${movie.title} on ${movie.providerName || 'Streaming'}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Watch Now</span>
          </a>
        </div>
      </div>

      <!-- Info Below Poster -->
      <div class="watchnow-card-info">
        <h4 class="watchnow-card-title" title="${movie.title}">${movie.title}</h4>
        <div class="watchnow-card-meta">
          <span>${movie.year}</span>
          <span class="meta-dot">•</span>
          <span>${movie.duration}</span>
          <span class="meta-dot">•</span>
          <span class="watchnow-rating">★ ${movie.rating}</span>
        </div>
        <span class="watchnow-genres">${genreList}</span>
      </div>
    </div>
  `;
}

function filterWatchNow(category) {
  const grid = document.getElementById('movies-watchnow-grid');
  const statusPill = document.getElementById('watchnow-status-pill');
  const clearActions = document.getElementById('watchnow-header-actions');
  const categoryCards = document.querySelectorAll('.category-card');

  if (!category) {
    activeCategoryFilter = null;
    categoryCards.forEach(c => c.classList.remove('is-selected'));
    if (grid) grid.innerHTML = renderWatchNowLibrary(null);
    if (statusPill) statusPill.textContent = `Library • ${WATCH_NOW_LIBRARY.length} Movies`;
    if (clearActions) clearActions.style.display = 'none';
    if (window.showToast) window.showToast('Showing all library movies');
    return;
  }

  // Toggle off if clicking the already active category
  if (activeCategoryFilter && activeCategoryFilter.id === category.id) {
    filterWatchNow(null);
    return;
  }

  activeCategoryFilter = category;

  // Highlight active category card
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

  // Count matches
  const normalize = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const isLanguage = category.categoryType === 'language';
  const filterId = category.id.toLowerCase();
  const normF = normalize(filterId);
  const matchedCount = WATCH_NOW_LIBRARY.filter(m => {
    if (isLanguage) {
      const ml = (m.language || '').toLowerCase();
      return filterId === 'others' 
        ? ml && !['malayalam', 'hindi', 'kannada', 'tamil', 'english'].includes(ml)
        : ml === filterId;
    }
    return (m.genres || []).some(g => {
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
    window.showToast(`Filtered by ${category.name} (${matchedCount} movies)`);
  }

  // Smooth scroll to Watch Now section
  const section = document.getElementById('movies-watchnow-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function attachCategoryEvents() {
  const cards = document.querySelectorAll('#movies-categories-grid .category-card');
  cards.forEach(card => {
    const handleSelect = () => {
      const genreId = card.dataset.genre;
      const category = MOVIE_CATEGORIES.find(c => c.id === genreId);
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
  const clearBtn = document.getElementById('watchnow-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filterWatchNow(null);
    });
  }
}

function attachWatchlistEvents() {
  const rail = document.getElementById('movies-watchlist-rail');
  if (!rail) return;

  rail.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.wl-remove-btn');
    if (removeBtn) {
      e.preventDefault();
      e.stopPropagation();
      const movieId = removeBtn.dataset.id;
      const card = document.getElementById(`wl-card-${movieId}`);
      if (card) {
        card.classList.add('is-removing');
        setTimeout(() => {
          card.remove();
          // Update count badge
          const remaining = rail.querySelectorAll('.watchlist-card').length;
          const countPill = document.getElementById('watchlist-count-pill');
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
  // 1. Click handlers for floating edge buttons (.rail-arrow-float)
  document.querySelectorAll('.rail-arrow-float').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Continue Watching Accordion navigation
      if (btn.dataset.cw) {
        const cards = Array.from(document.querySelectorAll('.movies-cw-card'));
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

      // Scrollable platform rails (Watchlist, Netflix, Prime, Hotstar)
      const targetId = btn.dataset.target;
      if (!targetId) return;
      const rail = document.getElementById(targetId);
      if (!rail) return;

      const isPrev = btn.classList.contains('rail-nav-prev') || btn.classList.contains('rail-arrow-left');
      const scrollStep = Math.max(380, Math.floor(rail.clientWidth * 0.72));

      rail.scrollBy({
        left: isPrev ? -scrollStep : scrollStep,
        behavior: 'smooth'
      });
    });
  });

  // 2. Dynamic arrow visibility & disabled state based on scroll position
  const rails = document.querySelectorAll('.watchlist-rail, .platform-top10-rail');
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
  const cwSection = document.getElementById('movies-cw-section');
  if (!cwSection) return;
  const cards = Array.from(document.querySelectorAll('.movies-cw-card'));
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
  const currentActive = document.querySelector('.movies-cw-card.is-active');
  if (currentActive === card) return;

  if (currentActive) {
    currentActive.classList.remove('is-active');
    currentActive.setAttribute('aria-expanded', 'false');
  }

  card.classList.add('is-active');
  card.setAttribute('aria-expanded', 'true');

  // Sync with Bento Continue Watching card
  const movieId = card.dataset.id;
  const movieData = CONTINUE_WATCHING_MOVIES.find(m => m.id === movieId);
  if (movieData) {
    updateBentoContinueWatchingCard({
      title: movieData.title,
      timeLeft: movieData.timeLeft,
      progress: movieData.progress,
      poster: movieData.poster,
      url: movieData.streamUrl,
      providerName: movieData.providerName
    });
  }

  // Scroll appropriately: first and last stay as is; middle items center
  centerCard(card, smooth);
  updateContinueWatchingNavArrows();
}

function centerCard(card, smooth = true) {
  if (!card) return;
  const rail = document.getElementById('movies-cw-rail');
  if (!rail) return;

  const cards = Array.from(document.querySelectorAll('.movies-cw-card'));
  const cardIndex = cards.indexOf(card);

  const performScroll = () => {
    // The first card stays as it is (at the start)
    if (cardIndex === 0) {
      rail.scrollTo({
        left: 0,
        behavior: smooth ? 'smooth' : 'auto'
      });
      return;
    }

    // The last card stays as it is (at the end)
    if (cardIndex === cards.length - 1) {
      rail.scrollTo({
        left: Math.max(0, rail.scrollWidth - rail.clientWidth),
        behavior: smooth ? 'smooth' : 'auto'
      });
      return;
    }

    // Middle cards center so the user has the option to look/go right and left
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
  const cards = document.querySelectorAll('.movies-cw-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If user clicked inside an action button (stream link), don't collapse/expand
      if (e.target.closest('.cw-card-play-btn')) {
        return;
      }

      setActiveCard(card, true);
    });

    // Keyboard navigation (Enter / Space to select)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveCard(card, true);
      }
    });
  });

  // Global Left/Right Arrow Key Navigation
  document.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('movies-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;

    const allCards = Array.from(document.querySelectorAll('.movies-cw-card'));
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

export function openMoviesView() {
  const overlay = document.getElementById('movies-overlay');
  const showsOverlay = document.getElementById('shows-overlay');
  const musicOverlay = document.getElementById('music-overlay');
  const bento = document.getElementById('bento-dashboard');
  if (!overlay) return;

  if (showsOverlay) showsOverlay.classList.remove('active');
  if (musicOverlay) musicOverlay.classList.remove('active');

  if (bento) {
    bento.classList.add('view-hidden');
  }

  overlay.classList.add('active');
  overlay.scrollTop = 0;

  // Initial positioning: 1st card stays at the start
  setTimeout(() => {
    const activeCard = document.querySelector('.movies-cw-card.is-active');
    if (activeCard) {
      centerCard(activeCard, false);
    }
  }, 80);
}

export function closeMoviesView() {
  const overlay = document.getElementById('movies-overlay');
  const bento = document.getElementById('bento-dashboard');
  if (!overlay) return;

  overlay.classList.remove('active');

  if (bento) {
    bento.classList.remove('view-hidden');
  }

  // Set dock back to profile
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

export function updateBentoContinueWatchingCard(data) {
  const movieCard = document.getElementById('cw-item-movie');
  if (movieCard && data) {
    const titleEl = movieCard.querySelector('.cw-item-title');
    const timeLeftEl = movieCard.querySelector('.cw-time-remaining');
    const progressFill = movieCard.querySelector('.cw-progress-fill');
    const posterImg = movieCard.querySelector('.cw-poster-img');
    const resumeBtn = document.getElementById('btn-play-movie-cw');

    if (titleEl && data.title) {
      titleEl.innerHTML = data.title;
    }
    if (timeLeftEl && data.timeLeft) {
      timeLeftEl.textContent = data.timeLeft;
    }
    if (progressFill && data.progress) {
      progressFill.style.width = `${data.progress}%`;
    }
    if (posterImg && data.poster) {
      posterImg.src = data.poster;
      posterImg.alt = data.title || 'Movie';
    }
    if (resumeBtn) {
      resumeBtn.title = `Resume ${data.title || 'Movie'} on ${data.providerName || 'Streaming'}`;
      resumeBtn.onclick = (e) => {
        e.stopPropagation();
        if (data.url) {
          window.open(data.url, '_blank', 'noopener,noreferrer');
        }
      };
    }
  }
}
