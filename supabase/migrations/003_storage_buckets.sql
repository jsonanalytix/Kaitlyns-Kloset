-- Migration: 003_storage_buckets
-- Creates storage buckets and RLS policies for user-scoped file access

-- ============================================================
-- Create storage buckets
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('wardrobe-images', 'wardrobe-images', false),
  ('calendar-photos', 'calendar-photos', false),
  ('avatars', 'avatars', false);

-- ============================================================
-- Storage RLS: users can only access files in their own folder
-- Path pattern: {user_id}/{filename}
-- ============================================================

-- WARDROBE-IMAGES
CREATE POLICY "Users can upload wardrobe images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'wardrobe-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own wardrobe images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'wardrobe-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own wardrobe images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'wardrobe-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own wardrobe images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'wardrobe-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- CALENDAR-PHOTOS
CREATE POLICY "Users can upload calendar photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'calendar-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own calendar photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'calendar-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own calendar photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'calendar-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own calendar photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'calendar-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- AVATARS
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own avatar"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
