const axios = require('axios');

// Approximate coordinates for Punjab districts
const DISTRICT_COORDS = {
  ludhiana: { lat: 30.9010, lon: 75.8573 },
  jalandhar: { lat: 31.3260, lon: 75.5762 },
  patiala: { lat: 30.3398, lon: 76.3869 },
  amritsar: { lat: 31.6340, lon: 74.8723 },
  moga: { lat: 30.8160, lon: 75.1738 },
  sangrur: { lat: 30.2451, lon: 75.8427 },
  bathinda: { lat: 30.2070, lon: 74.9519 },
  hoshiarpur: { lat: 31.5343, lon: 75.9115 },
  fazilka: { lat: 30.4028, lon: 74.0281 },
  muktsar: { lat: 30.4743, lon: 74.5160 },
  ropar: { lat: 30.9691, lon: 76.5244 },
  's. s. nagar': { lat: 31.1471, lon: 75.3417 },
  kapurthala: { lat: 31.3788, lon: 75.3851 },
  barnala: { lat: 30.3718, lon: 75.5465 },
  mansa: { lat: 29.9986, lon: 75.3937 },
  pathankot: { lat: 32.2643, lon: 75.6514 },
  tarn_taran: { lat: 31.4516, lon: 74.9243 },
  ferozepur: { lat: 30.9296, lon: 74.6145 },
  chandigarh: { lat: 30.7333, lon: 76.7794 },
  default: { lat: 30.9010, lon: 75.8573 }, // Ludhiana fallback
};

/**
 * Weather-condition to disease risk mapping
 */
const WEATHER_DISEASE_MAP = [
  {
    condition: (w) => w.precipitation > 20 || w.humidity > 85,
    category: 'rain',
    diseases: [
      { disease: 'Foot and Mouth Disease (FMD)', advice: 'Ensure FMD vaccination is up to date. Keep animals in dry shelter. Monitor for fever and blisters.' },
      { disease: 'Mastitis', advice: 'Maintain clean milking practices. Dry udder thoroughly. Watch for swelling or abnormal milk.' },
    ],
  },
  {
    condition: (w) => w.temp > 40,
    category: 'heat',
    diseases: [
      { disease: 'Heat Stress', advice: 'Provide shade and ample clean water. Add electrolytes to water. Avoid transport during peak heat.' },
      { disease: 'Reduced Milk Production', advice: 'Expected 10-25% drop. Ensure adequate nutrition and water. Milk during cooler hours.' },
    ],
  },
  {
    condition: (w) => w.temp < 5,
    category: 'cold',
    diseases: [
      { disease: 'Pneumonia', advice: 'Protect young stock from cold winds. Ensure dry bedding. Watch for nasal discharge and rapid breathing.' },
      { disease: 'Hypothermia in Calves', advice: 'Provide extra bedding and calf jackets. Ensure colostrum intake for newborns.' },
    ],
  },
  {
    condition: (w) => w.precipitation > 50,
    category: 'rain',
    diseases: [
      { disease: 'Leptospirosis', advice: 'Avoid stagnant water contact. Vaccinate cattle. Wear protective gear during handling.' },
      { disease: 'Waterborne Diseases', advice: 'Ensure clean drinking water source. Watch for diarrhea in animals. Maintain hygiene around water troughs.' },
    ],
  },
  {
    condition: (w) => w.temp > 35 && w.precipitation < 1,
    category: 'heat',
    diseases: [
      { disease: 'Feed Scarcity Risk', advice: 'Supplement with stored fodder. Consider silage preparation. Monitor body condition score.' },
    ],
  },
];

/**
 * Get weather alerts for a location
 * @param {string} district - District name
 * @param {string} state - State name
 * @returns {Object} - { alerts: [...], weather: { temp, condition, precipitation } }
 */
async function getWeatherAlerts(district, state) {
  const key = (district || '').toLowerCase().trim();
  const coords = DISTRICT_COORDS[key] || DISTRICT_COORDS.default;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&hourly=relativehumidity_2m&timezone=Asia/Kolkata&forecast_days=3`;
    const response = await axios.get(url, { timeout: 5000 });
    const data = response.data;

    const current = data.current_weather || {};
    const daily = data.daily || {};

    const weather = {
      temp: Math.round(current.temperature || 0),
      condition: getWeatherCondition(current.weathercode),
      precipitation: daily.precipitation_sum?.[0] || 0,
      humidity: data.hourly?.relativehumidity_2m?.[0] || 60,
      windSpeed: current.windspeed || 0,
    };

    const alerts = getDiseaseRisks(weather);

    return { alerts, weather };
  } catch (error) {
    console.error('[WEATHER] Failed to fetch weather data:', error.message);
    return { alerts: [], weather: null };
  }
}

/**
 * Map weather data to disease risk alerts
 */
function getDiseaseRisks(weather) {
  const alerts = [];
  for (const mapping of WEATHER_DISEASE_MAP) {
    try {
      if (mapping.condition(weather)) {
        for (const disease of mapping.diseases) {
          alerts.push({ category: mapping.category, ...disease });
        }
      }
    } catch { /* skip */ }
  }
  return alerts;
}

function getWeatherCondition(code) {
  if (code <= 1) return 'Clear';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 49) return 'Foggy';
  if (code <= 69) return 'Rain';
  if (code <= 79) return 'Snow';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

module.exports = { getWeatherAlerts, getDiseaseRisks };
