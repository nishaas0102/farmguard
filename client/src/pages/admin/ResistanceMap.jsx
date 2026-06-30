import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function ResistanceMap() {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGeoJSON() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/datameet/maps/master/districts/india-districts.geojson');
        const data = await response.json();
        setGeoData(data);
      } catch (error) {
        console.error('Failed to load GeoJSON:', error);
      } finally {
        setLoading(false);
      }
    }

    loadGeoJSON();
  }, []);

  const onEachFeature = (feature, layer) => {
    const properties = feature.properties;
    const popup = `<div class="text-sm"><strong>${properties.NAME || properties.name || 'Unknown'}</strong></div>`;
    layer.bindPopup(popup);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resistance Radar</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">India Districts Antimicrobial Resistance Heatmap</p>
        </div>
        <div className="text-center py-12">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resistance Radar</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">India Districts Antimicrobial Resistance Heatmap</p>
      </div>

      <div className="rounded-3xl overflow-hidden" style={{ height: '600px' }}>
        {geoData ? (
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
            <GeoJSON data={geoData} onEachFeature={onEachFeature} style={{ color: '#666', weight: 1, opacity: 0.7, fillOpacity: 0.3 }} />
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <p className="text-gray-600">Could not load map data</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-3xl p-4 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-300">
          <strong>Note:</strong> This map shows India's administrative districts. Heatmap coloring will reflect AMU resistance patterns once real-world data is integrated.
        </p>
      </div>
    </div>
  );
}
