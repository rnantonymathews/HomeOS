/**
 * HomeOS - Clean Music & Audio Services Launcher
 * Instant one-click launcher for premier music streaming platforms.
 * Zero lag, zero network dependencies, 100% reliable.
 */

import { MUSIC_PLATFORMS } from './ottData.js';

export function initMusicView() {
  const overlay = document.getElementById('music-overlay');
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="ott-view-container">
      <!-- Top Supertitle Tag -->
      <div class="movie-block-top">
        <span class="movie-block-tag">MUSIC & AUDIO SERVICES</span>
      </div>

      <!-- Hairline divider with subtle RED / AMBER glow -->
      <div class="movie-block-divider-wrap" aria-hidden="true">
        <div class="movie-block-divider-line"></div>
        <div class="movie-block-divider-glow" style="background: radial-gradient(ellipse at center, rgba(239, 68, 68, 0.45) 0%, transparent 70%);"></div>
      </div>

      <!-- Section Header -->
      <div class="ott-view-header">
        <div class="ott-header-left">
          <h2 class="ott-view-title">Music Streaming Apps</h2>
          <span class="ott-count-pill">${MUSIC_PLATFORMS.length} Services</span>
        </div>
        <div class="ott-header-right">
          <span class="ott-hint-text">Click any service to listen directly</span>
        </div>
      </div>

      <!-- Grid of Premium OTT Platform Cards -->
      <div class="ott-platform-grid" role="region" aria-label="Music Streaming Platforms">
        ${renderPlatformCards(MUSIC_PLATFORMS)}
      </div>
    </div>
  `;
}

function renderPlatformCards(platforms) {
  return platforms.map(p => `
    <article class="ott-platform-card" style="--card-accent: ${p.accent}; --card-rgb: ${p.rgb};">
      <div class="ott-card-ambient" aria-hidden="true"></div>
      
      <div class="ott-card-inner">
        <div class="ott-card-top">
          <div class="ott-icon-badge">
            ${p.icon}
          </div>
          <span class="ott-tag-badge">${p.tag}</span>
        </div>

        <div class="ott-card-body">
          <h3 class="ott-platform-name">${p.name}</h3>
          <span class="ott-platform-category">${p.category}</span>
          <p class="ott-platform-desc">${p.description}</p>
        </div>

        <div class="ott-quick-links">
          ${(p.quickLinks || []).map(q => `
            <a href="${q.url}" target="_blank" rel="noopener noreferrer" class="ott-quick-chip" title="Open ${q.label} on ${p.name}">
              <span>${q.label}</span>
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 17l9.2-9.2M17 17V8H8"/>
              </svg>
            </a>
          `).join('')}
        </div>

        <div class="ott-card-action">
          <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="ott-launch-btn" title="Launch ${p.name}">
            <span>Launch ${p.name}</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    </article>
  `).join('');
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
  // Retained for dashboard compatibility
}

