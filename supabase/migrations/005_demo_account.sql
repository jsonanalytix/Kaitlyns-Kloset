-- Migration: 005_demo_account
-- Adds demo account support: is_demo flag on profiles, helper function,
-- and restrictive RLS policies that block the demo user from all write operations.

-- ============================================================
-- 1. Add is_demo column to profiles
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN is_demo boolean NOT NULL DEFAULT false;

-- ============================================================
-- 2. Helper: check if the current authenticated user is the demo user
-- SECURITY DEFINER so it can read profiles regardless of calling context
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_demo_user()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_demo FROM profiles WHERE id = auth.uid()),
    false
  );
$$;

-- ============================================================
-- 3. Restrictive RLS policies blocking demo user writes
-- ============================================================
-- RESTRICTIVE policies must ALL pass (alongside at least one permissive).
-- The demo user can SELECT but cannot INSERT, UPDATE, or DELETE.

-- profiles: block UPDATE
CREATE POLICY "Demo user cannot update profiles"
  ON public.profiles AS RESTRICTIVE FOR UPDATE
  USING (NOT public.is_demo_user());

-- wardrobe_items
CREATE POLICY "Demo user cannot insert wardrobe_items"
  ON public.wardrobe_items AS RESTRICTIVE FOR INSERT
  WITH CHECK (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot update wardrobe_items"
  ON public.wardrobe_items AS RESTRICTIVE FOR UPDATE
  USING (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot delete wardrobe_items"
  ON public.wardrobe_items AS RESTRICTIVE FOR DELETE
  USING (NOT public.is_demo_user());

-- outfits
CREATE POLICY "Demo user cannot insert outfits"
  ON public.outfits AS RESTRICTIVE FOR INSERT
  WITH CHECK (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot update outfits"
  ON public.outfits AS RESTRICTIVE FOR UPDATE
  USING (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot delete outfits"
  ON public.outfits AS RESTRICTIVE FOR DELETE
  USING (NOT public.is_demo_user());

-- outfit_items
CREATE POLICY "Demo user cannot insert outfit_items"
  ON public.outfit_items AS RESTRICTIVE FOR INSERT
  WITH CHECK (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot delete outfit_items"
  ON public.outfit_items AS RESTRICTIVE FOR DELETE
  USING (NOT public.is_demo_user());

-- trips
CREATE POLICY "Demo user cannot insert trips"
  ON public.trips AS RESTRICTIVE FOR INSERT
  WITH CHECK (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot update trips"
  ON public.trips AS RESTRICTIVE FOR UPDATE
  USING (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot delete trips"
  ON public.trips AS RESTRICTIVE FOR DELETE
  USING (NOT public.is_demo_user());

-- trip_days
CREATE POLICY "Demo user cannot insert trip_days"
  ON public.trip_days AS RESTRICTIVE FOR INSERT
  WITH CHECK (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot update trip_days"
  ON public.trip_days AS RESTRICTIVE FOR UPDATE
  USING (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot delete trip_days"
  ON public.trip_days AS RESTRICTIVE FOR DELETE
  USING (NOT public.is_demo_user());

-- trip_day_items
CREATE POLICY "Demo user cannot insert trip_day_items"
  ON public.trip_day_items AS RESTRICTIVE FOR INSERT
  WITH CHECK (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot delete trip_day_items"
  ON public.trip_day_items AS RESTRICTIVE FOR DELETE
  USING (NOT public.is_demo_user());

-- packing_list_items
CREATE POLICY "Demo user cannot insert packing_list_items"
  ON public.packing_list_items AS RESTRICTIVE FOR INSERT
  WITH CHECK (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot update packing_list_items"
  ON public.packing_list_items AS RESTRICTIVE FOR UPDATE
  USING (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot delete packing_list_items"
  ON public.packing_list_items AS RESTRICTIVE FOR DELETE
  USING (NOT public.is_demo_user());

-- calendar_entries
CREATE POLICY "Demo user cannot insert calendar_entries"
  ON public.calendar_entries AS RESTRICTIVE FOR INSERT
  WITH CHECK (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot update calendar_entries"
  ON public.calendar_entries AS RESTRICTIVE FOR UPDATE
  USING (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot delete calendar_entries"
  ON public.calendar_entries AS RESTRICTIVE FOR DELETE
  USING (NOT public.is_demo_user());

-- calendar_entry_items
CREATE POLICY "Demo user cannot insert calendar_entry_items"
  ON public.calendar_entry_items AS RESTRICTIVE FOR INSERT
  WITH CHECK (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot delete calendar_entry_items"
  ON public.calendar_entry_items AS RESTRICTIVE FOR DELETE
  USING (NOT public.is_demo_user());

-- stylist_conversations
CREATE POLICY "Demo user cannot insert stylist_conversations"
  ON public.stylist_conversations AS RESTRICTIVE FOR INSERT
  WITH CHECK (NOT public.is_demo_user());
CREATE POLICY "Demo user cannot delete stylist_conversations"
  ON public.stylist_conversations AS RESTRICTIVE FOR DELETE
  USING (NOT public.is_demo_user());

-- stylist_messages
CREATE POLICY "Demo user cannot insert stylist_messages"
  ON public.stylist_messages AS RESTRICTIVE FOR INSERT
  WITH CHECK (NOT public.is_demo_user());
