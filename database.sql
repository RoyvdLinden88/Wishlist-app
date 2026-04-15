-- ============================================================
-- Wishlist app — full schema + storage setup
-- Run this in the Supabase SQL editor
-- ============================================================

-- 1. Main table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  category    text NOT NULL DEFAULT 'other',
  status      text NOT NULL DEFAULT 'want_to_check',
  url         text,
  image_url   text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- If the table already exists and is missing image_url, add it:
ALTER TABLE wishlist_items ADD COLUMN IF NOT EXISTS image_url text;

-- Remove old columns that are no longer used (safe to skip if they don't exist)
ALTER TABLE wishlist_items DROP COLUMN IF EXISTS priority;
ALTER TABLE wishlist_items DROP COLUMN IF EXISTS rating;
ALTER TABLE wishlist_items DROP COLUMN IF EXISTS notes;

-- Tags array column (re-added)
ALTER TABLE wishlist_items ADD COLUMN IF NOT EXISTS tags text[];

-- Add new category values to the enum (safe to run multiple times on Postgres 9.1+)
ALTER TYPE wishlist_category ADD VALUE IF NOT EXISTS 'winkel';

-- ============================================================
-- 2. Storage bucket for uploaded images
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('wishlist-images', 'wishlist-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read images (public bucket)
DROP POLICY IF EXISTS "Public read – wishlist images" ON storage.objects;
CREATE POLICY "Public read – wishlist images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wishlist-images');

-- Allow anyone to upload (personal app — no auth required)
DROP POLICY IF EXISTS "Public insert – wishlist images" ON storage.objects;
CREATE POLICY "Public insert – wishlist images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wishlist-images');

-- Allow anyone to delete (for cleanup when items are deleted)
DROP POLICY IF EXISTS "Public delete – wishlist images" ON storage.objects;
CREATE POLICY "Public delete – wishlist images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'wishlist-images');
