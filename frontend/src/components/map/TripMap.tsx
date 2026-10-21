import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Activity } from '../../types';

// Fix standard Leaflet marker icons in React bundles
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored pin helper
const createCustomIcon = (index: number) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, #e15c76, #be123c);
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(225, 92, 118, 0.4);
        border: 2px solid white;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 12px;
          font-weight: bold;
          font-family: sans-serif;
        ">${index + 1}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
  });
};

// Component to dynamically fit bounds to markers
const MapBoundsFitter: React.FC<{ coords: [number, number][] }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords.map((c) => L.latLng(c[0], c[1])));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [coords, map]);
  return null;
};

interface TripMapProps {
  activities: Activity[];
  destinationName?: string;
  className?: string;
}

export const TripMap: React.FC<TripMapProps> = ({
  activities,
  destinationName,
  className = 'h-96 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100'
}) => {
  // Filter activities with valid coordinates
  const validActivities = activities.filter(
    (a) => typeof a.latitude === 'number' && typeof a.longitude === 'number' && !isNaN(a.latitude) && !isNaN(a.longitude)
  );

  const coords: [number, number][] = validActivities.map((a) => [a.latitude!, a.longitude!]);

  const defaultCenter: [number, number] = coords.length > 0 ? coords[0] : [20.5937, 78.9629];

  return (
    <div className={`relative ${className}`}>
      {coords.length === 0 ? (
        <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 text-gray-500 p-6 text-center">
          <p className="font-semibold text-gray-700">Map Preview</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            Coordinates for {destinationName || 'these attractions'} will render automatically as activities are populated.
          </p>
        </div>
      ) : (
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapBoundsFitter coords={coords} />

          {/* Connect sequential activities with route polyline */}
          {coords.length > 1 && (
            <Polyline
              positions={coords}
              pathOptions={{ color: '#e15c76', weight: 3, dashArray: '6, 8', opacity: 0.8 }}
            />
          )}

          {/* Markers */}
          {validActivities.map((act, idx) => (
            <Marker
              key={act.id || idx}
              position={[act.latitude!, act.longitude!]}
              icon={createCustomIcon(idx)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 max-w-[200px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                    {act.time_of_day} • {act.category}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 mt-1.5 leading-tight">{act.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{act.location_name}</p>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100 text-[11px] font-semibold text-gray-700">
                    <span>{act.start_time || '09:00'} - {act.end_time || '11:00'}</span>
                    <span className="text-emerald-600">{act.currency} {act.estimated_cost}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};
