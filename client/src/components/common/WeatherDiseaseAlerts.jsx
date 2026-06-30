import { useState, useEffect } from 'react';
import { CloudRain, Sun, Thermometer, Wind, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const WEATHER_ICONS = {
  rain: CloudRain,
  heat: Sun,
  cold: Thermometer,
  wind: Wind,
  default: AlertTriangle,
};

export default function WeatherDiseaseAlerts({ district, state }) {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeatherAlerts() {
      try {
        const res = await axios.get('/api/weather/alerts', { params: { district, state } });
        setAlerts(res.data.alerts || []);
        setWeather(res.data.weather || null);
      } catch (err) {
        console.error('Weather alerts fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchWeatherAlerts();
  }, [district, state]);

  if (loading) return null;
  if (alerts.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <CloudRain size={18} className="text-blue-600 dark:text-blue-400" />
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">{t('weather_alerts')}</h3>
        {weather && (
          <span className="text-xs text-blue-500 dark:text-blue-400 ml-auto">
            {weather.temp}&deg;C | {weather.condition}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {alerts.map((alert, idx) => {
          const Icon = WEATHER_ICONS[alert.category] || WEATHER_ICONS.default;
          return (
            <div key={idx} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
              <Icon size={16} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{alert.disease}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{alert.advice}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
