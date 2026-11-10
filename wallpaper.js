/**
 * HomeOS - Dynamic Wallpaper & Live Weather Engine
 * - Location: Bangalore, Ejipura (12.9382° N, 77.6299° E)
 * - Timing slots: 3am, 9am, 3pm, 9pm
 * - Conditions: s (sunny), w (winter), r (rainy)
 * - Faded crossfade transitions
 * - Rain animation triggers strictly when raining
 */

(function () {
  'use strict';

  const EJIPURA_LAT = 12.9382;
  const EJIPURA_LON = 77.6299;
  const WALLPAPER_DIR = 'assets/Wallpapers';

  // State management
  let overrideCondition = null; // 's' | 'w' | 'r' | null (null = auto)
  let overrideSlot = null;      // '3am' | '9am' | '3pm' | '9pm' | null (null = auto)

  let liveWeatherData = null;
  let currentCondition = 'w';
  let currentSlot = '9pm';
  let currentWallpaperUrl = '';
  let activeLayerId = 'frame-wallpaper-a';

  const RAIN_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);

  // WMO Code interpretation descriptions & icons
  function interpretWmoCode(code, isDay) {
    switch (code) {
      case 0:
        return { text: isDay ? 'Clear Sky' : 'Clear Night', icon: isDay ? '☀️' : '🌙' };
      case 1:
        return { text: 'Mainly Clear', icon: isDay ? '🌤️' : '🌙' };
      case 2:
        return { text: 'Partly Cloudy', icon: '⛅' };
      case 3:
        return { text: 'Overcast', icon: '☁️' };
      case 45:
      case 48:
        return { text: 'Fog / Mist', icon: '🌫️' };
      case 51:
      case 53:
      case 55:
        return { text: 'Drizzle', icon: '🌦️' };
      case 61:
      case 63:
      case 65:
        return { text: 'Rain', icon: '🌧️' };
      case 80:
      case 81:
      case 82:
        return { text: 'Rain Showers', icon: '🌧️' };
      case 95:
      case 96:
      case 99:
        return { text: 'Thunderstorm', icon: '⛈️' };
      default:
        return { text: 'Cloudy', icon: '☁️' };
    }
  }

  // ==========================================================================
  // 1. Time Slot Determination (3am, 9am, 3pm, 9pm)
  // ==========================================================================
  function getCurrentTimeSlot(date = new Date()) {
    const hours = date.getHours();
    // 03:00 - 08:59 -> 3am
    if (hours >= 3 && hours < 9) return '3am';
    // 09:00 - 14:59 -> 9am
    if (hours >= 9 && hours < 15) return '9am';
    // 15:00 - 20:59 -> 3pm
    if (hours >= 15 && hours < 21) return '3pm';
    // 21:00 - 02:59 -> 9pm
    return '9pm';
  }

  // ==========================================================================
  // 2. Weather Condition Analysis for Bangalore, Ejipura
  // ==========================================================================
  function analyzeCondition(data) {
    if (!data) {
      // Offline fallback: Bangalore winter check (Nov-Feb = winter)
      const month = new Date().getMonth() + 1;
      return (month === 11 || month === 12 || month === 1 || month === 2) ? 'w' : 's';
    }

    const code = data.weather_code;
    const isRaining = RAIN_CODES.has(code) || (data.rain > 0) || (data.precipitation > 0);

    if (isRaining) {
      return 'r';
    }

    // Bangalore seasonal climate analysis:
    // Winter: Nov, Dec, Jan, Feb (cool mornings/evenings)
    // Summer/Sunny: Mar - May or clear warm days
    const month = new Date().getMonth() + 1;
    const isWinterMonth = (month === 11 || month === 12 || month === 1 || month === 2);
    const temp = data.temperature_2m;
    const isCool = temp <= 22;
    const isCloudyOrFog = [2, 3, 45, 48].includes(code);

    if (isWinterMonth || (isCool && isCloudyOrFog)) {
      return 'w';
    }

    // Sunny when clear / daytime warm
    return 's';
  }

  // ==========================================================================
  // 3. Smooth Crossfading Wallpaper Transition
  // ==========================================================================
  function applyWallpaper(condition, slot, force = false) {
    const fileName = `${condition}-${slot}.png`;
    const fullUrl = `${WALLPAPER_DIR}/${fileName}`;

    if (fullUrl === currentWallpaperUrl && !force) return;

    // Preload image to avoid blank flashing
    const img = new Image();
    img.src = fullUrl;

    img.onload = () => {
      const isInitial = !currentWallpaperUrl;
      const isFrameA = activeLayerId === 'frame-wallpaper-a';
      const nextLayerId = isFrameA ? 'frame-wallpaper-b' : 'frame-wallpaper-a';
      const currentLayer = document.getElementById(activeLayerId) || document.getElementById('wallpaper-layer-a');
      const nextLayer = document.getElementById(nextLayerId) || document.getElementById('wallpaper-layer-b');

      if (!nextLayer || !currentLayer) return;

      if (isInitial) {
        currentLayer.style.backgroundImage = `url('${fullUrl}')`;
        currentLayer.classList.add('active');
        currentWallpaperUrl = fullUrl;
      } else {
        nextLayer.style.backgroundImage = `url('${fullUrl}')`;
        nextLayer.classList.add('active');
        currentLayer.classList.remove('active');
        activeLayerId = nextLayerId;
        currentWallpaperUrl = fullUrl;
      }

      // Update flyout name if visible
      const nameEl = document.getElementById('current-wallpaper-name');
      if (nameEl) nameEl.textContent = fileName;
    };

    img.onerror = () => {
      console.warn(`[HomeOS] Failed to load wallpaper: ${fullUrl}`);
    };
  }

  // ==========================================================================
  // 4. Update Sky Animation Sync
  // ==========================================================================
  function updateSkyEffects(condition, weatherData) {
    if (!window.HomeOS_Sky) return;

    const isRaining = condition === 'r';
    window.HomeOS_Sky.setRain(isRaining);

    let isCloudy = true;
    if (weatherData) {
      isCloudy = (weatherData.cloud_cover > 40) || [2, 3, 45, 48].includes(weatherData.weather_code) || isRaining;
    } else {
      isCloudy = condition === 'r' || condition === 'w';
    }

    window.HomeOS_Sky.setCloudy(isCloudy);
  }

  // ==========================================================================
  // 5. Update UI Status Widget
  // ==========================================================================
  function updateUI(condition, slot, weatherData) {
    const iconEl = document.getElementById('weather-icon');
    const tempEl = document.getElementById('weather-temp');
    const slotTagEl = document.getElementById('weather-slot-tag');
    const flyoutDesc = document.getElementById('flyout-desc');
    const flyoutBadge = document.getElementById('flyout-status-badge');

    const slotLabel = slot.toUpperCase();
    const condName = condition === 'r' ? 'Rainy' : (condition === 'w' ? 'Winter' : 'Sunny');

    // Photo Frame Weather Elements
    const frameIcon = document.getElementById('frame-weather-icon');
    const frameTemp = document.getElementById('frame-weather-temp');
    const frameCond = document.getElementById('frame-weather-cond');

    if (weatherData) {
      const wmoInfo = interpretWmoCode(weatherData.weather_code, weatherData.is_day === 1);
      const iconStr = condition === 'r' ? '🌧️' : wmoInfo.icon;
      const tempStr = `${Math.round(weatherData.temperature_2m)}°C`;
      const condStr = condition === 'r' ? 'Raining' : wmoInfo.text;

      if (iconEl) iconEl.textContent = iconStr;
      if (tempEl) tempEl.textContent = tempStr;
      if (frameIcon) frameIcon.textContent = iconStr;
      if (frameTemp) frameTemp.textContent = tempStr;
      if (frameCond) frameCond.textContent = condStr;

      if (flyoutDesc) {
        flyoutDesc.textContent = `${wmoInfo.text} • ${weatherData.temperature_2m}°C • Humidity ${weatherData.relative_humidity_2m}%`;
      }
      if (flyoutBadge) flyoutBadge.textContent = 'Live Feed';
    } else {
      const iconStr = condition === 'r' ? '🌧️' : (condition === 'w' ? '❄️' : '☀️');
      if (iconEl) iconEl.textContent = iconStr;
      if (tempEl) tempEl.textContent = '22°C';
      if (frameIcon) frameIcon.textContent = iconStr;
      if (frameTemp) frameTemp.textContent = '22°C';
      if (frameCond) frameCond.textContent = condition === 'r' ? 'Rainy' : (condition === 'w' ? 'Winter Overcast' : 'Sunny');
      if (flyoutDesc) flyoutDesc.textContent = 'Ejipura, Bangalore (Default)';
    }

    if (slotTagEl) {
      const modePrefix = (overrideCondition || overrideSlot) ? 'Preview' : 'Auto';
      slotTagEl.textContent = `${modePrefix}: ${condName} • ${slotLabel}`;
    }
  }

  // ==========================================================================
  // 6. Master Sync Engine
  // ==========================================================================
  function syncEngine() {
    const detectedSlot = getCurrentTimeSlot();
    const detectedCondition = analyzeCondition(liveWeatherData);

    currentSlot = overrideSlot || detectedSlot;
    currentCondition = overrideCondition || detectedCondition;

    applyWallpaper(currentCondition, currentSlot);
    updateSkyEffects(currentCondition, liveWeatherData);
    updateUI(currentCondition, currentSlot, liveWeatherData);
  }

  // ==========================================================================
  // 7. Live Weather Fetcher (Open-Meteo API)
  // ==========================================================================
  async function fetchLiveWeather() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${EJIPURA_LAT}&longitude=${EJIPURA_LON}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,cloud_cover&timezone=Asia%2FKolkata`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data && data.current) {
        liveWeatherData = data.current;
        console.log('[HomeOS] Live weather fetched for Bangalore, Ejipura:', liveWeatherData);
        syncEngine();
      }
    } catch (err) {
      console.warn('[HomeOS] Weather fetch error (using seasonal model):', err);
      syncEngine();
    }
  }

  // ==========================================================================
  // 8. Interactive Weather Widget Flyout & Previews
  // ==========================================================================
  function initWeatherFlyout() {
    const widget = document.getElementById('weather-widget');
    const flyout = document.getElementById('weather-flyout');
    if (!widget || !flyout) return;

    widget.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = flyout.style.display === 'block';
      flyout.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
      if (!flyout.contains(e.target) && !widget.contains(e.target)) {
        flyout.style.display = 'none';
      }
    });

    // Condition Toggles
    const conditionToggles = document.getElementById('condition-toggles');
    if (conditionToggles) {
      conditionToggles.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const val = btn.dataset.condition;

        conditionToggles.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        overrideCondition = val === 'auto' ? null : val;
        syncEngine();
      });
    }

    // Slot Toggles
    const slotToggles = document.getElementById('slot-toggles');
    if (slotToggles) {
      slotToggles.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const val = btn.dataset.slot;

        slotToggles.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        overrideSlot = val === 'auto' ? null : val;
        syncEngine();
      });
    }
  }

  // ==========================================================================
  // 9. Startup & Intervals
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // Immediate initial sync with default values
    syncEngine();

    // Initialize UI controls
    initWeatherFlyout();

    // Fetch live Ejipura weather immediately
    fetchLiveWeather();

    // Poll weather every 10 minutes (600,000 ms)
    setInterval(fetchLiveWeather, 10 * 60 * 1000);

    // Check time slot transition every 30 seconds
    setInterval(() => {
      if (!overrideSlot) {
        const newSlot = getCurrentTimeSlot();
        if (newSlot !== currentSlot) {
          syncEngine();
        }
      }
    }, 30 * 1000);
  });

  // Export public interface for debugging or testing
  window.HomeOS_Wallpaper = {
    setPreview: function (condition, slot) {
      overrideCondition = condition;
      overrideSlot = slot;
      syncEngine();
    },
    resetAuto: function () {
      overrideCondition = null;
      overrideSlot = null;
      syncEngine();
    },
    getStatus: function () {
      return {
        condition: currentCondition,
        slot: currentSlot,
        wallpaper: currentWallpaperUrl,
        liveWeather: liveWeatherData
      };
    }
  };

})();

