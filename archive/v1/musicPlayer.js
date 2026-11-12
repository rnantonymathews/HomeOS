/**
 * HomeOS - In-App YouTube Music Player
 * Plays music directly inside HomeOS without opening external tabs or redirecting.
 */

let activeTrack = null;
let isPlayerMinimized = false;

export function initMusicPlayer() {
  const container = document.getElementById('homeos-music-player');
  if (!container) return;

  // Global window function for invoking the in-app player from anywhere (cards, buttons, widgets)
  window.playHomeOSMusic = (track) => {
    if (!track) return;
    activeTrack = track;
    openInAppPlayer(track);
  };

  attachPlayerControls();
}

function openInAppPlayer(track) {
  const player = document.getElementById('homeos-music-player');
  const iframe = document.getElementById('homeos-player-iframe');
  const titleEl = document.getElementById('player-track-title');
  const artistEl = document.getElementById('player-track-artist');
  const coverEl = document.getElementById('player-track-cover');
  const extLink = document.getElementById('player-ytmusic-link');

  if (!player || !iframe) return;

  // Extract video ID from track
  let videoId = track.videoId;
  if (!videoId && track.streamUrl) {
    const m = track.streamUrl.match(/(?:watch\?v=|embed\/|v\/|youtu\.be\/|\/v=)([^#&?]+)/);
    if (m) videoId = m[1];
  }

  // Fallback videoId if missing
  if (!videoId) {
    videoId = 'cGNcjqXe87U'; // Default popular track
  }

  // Update Metadata
  if (titleEl) titleEl.textContent = track.title || 'Playing Track';
  if (artistEl) artistEl.textContent = track.artist || 'YouTube Music';
  if (coverEl) coverEl.src = track.poster || track.backdrop || './assets/icons/music.svg';
  if (extLink) extLink.href = `https://music.youtube.com/watch?v=${videoId}`;

  // Embed official YouTube player directly inside HomeOS DOM
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;

  // Reveal player with smooth slide-up
  player.classList.remove('is-hidden');
  player.classList.add('is-active');

  // Sync to system media session (lockscreen, keyboard play/pause keys)
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title || 'HomeOS Music',
      artist: track.artist || 'YouTube Music',
      album: 'HomeOS Collection',
      artwork: [
        { src: track.poster || '', sizes: '512x512', type: 'image/jpeg' }
      ]
    });
  }

  if (window.showToast) {
    window.showToast(`Now playing: ${track.title}`);
  }
}

function attachPlayerControls() {
  const player = document.getElementById('homeos-music-player');
  const closeBtn = document.getElementById('player-close-btn');
  const minBtn = document.getElementById('player-minimize-btn');
  const iframe = document.getElementById('homeos-player-iframe');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (player) {
        player.classList.remove('is-active');
        player.classList.add('is-hidden');
      }
      if (iframe) {
        iframe.src = ''; // Stop audio playback
      }
    });
  }

  if (minBtn) {
    minBtn.addEventListener('click', () => {
      isPlayerMinimized = !isPlayerMinimized;
      if (player) {
        player.classList.toggle('is-minimized', isPlayerMinimized);
      }
    });
  }
}
