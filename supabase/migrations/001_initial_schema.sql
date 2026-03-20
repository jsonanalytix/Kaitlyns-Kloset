-- Migration: 001_initial_schema
-- Creates all 12 tables for Kaitlyn's Kloset app
-- Tables: profiles, wardrobe_items, outfits, outfit_items,
--         trips, trip_days, trip_day_items, packing_list_items,
--         calendar_entries, calendar_entry_items,
--         stylist_conversations, stylist_messages

-- ============================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text,
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_created_at ON public.profiles(created_at);

-- ============================================================
-- 2. WARDROBE_ITEMS
-- ============================================================
CREATE TABLE public.wardrobe_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name          text NOT NULL,
  category      text NOT NULL CHECK (category IN ('Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories')),
  image_url     text,
  color         text,
  color_hex     text,
  season        text CHECK (season IN ('All-season', 'Spring', 'Summer', 'Fall', 'Winter')),
  formality     text CHECK (formality IN ('Casual', 'Smart-casual', 'Formal')),
  fabric_weight text CHECK (fabric_weight IN ('Lightweight', 'Midweight', 'Heavy')),
  tags          text[] DEFAULT '{}',
  wear_count    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_wardrobe_items_user_id ON public.wardrobe_items(user_id);
CREATE INDEX idx_wardrobe_items_category ON public.wardrobe_items(user_id, category);
CREATE INDEX idx_wardrobe_items_season ON public.wardrobe_items(user_id, season);

-- ============================================================
-- 3. OUTFITS
-- ============================================================
CREATE TABLE public.outfits (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text,
  occasion    text,
  source      text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'ai_stylist')),
  is_saved    boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_outfits_user_id ON public.outfits(user_id);
CREATE INDEX idx_outfits_source ON public.outfits(user_id, source);
CREATE INDEX idx_outfits_saved ON public.outfits(user_id, is_saved) WHERE is_saved = true;

-- ============================================================
-- 4. OUTFIT_ITEMS (junction: outfits <-> wardrobe_items)
-- ============================================================
CREATE TABLE public.outfit_items (
  outfit_id uuid NOT NULL REFERENCES public.outfits(id) ON DELETE CASCADE,
  item_id   uuid NOT NULL REFERENCES public.wardrobe_items(id) ON DELETE CASCADE,
  position  integer NOT NULL DEFAULT 0,
  PRIMARY KEY (outfit_id, item_id)
);

CREATE INDEX idx_outfit_items_item_id ON public.outfit_items(item_id);

-- ============================================================
-- 5. TRIPS
-- ============================================================
CREATE TABLE public.trips (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name            text NOT NULL,
  destination     text NOT NULL,
  cover_image_url text,
  start_date      date NOT NULL,
  end_date        date NOT NULL,
  weather_summary text,
  weather_high    integer,
  weather_low     integer,
  luggage_type    text CHECK (luggage_type IN ('backpack', 'carry-on', 'carry-on-checked', 'no-restrictions')),
  activities      text[] DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_trips_dates ON public.trips(user_id, start_date, end_date);

-- ============================================================
-- 6. TRIP_DAYS
-- ============================================================
CREATE TABLE public.trip_days (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id     uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number  integer NOT NULL,
  label       text,
  activity    text,
  outfit_name text,
  CONSTRAINT unique_trip_day UNIQUE (trip_id, day_number)
);

CREATE INDEX idx_trip_days_trip_id ON public.trip_days(trip_id);

-- ============================================================
-- 7. TRIP_DAY_ITEMS (junction: trip_days <-> wardrobe_items)
-- ============================================================
CREATE TABLE public.trip_day_items (
  trip_day_id uuid NOT NULL REFERENCES public.trip_days(id) ON DELETE CASCADE,
  item_id     uuid NOT NULL REFERENCES public.wardrobe_items(id) ON DELETE CASCADE,
  PRIMARY KEY (trip_day_id, item_id)
);

CREATE INDEX idx_trip_day_items_item_id ON public.trip_day_items(item_id);

-- ============================================================
-- 8. PACKING_LIST_ITEMS
-- ============================================================
CREATE TABLE public.packing_list_items (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id  uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  item_id  uuid NOT NULL REFERENCES public.wardrobe_items(id) ON DELETE CASCADE,
  category text,
  packed   boolean NOT NULL DEFAULT false,
  CONSTRAINT unique_packing_item UNIQUE (trip_id, item_id)
);

CREATE INDEX idx_packing_list_items_trip_id ON public.packing_list_items(trip_id);

-- ============================================================
-- 9. CALENDAR_ENTRIES
-- ============================================================
CREATE TABLE public.calendar_entries (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date                date NOT NULL,
  outfit_name         text,
  occasion            text,
  mood                text,
  photo_url           text,
  weather_temp        integer,
  weather_condition   text,
  weather_description text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

CREATE INDEX idx_calendar_entries_user_date ON public.calendar_entries(user_id, date);

-- ============================================================
-- 10. CALENDAR_ENTRY_ITEMS (junction: calendar_entries <-> wardrobe_items)
-- ============================================================
CREATE TABLE public.calendar_entry_items (
  calendar_entry_id uuid NOT NULL REFERENCES public.calendar_entries(id) ON DELETE CASCADE,
  item_id           uuid NOT NULL REFERENCES public.wardrobe_items(id) ON DELETE CASCADE,
  PRIMARY KEY (calendar_entry_id, item_id)
);

CREATE INDEX idx_calendar_entry_items_item_id ON public.calendar_entry_items(item_id);

-- ============================================================
-- 11. STYLIST_CONVERSATIONS
-- ============================================================
CREATE TABLE public.stylist_conversations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_stylist_conversations_user_id ON public.stylist_conversations(user_id);

-- ============================================================
-- 12. STYLIST_MESSAGES
-- ============================================================
CREATE TABLE public.stylist_messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.stylist_conversations(id) ON DELETE CASCADE,
  sender          text NOT NULL CHECK (sender IN ('user', 'ai')),
  type            text NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'outfit')),
  content         text,
  outfit_id       uuid REFERENCES public.outfits(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_stylist_messages_conversation_id ON public.stylist_messages(conversation_id);
CREATE INDEX idx_stylist_messages_created_at ON public.stylist_messages(conversation_id, created_at);
