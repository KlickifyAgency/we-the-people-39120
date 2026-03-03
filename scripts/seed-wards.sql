-- ============================================================
-- WE THE PEOPLE 39120 — NATCHEZ WARD BOUNDARIES (SEED)
-- ============================================================
-- STATUS: PLACEHOLDER — Replace geometry with real GeoJSON.
--
-- TO GET REAL BOUNDARIES:
-- 1. Download ward map PDF:
--    https://natchez.ms.us/DocumentCenter/View/1290/Natchez-Ward-Map
-- 2. Convert to GeoJSON at mapshaper.org or using QGIS
-- 3. Replace the placeholder coordinates below with real ones
-- 4. All coordinates must be [longitude, latitude] (GeoJSON spec)
-- 5. Polygons must close (first point = last point)
--
-- Natchez bounding box approx:
--   SW: [-91.45, 31.52]
--   NE: [-91.35, 31.60]
-- ============================================================

-- Update wards with approximate placeholder boundaries
-- (divided into 6 rough sectors of the city for testing)
-- Replace ALL coordinate arrays with real ward GeoJSON before Phase 2 launch.

UPDATE public.wards
SET geometry = '{
  "type": "Polygon",
  "coordinates": [[
    [-91.430, 31.565],
    [-91.400, 31.565],
    [-91.400, 31.590],
    [-91.430, 31.590],
    [-91.430, 31.565]
  ]]
}'::jsonb
WHERE ward_number = 1;

UPDATE public.wards
SET geometry = '{
  "type": "Polygon",
  "coordinates": [[
    [-91.400, 31.565],
    [-91.370, 31.565],
    [-91.370, 31.590],
    [-91.400, 31.590],
    [-91.400, 31.565]
  ]]
}'::jsonb
WHERE ward_number = 2;

UPDATE public.wards
SET geometry = '{
  "type": "Polygon",
  "coordinates": [[
    [-91.430, 31.540],
    [-91.400, 31.540],
    [-91.400, 31.565],
    [-91.430, 31.565],
    [-91.430, 31.540]
  ]]
}'::jsonb
WHERE ward_number = 3;

UPDATE public.wards
SET geometry = '{
  "type": "Polygon",
  "coordinates": [[
    [-91.400, 31.540],
    [-91.370, 31.540],
    [-91.370, 31.565],
    [-91.400, 31.565],
    [-91.400, 31.540]
  ]]
}'::jsonb
WHERE ward_number = 4;

UPDATE public.wards
SET geometry = '{
  "type": "Polygon",
  "coordinates": [[
    [-91.430, 31.515],
    [-91.400, 31.515],
    [-91.400, 31.540],
    [-91.430, 31.540],
    [-91.430, 31.515]
  ]]
}'::jsonb
WHERE ward_number = 5;

UPDATE public.wards
SET geometry = '{
  "type": "Polygon",
  "coordinates": [[
    [-91.400, 31.515],
    [-91.370, 31.515],
    [-91.370, 31.540],
    [-91.400, 31.540],
    [-91.400, 31.515]
  ]]
}'::jsonb
WHERE ward_number = 6;

-- Verify all wards have geometry
SELECT
  ward_number,
  boundaries_description,
  (geometry IS NOT NULL) AS has_boundary,
  jsonb_array_length(geometry->'coordinates'->0) AS boundary_points
FROM public.wards
ORDER BY ward_number;

-- ============================================================
-- REPLACEMENT GUIDE (when you have real GeoJSON):
--
-- From mapshaper.org output, each ward feature looks like:
-- {
--   "type": "Feature",
--   "properties": { "ward": 1 },
--   "geometry": {
--     "type": "Polygon",
--     "coordinates": [[ [lng, lat], [lng, lat], ... ]]
--   }
-- }
--
-- Extract the geometry object and paste it into the UPDATE above.
-- Make sure the first and last coordinate pairs are identical
-- (GeoJSON requires closed rings).
-- ============================================================
