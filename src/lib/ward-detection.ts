import * as turf from '@turf/turf';

interface WardInfo {
  ward: number;
  alderman: string;
  email: string;
  phone: string;
}

let wardGeoJSON: any = null;

async function loadWards(): Promise<any> {
  if (wardGeoJSON) return wardGeoJSON;
  const res = await fetch('/natchez-wards.geojson');
  wardGeoJSON = await res.json();
  return wardGeoJSON!;
}

export async function detectWard(lat: number, lng: number): Promise<WardInfo | null> {
  try {
    const wards = await loadWards();
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
