import * as turf from '@turf/turf';
import * as fs from 'fs';
import * as path from 'path';

interface WardInfo {
  ward: number;
  alderman: string;
  email: string;
  phone: string;
}

let wardGeoJSON: any = null;

function loadWards(): any {
  if (wardGeoJSON) return wardGeoJSON;
  const filePath = path.join(process.cwd(), 'public', 'natchez-wards.geojson');
  const raw = fs.readFileSync(filePath, 'utf-8');
  wardGeoJSON = JSON.parse(raw);
  return wardGeoJSON!;
}

export function detectWardServer(lat: number, lng: number): WardInfo | null {
  try {
    const wards = loadWards();
    const point = turf.point([lng, lat]);
    for (const feature of wards.features) {
      if (feature.geometry.type === 'Polygon') {
        const polygon = turf.polygon(feature.geometry.coordinates);
        if (turf.booleanPointInPolygon(point, polygon)) {
          return feature.properties as WardInfo;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}
