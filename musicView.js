/**
 * HomeOS - Music View
 * Dedicated Music View powered by YouTube Music, Continue Listening, Listenlist, Categories, and Listen Now Library
 */

import { 
  MUSIC_CONTINUE_LISTENING, 
  MUSIC_LISTENLIST,
  YOUTUBE_MUSIC_TOP_10,
  MUSIC_CATEGORIES,
  LISTEN_NOW_MUSIC_LIBRARY
} from './musicData.js';

let activeMusicCategoryFilter = null;

export function initMusicView() {
  const overlay = document.getElementById('music-overlay');
  if (!overlay) return;

  overlay.innerHTML = `
    <!-- 1. Continue Listening Block (Orange Glow) -->
    <div class="movies-cw-section music-cw-section" id="music-cw-section">
      <!-- Top Supertitle Tag: MUSIC BLOCK -->
      <div class="movie-block-top">
        <span class="movie-block-tag music-block-tag">MUSIC BLOCK</span>
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
        <button type="button" class="rail-arrow-float rail-arrow-left" data-cw="music-prev" aria-label="Previous track" title="Previous track">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="movies-cw-rail music-cw-rail" id="music-cw-rail" role="region" aria-label="Continue Listening Tracks">
          ${renderMusicContinueListeningCards(MUSIC_CONTINUE_LISTENING)}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-cw="music-next" aria-label="Next track" title="Next track">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 2. Listenlist Priority Section (Golden Amber Glow) -->
    <div class="movies-platform-section music-listenlist-section" id="music-listenlist-section">
      <!-- Hairline divider with downward GOLDEN AMBER glow -->
      <div class="movie-block-divider-wrap watchlist-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line watchlist-divider-line"></div>
        <div class="movie-block-divider-glow watchlist-divider-glow"></div>
      </div>

      <!-- Section Title: Listenlist with count badge -->
      <div class="movies-section-header">
        <div class="watchlist-header-left">
          <h2 class="movies-section-title">Listenlist</h2>
          <span class="watchlist-count-pill" id="music-listenlist-count-pill">${MUSIC_LISTENLIST.length} Saved</span>
        </div>
      </div>

      <!-- Listenlist Rail with Floating Arrows -->
      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-target="music-listenlist-rail" aria-label="Scroll left" title="Scroll left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="watchlist-rail music-square-rail" id="music-listenlist-rail" role="region" aria-label="My Saved Listenlist">
          ${renderMusicListenlistCards(MUSIC_LISTENLIST)}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="music-listenlist-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 3. YouTube Music Top 10 Hits Section with Hairline Divider & Downward RED Glow -->
    <div class="movies-platform-section music-ytmusic-section" id="music-ytmusic-section">
      <div class="movie-block-divider-wrap ytmusic-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line ytmusic-divider-line"></div>
        <div class="movie-block-divider-glow ytmusic-divider-glow"></div>
      </div>

      <div class="movies-section-header">
        <div class="ytmusic-header-left">
          <h2 class="movies-section-title ytmusic-title">YouTube Music</h2>
          <span class="ytmusic-trending-pill">Top 10 Trending</span>
        </div>
      </div>

      <div class="rail-scroll-wrapper">
        <button type="button" class="rail-arrow-float rail-arrow-left" data-target="music-ytmusic-rail" aria-label="Scroll left" title="Scroll left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="platform-top10-rail ytmusic-top10-rail" id="music-ytmusic-rail" role="region" aria-label="Top 10 Tracks on YouTube Music">
          ${renderMusicTop10Rail(YOUTUBE_MUSIC_TOP_10)}
        </div>
        <button type="button" class="rail-arrow-float rail-arrow-right" data-target="music-ytmusic-rail" aria-label="Scroll right" title="Scroll right">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 4. Music Categories Section with Hairline Divider & Downward TEAL/CYAN Glow -->
    <div class="movies-platform-section music-categories-section" id="music-categories-section">
      <div class="movie-block-divider-wrap categories-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line categories-divider-line"></div>
        <div class="movie-block-divider-glow categories-divider-glow"></div>
      </div>

      <div class="movies-section-header">
        <div class="categories-header-left">
          <h2 class="movies-section-title">Categories</h2>
          <span class="categories-count-pill">${MUSIC_CATEGORIES.length} Categories (Genres & Languages)</span>
        </div>
      </div>

      <!-- Categories 3-Row Stacked Grid (6 Genres in Row 1, 6 Genres in Row 2, 6 Languages in Row 3) -->
      <div class="categories-grid" id="music-categories-grid" role="region" aria-label="Music Categories & Genres">
        ${renderMusicCategoryCards(MUSIC_CATEGORIES)}
      </div>
    </div>

    <!-- 5. Listen Now Section (Unified YouTube Music Library) with Emerald Glow & Dynamic Filtering -->
    <div class="movies-platform-section music-listennow-section" id="music-listennow-section">
      <div class="movie-block-divider-wrap watchnow-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line watchnow-divider-line"></div>
        <div class="movie-block-divider-glow watchnow-divider-glow"></div>
      </div>

      <div class="movies-section-header watchnow-section-header">
        <div class="watchnow-header-left">
          <h2 class="movies-section-title">Listen Now</h2>
          <span class="watchnow-status-pill" id="music-listennow-status-pill">Library • ${LISTEN_NOW_MUSIC_LIBRARY.length} Tracks & Albums</span>
        </div>
        <div class="watchnow-header-actions" id="music-listennow-header-actions" style="display: none;">
          <button type="button" class="watchnow-clear-btn" id="music-listennow-clear-btn" title="Reset filter to view all music">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>Reset to All</span>
          </button>
        </div>
      </div>

      <div class="watchnow-grid music-library-grid" id="music-listennow-grid" role="region" aria-label="Listen Now YouTube Music Library">
        ${renderMusicListenNowLibrary(null)}
      </div>
    </div>
  `;

  attachMusicContinueListeningEvents();
  attachMusicListenlistEvents();
  attachMusicRailNavigationEvents();
  attachMusicCategoryEvents();
  attachMusicListenNowEvents();

  setTimeout(() => {
    const activeCard = document.querySelector('#music-cw-rail .movies-cw-card.is-active');
    if (activeCard) {
      centerMusicCard(activeCard, false);
    }
  }, 100);
}

function renderMusicContinueListeningCards(tracks) {
  return tracks.map((track, index) => {
    const isActive = index === 0;
    const progressPct = Math.min(100, Math.max(0, track.progress || 0));

    return `
      <div class="movies-cw-card music-cw-card ${isActive ? 'is-active' : ''}" 
           data-track-id="${track.id}" 
           data-index="${index}"
           tabindex="0"
           role="button"
           aria-expanded="${isActive ? 'true' : 'false'}"
           aria-label="${track.title} by ${track.artist} (${progressPct}% played)">
        
        <div class="cw-card-bg-wrap">
          <img class="cw-card-backdrop" 
               src="${track.backdrop || track.cover}" 
               alt="${track.title} backdrop" 
               loading="${index < 3 ? 'eager' : 'lazy'}" 
               onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80'" />
          <div class="cw-card-vignette"></div>
        </div>

        <div class="cw-collapsed-art music-collapsed-art">
          <img class="cw-collapsed-poster music-collapsed-cover" 
               src="${track.cover}" 
               alt="${track.title} album cover" 
               loading="${index < 3 ? 'eager' : 'lazy'}" 
               onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'" />
          <div class="cw-collapsed-info">
            <span class="cw-collapsed-title">${track.title}</span>
            <span class="cw-collapsed-episode">${track.artist}</span>
          </div>
          <div class="cw-collapsed-progress-bar">
            <div class="cw-collapsed-progress-fill fill-music" style="width: ${progressPct}%;"></div>
          </div>
        </div>

        <div class="cw-expanded-content">
          <div class="cw-expanded-top">
            <div class="cw-badge-group">
              <span class="cw-provider-pill badge-ytmusic">
                YouTube Music
              </span>
              <span class="cw-year-pill">${track.year}</span>
              <span class="cw-duration-pill">${track.duration}</span>
            </div>
            <span class="cw-episode-tag">${track.album || ''}</span>
          </div>

          <div class="cw-expanded-middle">
            <h3 class="cw-expanded-title">${track.title}</h3>
            <p class="cw-expanded-genres">${track.artist} • ${(track.genres || []).join(' • ')}</p>
            <p class="cw-expanded-synopsis">${track.description || ''}</p>
          </div>

          <div class="cw-expanded-bottom">
            <div class="cw-progress-cluster">
              <div class="cw-progress-meta">
                <span class="cw-progress-label">Track Progress (${track.timeElapsed} / ${track.duration})</span>
                <span class="cw-time-left">${track.timeLeft || ''}</span>
              </div>
              <div class="cw-progress-track">
                <div class="cw-progress-indicator fill-music" style="width: ${progressPct}%;"></div>
              </div>
            </div>

            <div class="cw-action-row">
              <button type="button" class="cw-btn cw-btn-play" data-action="play-track" data-id="${track.id}" data-url="${track.streamUrl}">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Resume Track</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderMusicListenlistCards(tracks) {
  return tracks.map(track => `
    <div class="watchlist-card music-square-card" 
         data-id="${track.id}" 
         data-url="${track.streamUrl}"
         tabindex="0"
         role="button"
         aria-label="${track.title} by ${track.artist}">
      
      <div class="watchlist-poster-wrap music-cover-wrap">
        <img class="watchlist-poster-img music-cover-img" 
             src="${track.cover}" 
             alt="${track.title} cover" 
             loading="lazy" 
             onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'" />
        <div class="watchlist-card-vignette"></div>
        
        <div class="watchlist-hover-actions">
          <button type="button" class="watchlist-quick-play-btn" data-action="play-track" data-id="${track.id}" data-url="${track.streamUrl}" title="Play ${track.title}">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </div>

        <div class="watchlist-meta-overlay">
          <h4 class="watchlist-card-title">${track.title}</h4>
          <div class="watchlist-card-specs">
            <span>${track.artist}</span>
            <span class="watchlist-spec-dot">•</span>
            <span>${track.duration}</span>
            <span class="watchlist-spec-dot">•</span>
            <span class="watchlist-rating">▶ ${track.plays}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderMusicTop10Rail(tracks) {
  return tracks.map(track => `
    <div class="top10-item-wrap">
      <span class="top10-rank-num" aria-hidden="true">${track.rank}</span>
      <div class="platform-top10-card music-square-card" 
           data-id="${track.id}" 
           data-url="${track.streamUrl}"
           tabindex="0"
           role="button"
           aria-label="#${track.rank} in YouTube Music: ${track.title} by ${track.artist}">
        
        <div class="top10-poster-wrap music-cover-wrap">
          <img class="top10-poster-img music-cover-img" 
               src="${track.cover}" 
               alt="${track.title} cover" 
               loading="lazy" 
               onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'" />
          <div class="top10-card-vignette"></div>
          
          <div class="top10-rank-badge ytmusic-rank-badge">#${track.rank} ON YOUTUBE MUSIC</div>
          
          <div class="top10-meta-overlay">
            <h4 class="top10-card-title">${track.title}</h4>
            <div class="top10-card-specs">
              <span>${track.artist}</span>
              <span class="top10-spec-dot">•</span>
              <span>${track.duration}</span>
              <span class="top10-spec-dot">•</span>
              <span class="top10-rating">▶ ${track.plays}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderMusicCategoryCards(categories) {
  return categories.map(cat => {
    const isSelected = activeMusicCategoryFilter && activeMusicCategoryFilter.id === cat.id;
    return `
      <div class="category-card ${isSelected ? 'is-selected' : ''}" 
           data-category-id="${cat.id}"
           data-category-type="${cat.categoryType || 'genre'}"
           data-color="${cat.color}"
           data-rgb="${cat.rgb}"
           role="button"
           tabindex="0"
           aria-pressed="${isSelected ? 'true' : 'false'}"
           aria-label="Filter music library by ${cat.name}">
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

function renderMusicListenNowLibrary(categoryFilter = null) {
  let matchedTracks = [];
  let otherTracks = [];

  const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  if (!categoryFilter) {
    matchedTracks = [...LISTEN_NOW_MUSIC_LIBRARY];
    otherTracks = [];
  } else {
    const filterId = normalize(categoryFilter.id);
    const filterType = categoryFilter.categoryType || 'genre';

    LISTEN_NOW_MUSIC_LIBRARY.forEach(track => {
      let isMatch = false;

      if (filterType === 'language') {
        const trackLang = normalize(track.language);
        if (filterId === 'punjabi') {
          isMatch = trackLang.includes('punjabi') || (!['malayalam', 'hindi', 'kannada', 'tamil', 'english'].some(l => trackLang.includes(l)));
        } else {
          isMatch = trackLang.includes(filterId);
        }
      } else {
        const genreList = (track.genres || []).map(g => normalize(g));
        isMatch = genreList.some(g => g.includes(filterId) || filterId.includes(g));
      }

      if (isMatch) {
        matchedTracks.push(track);
      } else {
        otherTracks.push(track);
      }
    });
  }

  let html = '';

  if (matchedTracks.length > 0) {
    html += matchedTracks.map(track => renderMusicListenNowCard(track, !!categoryFilter)).join('');
  } else if (categoryFilter) {
    html += `
      <div class="watchnow-empty-state" style="grid-column: 1 / -1; padding: 36px 0; text-align: center; color: rgba(255,255,255,0.6);">
        <p style="font-size: 15px; margin: 0 0 6px 0;">No tracks currently tagged with "<strong>${categoryFilter.name}</strong>".</p>
        <p style="font-size: 12.5px; opacity: 0.7;">Showing all other music in your HomeOS library below.</p>
      </div>
    `;
  }

  if (categoryFilter && otherTracks.length > 0) {
    html += `
      <div class="watchnow-dotted-divider" role="separator" aria-label="End of category results; beginning of other library titles">
        <div class="watchnow-dotted-line"></div>
        <div class="watchnow-dotted-pill">
          <span>••••</span>
          <span>OTHER TRACKS IN LIBRARY (${otherTracks.length})</span>
          <span>••••</span>
        </div>
        <div class="watchnow-dotted-line"></div>
      </div>
    `;
    html += otherTracks.map(track => renderMusicListenNowCard(track, false)).join('');
  }

  return html;
}

function renderMusicListenNowCard(track, isDirectMatch = false) {
  return `
    <div class="watchnow-card music-square-card ${isDirectMatch ? 'is-matched-category' : ''}" 
         data-id="${track.id}" 
         data-url="${track.streamUrl}"
         tabindex="0"
         role="button"
         aria-label="${track.title} by ${track.artist}">
      
      <div class="watchnow-poster-wrap music-cover-wrap">
        <img class="watchnow-poster-img music-cover-img" 
             src="${track.cover}" 
             alt="${track.title} cover" 
             loading="lazy" 
             onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'" />
        <div class="watchnow-card-vignette"></div>

        ${isDirectMatch ? '<span class="watchnow-matched-badge">MATCH</span>' : ''}
        
        <div class="watchnow-hover-action">
          <button type="button" class="watchnow-stream-btn" data-action="play-track" data-id="${track.id}" data-url="${track.streamUrl}" title="Play ${track.title} on YouTube Music">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Listen Now</span>
          </button>
        </div>

        <div class="watchnow-top-capsules">
          <span class="watchnow-provider-pill badge-ytmusic">
            YouTube Music
          </span>
          <span class="watchnow-lang-pill">${track.language}</span>
        </div>

        <div class="watchnow-meta-overlay">
          <h4 class="watchnow-card-title">${track.title}</h4>
          <div class="watchnow-card-specs">
            <span>${track.artist}</span>
            <span class="watchnow-spec-dot">•</span>
            <span class="watchnow-rating">${track.duration}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function filterMusicListenNow(category) {
  if (activeMusicCategoryFilter && activeMusicCategoryFilter.id === category.id) {
    activeMusicCategoryFilter = null;
  } else {
    activeMusicCategoryFilter = category;
  }

  const categoryCards = document.querySelectorAll('#music-categories-grid .category-card');
  categoryCards.forEach(card => {
    const cardId = card.dataset.categoryId;
    const isSelected = activeMusicCategoryFilter && activeMusicCategoryFilter.id === cardId;
    card.classList.toggle('is-selected', isSelected);
    card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });

  const grid = document.getElementById('music-listennow-grid');
  const statusPill = document.getElementById('music-listennow-status-pill');
  const clearActions = document.getElementById('music-listennow-header-actions');

  if (grid) {
    grid.innerHTML = renderMusicListenNowLibrary(activeMusicCategoryFilter);
  }

  if (statusPill) {
    if (activeMusicCategoryFilter) {
      statusPill.innerHTML = `<strong>${activeMusicCategoryFilter.name}</strong> • Filtered Results & Library`;
      statusPill.classList.add('has-filter');
    } else {
      statusPill.textContent = `Library • ${LISTEN_NOW_MUSIC_LIBRARY.length} Tracks & Albums`;
      statusPill.classList.remove('has-filter');
    }
  }

  if (clearActions) {
    clearActions.style.display = activeMusicCategoryFilter ? 'flex' : 'none';
  }

  if (activeMusicCategoryFilter) {
    const listenNowSection = document.getElementById('music-listennow-section');
    if (listenNowSection) {
      listenNowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function attachMusicCategoryEvents() {
  const categoryCards = document.querySelectorAll('#music-categories-grid .category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const catId = card.dataset.categoryId;
      const category = MUSIC_CATEGORIES.find(c => c.id === catId);
      if (category) {
        filterMusicListenNow(category);
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

function attachMusicListenNowEvents() {
  const clearBtn = document.getElementById('music-listennow-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      activeMusicCategoryFilter = null;
      filterMusicListenNow({ id: '__none__' });
    });
  }
}

function attachMusicListenlistEvents() {
  const overlay = document.getElementById('music-overlay');
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    const playBtn = e.target.closest('[data-action="play-track"]');
    if (playBtn) {
      e.stopPropagation();
      const trackId = playBtn.dataset.id;
      const url = playBtn.dataset.url;
      const track = MUSIC_CONTINUE_LISTENING.find(t => t.id === trackId) || 
                    MUSIC_LISTENLIST.find(t => t.id === trackId) || 
                    LISTEN_NOW_MUSIC_LIBRARY.find(t => t.id === trackId);
      if (track) {
        updateBentoContinueMusicCard(track);
      }
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

function attachMusicRailNavigationEvents() {
  const overlay = document.getElementById('music-overlay');
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
      const isNext = arrow.dataset.cw === 'music-next';
      const allCards = Array.from(document.querySelectorAll('#music-cw-rail .movies-cw-card'));
      const activeIdx = allCards.findIndex(c => c.classList.contains('is-active'));

      if (isNext && activeIdx < allCards.length - 1) {
        setMusicActiveCard(allCards[activeIdx + 1], true);
      } else if (!isNext && activeIdx > 0) {
        setMusicActiveCard(allCards[activeIdx - 1], true);
      }
    });
  });
}

export function setMusicActiveCard(card, smooth = true) {
  const allCards = document.querySelectorAll('#music-cw-rail .movies-cw-card');
  allCards.forEach(c => {
    c.classList.remove('is-active');
    c.setAttribute('aria-expanded', 'false');
  });

  card.classList.add('is-active');
  card.setAttribute('aria-expanded', 'true');

  centerMusicCard(card, smooth);

  const trackId = card.dataset.trackId;
  const trackData = MUSIC_CONTINUE_LISTENING.find(t => t.id === trackId);
  if (trackData) {
    updateBentoContinueMusicCard(trackData);
  }
}

function centerMusicCard(card, smooth = true) {
  const rail = document.getElementById('music-cw-rail');
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

function attachMusicContinueListeningEvents() {
  const rail = document.getElementById('music-cw-rail');
  if (!rail) return;

  const cards = rail.querySelectorAll('.movies-cw-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const playBtn = e.target.closest('[data-action="play-track"]');
      if (playBtn) {
        e.stopPropagation();
        const url = playBtn.dataset.url;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }
      setMusicActiveCard(card, true);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setMusicActiveCard(card, true);
      }
    });
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
      centerMusicCard(activeCard, false);
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
      titleEl.innerHTML = `${data.title} <span style="font-size:11px; opacity:0.75; font-weight:normal;">(${data.artist || ''})</span>`;
    }
    if (timeLeftEl && (data.timeLeft || data.duration)) {
      timeLeftEl.textContent = data.timeLeft || data.duration;
    }
    if (progressFill && data.progress) {
      progressFill.style.width = `${data.progress}%`;
    }
    if (posterImg && (data.cover || data.backdrop)) {
      posterImg.src = data.cover || data.backdrop;
      posterImg.alt = data.title || 'Music Track';
    }
    if (resumeBtn) {
      resumeBtn.title = `Resume ${data.title} on YouTube Music`;
      resumeBtn.onclick = (e) => {
        e.stopPropagation();
        if (data.streamUrl) {
          window.open(data.streamUrl, '_blank', 'noopener,noreferrer');
        }
      };
    }
  }

  // Also update in-page Bento music player widget
  if (bentoPlayer && data) {
    const musicTitle = document.getElementById('music-title');
    const musicArtist = document.getElementById('music-artist');
    const musicFill = document.getElementById('music-progress-fill');
    const musicScrubber = document.getElementById('music-scrubber');

    if (musicTitle && data.title) musicTitle.textContent = data.title;
    if (musicArtist && data.artist) musicArtist.textContent = data.artist;
    if (musicFill && data.progress) musicFill.style.width = `${data.progress}%`;
    if (musicScrubber && data.progress) musicScrubber.style.left = `${data.progress}%`;
  }
}
