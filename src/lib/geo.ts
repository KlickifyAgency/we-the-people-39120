import * as turf from '@turf/turf';
import { Ward } from './types';

/**
 * Given a lat/lng and a list of wards with GeoJSON boundaries,
 * returns the ward containing that point.
 * Phase 2: Enable when ward GeoJSON is uploaded to Supabase.
 * Phase 1: Always returns null (ward_id stays null on reports).
 */
export function detectWard(lat: number, lng: number, wards: Ward[]): Ward | null {
  const point = turf.point([lng, lat]); // GeoJSON is [lng, lat]

  for (const ward of wards) {
    if (!ward.geometry) continue;
    try {
      const polygon = turf.polygon(ward.geometry.coordinates as number[][][]);
      if (turf.booleanPointInPolygon(point, polygon)) {
        return ward;
      }
    } catch {
      // Skip invalid geometries silently
    }
  }

  return null;
}

/**
 * Approximate location to block level (~100m precision).
 * Privacy: never expose exact GPS to public feed.
 */
export function approximateLocation(lat: number, lng: number): string {
  const approxLat = Math.round(lat * 1000) / 1000;
  const approxLng = Math.round(lng * 1000) / 1000;
  return `Near ${approxLat}, ${approxLng}`;
}

/**
 * Distance between two points in miles (Turf.js).
 */
export function distanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const from = turf.point([lng1, lat1]);
  const to = turf.point([lng2, lat2]);
  return turf.distance(from, to, { units: 'miles' });
}
