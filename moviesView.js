/**
 * HomeOS - Movies View & Discovery Engine
 * Calm Profile-Matched Aesthetic: Obsidian Cards, Unboxed Gradient Posters,
 * Full Paragraph Synopses, Poppins Typography & Neutral Matte Gray Controls.
 */

import { MOVIES_CATALOG, MOVIE_RAILS, STREAMING_PLATFORMS } from './moviesData.js';

let state = {
  searchQuery: '',
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

  // Re-render to ensure fresh state
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
  // Close / Back to Dashboard button
  const closeBtn = document.getElementById('movies-btn-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMoviesView);
  }

  // Minimal Calm Search Input
  const searchInput = document.getElementById('movies-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      renderFilteredContent();
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

export function renderMoviesView() {
  renderHeroSpotlight();
  renderFilteredContent();
}

/**
 * 1. Render Cinematic Hero Spotlight (Profile Bento Aesthetic)
 */
function renderHeroSpotlight() {
  const heroContainer = document.getElementById('movies-hero-spotlight');
  if (!heroContainer) return;

  // Use Dune: Part Two or highest rated featured
  const featured = MOVIES_CATALOG.find(m => m.featured) || MOVIES_CATALOG[0];
  if (!featured) return;

  const primaryProviderKey = featured.providers[0] || 'hotstar';
  const primaryProvider = STREAMING_PLATFORMS[primaryProviderKey] || { name: 'JioHotstar' };

  heroContainer.innerHTML = `
    <div class="movies-spotlight-card">
      <div class="card-glow glow-movies-hero"></div>
      
      <div class="spotlight-card-content">
        <!-- Unboxed Backdrop with Smooth Dissolve Masks -->
        <div class="spotlight-hero-backdrop-wrap">
          <img src="${featured.backdrop}" alt="${featured.title}" class="spotlight-hero-backdrop-img" />
          <div class="spotlight-hero-fade-bottom"></div>
          <div class="spotlight-hero-fade-left"></div>
        </div>

        <!-- Spotlight Content -->
        <div class="spotlight-hero-details">
          <div class="spotlight-hero-tag">FEATURED SPOTLIGHT</div>
          <h2 class="spotlight-hero-title">${featured.title}</h2>
          <div class="spotlight-hero-meta">
            <span>${featured.director}</span>
            <span>•</span>
            <span>${featured.year}</span>
            <span>•</span>
            <span>${featured.duration}</span>
            <span>•</span>
            <span>${featured.genres.join(', ')}</span>
          </div>
          <p class="spotlight-hero-synopsis">${featured.synopsis}</p>

          <div class="spotlight-hero-actions">
            <button class="spotlight-btn-stream" id="hero-btn-play" data-movie-id="${featured.id}">
              Stream on ${primaryProvider.name}
            </button>
            <button class="spotlight-btn-trailer" id="hero-btn-trailer" data-trailer-id="${featured.trailerId}" data-title="${featured.title}">
              Watch Trailer
            </button>
            <button class="spotlight-btn-details" id="hero-btn-details">
              Details
            </button>
          </div>
        </div>
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
 * 2. Filter & Render Content (Rails or Search Grid)
 */
function getFilteredMovies() {
  let list = [...MOVIES_CATALOG];

  if (state.searchQuery) {
    list = list.filter(m => {
      const titleMatch = m.title.toLowerCase().includes(state.searchQuery);
      const castMatch = m.cast.some(c => c.toLowerCase().includes(state.searchQuery));
      const directorMatch = m.director.toLowerCase().includes(state.searchQuery);
      const genreMatch = m.genres.some(g => g.toLowerCase().includes(state.searchQuery));
      return titleMatch || castMatch || directorMatch || genreMatch;
    });
  }

  return list;
}

function renderFilteredContent() {
  const contentContainer = document.getElementById('movies-content-container');
  if (!contentContainer) return;

  const movies = getFilteredMovies();

  // If search query is entered, show responsive grid; otherwise show calm rails
  if (state.searchQuery.length > 0) {
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
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button class="rail-arrow-btn rail-next" data-rail="${rail.id}" aria-label="Next">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2">
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
 * 4. Render Grid View (for Search Results)
 */
function renderGridView(container, movies) {
  if (movies.length === 0) {
    container.innerHTML = `
      <div class="movies-empty-state">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p class="empty-title">No movies found matching "${state.searchQuery}"</p>
        <p class="empty-subtitle">Try searching for a different title, actor, director, or genre.</p>
      </div>
    `;
    return;
  }

  let html = `
    <div class="movies-grid-wrapper">
      <div class="grid-header-info">
        <span class="grid-count">${movies.length} ${movies.length === 1 ? 'Movie' : 'Movies'} Found</span>
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
 * 5. Obsidian Movie Card HTML Generator
 * Matches the Profile & Fresh Drops aesthetic:
 * Unboxed poster stage melting into dark base, Poppins typography, subtle ambient hover glow.
 */
function createMovieCardHtml(movie) {
  return `
    <div class="obsidian-movie-card" data-movie-id="${movie.id}">
      <div class="card-ambient-glow"></div>
      <div class="obsidian-card-inner">
        <div class="obsidian-poster-stage">
          <img src="${movie.poster}" alt="${movie.title}" class="obsidian-poster-img" loading="lazy" />
          <div class="obsidian-poster-fade"></div>
        </div>
        <div class="obsidian-card-info">
          <span class="obsidian-movie-title" title="${movie.title}">${movie.title}</span>
          <div class="obsidian-movie-meta">
            <span class="obsidian-meta-year">${movie.year}</span>
            <span class="obsidian-meta-dot">•</span>
            <span class="obsidian-meta-genre">${movie.genres[0] || 'Feature'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Card Click Bindings
 */
function bindCardClickEvents(container) {
  const cards = container.querySelectorAll('.obsidian-movie-card');
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
        track.scrollBy({ left: -540, behavior: 'smooth' });
      }
    });
  });

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const railId = btn.dataset.rail;
      const track = document.getElementById(`track-${railId}`);
      if (track) {
        track.scrollBy({ left: 540, behavior: 'smooth' });
      }
    });
  });
}

/**
 * 6. Detail Modal & OTT Launcher Sheet
 * Styled in Calm Obsidian Glass with Soft Glow & Matte Gray Buttons
 */
export function openDetailModal(movie) {
  state.selectedMovie = movie;
  const modal = document.getElementById('movie-detail-modal');
  if (!modal) return;

  // OTT Provider Buttons with uniform calm gray styling
  const providerButtonsHtml = movie.providers.map(pKey => {
    const p = STREAMING_PLATFORMS[pKey];
    if (!p) return '';
    const searchUrl = `${p.searchBase}${encodeURIComponent(movie.title)}`;
    return `
      <a href="${searchUrl}" target="_blank" rel="noopener noreferrer" class="provider-launch-btn" title="Stream ${movie.title} on ${p.name}">
        <span class="provider-name">${p.name}</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
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
      <div class="card-glow glow-modal-spotlight"></div>

      <button class="modal-btn-close" id="movie-modal-close" aria-label="Close details">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Hero Cover with gradient dissolve -->
      <div class="modal-hero-cover" style="background-image: url('${movie.backdrop}')">
        <div class="modal-cover-gradient"></div>
        <div class="modal-cover-content">
          <div class="modal-meta-row">
            <span class="modal-year">${movie.year}</span>
            <span class="modal-dot">•</span>
            <span class="modal-duration">${movie.duration}</span>
            <span class="modal-dot">•</span>
            <span class="modal-genre-text">${movie.genres.join(', ')}</span>
          </div>
          <h2 class="modal-title">${movie.title}</h2>
          ${movie.tagline ? `<p class="modal-tagline">"${movie.tagline}"</p>` : ''}
        </div>
      </div>

      <div class="modal-body-scroll">
        <div class="modal-body-grid">
          
          <!-- Left Column: Storyline & Cast -->
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
              <button class="btn-modal-action" id="btn-modal-trailer" data-trailer-id="${movie.trailerId}">
                Watch Trailer
              </button>
              <button class="btn-modal-action" id="btn-modal-continue" title="Pin to HomeOS Continue Watching card">
                Pin to Dashboard
              </button>
            </div>
          </div>

          <!-- Right Column: Where to Stream in India -->
          <div class="modal-col-right">
            <div class="streaming-hub-box">
              <div class="hub-header">
                <span class="hub-title">WHERE TO STREAM</span>
                <span class="hub-tag">India</span>
              </div>

              <div class="provider-launch-list">
                ${providerButtonsHtml}
              </div>

              <a href="${movie.justWatchUrl}" target="_blank" rel="noopener noreferrer" class="justwatch-fallback-link">
                <span>View Full Availability Matrix on JustWatch</span>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
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

  // Bind modal buttons
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
      continueBtn.textContent = 'Pinned to Dashboard!';
      setTimeout(() => {
        if (window.showToast) {
          window.showToast(`Pinned "${movie.title}" to your HomeOS Continue Watching card!`);
        }
      }, 150);
    });
  }
}

export function closeDetailModal() {
  const modal = document.getElementById('movie-detail-modal');
  if (modal) modal.classList.remove('active');
}

/**
 * 7. Trailer Modal (Ad-free embedded YouTube)
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
 * 8. 1-Click Launch Primary Stream
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
 * 9. Sync Movie to Bento Continue Watching Card
 */
function setContinueWatching(movie) {
  const primaryProvider = movie.providers && movie.providers[0] ? STREAMING_PLATFORMS[movie.providers[0]] : null;
  const continueData = {
    id: movie.id,
    title: movie.title,
    subtext: movie.duration,
    poster: movie.poster,
    progress: 68,
    timeLeft: '45m left',
    url: primaryProvider ? `${primaryProvider.searchBase}${encodeURIComponent(movie.title)}` : movie.justWatchUrl,
    providerName: primaryProvider ? primaryProvider.name : 'Streaming'
  };

  try {
    localStorage.setItem('homeos_continue_watching', JSON.stringify(continueData));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }

  updateBentoContinueWatchingCard(continueData);
}

export function updateBentoContinueWatchingCard(data) {
  const movieCard = document.getElementById('cw-item-movie');
  if (movieCard) {
    const titleEl = movieCard.querySelector('.cw-item-title');
    const timeLeftEl = movieCard.querySelector('.cw-time-remaining');
    const progressFill = movieCard.querySelector('.cw-progress-fill');
    const posterImg = movieCard.querySelector('.cw-poster-img');
    const resumeBtn = document.getElementById('btn-play-movie-cw');

    if (titleEl) {
      titleEl.innerHTML = data.title;
    }
    if (timeLeftEl) {
      timeLeftEl.textContent = data.timeLeft || 'Resume';
    }
    if (progressFill) {
      progressFill.style.width = `${data.progress || 65}%`;
    }
    if (posterImg && data.poster) {
      posterImg.src = data.poster;
      posterImg.alt = data.title;
    }
    if (resumeBtn) {
      resumeBtn.title = `Resume ${data.title} on ${data.providerName || 'Streaming'}`;
      resumeBtn.onclick = (e) => {
        e.stopPropagation();
        if (data.url) {
          window.open(data.url, '_blank', 'noopener,noreferrer');
        }
      };
    }
  }
}
