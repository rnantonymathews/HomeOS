/**
 * HomeOS - Movies View
 * Clean, Frameless Architecture floating directly on Matte Desktop Wallpaper
 */

import { CONTINUE_WATCHING_MOVIES } from './moviesData.js';

export function initMoviesView() {
  const overlay = document.getElementById('movies-overlay');
  if (!overlay) return;

  // Build the Continue Watching Section directly on the clean matte canvas
  overlay.innerHTML = `
    <div class="movies-cw-section" id="movies-cw-section">
      <!-- Minimalist Frameless Header -->
      <div class="movies-cw-header">
        <div class="movies-cw-header-left">
          <span class="movies-cw-tag">RESUME PLAYBACK</span>
          <h2 class="movies-cw-title">Continue Watching</h2>
        </div>
        <div class="movies-cw-header-right">
          <span class="movies-cw-counter">${CONTINUE_WATCHING_MOVIES.length} in progress</span>
        </div>
      </div>

      <!-- Horizontal Expanding Accordion Rail -->
      <div class="movies-cw-rail" id="movies-cw-rail" role="region" aria-label="Continue Watching Movies">
        ${renderContinueWatchingCards(CONTINUE_WATCHING_MOVIES)}
      </div>
    </div>

    <!-- YouTube Trailer Modal Overlay -->
    <div class="movie-trailer-modal" id="movie-trailer-modal" aria-hidden="true">
      <div class="trailer-modal-backdrop" id="trailer-modal-backdrop"></div>
      <div class="trailer-modal-container">
        <div class="trailer-header">
          <span class="trailer-movie-title" id="trailer-modal-title">Trailer</span>
          <button class="trailer-modal-close" id="trailer-modal-close" aria-label="Close Trailer">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="trailer-iframe-wrap">
          <iframe id="trailer-iframe" src="" title="Movie Trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  `;

  attachContinueWatchingEvents();
  attachTrailerModalEvents();
}

function renderContinueWatchingCards(movies) {
  return movies.map((movie, index) => {
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
            <button class="cw-card-trailer-btn" data-trailer="${movie.trailerId}" data-title="${movie.title}" title="Watch Trailer">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Trailer</span>
            </button>
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
}

function attachContinueWatchingEvents() {
  const cards = document.querySelectorAll('.movies-cw-card');
  const rail = document.getElementById('movies-cw-rail');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If user clicked inside an action button (stream link or trailer button), don't collapse/expand
      if (e.target.closest('.cw-card-play-btn') || e.target.closest('.cw-card-trailer-btn')) {
        return;
      }

      // If already active, do nothing
      if (card.classList.contains('is-active')) return;

      // Collapse previously active card
      const activeCard = document.querySelector('.movies-cw-card.is-active');
      if (activeCard) {
        activeCard.classList.remove('is-active');
        activeCard.setAttribute('aria-expanded', 'false');
      }

      // Expand clicked card
      card.classList.add('is-active');
      card.setAttribute('aria-expanded', 'true');

      // Sync Profile continue watching card if user clicked
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

      // Smoothly ensure expanded card is fully visible inside the rail
      if (rail) {
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }, 120);
      }
    });

    // Keyboard navigation (Enter / Space to select)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

function attachTrailerModalEvents() {
  const modal = document.getElementById('movie-trailer-modal');
  const iframe = document.getElementById('trailer-iframe');
  const closeBtn = document.getElementById('trailer-modal-close');
  const backdrop = document.getElementById('trailer-modal-backdrop');
  const titleEl = document.getElementById('trailer-modal-title');
  if (!modal) return;

  const closeTrailer = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (iframe) iframe.src = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeTrailer);
  if (backdrop) backdrop.addEventListener('click', closeTrailer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeTrailer();
    }
  });

  const trailerButtons = document.querySelectorAll('.cw-card-trailer-btn');
  trailerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const trailerId = btn.dataset.trailer;
      const movieTitle = btn.dataset.title;
      if (trailerId && iframe) {
        iframe.src = `https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0`;
        if (titleEl) titleEl.textContent = `${movieTitle} - Trailer`;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
      }
    });
  });
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
