-- Migration: 004_functions_and_triggers
-- Creates database functions and triggers:
--   1. handle_new_user() - auto-creates profile on signup
--   2. increment_wear_count() - bumps wear count when logging calendar entries
--   3. compute_wardrobe_insights() - returns wardrobe analytics

-- ============================================================
-- 1. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. INCREMENT WEAR COUNT
-- Called when a calendar entry is created to bump wear_count
-- on each wardrobe item in that entry's outfit.
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_wear_count(p_item_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.wardrobe_items
  SET wear_count = wear_count + 1
  WHERE id = p_item_id;
END;
$$;

-- Trigger: auto-increment wear counts when items are linked to a calendar entry
CREATE OR REPLACE FUNCTION public.on_calendar_entry_item_inserted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.wardrobe_items
  SET wear_count = wear_count + 1
  WHERE id = NEW.item_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_increment_wear_on_calendar_log
  AFTER INSERT ON public.calendar_entry_items
  FOR EACH ROW
  EXECUTE FUNCTION public.on_calendar_entry_item_inserted();

-- ============================================================
-- 3. COMPUTE WARDROBE INSIGHTS
-- Returns wardrobe score, category breakdown, gap suggestions,
-- and seasonal readiness for a given user.
-- ============================================================
CREATE OR REPLACE FUNCTION public.compute_wardrobe_insights(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_total_items integer;
  v_total_worn integer;
  v_wardrobe_score integer;
  v_score_label text;
  v_category_breakdown jsonb;
  v_gap_suggestions jsonb;
  v_underused_items jsonb;
  v_current_season text;
  v_season_item_count integer;
  v_seasonal_readiness jsonb;
  v_current_month integer;
BEGIN
  -- Total items
  SELECT count(*) INTO v_total_items
  FROM public.wardrobe_items
  WHERE user_id = p_user_id;

  -- Items that have been worn at least once
  SELECT count(*) INTO v_total_worn
  FROM public.wardrobe_items
  WHERE user_id = p_user_id AND wear_count > 0;

  -- Wardrobe score: weighted combination of utilization + category diversity
  IF v_total_items = 0 THEN
    v_wardrobe_score := 0;
    v_score_label := 'Empty wardrobe';
  ELSE
    DECLARE
      v_utilization numeric;
      v_category_count integer;
      v_diversity_bonus numeric;
    BEGIN
      v_utilization := (v_total_worn::numeric / v_total_items) * 100;

      SELECT count(DISTINCT category) INTO v_category_count
      FROM public.wardrobe_items
      WHERE user_id = p_user_id;

      -- 6 categories max: bonus scales from 0-20 based on diversity
      v_diversity_bonus := (v_category_count::numeric / 6.0) * 20;

      v_wardrobe_score := LEAST(100, ROUND(v_utilization * 0.8 + v_diversity_bonus));
    END;

    v_score_label := CASE
      WHEN v_wardrobe_score >= 85 THEN 'Excellent wardrobe'
      WHEN v_wardrobe_score >= 70 THEN 'Well-rounded wardrobe'
      WHEN v_wardrobe_score >= 50 THEN 'Growing wardrobe'
      ELSE 'Needs attention'
    END;
  END IF;

  -- Category breakdown with color assignments
  SELECT COALESCE(jsonb_agg(row_to_json(cats)::jsonb), '[]'::jsonb)
  INTO v_category_breakdown
  FROM (
    SELECT
      category,
      count(*)::integer AS count,
      CASE category
        WHEN 'Tops' THEN '#C9918F'
        WHEN 'Bottoms' THEN '#E4BAB4'
        WHEN 'Dresses' THEN '#D49B94'
        WHEN 'Outerwear' THEN '#B27472'
        WHEN 'Shoes' THEN '#9E938B'
        WHEN 'Accessories' THEN '#7A706A'
      END AS color
    FROM public.wardrobe_items
    WHERE user_id = p_user_id
    GROUP BY category
    ORDER BY count DESC
  ) cats;

  -- Gap suggestions: identify missing categories or underrepresented ones
  SELECT COALESCE(jsonb_agg(row_to_json(gaps)::jsonb), '[]'::jsonb)
  INTO v_gap_suggestions
  FROM (
    SELECT
      'gap-' || row_number() OVER () AS id,
      cat AS title,
      CASE cat
        WHEN 'Outerwear' THEN 'Adding outerwear pieces would expand your layering options significantly.'
        WHEN 'Accessories' THEN 'A few accessories can transform basic outfits into polished looks.'
        WHEN 'Shoes' THEN 'More shoe variety unlocks different outfit styles.'
        WHEN 'Dresses' THEN 'Dresses are versatile one-piece outfits for any occasion.'
        WHEN 'Tops' THEN 'More tops give you greater mix-and-match flexibility.'
        WHEN 'Bottoms' THEN 'Additional bottoms complement your existing tops.'
      END AS description,
      CASE cat
        WHEN 'Outerwear' THEN 'cloud-rain'
        WHEN 'Accessories' THEN 'sparkles'
        WHEN 'Shoes' THEN 'footprints'
        WHEN 'Dresses' THEN 'shirt'
        WHEN 'Tops' THEN 'shirt'
        WHEN 'Bottoms' THEN 'shirt'
      END AS icon
    FROM unnest(ARRAY['Tops','Bottoms','Dresses','Outerwear','Shoes','Accessories']) AS cat
    WHERE cat NOT IN (
      SELECT category FROM public.wardrobe_items
      WHERE user_id = p_user_id
      GROUP BY category
      HAVING count(*) >= 3
    )
    LIMIT 3
  ) gaps;

  -- Underused items (worn 0-1 times)
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  INTO v_underused_items
  FROM (
    SELECT id
    FROM public.wardrobe_items
    WHERE user_id = p_user_id AND wear_count <= 1
    ORDER BY wear_count ASC, created_at DESC
    LIMIT 5
  ) underused;

  -- Determine current season from month
  v_current_month := EXTRACT(MONTH FROM now());
  v_current_season := CASE
    WHEN v_current_month IN (3, 4, 5) THEN 'Spring'
    WHEN v_current_month IN (6, 7, 8) THEN 'Summer'
    WHEN v_current_month IN (9, 10, 11) THEN 'Fall'
    ELSE 'Winter'
  END;

  SELECT count(*) INTO v_season_item_count
  FROM public.wardrobe_items
  WHERE user_id = p_user_id
    AND (season = v_current_season OR season = 'All-season');

  v_seasonal_readiness := jsonb_build_object(
    'season', v_current_season,
    'message', CASE
      WHEN v_season_item_count >= 10 THEN v_current_season || ' is covered — you have plenty of options.'
      WHEN v_season_item_count >= 5 THEN 'You have a decent ' || v_current_season || ' selection but could add a few pieces.'
      ELSE 'Your ' || v_current_season || ' wardrobe needs some attention — consider adding season-appropriate items.'
    END,
    'ready', v_season_item_count >= 8
  );

  RETURN jsonb_build_object(
    'wardrobeScore', v_wardrobe_score,
    'scoreLabel', v_score_label,
    'categoryBreakdown', v_category_breakdown,
    'gapSuggestions', v_gap_suggestions,
    'underusedItemIds', v_underused_items,
    'seasonalReadiness', v_seasonal_readiness
  );
END;
$$;
