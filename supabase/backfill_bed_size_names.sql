-- Optional: backfill size_name from width rules used by the storefront.
-- Single ≈ 42, Queen ≈ 60, Queen 2 ≈ 66, King ≥ 72
UPDATE public.product_variants_bed
SET size_name = CASE
  WHEN width >= 72 THEN 'King'
  WHEN width >= 64 THEN 'Queen 2'
  WHEN width >= 54 THEN 'Queen'
  WHEN width IS NOT NULL THEN 'Single'
  ELSE size_name
END
WHERE size_name IS NULL OR btrim(size_name) = '';
