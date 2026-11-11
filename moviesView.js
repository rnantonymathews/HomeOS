/**
 * HomeOS - Movies View (Clean Blank Canvas)
 * Ready to build step-by-step with the user.
 */

export function initMoviesView() {
  // Clean canvas ready for step-by-step implementation
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
