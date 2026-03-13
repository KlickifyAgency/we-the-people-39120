-- ============================================================
-- SEED: Natchez Aldermen (Phase 2 ready)
-- Real names where known; TBD for unresearched wards.
-- Update with full contact info when Phase 2 activates.
-- ============================================================

-- First insert wards (boundaries loaded separately via GeoJSON)
INSERT INTO public.wards (ward_number, boundaries_description) VALUES
  (1, 'Ward 1 - Northwest Natchez'),
  (2, 'Ward 2 - North Central Natchez'),
  (3, 'Ward 3 - Northeast Natchez'),
  (4, 'Ward 4 - Southeast Natchez'),
  (5, 'Ward 5 - South Central Natchez'),
  (6, 'Ward 6 - West/Bluff area Natchez');

-- Insert aldermen
WITH ward_ids AS (
  SELECT id, ward_number FROM public.wards
)
INSERT INTO public.aldermen (name, ward_id, email, phone, term_start, term_end, party_affiliation, public_profile_enabled)
SELECT
  alderman_data.name,
  ward_ids.id,
  alderman_data.email,
  alderman_data.phone,
  alderman_data.term_start::DATE,
  alderman_data.term_end::DATE,
  'Non-partisan',
  false
FROM (VALUES
  (1, 'Valencia Hall',   NULL, NULL, '2024-01-01', '2028-12-31'),
  (2, 'TBD Ward 2',      NULL, NULL, NULL,          NULL        ),
  (3, 'TBD Ward 3',      NULL, NULL, NULL,          NULL        ),
  (4, 'TBD Ward 4',      NULL, NULL, NULL,          NULL        ),
  (5, 'Ben Davis',       NULL, NULL, '2020-01-01', '2028-12-31'),
  (6, 'TBD Ward 6',      NULL, NULL, NULL,          NULL        )
) AS alderman_data(ward_number, name, email, phone, term_start, term_end)
JOIN ward_ids ON ward_ids.ward_number = alderman_data.ward_number;

-- Link aldermen back to wards
UPDATE public.wards w
SET alderman_id = a.id
FROM public.aldermen a
WHERE a.ward_id = w.id;
