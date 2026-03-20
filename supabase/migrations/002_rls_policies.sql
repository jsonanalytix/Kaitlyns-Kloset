-- Migration: 002_rls_policies
-- Enables RLS on all tables and creates ownership-based access policies

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_day_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packing_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_entry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylist_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylist_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- WARDROBE_ITEMS
-- ============================================================
CREATE POLICY "Users can read own wardrobe items"
  ON public.wardrobe_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wardrobe items"
  ON public.wardrobe_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wardrobe items"
  ON public.wardrobe_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wardrobe items"
  ON public.wardrobe_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- OUTFITS
-- ============================================================
CREATE POLICY "Users can read own outfits"
  ON public.outfits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outfits"
  ON public.outfits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outfits"
  ON public.outfits FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own outfits"
  ON public.outfits FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- OUTFIT_ITEMS (join through outfits to verify ownership)
-- ============================================================
CREATE POLICY "Users can read own outfit items"
  ON public.outfit_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.outfits
      WHERE outfits.id = outfit_items.outfit_id
        AND outfits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own outfit items"
  ON public.outfit_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.outfits
      WHERE outfits.id = outfit_items.outfit_id
        AND outfits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own outfit items"
  ON public.outfit_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.outfits
      WHERE outfits.id = outfit_items.outfit_id
        AND outfits.user_id = auth.uid()
    )
  );

-- ============================================================
-- TRIPS
-- ============================================================
CREATE POLICY "Users can read own trips"
  ON public.trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips"
  ON public.trips FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- TRIP_DAYS (join through trips)
-- ============================================================
CREATE POLICY "Users can read own trip days"
  ON public.trip_days FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_days.trip_id
        AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own trip days"
  ON public.trip_days FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_days.trip_id
        AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own trip days"
  ON public.trip_days FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_days.trip_id
        AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own trip days"
  ON public.trip_days FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_days.trip_id
        AND trips.user_id = auth.uid()
    )
  );

-- ============================================================
-- TRIP_DAY_ITEMS (join through trip_days -> trips)
-- ============================================================
CREATE POLICY "Users can read own trip day items"
  ON public.trip_day_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trip_days
      JOIN public.trips ON trips.id = trip_days.trip_id
      WHERE trip_days.id = trip_day_items.trip_day_id
        AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own trip day items"
  ON public.trip_day_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trip_days
      JOIN public.trips ON trips.id = trip_days.trip_id
      WHERE trip_days.id = trip_day_items.trip_day_id
        AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own trip day items"
  ON public.trip_day_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.trip_days
      JOIN public.trips ON trips.id = trip_days.trip_id
      WHERE trip_days.id = trip_day_items.trip_day_id
        AND trips.user_id = auth.uid()
    )
  );

-- ============================================================
-- PACKING_LIST_ITEMS (join through trips)
-- ============================================================
CREATE POLICY "Users can read own packing list items"
  ON public.packing_list_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = packing_list_items.trip_id
        AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own packing list items"
  ON public.packing_list_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = packing_list_items.trip_id
        AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own packing list items"
  ON public.packing_list_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = packing_list_items.trip_id
        AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own packing list items"
  ON public.packing_list_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = packing_list_items.trip_id
        AND trips.user_id = auth.uid()
    )
  );

-- ============================================================
-- CALENDAR_ENTRIES
-- ============================================================
CREATE POLICY "Users can read own calendar entries"
  ON public.calendar_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calendar entries"
  ON public.calendar_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar entries"
  ON public.calendar_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar entries"
  ON public.calendar_entries FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- CALENDAR_ENTRY_ITEMS (join through calendar_entries)
-- ============================================================
CREATE POLICY "Users can read own calendar entry items"
  ON public.calendar_entry_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.calendar_entries
      WHERE calendar_entries.id = calendar_entry_items.calendar_entry_id
        AND calendar_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own calendar entry items"
  ON public.calendar_entry_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.calendar_entries
      WHERE calendar_entries.id = calendar_entry_items.calendar_entry_id
        AND calendar_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own calendar entry items"
  ON public.calendar_entry_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.calendar_entries
      WHERE calendar_entries.id = calendar_entry_items.calendar_entry_id
        AND calendar_entries.user_id = auth.uid()
    )
  );

-- ============================================================
-- STYLIST_CONVERSATIONS
-- ============================================================
CREATE POLICY "Users can read own conversations"
  ON public.stylist_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON public.stylist_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON public.stylist_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- STYLIST_MESSAGES (join through stylist_conversations)
-- ============================================================
CREATE POLICY "Users can read own messages"
  ON public.stylist_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.stylist_conversations
      WHERE stylist_conversations.id = stylist_messages.conversation_id
        AND stylist_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own messages"
  ON public.stylist_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stylist_conversations
      WHERE stylist_conversations.id = stylist_messages.conversation_id
        AND stylist_conversations.user_id = auth.uid()
    )
  );
