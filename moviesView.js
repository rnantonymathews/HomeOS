/**
 * HomeOS - Movies View & Discovery Engine
 * Handles rendering, filtering, sorting, Rails vs Grid switching,
 * detail sheets, and 1-click OTT redirection.
 */

import { MOVIES_CATALOG, MOVIE_RAILS, STREAMING_PLATFORMS } from './moviesData.js';

let state = {
  viewMode: 'rails', // 'rails' | 'grid'
  activeGenre: 'all',
  activeProvider: 'all',
  searchQuery: '',
  sortBy: 'popularity', // 'popularity' | 'rating' | 'year' | 'duration'
  selectedMovie: null
};

export function initMoviesView() {
  const overlay = document.getElementById('movies-overlay');
  if (!overlay) return;

  setupEventListeners();
  renderMoviesView();
}

export function openMoviesView() {
  const overlay = document.getElementById('movies-overlay');
  const bento = document.getElementById('bento-dashboard');
  if (!overlay) return;

  if (bento) {
    bento.classList.add('view-hidden');
  }

  overlay.classList.add('active');
  overlay.scrollTop = 0;

  // Re-render to ensure any state updates apply
  renderMoviesView();
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

function setupEventListeners() {
  // Close / Back button
  const closeBtn = document.getElementById('movies-btn-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMoviesView);
  }

  // Search Input
  const searchInput = document.getElementById('movies-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      // If user types search, automatically display results cleanly in grid mode
      if (state.searchQuery.length > 0) {
        state.viewMode = 'grid';
        updateViewModeUI();
      }
      renderFilteredContent();
    });
  }

  // View Mode Switcher (Rails vs Grid)
  const btnRails = document.getElementById('btn-view-rails');
  const btnGrid = document.getElementById('btn-view-grid');

  if (btnRails) {
    btnRails.addEventListener('click', () => {
      state.viewMode = 'rails';
      updateViewModeUI();
      renderFilteredContent();
    });
  }

  if (btnGrid) {
    btnGrid.addEventListener('click', () => {
      state.viewMode = 'grid';
      updateViewModeUI();
      renderFilteredContent();
    });
  }

  // Genre Filter Pills
  const genrePills = document.querySelectorAll('.genre-pill');
  genrePills.forEach(pill => {
    pill.addEventListener('click', () => {
      genrePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.activeGenre = pill.dataset.genre || 'all';
      renderFilteredContent();
    });
  });

  // OTT Provider Quick Filter Pills
  const ottPills = document.querySelectorAll('.ott-pill');
  ottPills.forEach(pill => {
    pill.addEventListener('click', () => {
      ottPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.activeProvider = pill.dataset.provider || 'all';
      renderFilteredContent();
    });
  });

  // Sort Selector
  const sortSelect = document.getElementById('movies-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderFilteredContent();
    });
  }

  // Detail Modal Close
  const modalClose = document.getElementById('movie-modal-close');
  const modalOverlay = document.getElementById('movie-detail-modal');
  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', closeDetailModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeDetailModal();
    });
  }

  // ESC key listener to close modal or view
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('movie-detail-modal');
      const trailerModal = document.getElementById('movie-trailer-modal');
      if (trailerModal && trailerModal.classList.contains('active')) {
        closeTrailerModal();
      } else if (modal && modal.classList.contains('active')) {
        closeDetailModal();
      } else if (document.getElementById('movies-overlay')?.classList.contains('active')) {
        closeMoviesView();
      }
    }
  });

  // Trailer Modal Close
  const trailerClose = document.getElementById('trailer-modal-close');
  const trailerModal = document.getElementById('movie-trailer-modal');
  if (trailerClose && trailerModal) {
    trailerClose.addEventListener('click', closeTrailerModal);
    trailerModal.addEventListener('click', (e) => {
      if (e.target === trailerModal) closeTrailerModal();
    });
  }
}

function updateViewModeUI() {
  const btnRails = document.getElementById('btn-view-rails');
  const btnGrid = document.getElementById('btn-view-grid');
  if (btnRails && btnGrid) {
    if (state.viewMode === 'rails') {
      btnRails.classList.add('active');
      btnGrid.classList.remove('active');
    } else {
      btnRails.classList.remove('active');
      btnGrid.classList.add('active');
    }
  }
}

export function renderMoviesView() {
  renderHeroSpotlight();
  renderFilteredContent();
}

/**
 * 1. Render Cinematic Hero Spotlight
 */
function renderHeroSpotlight() {
  const heroContainer = document.getElementById('movies-hero-spotlight');
  if (!heroContainer) return;

  // Use Dune: Part Two or highest rated featured
  const featured = MOVIES_CATALOG.find(m => m.featured) || MOVIES_CATALOG[0];
  if (!featured) return;

  const providerBadgesHtml = featured.providers.map(pKey => {
    const p = STREAMING_PLATFORMS[pKey];
    if (!p) return '';
    return `
      <div class="hero-provider-tag" title="Stream on ${p.name}">
        <img src="${p.icon}" alt="${p.name}" class="provider-mini-icon" />
        <span>${p.name}</span>
      </div>
    `;
  }).join('');

  heroContainer.innerHTML = `
    <div class="hero-backdrop-wrap">
      <img src="${featured.backdrop}" alt="${featured.title}" class="hero-backdrop-img" />
      <div class="hero-vignette-bottom"></div>
      <div class="hero-vignette-left"></div>
    </div>

    <div class="hero-content">
      <div class="hero-meta-row">
        <span class="hero-badge-spotlight">SPOTLIGHT OF THE WEEK</span>
        <span class="hero-rating"><span class="star-gold">★</span> ${featured.rating}</span>
        <span class="hero-year">${featured.year}</span>
        <span class="hero-duration">${featured.duration}</span>
        <div class="hero-genres">
          ${featured.genres.map(g => `<span class="hero-genre-pill">${g}</span>`).join('')}
        </div>
      </div>

      <h1 class="hero-title">${featured.title}</h1>
      <p class="hero-tagline">"${featured.tagline}"</p>
      <p class="hero-synopsis">${featured.synopsis}</p>

      <div class="hero-providers-row">
        <span class="available-on-label">Available in India on:</span>
        <div class="hero-providers-list">
          ${providerBadgesHtml}
        </div>
      </div>

      <div class="hero-action-row">
        <button class="hero-btn-play" id="hero-btn-play" data-movie-id="${featured.id}">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <polygon points="6 3 20 12 6 21 6 3"></polygon>
          </svg>
          Watch Now
        </button>

        <button class="hero-btn-trailer" id="hero-btn-trailer" data-trailer-id="${featured.trailerId}" data-title="${featured.title}">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
          </svg>
          Trailer
        </button>

        <button class="hero-btn-details" id="hero-btn-details" data-movie-id="${featured.id}">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Details
        </button>
      </div>
    </div>
  `;

  // Bind Hero Buttons
  const playBtn = document.getElementById('hero-btn-play');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      launchPrimaryStream(featured);
    });
  }

  const trailerBtn = document.getElementById('hero-btn-trailer');
  if (trailerBtn) {
    trailerBtn.addEventListener('click', () => {
      openTrailerModal(featured.trailerId, featured.title);
    });
  }

  const detailsBtn = document.getElementById('hero-btn-details');
  if (detailsBtn) {
    detailsBtn.addEventListener('click', () => {
      openDetailModal(featured);
    });
  }
}

/**
 * 2. Filter & Render Content (Rails or Grid)
 */
function getFilteredMovies() {
  let list = [...MOVIES_CATALOG];

  // Genre filter
  if (state.activeGenre !== 'all') {
    list = list.filter(m => 
      m.genres.some(g => g.toLowerCase() === state.activeGenre.toLowerCase())
    );
  }

  // OTT Provider filter
  if (state.activeProvider !== 'all') {
    list = list.filter(m => m.providers.includes(state.activeProvider));
  }

  // Search Query filter
  if (state.searchQuery) {
    list = list.filter(m => {
      const titleMatch = m.title.toLowerCase().includes(state.searchQuery);
      const castMatch = m.cast.some(c => c.toLowerCase().includes(state.searchQuery));
      const directorMatch = m.director.toLowerCase().includes(state.searchQuery);
      return titleMatch || castMatch || directorMatch;
    });
  }

  // Sorting
  if (state.sortBy === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (state.sortBy === 'year') {
    list.sort((a, b) => b.year - a.year);
  } else if (state.sortBy === 'duration') {
    list.sort((a, b) => a.duration.localeCompare(b.duration));
  }

  return list;
}

function renderFilteredContent() {
  const contentContainer = document.getElementById('movies-content-container');
  if (!contentContainer) return;

  const movies = getFilteredMovies();

  // If a filter, search, or grid mode is active, display grid
  const isFiltering = state.activeGenre !== 'all' || state.activeProvider !== 'all' || state.searchQuery.length > 0;
  
  if (state.viewMode === 'grid' || isFiltering) {
    renderGridView(contentContainer, movies);
  } else {
    renderRailsView(contentContainer);
  }
}

/**
 * 3. Render Curated Horizontal Rails
 */
function renderRailsView(container) {
  let html = `<div class="movies-rails-wrapper">`;

  MOVIE_RAILS.forEach(rail => {
    // Filter movies that belong to this rail
    const railMovies = MOVIES_CATALOG.filter(m => m.rails && m.rails.includes(rail.id));
    if (railMovies.length === 0) return;

    html += `
      <section class="movie-rail-section" id="rail-${rail.id}">
        <div class="rail-header">
          <div class="rail-title-group">
            <h2 class="rail-title">${rail.title}</h2>
            <span class="rail-subtitle">${rail.subtitle}</span>
          </div>
          <div class="rail-controls">
            <button class="rail-arrow-btn rail-prev" data-rail="${rail.id}" aria-label="Previous">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button class="rail-arrow-btn rail-next" data-rail="${rail.id}" aria-label="Next">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <div class="rail-track" id="track-${rail.id}">
          ${railMovies.map(movie => createMovieCardHtml(movie)).join('')}
        </div>
      </section>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;

  bindCardClickEvents(container);
  bindRailScrollEvents(container);
}

/**
 * 4. Render Infinite Grid View
 */
function renderGridView(container, movies) {
  if (movies.length === 0) {
    container.innerHTML = `
      <div class="movies-empty-state">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p class="empty-title">No movies found matching your filters</p>
        <p class="empty-subtitle">Try adjusting your search query, genre, or streaming platform filter.</p>
      </div>
    `;
    return;
  }

  let html = `
    <div class="movies-grid-wrapper">
      <div class="grid-header-info">
        <span class="grid-count">${movies.length} Movies Available</span>
        <span class="grid-tag">Unified Catalog • India Region</span>
      </div>
      <div class="movies-grid">
        ${movies.map(movie => createMovieCardHtml(movie)).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
  bindCardClickEvents(container);
}

/**
 * Movie Card HTML generator
 */
function createMovieCardHtml(movie) {
  // Mini provider dots/icons on poster
  const providersHtml = movie.providers.slice(0, 3).map(pKey => {
    const p = STREAMING_PLATFORMS[pKey];
    if (!p) return '';
    return `<img src="${p.icon}" alt="${p.name}" class="card-provider-mini" title="Stream on ${p.name}" />`;
  }).join('');

  return `
    <div class="movie-card" data-movie-id="${movie.id}">
      <div class="card-poster-wrap">
        <img src="${movie.poster}" alt="${movie.title}" class="card-poster-img" loading="lazy" />
        <div class="card-glass-shine"></div>
        <div class="card-rating-badge">
          <span class="star-gold">★</span> ${movie.rating}
        </div>
        <div class="card-providers-mini-row">
          ${providersHtml}
        </div>
      </div>
      <div class="card-info">
        <span class="card-title" title="${movie.title}">${movie.title}</span>
        <div class="card-meta">
          <span class="card-year">${movie.year}</span>
          <span class="card-dot">•</span>
          <span class="card-genre">${movie.genres[0] || ''}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Card Click Bindings
 */
function bindCardClickEvents(container) {
  const cards = container.querySelectorAll('.movie-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.movieId;
      const movie = MOVIES_CATALOG.find(m => m.id === id);
      if (movie) openDetailModal(movie);
    });
  });
}

/**
 * Rail Horizontal Scroll Arrows
 */
function bindRailScrollEvents(container) {
  const prevBtns = container.querySelectorAll('.rail-prev');
  const nextBtns = container.querySelectorAll('.rail-next');

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const railId = btn.dataset.rail;
      const track = document.getElementById(`track-${railId}`);
      if (track) {
        track.scrollBy({ left: -600, behavior: 'smooth' });
      }
    });
  });

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const railId = btn.dataset.rail;
      const track = document.getElementById(`track-${railId}`);
      if (track) {
        track.scrollBy({ left: 600, behavior: 'smooth' });
      }
    });
  });
}

/**
 * 5. Detail Modal & OTT Launcher Sheet
 */
export function openDetailModal(movie) {
  state.selectedMovie = movie;
  const modal = document.getElementById('movie-detail-modal');
  if (!modal) return;

  // OTT Provider Buttons with direct URLs
  const providerButtonsHtml = movie.providers.map(pKey => {
    const p = STREAMING_PLATFORMS[pKey];
    if (!p) return '';
    const searchUrl = `${p.searchBase}${encodeURIComponent(movie.title)}`;
    return `
      <a href="${searchUrl}" target="_blank" rel="noopener noreferrer" class="provider-launch-btn ${p.badgeClass}" title="Stream ${movie.title} on ${p.name}">
        <img src="${p.icon}" alt="${p.name}" class="provider-launch-icon" />
        <div class="provider-launch-info">
          <span class="provider-name">${p.name}</span>
          <span class="provider-status">Subscription • 1-Click Stream</span>
        </div>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="arrow-out">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    `;
  }).join('');

  modal.innerHTML = `
    <div class="modal-backdrop-blur"></div>
    <div class="modal-card">
      <button class="modal-btn-close" id="movie-modal-close" aria-label="Close details">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="modal-hero-cover" style="background-image: url('${movie.backdrop}')">
        <div class="modal-cover-gradient"></div>
        <div class="modal-cover-content">
          <div class="modal-meta-row">
            <span class="modal-rating"><span class="star-gold">★</span> ${movie.rating}</span>
            <span class="modal-year">${movie.year}</span>
            <span class="modal-duration">${movie.duration}</span>
            <div class="modal-genres">
              ${movie.genres.map(g => `<span class="modal-genre-tag">${g}</span>`).join('')}
            </div>
          </div>
          <h2 class="modal-title">${movie.title}</h2>
          <p class="modal-tagline">"${movie.tagline}"</p>
        </div>
      </div>

      <div class="modal-body-scroll">
        <div class="modal-body-grid">
          
          <!-- Left Column: Storyline & Details -->
          <div class="modal-col-left">
            <h3 class="section-title">STORYLINE</h3>
            <p class="modal-synopsis">${movie.synopsis}</p>

            <div class="modal-crew-grid">
              <div class="crew-item">
                <span class="crew-role">Director</span>
                <span class="crew-name">${movie.director}</span>
              </div>
              <div class="crew-item">
                <span class="crew-role">Starring</span>
                <span class="crew-name">${movie.cast.join(', ')}</span>
              </div>
            </div>

            <div class="modal-actions-bar">
              <button class="btn-modal-trailer" id="btn-modal-trailer" data-trailer-id="${movie.trailerId}">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Watch Trailer
              </button>

              <button class="btn-modal-continue" id="btn-modal-continue" title="Pin to HomeOS Continue Watching card">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                Pin to Continue Watching
              </button>
            </div>
          </div>

          <!-- Right Column: Where to Stream in India (JustWatch) -->
          <div class="modal-col-right">
            <div class="streaming-hub-box">
              <div class="hub-header">
                <div class="hub-title-row">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#22c55e" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 12h8"></path>
                    <path d="M12 8v8"></path>
                  </svg>
                  <span class="hub-title">WHERE TO STREAM IN INDIA</span>
                </div>
                <span class="hub-tag">JustWatch Verified</span>
              </div>

              <div class="provider-launch-list">
                ${providerButtonsHtml}
              </div>

              <a href="${movie.justWatchUrl}" target="_blank" rel="noopener noreferrer" class="justwatch-fallback-link">
                <span>View Full Availability Matrix on JustWatch</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');

  // Bind new modal buttons
  const closeBtn = document.getElementById('movie-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeDetailModal);

  const trailerBtn = document.getElementById('btn-modal-trailer');
  if (trailerBtn) {
    trailerBtn.addEventListener('click', () => {
      openTrailerModal(movie.trailerId, movie.title);
    });
  }

  const continueBtn = document.getElementById('btn-modal-continue');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      setContinueWatching(movie);
      continueBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#22c55e" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Pinned to Dashboard!
      `;
      setTimeout(() => {
        if (window.showToast) {
          window.showToast(`Pinned "${movie.title}" to your HomeOS Continue Watching card!`);
        }
      }, 200);
    });
  }
}

export function closeDetailModal() {
  const modal = document.getElementById('movie-detail-modal');
  if (modal) modal.classList.remove('active');
}

/**
 * 6. Trailer Modal (Ad-free embedded YouTube)
 */
export function openTrailerModal(trailerId, title) {
  const modal = document.getElementById('movie-trailer-modal');
  const iframe = document.getElementById('trailer-iframe');
  const titleEl = document.getElementById('trailer-movie-title');

  if (!modal || !iframe) return;

  if (titleEl) titleEl.textContent = `${title} • Official Trailer`;
  iframe.src = `https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1`;
  modal.classList.add('active');
}

export function closeTrailerModal() {
  const modal = document.getElementById('movie-trailer-modal');
  const iframe = document.getElementById('trailer-iframe');
  if (modal) modal.classList.remove('active');
  if (iframe) iframe.src = '';
}

/**
 * 7. 1-Click Launch Primary Stream
 */
function launchPrimaryStream(movie) {
  if (!movie.providers || movie.providers.length === 0) return;
  const primaryKey = movie.providers[0];
  const p = STREAMING_PLATFORMS[primaryKey];
  if (p) {
    const searchUrl = `${p.searchBase}${encodeURIComponent(movie.title)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
    if (window.showToast) {
      window.showToast(`Launching ${movie.title} on ${p.name}...`);
    }
  }
}

/**
 * 8. Sync Movie to Bento Continue Watching Card
 */
function setContinueWatching(movie) {
  const primaryProvider = movie.providers && movie.providers[0] ? STREAMING_PLATFORMS[movie.providers[0]] : null;
  const continueData = {
    id: movie.id,
    title: movie.title,
    subtext: movie.duration,
    progress: 72,
    timeLeft: '45m left',
    url: primaryProvider ? `${primaryProvider.searchBase}${encodeURIComponent(movie.title)}` : movie.justWatchUrl,
    providerName: primaryProvider ? primaryProvider.name : 'JustWatch'
  };

  try {
    localStorage.setItem('homeos_continue_watching', JSON.stringify(continueData));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }

  // Update Bento DOM if present
  updateBentoContinueWatchingCard(continueData);
}

export function updateBentoContinueWatchingCard(data) {
  const titleEl = document.querySelector('.cw-title');
  const timeLeftEl = document.querySelector('.cw-time-left');
  const progressFill = document.querySelector('.cw-progress-fill');
  const resumeBtn = document.getElementById('btn-resume-watching');

  if (titleEl) {
    titleEl.innerHTML = `${data.title} <span class="cw-episode">• ${data.subtext || 'Movie'}</span>`;
  }
  if (timeLeftEl) {
    timeLeftEl.textContent = data.timeLeft || 'Resume';
  }
  if (progressFill) {
    progressFill.style.width = `${data.progress || 65}%`;
  }
  if (resumeBtn) {
    resumeBtn.title = `Resume ${data.title} on ${data.providerName || 'Streaming'}`;
    resumeBtn.onclick = () => {
      if (data.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer');
      }
    };
  }
}
