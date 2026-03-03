'use client';

// Leaflet must be dynamically imported — it's SSR-incompatible.
// Usage: dynamic(() => import('@/components/citizen/MapView'), { ssr: false })

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ReportWithDetails } from '@/lib/types';
import { CATEGORIES, NATCHEZ_CENTER, NATCHEZ_ZOOM } from '@/lib/constants';
import { approximateLocation } from '@/lib/geo';
import { StatusBadge } from '@/components/shared/StatusBadge';

// Fix Leaflet default icon issue with webpack
delete (L.Icon.Default.prototype as typeof L.Icon.Default.prototype & { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createEmojiIcon(emoji: string): L.DivIcon {
  return L.divIcon({
    html: `<div style="font-size:28px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">${emoji}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

interface MapViewProps {
  reports: ReportWithDetails[];
  center?: [number, number];
  onReportClick?: (report: ReportWithDetails) => void;
}

export default function MapView({ reports, center, onReportClick }: MapViewProps) {
  const mapCenter = center ?? NATCHEZ_CENTER;

  return (
    <MapContainer
      center={mapCenter}
      zoom={NATCHEZ_ZOOM}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {center && <MapRecenter lat={center[0]} lng={center[1]} />}

      {reports.map((report) => {
        const cat = CATEGORIES[report.category];
        return (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={createEmojiIcon(cat.emoji)}
            eventHandlers={{ click: () => onReportClick?.(report) }}
          >
            <Popup maxWidth={240} className="dark-popup">
              <div className="p-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{cat.emoji}</span>
                  <strong className="text-sm text-[var(--color-text)]">{cat.label}</strong>
                </div>
                <StatusBadge status={report.status} />
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  {approximateLocation(report.lat, report.lng)}
                </p>
                <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">
                  👍 {report.me_too_count} neighbors confirmed
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
