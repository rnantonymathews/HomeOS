/**
 * HomeOS - Shows View
 * Ditto replica of Movies View architecture tailored for TV Series & Episodes
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

let activeCategoryFilter = null;

export function initShowsView() {
  const overlay = document.getElementById('shows-overlay');
  if (!overlay) return;

  overlay.innerHTML = `
    <!-- 1. Continue Watching Block (Orange Glow) -->
    <div class="movies-cw-section shows-cw-section" id="shows-cw-section">
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
        <button type="button" class="rail-arrow-float rail-arrow-left" data-cw="shows-prev" aria-label="Previous show" title="Previous show">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="movies-cw-rail shows-cw-rail" id="shows-cw-rail" role="region" aria-label="Continue Watching TV Shows">
          ${renderShowsContinueWatchingCards(SHOWS_CONTINUE_WATCHING)}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-cw="shows-next" aria-label="Next show" title="Next show">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 2. Watchlist Priority Section (Golden Amber Glow) -->
    <div class="movies-platform-section shows-watchlist-section" id="shows-watchlist-section">
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
        <div class="watchlist-rail" id="shows-watchlist-rail" role="region" aria-label="My Saved Shows Watchlist">
          ${renderShowsWatchlistCards(SHOWS_WATCHLIST)}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="shows-watchlist-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 3. Netflix Section with Hairline Divider & Downward RED Glow -->
    <div class="movies-platform-section shows-netflix-section" id="shows-netflix-section">
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
          ${renderShowsTop10Rail(NETFLIX_TOP_10_SHOWS, 'netflix', 'Netflix')}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="shows-netflix-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 4. Prime Video Section with Hairline Divider & Downward BLUE Glow -->
    <div class="movies-platform-section shows-prime-section" id="shows-prime-section">
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
          ${renderShowsTop10Rail(PRIME_TOP_10_SHOWS, 'prime', 'Prime Video')}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="shows-prime-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 5. Hotstar Section with Hairline Divider & Downward PURPLE Glow -->
    <div class="movies-platform-section shows-hotstar-section" id="shows-hotstar-section">
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
          ${renderShowsTop10Rail(HOTSTAR_TOP_10_SHOWS, 'hotstar', 'Hotstar')}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="shows-hotstar-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 6. Categories Section with Hairline Divider & Downward TEAL Glow -->
    <div class="movies-platform-section shows-categories-section" id="shows-categories-section">
      <div class="movie-block-divider-wrap categories-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line categories-divider-line"></div>
        <div class="movie-block-divider-glow categories-divider-glow"></div>
      </div>

      <div class="movies-section-header">
        <div class="categories-header-left">
          <h2 class="movies-section-title">Categories</h2>
          <span class="categories-count-pill">${SHOWS_CATEGORIES.length} Categories (Genres & Languages)</span>
        </div>
      </div>

      <!-- Categories 3-Row Stacked Grid (6 Genres in Row 1, 6 Genres in Row 2, 6 Languages in Row 3) -->
      <div class="categories-grid" id="shows-categories-grid" role="region" aria-label="Show Categories & Languages">
        ${renderShowsCategoryCards(SHOWS_CATEGORIES)}
      </div>
    </div>

    <!-- 7. Watch Now Section (Unified Shows Library) with Emerald Glow & Dynamic Filtering -->
    <div class="movies-platform-section shows-watchnow-section" id="shows-watchnow-section">
      <div class="movie-block-divider-wrap watchnow-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line watchnow-divider-line"></div>
        <div class="movie-block-divider-glow watchnow-divider-glow"></div>
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

      <div class="watchnow-grid" id="shows-watchnow-grid" role="region" aria-label="Watch Now Library TV Shows">
        ${renderShowsWatchNowLibrary(null)}
      </div>
    </div>
  `;

  attachShowsContinueWatchingEvents();
  attachShowsWatchlistEvents();
  attachShowsRailNavigationEvents();
  attachShowsCategoryEvents();
  attachShowsWatchNowEvents();

  setTimeout(() => {
    const activeCard = document.querySelector('#shows-cw-rail .movies-cw-card.is-active');
    if (activeCard) {
      centerShowsCard(activeCard, false);
    }
  }, 100);
}

function renderShowsContinueWatchingCards(shows) {
  return shows.map((show, index) => {
    const isActive = index === 0;
    const progressPct = Math.min(100, Math.max(0, show.progress || 0));

    return `
      <div class="movies-cw-card ${isActive ? 'is-active' : ''}" 
           data-show-id="${show.id}" 
           data-index="${index}"
           tabindex="0"
           role="button"
           aria-expanded="${isActive ? 'true' : 'false'}"
           aria-label="${show.title} - ${show.episodeInfo || ''} (${progressPct}% completed)">
        
        <div class="cw-card-bg-wrap">
          <img class="cw-card-backdrop" 
               src="${show.backdrop || show.poster}" 
               alt="${show.title} backdrop" 
               loading="${index < 3 ? 'eager' : 'lazy'}" 
               onerror="this.src='https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80'" />
          <div class="cw-card-vignette"></div>
        </div>

        <div class="cw-collapsed-art">
          <img class="cw-collapsed-poster" 
               src="${show.poster}" 
               alt="${show.title} poster" 
               loading="${index < 3 ? 'eager' : 'lazy'}" 
               onerror="this.src='https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'" />
          <div class="cw-collapsed-info">
            <span class="cw-collapsed-title">${show.title}</span>
            <span class="cw-collapsed-episode">${show.episodeInfo || ''}</span>
          </div>
          <div class="cw-collapsed-progress-bar">
            <div class="cw-collapsed-progress-fill" style="width: ${progressPct}%;"></div>
          </div>
        </div>

        <div class="cw-expanded-content">
          <div class="cw-expanded-top">
            <div class="cw-badge-group">
              <span class="cw-provider-pill ${show.providerBadgeClass || 'badge-netflix'}">
                ${show.providerName || 'Streaming'}
              </span>
              <span class="cw-year-pill">${show.year}</span>
              <span class="cw-duration-pill">${show.duration}</span>
            </div>
            <span class="cw-episode-tag">${show.episodeInfo || ''}</span>
          </div>

          <div class="cw-expanded-middle">
            <h3 class="cw-expanded-title">${show.title}</h3>
            <p class="cw-expanded-genres">${(show.genres || []).join(' • ')}</p>
            <p class="cw-expanded-synopsis">${show.synopsis || ''}</p>
          </div>

          <div class="cw-expanded-bottom">
            <div class="cw-progress-cluster">
              <div class="cw-progress-meta">
                <span class="cw-progress-label">Episode Progress</span>
                <span class="cw-time-left">${show.timeLeft || ''}</span>
              </div>
              <div class="cw-progress-track">
                <div class="cw-progress-indicator" style="width: ${progressPct}%;"></div>
              </div>
            </div>

            <div class="cw-action-row">
              <button type="button" class="cw-btn cw-btn-play" data-action="play-show" data-url="${show.streamUrl}">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Resume Episode</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderShowsTop10Rail(shows, platformKey, platformName) {
  return shows.map(show => `
    <div class="top10-item-wrap">
      <span class="top10-rank-num" aria-hidden="true">${show.rank}</span>
      <div class="platform-top10-card" 
           data-id="${show.id}" 
           data-platform="${platformKey}"
           data-url="${show.streamUrl}"
           tabindex="0"
           role="button"
           aria-label="#${show.rank} in ${platformName} Shows: ${show.title}">
        
        <div class="top10-poster-wrap">
          <img class="top10-poster-img" 
               src="${show.poster}" 
               alt="${show.title} poster" 
               loading="lazy" 
               onerror="this.src='https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'" />
          <div class="top10-card-vignette"></div>
          
          <div class="top10-rank-badge">#${show.rank} IN SHOWS TODAY</div>
          
          <div class="top10-meta-overlay">
            <h4 class="top10-card-title">${show.title}</h4>
            <div class="top10-card-specs">
              <span>${show.seasons || show.year}</span>
              <span class="top10-spec-dot">•</span>
              <span>${show.language}</span>
              <span class="top10-spec-dot">•</span>
              <span class="top10-rating">★ ${show.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderShowsWatchlistCards(shows) {
  return shows.map(show => `
    <div class="watchlist-card" 
         data-id="${show.id}" 
         data-url="${show.streamUrl}"
         tabindex="0"
         role="button"
         aria-label="${show.title} (${show.seasons || show.year})">
      
      <div class="watchlist-poster-wrap">
        <img class="watchlist-poster-img" 
             src="${show.poster}" 
             alt="${show.title} poster" 
             loading="lazy" 
             onerror="this.src='https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'" />
        <div class="watchlist-card-vignette"></div>
        
        <div class="watchlist-hover-actions">
          <button type="button" class="watchlist-quick-play-btn" data-action="play-show" data-url="${show.streamUrl}" title="Watch ${show.title}">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </div>

        <div class="watchlist-meta-overlay">
          <h4 class="watchlist-card-title">${show.title}</h4>
          <div class="watchlist-card-specs">
            <span>${show.seasons || show.year}</span>
            <span class="watchlist-spec-dot">•</span>
            <span>${show.language}</span>
            <span class="watchlist-spec-dot">•</span>
            <span class="watchlist-rating">★ ${show.rating}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderShowsCategoryCards(categories) {
  return categories.map(cat => {
    const isSelected = activeCategoryFilter && activeCategoryFilter.id === cat.id;
    return `
      <div class="category-card ${isSelected ? 'is-selected' : ''}" 
           data-category-id="${cat.id}"
           data-category-type="${cat.categoryType || 'genre'}"
           data-color="${cat.color}"
           data-rgb="${cat.rgb}"
           role="button"
           tabindex="0"
           aria-pressed="${isSelected ? 'true' : 'false'}"
           aria-label="Filter library by ${cat.name}">
        <div class="category-card-inner" style="--cat-color: ${cat.color}; --cat-rgb: ${cat.rgb};">
          <div class="category-emoji-box" aria-hidden="true">
            ${cat.svg}
          </div>
          <div class="category-text-stack">
            <span class="category-name">${cat.name}</span>
            <span class="category-desc">${cat.subtitle}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderShowsWatchNowLibrary(categoryFilter = null) {
  let matchedShows = [];
  let otherShows = [];

  const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  if (!categoryFilter) {
    matchedShows = [...WATCH_NOW_SHOWS_LIBRARY];
    otherShows = [];
  } else {
    const filterId = normalize(categoryFilter.id);
    const filterType = categoryFilter.categoryType || 'genre';

    WATCH_NOW_SHOWS_LIBRARY.forEach(show => {
      let isMatch = false;

      if (filterType === 'language') {
        const showLang = normalize(show.language);
        if (filterId === 'others') {
          const mainLangs = ['malayalam', 'hindi', 'kannada', 'tamil', 'english'];
          isMatch = !mainLangs.some(l => showLang.includes(l));
        } else {
          isMatch = showLang.includes(filterId);
        }
      } else {
        const genreList = (show.genres || []).map(g => normalize(g));
        isMatch = genreList.some(g => g.includes(filterId) || filterId.includes(g));
      }

      if (isMatch) {
        matchedShows.push(show);
      } else {
        otherShows.push(show);
      }
    });
  }

  let html = '';

  if (matchedShows.length > 0) {
    html += matchedShows.map(show => renderShowsWatchNowCard(show, !!categoryFilter)).join('');
  } else if (categoryFilter) {
    html += `
      <div class="watchnow-empty-state" style="grid-column: 1 / -1; padding: 36px 0; text-align: center; color: rgba(255,255,255,0.6);">
        <p style="font-size: 15px; margin: 0 0 6px 0;">No TV series currently tagged with "<strong>${categoryFilter.name}</strong>".</p>
        <p style="font-size: 12.5px; opacity: 0.7;">Showing all other series in your HomeOS library below.</p>
      </div>
    `;
  }

  if (categoryFilter && otherShows.length > 0) {
    html += `
      <div class="watchnow-dotted-divider" role="separator" aria-label="End of category results; beginning of other library titles">
        <div class="watchnow-dotted-line"></div>
        <div class="watchnow-dotted-pill">
          <span>••••</span>
          <span>OTHER SHOWS IN LIBRARY (${otherShows.length})</span>
          <span>••••</span>
        </div>
        <div class="watchnow-dotted-line"></div>
      </div>
    `;
    html += otherShows.map(show => renderShowsWatchNowCard(show, false)).join('');
  }

  return html;
}

function renderShowsWatchNowCard(show, isDirectMatch = false) {
  return `
    <div class="watchnow-card ${isDirectMatch ? 'is-matched-category' : ''}" 
         data-id="${show.id}" 
         data-url="${show.streamUrl}"
         tabindex="0"
         role="button"
         aria-label="${show.title} (${show.seasons || show.year})">
      
      <div class="watchnow-poster-wrap">
        <img class="watchnow-poster-img" 
             src="${show.poster}" 
             alt="${show.title} poster" 
             loading="lazy" 
             onerror="this.src='https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'" />
        <div class="watchnow-card-vignette"></div>

        ${isDirectMatch ? '<span class="watchnow-matched-badge">MATCH</span>' : ''}
        
        <div class="watchnow-hover-action">
          <button type="button" class="watchnow-stream-btn" data-action="play-show" data-url="${show.streamUrl}" title="Watch ${show.title} on ${show.providerName}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Watch Now</span>
          </button>
        </div>

        <div class="watchnow-top-capsules">
          <span class="watchnow-provider-pill ${show.providerBadgeClass || 'badge-netflix'}">
            ${show.providerName}
          </span>
          <span class="watchnow-lang-pill">${show.language}</span>
        </div>

        <div class="watchnow-meta-overlay">
          <h4 class="watchnow-card-title">${show.title}</h4>
          <div class="watchnow-card-specs">
            <span>${show.seasons || show.year}</span>
            <span class="watchnow-spec-dot">•</span>
            <span class="watchnow-rating">★ ${show.rating}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function filterShowsWatchNow(category) {
  if (activeCategoryFilter && activeCategoryFilter.id === category.id) {
    activeCategoryFilter = null;
  } else {
    activeCategoryFilter = category;
  }

  const categoryCards = document.querySelectorAll('#shows-categories-grid .category-card');
  categoryCards.forEach(card => {
    const cardId = card.dataset.categoryId;
    const isSelected = activeCategoryFilter && activeCategoryFilter.id === cardId;
    card.classList.toggle('is-selected', isSelected);
    card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });

  const grid = document.getElementById('shows-watchnow-grid');
  const statusPill = document.getElementById('shows-watchnow-status-pill');
  const clearActions = document.getElementById('shows-watchnow-header-actions');

  if (grid) {
    grid.innerHTML = renderShowsWatchNowLibrary(activeCategoryFilter);
  }

  if (statusPill) {
    if (activeCategoryFilter) {
      statusPill.innerHTML = `<strong>${activeCategoryFilter.name}</strong> • Filtered Results & Library`;
      statusPill.classList.add('has-filter');
    } else {
      statusPill.textContent = `Library • ${WATCH_NOW_SHOWS_LIBRARY.length} TV Shows`;
      statusPill.classList.remove('has-filter');
    }
  }

  if (clearActions) {
    clearActions.style.display = activeCategoryFilter ? 'flex' : 'none';
  }

  if (activeCategoryFilter) {
    const watchNowSection = document.getElementById('shows-watchnow-section');
    if (watchNowSection) {
      watchNowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function attachShowsCategoryEvents() {
  const categoryCards = document.querySelectorAll('#shows-categories-grid .category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const catId = card.dataset.categoryId;
      const category = SHOWS_CATEGORIES.find(c => c.id === catId);
      if (category) {
        filterShowsWatchNow(category);
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

function attachShowsWatchNowEvents() {
  const clearBtn = document.getElementById('shows-watchnow-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      activeCategoryFilter = null;
      filterShowsWatchNow({ id: '__none__' });
    });
  }
}

function attachShowsWatchlistEvents() {
  const overlay = document.getElementById('shows-overlay');
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    const playBtn = e.target.closest('[data-action="play-show"]');
    if (playBtn) {
      e.stopPropagation();
      const url = playBtn.dataset.url;
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    const card = e.target.closest('.watchlist-card, .platform-top10-card, .watchnow-card');
    if (card) {
      const url = card.dataset.url;
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  });
}

function attachShowsRailNavigationEvents() {
  const overlay = document.getElementById('shows-overlay');
  if (!overlay) return;

  const arrows = overlay.querySelectorAll('.rail-arrow-float[data-target]');
  arrows.forEach(arrow => {
    arrow.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = arrow.dataset.target;
      const rail = document.getElementById(targetId);
      if (!rail) return;

      const isLeft = arrow.classList.contains('rail-arrow-left');
      const scrollAmount = Math.max(rail.clientWidth * 0.75, 400);

      rail.scrollBy({
        left: isLeft ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    });
  });

  const cwArrows = overlay.querySelectorAll('.rail-arrow-float[data-cw]');
  cwArrows.forEach(arrow => {
    arrow.addEventListener('click', (e) => {
      e.stopPropagation();
      const isNext = arrow.dataset.cw === 'shows-next';
      const allCards = Array.from(document.querySelectorAll('#shows-cw-rail .movies-cw-card'));
      const activeIdx = allCards.findIndex(c => c.classList.contains('is-active'));

      if (isNext && activeIdx < allCards.length - 1) {
        setShowsActiveCard(allCards[activeIdx + 1], true);
      } else if (!isNext && activeIdx > 0) {
        setShowsActiveCard(allCards[activeIdx - 1], true);
      }
    });
  });
}

export function setShowsActiveCard(card, smooth = true) {
  const allCards = document.querySelectorAll('#shows-cw-rail .movies-cw-card');
  allCards.forEach(c => {
    c.classList.remove('is-active');
    c.setAttribute('aria-expanded', 'false');
  });

  card.classList.add('is-active');
  card.setAttribute('aria-expanded', 'true');

  centerShowsCard(card, smooth);

  const showId = card.dataset.showId;
  const showData = SHOWS_CONTINUE_WATCHING.find(s => s.id === showId);
  if (showData) {
    updateBentoContinueShowsCard(showData);
  }
}

function centerShowsCard(card, smooth = true) {
  const rail = document.getElementById('shows-cw-rail');
  if (!rail || !card) return;

  const allCards = Array.from(rail.querySelectorAll('.movies-cw-card'));
  const cardIndex = allCards.indexOf(card);

  if (cardIndex === 0) {
    rail.scrollTo({ left: 0, behavior: smooth ? 'smooth' : 'auto' });
    return;
  }

  if (cardIndex === allCards.length - 1) {
    rail.scrollTo({ left: rail.scrollWidth - rail.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
    return;
  }

  const railWidth = rail.clientWidth;
  const cardLeft = card.offsetLeft;
  const cardWidth = card.offsetWidth;

  const targetScrollLeft = cardLeft - (railWidth / 2) + (cardWidth / 2);

  rail.scrollTo({
    left: Math.max(0, targetScrollLeft),
    behavior: smooth ? 'smooth' : 'auto'
  });
}

function attachShowsContinueWatchingEvents() {
  const rail = document.getElementById('shows-cw-rail');
  if (!rail) return;

  const cards = rail.querySelectorAll('.movies-cw-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const playBtn = e.target.closest('[data-action="play-show"]');
      if (playBtn) {
        e.stopPropagation();
        const url = playBtn.dataset.url;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }
      setShowsActiveCard(card, true);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setShowsActiveCard(card, true);
      }
    });
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
      centerShowsCard(activeCard, false);
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
      titleEl.innerHTML = `${data.title} <span style="font-size:11px; opacity:0.75; font-weight:normal;">(${data.episodeInfo || ''})</span>`;
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
        if (data.streamUrl) {
          window.open(data.streamUrl, '_blank', 'noopener,noreferrer');
        }
      };
    }
  }
}
