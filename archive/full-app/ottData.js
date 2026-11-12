/**
 * HomeOS - Clean OTT Launcher Data
 * Fast, one-click launcher definitions for premier streaming platforms.
 * Zero external scraping, instant loading, 100% reliable deep links.
 */

export const MOVIE_PLATFORMS = [
  {
    id: 'netflix-movies',
    name: 'Netflix',
    category: 'Movies & Originals',
    description: 'Award-winning films, Hollywood blockbusters, and Netflix Original productions.',
    url: 'https://www.netflix.com/browse/genre/34399',
    accent: '#E50914',
    rgb: '229, 9, 20',
    tag: 'GLOBAL CINEMA',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M4 2v20l8-14v14l8-20" stroke="#E50914" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    quickLinks: [
      { label: 'Top 10 Today', url: 'https://www.netflix.com/browse/genre/34399' },
      { label: 'Action & Sci-Fi', url: 'https://www.netflix.com/browse/genre/1365' },
      { label: 'Award Winners', url: 'https://www.netflix.com/browse/genre/89844' }
    ]
  },
  {
    id: 'prime-movies',
    name: 'Prime Video',
    category: 'Included with Prime',
    description: 'Blockbuster movies, Amazon Originals, and early access movie rentals.',
    url: 'https://www.primevideo.com/storefront/movie',
    accent: '#00A8E1',
    rgb: '0, 168, 225',
    tag: 'PRIME MOVIES',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M3 13c5 4 13 4 18 0" stroke="#00A8E1" stroke-width="2.5" stroke-linecap="round"/><path d="M17 11.5l4 1.5-1.5-4" stroke="#00A8E1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="#00A8E1" stroke-width="2"/></svg>`,
    quickLinks: [
      { label: 'Top Movies', url: 'https://www.primevideo.com/storefront/movie' },
      { label: 'Action & Thrillers', url: 'https://www.primevideo.com/genre/action' },
      { label: 'Hindi Cinema', url: 'https://www.primevideo.com/storefront/movie' }
    ]
  },
  {
    id: 'hotstar-movies',
    name: 'Disney+ Hotstar',
    category: 'Blockbusters & Marvel',
    description: 'Disney classics, Marvel Cinematic Universe, Star Wars, and premier Indian films.',
    url: 'https://www.hotstar.com/in/explore/movies',
    accent: '#113CCF',
    rgb: '17, 60, 207',
    tag: 'DISNEY & MARVEL',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#113CCF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    quickLinks: [
      { label: 'Explore Movies', url: 'https://www.hotstar.com/in/explore/movies' },
      { label: 'Marvel Universe', url: 'https://www.hotstar.com/in/explore/movies' },
      { label: 'Malayalam & Tamil', url: 'https://www.hotstar.com/in/explore/movies' }
    ]
  },
  {
    id: 'appletv-movies',
    name: 'Apple TV+',
    category: 'Apple Original Films',
    description: 'Prestige Oscar-winning cinematic storytelling in stunning 4K HDR and Spatial Audio.',
    url: 'https://tv.apple.com',
    accent: '#E6E6E6',
    rgb: '230, 230, 230',
    tag: 'PRESTIGE 4K',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.95 2.77 1 .08 2.05-.52 2.67-1.27z"/></svg>`,
    quickLinks: [
      { label: 'Feature Films', url: 'https://tv.apple.com' },
      { label: 'Movie Premieres', url: 'https://tv.apple.com' }
    ]
  },
  {
    id: 'jiocinema-movies',
    name: 'JioCinema',
    category: 'Hindi & Regional',
    description: 'Stream Bollywood hits, Hollywood blockbusters, and regional releases.',
    url: 'https://www.jiocinema.com/movies',
    accent: '#E11383',
    rgb: '225, 19, 131',
    tag: 'DESI & HOLLYWOOD',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" stroke="#E11383" stroke-width="2.5"/><polygon points="10 9 16 12 10 15" fill="#E11383"/></svg>`,
    quickLinks: [
      { label: 'Browse Movies', url: 'https://www.jiocinema.com/movies' },
      { label: 'Top Rated', url: 'https://www.jiocinema.com/movies' }
    ]
  },
  {
    id: 'sonyliv-movies',
    name: 'SonyLIV',
    category: 'Sony Pictures & South',
    description: 'Sony Pictures library, Malayalam, Tamil, and Hindi cinematic powerhouses.',
    url: 'https://www.sonyliv.com/movies',
    accent: '#2979FF',
    rgb: '41, 121, 255',
    tag: 'SONY PICTURES',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><rect x="2" y="4" width="20" height="16" rx="4" stroke="#2979FF" stroke-width="2.5"/><circle cx="12" cy="12" r="4" fill="#2979FF"/></svg>`,
    quickLinks: [
      { label: 'All Movies', url: 'https://www.sonyliv.com/movies' },
      { label: 'Malayalam Hits', url: 'https://www.sonyliv.com/movies' }
    ]
  },
  {
    id: 'zee5-movies',
    name: 'ZEE5',
    category: 'Indian Mass Blockbusters',
    description: 'Vast collection of Hindi, South, and regional Indian films.',
    url: 'https://www.zee5.com/movies',
    accent: '#9C27B0',
    rgb: '156, 39, 176',
    tag: 'REGIONAL CINEMA',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><circle cx="12" cy="12" r="9" stroke="#9C27B0" stroke-width="2.5"/><path d="M8 8h8l-8 8h8" stroke="#9C27B0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    quickLinks: [
      { label: 'New Releases', url: 'https://www.zee5.com/movies' },
      { label: 'Free Movies', url: 'https://www.zee5.com/movies' }
    ]
  },
  {
    id: 'mubi-movies',
    name: 'MUBI',
    category: 'Handpicked Auteur Cinema',
    description: 'A curated selection of visionary films and timeless masterpieces.',
    url: 'https://mubi.com',
    accent: '#26A69A',
    rgb: '38, 166, 154',
    tag: 'AUTEUR & CLASSICS',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#26A69A" stroke-width="2.5"/><line x1="8" y1="3" x2="8" y2="21" stroke="#26A69A" stroke-width="2"/><line x1="16" y1="3" x2="16" y2="21" stroke="#26A69A" stroke-width="2"/></svg>`,
    quickLinks: [
      { label: 'Now Showing', url: 'https://mubi.com' }
    ]
  }
];

export const SHOWS_PLATFORMS = [
  {
    id: 'netflix-shows',
    name: 'Netflix',
    category: 'Global TV Hits & Binge Series',
    description: 'Gripping dramas, sci-fi epics, comedy specials, and viral phenomenon TV.',
    url: 'https://www.netflix.com/browse/genre/83',
    accent: '#E50914',
    rgb: '229, 9, 20',
    tag: 'BINGE SERIES',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><rect x="3" y="7" width="18" height="13" rx="3" stroke="#E50914" stroke-width="2.5"/><path d="M8.5 3.5l3.5 3.5 3.5-3.5" stroke="#E50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    quickLinks: [
      { label: 'All TV Shows', url: 'https://www.netflix.com/browse/genre/83' },
      { label: 'Top 10 Shows', url: 'https://www.netflix.com/browse/genre/83' },
      { label: 'Docuseries', url: 'https://www.netflix.com/browse/genre/10105' }
    ]
  },
  {
    id: 'prime-shows',
    name: 'Prime Video',
    category: 'Exclusive Prime Originals',
    description: 'Critically acclaimed series, franchise epics, and award-winning TV.',
    url: 'https://www.primevideo.com/storefront/tv',
    accent: '#00A8E1',
    rgb: '0, 168, 225',
    tag: 'PRIME ORIGINALS',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M3 13c5 4 13 4 18 0" stroke="#00A8E1" stroke-width="2.5" stroke-linecap="round"/><path d="M17 11.5l4 1.5-1.5-4" stroke="#00A8E1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="4" y="4" width="16" height="6" rx="2" stroke="#00A8E1" stroke-width="2"/></svg>`,
    quickLinks: [
      { label: 'TV Shows Home', url: 'https://www.primevideo.com/storefront/tv' },
      { label: 'Amazon Originals', url: 'https://www.primevideo.com/storefront/tv' }
    ]
  },
  {
    id: 'hotstar-shows',
    name: 'Disney+ Hotstar',
    category: 'HBO, Star & Hotstar Specials',
    description: 'Premier HBO originals, Marvel & Star Wars TV series, and Indian web dramas.',
    url: 'https://www.hotstar.com/in/explore/tv-shows',
    accent: '#113CCF',
    rgb: '17, 60, 207',
    tag: 'HBO & SPECIALS',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#113CCF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    quickLinks: [
      { label: 'Explore Shows', url: 'https://www.hotstar.com/in/explore/tv-shows' },
      { label: 'Hotstar Specials', url: 'https://www.hotstar.com/in/explore/tv-shows' }
    ]
  },
  {
    id: 'appletv-shows',
    name: 'Apple TV+',
    category: 'Emmy-Winning Dramas',
    description: 'Ted Lasso, Severance, Morning Show, Silo, and high-concept prestige storytelling.',
    url: 'https://tv.apple.com',
    accent: '#E6E6E6',
    rgb: '230, 230, 230',
    tag: 'CRITICALLY ACCLAIMED',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.95 2.77 1 .08 2.05-.52 2.67-1.27z"/></svg>`,
    quickLinks: [
      { label: 'Drama Series', url: 'https://tv.apple.com' },
      { label: 'Sci-Fi & Thrillers', url: 'https://tv.apple.com' }
    ]
  },
  {
    id: 'jiocinema-shows',
    name: 'JioCinema',
    category: 'Reality & Premium TV',
    description: 'Bigg Boss, HBO Max hit series, and popular Indian web originals.',
    url: 'https://www.jiocinema.com/tv-shows',
    accent: '#E11383',
    rgb: '225, 19, 131',
    tag: 'HBO & REALITY',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" stroke="#E11383" stroke-width="2.5"/><polygon points="10 9 16 12 10 15" fill="#E11383"/></svg>`,
    quickLinks: [
      { label: 'Browse TV', url: 'https://www.jiocinema.com/tv-shows' }
    ]
  },
  {
    id: 'sonyliv-shows',
    name: 'SonyLIV',
    category: 'Hard-hitting Crime & Drama',
    description: 'Scam series, Gullak, Rocket Boys, and intense investigative shows.',
    url: 'https://www.sonyliv.com/shows',
    accent: '#2979FF',
    rgb: '41, 121, 255',
    tag: 'ORIGINAL DRAMAS',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><rect x="2" y="4" width="20" height="16" rx="4" stroke="#2979FF" stroke-width="2.5"/><circle cx="12" cy="12" r="4" fill="#2979FF"/></svg>`,
    quickLinks: [
      { label: 'Top Shows', url: 'https://www.sonyliv.com/shows' }
    ]
  },
  {
    id: 'zee5-shows',
    name: 'ZEE5',
    category: 'Regional Dramas & Soaps',
    description: 'Original Indian web series and popular regional television.',
    url: 'https://www.zee5.com/tv-shows',
    accent: '#9C27B0',
    rgb: '156, 39, 176',
    tag: 'INDIAN SOAPS',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><circle cx="12" cy="12" r="9" stroke="#9C27B0" stroke-width="2.5"/><path d="M8 8h8l-8 8h8" stroke="#9C27B0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    quickLinks: [
      { label: 'TV Shows', url: 'https://www.zee5.com/tv-shows' }
    ]
  }
];

export const MUSIC_PLATFORMS = [
  {
    id: 'ytmusic-player',
    name: 'YouTube Music',
    category: 'Tracks, Live & Remixes',
    description: 'Over 100M official songs, rare live performances, indie covers, and personalized mixes.',
    url: 'https://music.youtube.com',
    accent: '#FF0000',
    rgb: '255, 0, 0',
    tag: 'LARGEST CATALOG',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><circle cx="12" cy="12" r="9" stroke="#FF0000" stroke-width="2.5"/><circle cx="12" cy="12" r="3.5" fill="#FF0000"/><polygon points="10 9 15 12 10 15" fill="#FFFFFF"/></svg>`,
    quickLinks: [
      { label: 'Home Feed', url: 'https://music.youtube.com' },
      { label: 'Top Charts', url: 'https://music.youtube.com/explore' },
      { label: 'Moods & Genres', url: 'https://music.youtube.com/moods_and_genres' }
    ]
  },
  {
    id: 'spotify-player',
    name: 'Spotify',
    category: 'Playlists & Podcasts',
    description: 'Personalized Daily Mixes, Discover Weekly, collaborative playlists, and top podcasts.',
    url: 'https://open.spotify.com',
    accent: '#1DB954',
    rgb: '29, 185, 84',
    tag: 'DAILY MIXES',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><circle cx="12" cy="12" r="9" fill="#1DB954"/><path d="M7 9c3-1 7-1 10 .5M7.5 12c2.5-.8 6-.6 8.5.8M8 15c2-.5 4.5-.4 6.5.6" stroke="#000000" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    quickLinks: [
      { label: 'Open Web Player', url: 'https://open.spotify.com' },
      { label: 'Top 50 India', url: 'https://open.spotify.com/playlist/37i9dQZEVXbLZ52XMT2umF' },
      { label: 'New Releases', url: 'https://open.spotify.com/section/0JQ5DAnM3wGh0g22RIWRxf' }
    ]
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    category: 'Spatial Audio & Lossless',
    description: 'Immersive Spatial Audio with Dolby Atmos and studio master Lossless streaming.',
    url: 'https://music.apple.com',
    accent: '#FA243C',
    rgb: '250, 36, 60',
    tag: 'LOSSLESS AUDIO',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" fill="#FA243C"/><path d="M9 16V8l8-2v8" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="16" r="2" fill="#FFFFFF"/><circle cx="15" cy="14" r="2" fill="#FFFFFF"/></svg>`,
    quickLinks: [
      { label: 'Browse Web Player', url: 'https://music.apple.com' },
      { label: 'Top 100 Global', url: 'https://music.apple.com' }
    ]
  },
  {
    id: 'amazon-music',
    name: 'Amazon Prime Music',
    category: 'Included with Prime',
    description: 'Ad-free music streaming, millions of podcast episodes, and offline downloads.',
    url: 'https://music.amazon.in',
    accent: '#00A8E1',
    rgb: '0, 168, 225',
    tag: 'AD-FREE PRIME',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M4 14c4 4 12 4 16 0" stroke="#00A8E1" stroke-width="2.5" stroke-linecap="round"/><circle cx="12" cy="8" r="4" stroke="#00A8E1" stroke-width="2"/></svg>`,
    quickLinks: [
      { label: 'Listen Now', url: 'https://music.amazon.in' }
    ]
  },
  {
    id: 'jiosaavn-music',
    name: 'JioSaavn',
    category: 'Bollywood & Regional',
    description: 'Massive library of Bollywood songs, Hindi classics, Punjabi pop, and regional hits.',
    url: 'https://www.jiosaavn.com',
    accent: '#2BC5B4',
    rgb: '43, 197, 180',
    tag: 'REGIONAL AUDIO',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><circle cx="12" cy="12" r="9" stroke="#2BC5B4" stroke-width="2.5"/><path d="M9 8v8l6-4z" fill="#2BC5B4"/></svg>`,
    quickLinks: [
      { label: 'Trending Songs', url: 'https://www.jiosaavn.com' }
    ]
  },
  {
    id: 'soundcloud-music',
    name: 'SoundCloud',
    category: 'Indie & Creator Hub',
    description: 'Discover underground beats, unreleased tracks, DJ sets, and raw music creation.',
    url: 'https://soundcloud.com',
    accent: '#FF5500',
    rgb: '255, 85, 0',
    tag: 'INDIE & DJ SETS',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><circle cx="7" cy="14" r="3" fill="#FF5500"/><rect x="11" y="9" width="3" height="8" rx="1.5" fill="#FF5500"/><rect x="15" y="7" width="3" height="10" rx="1.5" fill="#FF5500"/><rect x="19" y="11" width="3" height="6" rx="1.5" fill="#FF5500"/></svg>`,
    quickLinks: [
      { label: 'Discover Music', url: 'https://soundcloud.com' }
    ]
  }
];

