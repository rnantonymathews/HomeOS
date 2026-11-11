/**
 * HomeOS - Movies View
 * Clean, Frameless Architecture floating directly on Matte Desktop Wallpaper
 */

import { CONTINUE_WATCHING_MOVIES } from './moviesData.js';

export function initMoviesView() {
  const overlay = document.getElementById('movies-overlay');
  if (!overlay) return;

  // Build the Movie Block Section directly on the clean matte canvas
  overlay.innerHTML = `
    <div class="movies-cw-section" id="movies-cw-section">
      <!-- 1. Top Supertitle Tag: MOVIE BLOCK -->
      <div class="movie-block-top">
        <span class="movie-block-tag">MOVIE BLOCK</span>
      </div>

      <!-- 2. Hairline divider with gentle downward purple glow -->
      <div class="movie-block-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line"></div>
        <div class="movie-block-divider-glow"></div>
      </div>

      <!-- 3. Continue Watching Header with Prev/Next Navigation -->
      <div class="movies-cw-header">
        <div class="movies-cw-header-left">
          <h2 class="movies-cw-title">Continue Watching</h2>
        </div>
        <div class="movies-cw-header-right">
          <span class="movies-cw-counter">${CONTINUE_WATCHING_MOVIES.length} in progress</span>
          <div class="movies-cw-nav-arrows">
            <button class="cw-nav-btn btn-cw-prev" id="btn-cw-prev" title="Previous Movie" aria-label="Previous Movie">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button class="cw-nav-btn btn-cw-next" id="btn-cw-next" title="Next Movie" aria-label="Next Movie">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 4. Horizontal Expanding Accordion Rail (Hidden Scrollbar + Anchored First/Last) -->
      <div class="movies-cw-rail" id="movies-cw-rail" role="region" aria-label="Continue Watching Movies">
        ${renderContinueWatchingCards(CONTINUE_WATCHING_MOVIES)}
      </div>
    </div>
  `;

  attachContinueWatchingEvents();

  // Initial position: 1st card stays naturally at the start
  setTimeout(() => {
    const activeCard = document.querySelector('.movies-cw-card.is-active');
    if (activeCard) {
      centerCard(activeCard, false);
      updateNavArrows();
    }
  }, 100);
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

  // Update Nav Buttons State
  updateNavArrows();

  // Scroll appropriately: first and last stay as is; middle items center
  centerCard(card, smooth);
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

function updateNavArrows() {
  const cards = Array.from(document.querySelectorAll('.movies-cw-card'));
  const activeIndex = cards.findIndex(c => c.classList.contains('is-active'));
  const prevBtn = document.getElementById('btn-cw-prev');
  const nextBtn = document.getElementById('btn-cw-next');

  if (prevBtn) {
    prevBtn.disabled = activeIndex <= 0;
  }
  if (nextBtn) {
    nextBtn.disabled = activeIndex >= cards.length - 1;
  }
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

  // Nav Arrow buttons
  const prevBtn = document.getElementById('btn-cw-prev');
  const nextBtn = document.getElementById('btn-cw-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const allCards = Array.from(document.querySelectorAll('.movies-cw-card'));
      const activeIdx = allCards.findIndex(c => c.classList.contains('is-active'));
      if (activeIdx > 0) {
        setActiveCard(allCards[activeIdx - 1], true);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const allCards = Array.from(document.querySelectorAll('.movies-cw-card'));
      const activeIdx = allCards.findIndex(c => c.classList.contains('is-active'));
      if (activeIdx < allCards.length - 1) {
        setActiveCard(allCards[activeIdx + 1], true);
      }
    });
  }

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
  const bento = document.getElementById('bento-dashboard');
  if (!overlay) return;

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
      updateNavArrows();
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
