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
  WATCHLIST_MOVIES
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
      <div class="movies-cw-rail" id="movies-cw-rail" role="region" aria-label="Continue Watching Movies">
        ${renderContinueWatchingCards(CONTINUE_WATCHING_MOVIES)}
      </div>
    </div>

    <!-- 2. Netflix Section with Hairline Divider, Downward RED Glow, and "Netflix" Title (No Logo) -->
    <div class="movies-platform-section movies-netflix-section" id="movies-netflix-section">
      <!-- Hairline divider with downward RED glow -->
      <div class="movie-block-divider-wrap netflix-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line netflix-divider-line"></div>
        <div class="movie-block-divider-glow netflix-divider-glow"></div>
      </div>

      <!-- Section Title: Netflix (no logo) -->
      <div class="movies-section-header">
        <div class="netflix-header-left">
          <h2 class="movies-section-title">Netflix</h2>
        </div>
      </div>

      <!-- Netflix Top 10 Movies Rail (Iconic Oversized Rank Numerals) -->
      <div class="platform-top10-rail netflix-top10-rail" id="movies-netflix-rail" role="region" aria-label="Top 10 Movies on Netflix India">
        ${renderPlatformTop10Rail(NETFLIX_TOP_10_INDIA, 'netflix', 'Netflix')}
      </div>
    </div>

    <!-- 3. Prime Video Section with Hairline Divider, Downward BLUE Glow, and "Prime Video" Title (No Logo) -->
    <div class="movies-platform-section movies-prime-section" id="movies-prime-section">
      <!-- Hairline divider with downward BLUE glow -->
      <div class="movie-block-divider-wrap prime-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line prime-divider-line"></div>
        <div class="movie-block-divider-glow prime-divider-glow"></div>
      </div>

      <!-- Section Title: Prime Video (no logo) -->
      <div class="movies-section-header">
        <div class="prime-header-left">
          <h2 class="movies-section-title">Prime Video</h2>
        </div>
      </div>

      <!-- Prime Video Top 10 Movies Rail (Iconic Oversized Rank Numerals) -->
      <div class="platform-top10-rail prime-top10-rail" id="movies-prime-rail" role="region" aria-label="Top 10 Movies on Prime Video">
        ${renderPlatformTop10Rail(PRIME_TOP_10, 'prime', 'Prime Video')}
      </div>
    </div>

    <!-- 4. Hotstar Section with Hairline Divider, Downward PURPLE Glow, and "Hotstar" Title (No Logo) -->
    <div class="movies-platform-section movies-hotstar-section" id="movies-hotstar-section">
      <!-- Hairline divider with downward PURPLE glow -->
      <div class="movie-block-divider-wrap hotstar-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line hotstar-divider-line"></div>
        <div class="movie-block-divider-glow hotstar-divider-glow"></div>
      </div>

      <!-- Section Title: Hotstar (no logo) -->
      <div class="movies-section-header">
        <div class="hotstar-header-left">
          <h2 class="movies-section-title">Hotstar</h2>
        </div>
      </div>

      <!-- Hotstar Top 10 Movies Rail (Iconic Oversized Rank Numerals) -->
      <div class="platform-top10-rail hotstar-top10-rail" id="movies-hotstar-rail" role="region" aria-label="Top 10 Movies on Hotstar">
        ${renderPlatformTop10Rail(HOTSTAR_TOP_10, 'hotstar', 'Hotstar')}
      </div>
    </div>

    <!-- 5. Watchlist Section with Hairline Divider, Downward EMERALD Glow, and "Watchlist" Title (No Logo) -->
    <div class="movies-platform-section movies-watchlist-section" id="movies-watchlist-section">
      <!-- Hairline divider with downward EMERALD glow -->
      <div class="movie-block-divider-wrap watchlist-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line watchlist-divider-line"></div>
        <div class="movie-block-divider-glow watchlist-divider-glow"></div>
      </div>

      <!-- Section Title: Watchlist (no logo) -->
      <div class="movies-section-header">
        <div class="watchlist-header-left">
          <h2 class="movies-section-title">Watchlist</h2>
        </div>
      </div>

      <!-- Watchlist Movies Rail (Iconic Oversized Rank Numerals) -->
      <div class="platform-top10-rail watchlist-top10-rail" id="movies-watchlist-rail" role="region" aria-label="My Watchlist Movies">
        ${renderPlatformTop10Rail(WATCHLIST_MOVIES, 'watchlist', 'Watchlist')}
      </div>
    </div>
  `;

  attachContinueWatchingEvents();

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
    const rankSub = platformKey === 'watchlist'
      ? `#${movie.rank} in Watchlist`
      : `#${movie.rank} in Movies Today`;
    const watchTitle = platformKey === 'watchlist'
      ? `Watch #${movie.rank} ${movie.title} (${movie.providerName || 'Streaming'})`
      : `Watch #${movie.rank} ${movie.title} on ${platformName}`;

    return `
      <a href="${movie.streamUrl}" target="_blank" rel="noopener noreferrer" class="platform-top10-item platform-item-${platformKey}" title="${watchTitle}">
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
            <span class="platform-card-rank-sub rank-sub-${platformKey}">${rankSub}</span>
            <span class="platform-card-title">${movie.title}</span>
            <div class="platform-card-meta">
              <span>${movie.year}</span>
              <span class="meta-dot">•</span>
              <span>${movie.providerName || movie.language}</span>
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
