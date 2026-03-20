-- Migration: 006_demo_seed_and_reset
-- Creates the demo data seed/reset function and optional nightly cron schedule.
-- Prerequisites: demo user created in auth.users with email demo@kaitlynskloset.app

-- ============================================================
-- 1. Deterministic UUID helper for demo data
-- ============================================================
-- UUID scheme: d0000000-0000-4000-{category}-{number padded to 12}
--   wi = a000 (wardrobe items 1-25)
--   o  = b000 (outfits 1-13)
--   tr = c000 (trips 1-3)
--   td = c100 (trip days 1-17)
--   ce = d000 (calendar entries 1-28)
--   cv = e000 (conversation)

CREATE OR REPLACE FUNCTION public._demo_uuid(cat text, num int)
RETURNS uuid LANGUAGE sql IMMUTABLE AS $$
  SELECT (CASE cat
    WHEN 'wi' THEN 'd0000000-0000-4000-a000-'
    WHEN 'o'  THEN 'd0000000-0000-4000-b000-'
    WHEN 'tr' THEN 'd0000000-0000-4000-c000-'
    WHEN 'td' THEN 'd0000000-0000-4000-c100-'
    WHEN 'ce' THEN 'd0000000-0000-4000-d000-'
    WHEN 'cv' THEN 'd0000000-0000-4000-e000-'
  END || lpad(num::text, 12, '0'))::uuid;
$$;

-- ============================================================
-- 2. Reset / seed function (SECURITY DEFINER bypasses RLS)
-- ============================================================
CREATE OR REPLACE FUNCTION public.reset_demo_account()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $fn$
DECLARE
  demo_uid uuid;
BEGIN
  SELECT id INTO demo_uid FROM auth.users WHERE email = 'demo@kaitlynskloset.app';
  IF demo_uid IS NULL THEN
    RAISE NOTICE 'Demo user (demo@kaitlynskloset.app) not found, skipping reset';
    RETURN;
  END IF;

  -- ── Delete existing demo data (ON DELETE CASCADE handles junction tables) ──
  DELETE FROM stylist_conversations WHERE user_id = demo_uid;
  DELETE FROM outfits WHERE user_id = demo_uid;
  DELETE FROM trips WHERE user_id = demo_uid;
  DELETE FROM calendar_entries WHERE user_id = demo_uid;
  DELETE FROM wardrobe_items WHERE user_id = demo_uid;

  -- ── Update profile ──
  UPDATE profiles
  SET name = 'Kaitlyn', avatar_url = '/kait.png', is_demo = true
  WHERE id = demo_uid;

  -- ════════════════════════════════════════════════════════════
  -- WARDROBE ITEMS (25)
  -- ════════════════════════════════════════════════════════════
  INSERT INTO wardrobe_items (id, user_id, name, category, image_url, color, color_hex, season, formality, fabric_weight, tags, wear_count, created_at) VALUES
  (_demo_uuid('wi',1),  demo_uid, 'Cream Linen Blouse',          'Tops',        'https://images.unsplash.com/photo-1752825609278-f9696bc9d7bd?w=400&h=500&fit=crop', 'Cream',        '#F5F0E6', 'Summer',     'Smart-casual', 'Lightweight', ARRAY['Favorite','Brunch staple'],                 8,  now() - interval '2 days'),
  (_demo_uuid('wi',2),  demo_uid, 'High-Waisted Black Jeans',    'Bottoms',     'https://images.unsplash.com/photo-1624045464280-5eb522c8eba2?w=400&h=500&fit=crop', 'Black',        '#1C1C1C', 'All-season', 'Casual',       'Midweight',   ARRAY['Everyday','Goes with everything'],          15, now() - interval '5 days'),
  (_demo_uuid('wi',3),  demo_uid, 'Sage Midi Skirt',             'Bottoms',     'https://images.unsplash.com/photo-1599505043460-025f45a0041a?w=400&h=500&fit=crop', 'Sage',         '#9CAF88', 'Spring',     'Smart-casual', 'Lightweight', ARRAY['Date night staple'],                        5,  now() - interval '3 days'),
  (_demo_uuid('wi',4),  demo_uid, 'Camel Cashmere Sweater',      'Tops',        'https://images.unsplash.com/photo-1613182840815-fc7135440065?w=400&h=500&fit=crop', 'Camel',        '#C4956A', 'Fall',       'Smart-casual', 'Midweight',   ARRAY['Cozy','Layering piece'],                    6,  now() - interval '7 days'),
  (_demo_uuid('wi',5),  demo_uid, 'White Leather Sneakers',      'Shoes',       'https://images.unsplash.com/photo-1662376567952-004fab001201?w=400&h=500&fit=crop', 'White',        '#F8F8F8', 'All-season', 'Casual',       'Midweight',   ARRAY['Everyday','Favorite'],                      18, now() - interval '1 day'),
  (_demo_uuid('wi',6),  demo_uid, 'Blush Silk Camisole',         'Tops',        'https://images.unsplash.com/photo-1578418683770-50efe4936efe?w=400&h=500&fit=crop', 'Blush',        '#E8C4C0', 'Summer',     'Smart-casual', 'Lightweight', ARRAY['Date night staple','Layering piece'],        4,  now() - interval '4 days'),
  (_demo_uuid('wi',7),  demo_uid, 'Classic Denim Jacket',        'Outerwear',   'https://images.unsplash.com/photo-1587082082054-55f834fa561d?w=400&h=500&fit=crop', 'Blue',         '#6B8EAD', 'All-season', 'Casual',       'Midweight',   ARRAY['Layering piece','Goes with everything'],    12, now() - interval '10 days'),
  (_demo_uuid('wi',8),  demo_uid, 'Floral Wrap Dress',           'Dresses',     'https://images.unsplash.com/photo-1760172551779-5bd7f920a54b?w=400&h=500&fit=crop', 'Pink',         '#E8A0B4', 'Spring',     'Smart-casual', 'Lightweight', ARRAY['Brunch staple','Favorite'],                 7,  now() - interval '6 days'),
  (_demo_uuid('wi',9),  demo_uid, 'Tan Trench Coat',             'Outerwear',   'https://images.unsplash.com/photo-1648489732771-f46eb9d8d95a?w=400&h=500&fit=crop', 'Tan',          '#C8AD8A', 'Fall',       'Formal',       'Midweight',   ARRAY['Classic','Work-ready'],                     3,  now() - interval '14 days'),
  (_demo_uuid('wi',10), demo_uid, 'Black Ankle Boots',           'Shoes',       'https://images.unsplash.com/photo-1534233812932-59b8fa1b780c?w=400&h=500&fit=crop', 'Black',        '#2A2A2A', 'Fall',       'Smart-casual', 'Heavy',       ARRAY['Goes with everything','Fall staple'],       11, now() - interval '20 days'),
  (_demo_uuid('wi',11), demo_uid, 'Ribbed White Tank',           'Tops',        'https://images.unsplash.com/photo-1630994531192-3af0be5ca749?w=400&h=500&fit=crop', 'White',        '#FAFAFA', 'Summer',     'Casual',       'Lightweight', ARRAY['Everyday','Layering piece'],                14, now() - interval '8 days'),
  (_demo_uuid('wi',12), demo_uid, 'Navy Blazer',                 'Outerwear',   'https://images.unsplash.com/photo-1762793193633-c26f3d34e710?w=400&h=500&fit=crop', 'Navy',         '#2C3E6B', 'All-season', 'Formal',       'Midweight',   ARRAY['Work-ready','Classic'],                     7,  now() - interval '30 days'),
  (_demo_uuid('wi',13), demo_uid, 'Olive Cargo Pants',           'Bottoms',     'https://images.unsplash.com/photo-1644955734676-9f24f7d4f929?w=400&h=500&fit=crop', 'Olive',        '#6B7B3F', 'All-season', 'Casual',       'Midweight',   ARRAY['Weekend vibes','Travel-friendly'],          6,  now() - interval '12 days'),
  (_demo_uuid('wi',14), demo_uid, 'Gold Hoop Earrings',          'Accessories', 'https://images.unsplash.com/photo-1708221269367-ce41b47449d2?w=400&h=500&fit=crop', 'Gold',         '#D4A843', 'All-season', 'Smart-casual', 'Lightweight', ARRAY['Everyday','Favorite'],                      16, now() - interval '45 days'),
  (_demo_uuid('wi',15), demo_uid, 'Strappy Block Heels',         'Shoes',       'https://images.unsplash.com/photo-1770757685000-c80e45122986?w=400&h=500&fit=crop', 'Nude',         '#D4B5A0', 'All-season', 'Formal',       'Midweight',   ARRAY['Date night staple','Special occasion'],     2,  now() - interval '25 days'),
  (_demo_uuid('wi',16), demo_uid, 'Oversized Knit Cardigan',     'Outerwear',   'https://images.unsplash.com/photo-1571703930740-5d85c31aea8b?w=400&h=500&fit=crop', 'Oatmeal',      '#D8CCBA', 'Fall',       'Casual',       'Heavy',       ARRAY['Cozy','Layering piece'],                    5,  now() - interval '9 days'),
  (_demo_uuid('wi',17), demo_uid, 'Little Black Dress',          'Dresses',     'https://images.unsplash.com/photo-1555685885-81b8bd9edf70?w=400&h=500&fit=crop', 'Black',        '#1A1A1A', 'All-season', 'Formal',       'Midweight',   ARRAY['Classic','Date night staple','Favorite'],   4,  now() - interval '40 days'),
  (_demo_uuid('wi',18), demo_uid, 'Wide-Brim Straw Hat',         'Accessories', 'https://images.unsplash.com/photo-1767428828092-0ba4f6d48b33?w=400&h=500&fit=crop', 'Natural',      '#D9C9A8', 'Summer',     'Casual',       'Lightweight', ARRAY['Vacation','Beach day'],                     1,  now() - interval '15 days'),
  (_demo_uuid('wi',19), demo_uid, 'Pleated Midi Trousers',       'Bottoms',     'https://images.unsplash.com/photo-1523654999808-59842135e652?w=400&h=500&fit=crop', 'Charcoal',     '#4A4A4A', 'All-season', 'Formal',       'Midweight',   ARRAY['Work-ready','Classic'],                     8,  now() - interval '18 days'),
  (_demo_uuid('wi',20), demo_uid, 'Cropped Striped Tee',         'Tops',        'https://images.unsplash.com/photo-1687806301973-60ce61802d5f?w=400&h=500&fit=crop', 'Navy/White',   '#2C3E6B', 'Summer',     'Casual',       'Lightweight', ARRAY['Weekend vibes','Everyday'],                 9,  now() - interval '11 days'),
  (_demo_uuid('wi',21), demo_uid, 'Satin Slip Dress',            'Dresses',     'https://images.unsplash.com/photo-1750064159040-c37883f82014?w=400&h=500&fit=crop', 'Champagne',    '#E8D5B7', 'All-season', 'Formal',       'Lightweight', ARRAY['Special occasion','Date night staple'],     1,  now() - interval '22 days'),
  (_demo_uuid('wi',22), demo_uid, 'Woven Crossbody Bag',         'Accessories', 'https://images.unsplash.com/photo-1527383214149-cb7be04ae387?w=400&h=500&fit=crop', 'Brown',        '#8B6F4E', 'All-season', 'Casual',       'Midweight',   ARRAY['Everyday','Travel-friendly'],               13, now() - interval '35 days'),
  (_demo_uuid('wi',23), demo_uid, 'Puffer Vest',                 'Outerwear',   'https://images.unsplash.com/photo-1599663252920-827a898e55d2?w=400&h=500&fit=crop', 'Forest Green', '#3A5F40', 'Winter',     'Casual',       'Midweight',   ARRAY['Layering piece','Travel-friendly'],         0,  now() - interval '28 days'),
  (_demo_uuid('wi',24), demo_uid, 'Leather Belt',                'Accessories', 'https://images.unsplash.com/photo-1565251419287-9097aa7299ec?w=400&h=500&fit=crop', 'Cognac',       '#9A5C30', 'All-season', 'Smart-casual', 'Midweight',   ARRAY['Classic','Goes with everything'],           10, now() - interval '50 days'),
  (_demo_uuid('wi',25), demo_uid, 'High-Waisted Denim Shorts',   'Bottoms',     'https://images.unsplash.com/photo-1607862111566-748bcc7be5ee?w=400&h=500&fit=crop', 'Light Wash',   '#A8C4D4', 'Summer',     'Casual',       'Lightweight', ARRAY['Weekend vibes','Vacation'],                 3,  now() - interval '16 days');

  -- ════════════════════════════════════════════════════════════
  -- OUTFITS: Manual (1-4), AI Saved (5-11), Chat (12-13)
  -- ════════════════════════════════════════════════════════════
  INSERT INTO outfits (id, user_id, name, description, occasion, source, is_saved, created_at) VALUES
  -- Manual outfits
  (_demo_uuid('o',1),  demo_uid, 'Casual Friday',                      'A relaxed yet polished look — the linen blouse keeps it light, and the denim jacket adds a casual layer. Finished with clean white sneakers for effortless weekend energy.',            'Weekend',    'manual',     true,  '2026-03-18T12:00:00Z'),
  (_demo_uuid('o',2),  demo_uid, 'Date Night at the Italian Place',    'The little black dress paired with strappy heels and gold hoops — classic, confident, and effortlessly elegant for a candlelit dinner.',                                                    'Date Night', 'manual',     true,  '2026-03-15T19:00:00Z'),
  (_demo_uuid('o',3),  demo_uid, 'Monday Morning Meeting',             'The navy blazer over a ribbed tank tucked into pleated trousers. A structured look that means business without feeling stuffy.',                                                             'Work',       'manual',     true,  '2026-03-12T08:00:00Z'),
  (_demo_uuid('o',4),  demo_uid, 'Farmers Market Stroll',              'The floral wrap dress with white sneakers and a woven crossbody — feminine and easy, perfect for a sunny Saturday morning.',                                                                 'Casual',     'manual',     true,  '2026-03-10T10:00:00Z'),
  -- AI Stylist saved outfits
  (_demo_uuid('o',5),  demo_uid, 'Effortless Brunch Look',             'A relaxed linen top paired with the sage midi skirt and white sneakers — easy and put-together. The woven crossbody bag ties the earthy tones together perfectly.',                          'Casual',     'ai_stylist', true,  '2026-03-18T10:00:00Z'),
  (_demo_uuid('o',6),  demo_uid, 'Power Meeting',                      'The navy blazer instantly elevates the ribbed tank. Paired with pleated trousers and ankle boots, this look commands attention while staying comfortable for a long day.',                   'Work',       'ai_stylist', true,  '2026-03-16T09:00:00Z'),
  (_demo_uuid('o',7),  demo_uid, 'Sunset Date Night',                  'The little black dress is a timeless choice. Add strappy block heels for height and gold hoops for a warm, elegant touch. Understated glamour at its best.',                                'Date Night', 'ai_stylist', true,  '2026-03-14T18:00:00Z'),
  (_demo_uuid('o',8),  demo_uid, 'Cozy Coffee Run',                    'The cashmere sweater layered under the oversized cardigan makes this the ultimate cozy outfit. Black jeans ground the warm tones, and white sneakers keep it easygoing.',                   'Casual',     'ai_stylist', true,  '2026-03-12T11:00:00Z'),
  (_demo_uuid('o',9),  demo_uid, 'City Explorer',                      'The striped tee and cargo pants are a classic adventure combo. The denim jacket handles temperature swings, and the crossbody bag keeps your hands free for exploring.',                     'Travel',     'ai_stylist', true,  '2026-03-10T09:00:00Z'),
  (_demo_uuid('o',10), demo_uid, 'Evening Elegance',                   'The satin slip dress drapes beautifully and catches the light. A cognac belt cinches the waist, while gold hoops and nude heels complete this sophisticated evening look.',                  'Date Night', 'ai_stylist', true,  '2026-03-08T19:00:00Z'),
  (_demo_uuid('o',11), demo_uid, 'Weekend Farmers Market',             'The floral wrap dress is the star here — feminine and effortless. White sneakers keep it comfortable for walking, the straw hat adds charm, and the crossbody bag is perfect for carrying your finds.', 'Casual', 'ai_stylist', true,  '2026-03-05T10:00:00Z'),
  -- Chat outfits (not saved, referenced by stylist messages)
  (_demo_uuid('o',12), demo_uid, 'Candlelit Dinner',                   'The little black dress is a timeless choice for Italian dining. Strappy block heels add just enough height, and gold hoops bring a warm, elegant touch. Classy without overdoing it.',    'Date Night', 'ai_stylist', false, '2026-03-19T14:00:00Z'),
  (_demo_uuid('o',13), demo_uid, 'Candlelit Dinner (Walkable Edit)',   'Same gorgeous LBD, but now with your white leather sneakers for a chic, walkable look. The gold hoops still bring the elegance, and I added the woven crossbody bag so you have your hands free on the stroll there.', 'Date Night', 'ai_stylist', false, '2026-03-19T14:05:00Z');

  -- ════════════════════════════════════════════════════════════
  -- OUTFIT ITEMS (junction)
  -- ════════════════════════════════════════════════════════════
  INSERT INTO outfit_items (outfit_id, item_id, position) VALUES
  -- Outfit 1: Casual Friday [1,2,5,7]
  (_demo_uuid('o',1), _demo_uuid('wi',1),  0),
  (_demo_uuid('o',1), _demo_uuid('wi',2),  1),
  (_demo_uuid('o',1), _demo_uuid('wi',5),  2),
  (_demo_uuid('o',1), _demo_uuid('wi',7),  3),
  -- Outfit 2: Date Night [17,15,14]
  (_demo_uuid('o',2), _demo_uuid('wi',17), 0),
  (_demo_uuid('o',2), _demo_uuid('wi',15), 1),
  (_demo_uuid('o',2), _demo_uuid('wi',14), 2),
  -- Outfit 3: Monday Morning Meeting [12,11,19,10]
  (_demo_uuid('o',3), _demo_uuid('wi',12), 0),
  (_demo_uuid('o',3), _demo_uuid('wi',11), 1),
  (_demo_uuid('o',3), _demo_uuid('wi',19), 2),
  (_demo_uuid('o',3), _demo_uuid('wi',10), 3),
  -- Outfit 4: Farmers Market Stroll [8,5,22,18]
  (_demo_uuid('o',4), _demo_uuid('wi',8),  0),
  (_demo_uuid('o',4), _demo_uuid('wi',5),  1),
  (_demo_uuid('o',4), _demo_uuid('wi',22), 2),
  (_demo_uuid('o',4), _demo_uuid('wi',18), 3),
  -- Outfit 5: Effortless Brunch Look [1,3,5,22]
  (_demo_uuid('o',5), _demo_uuid('wi',1),  0),
  (_demo_uuid('o',5), _demo_uuid('wi',3),  1),
  (_demo_uuid('o',5), _demo_uuid('wi',5),  2),
  (_demo_uuid('o',5), _demo_uuid('wi',22), 3),
  -- Outfit 6: Power Meeting [12,11,19,10]
  (_demo_uuid('o',6), _demo_uuid('wi',12), 0),
  (_demo_uuid('o',6), _demo_uuid('wi',11), 1),
  (_demo_uuid('o',6), _demo_uuid('wi',19), 2),
  (_demo_uuid('o',6), _demo_uuid('wi',10), 3),
  -- Outfit 7: Sunset Date Night [17,15,14]
  (_demo_uuid('o',7), _demo_uuid('wi',17), 0),
  (_demo_uuid('o',7), _demo_uuid('wi',15), 1),
  (_demo_uuid('o',7), _demo_uuid('wi',14), 2),
  -- Outfit 8: Cozy Coffee Run [4,2,5,16]
  (_demo_uuid('o',8), _demo_uuid('wi',4),  0),
  (_demo_uuid('o',8), _demo_uuid('wi',2),  1),
  (_demo_uuid('o',8), _demo_uuid('wi',5),  2),
  (_demo_uuid('o',8), _demo_uuid('wi',16), 3),
  -- Outfit 9: City Explorer [20,13,5,7,22]
  (_demo_uuid('o',9), _demo_uuid('wi',20), 0),
  (_demo_uuid('o',9), _demo_uuid('wi',13), 1),
  (_demo_uuid('o',9), _demo_uuid('wi',5),  2),
  (_demo_uuid('o',9), _demo_uuid('wi',7),  3),
  (_demo_uuid('o',9), _demo_uuid('wi',22), 4),
  -- Outfit 10: Evening Elegance [21,15,14,24]
  (_demo_uuid('o',10), _demo_uuid('wi',21), 0),
  (_demo_uuid('o',10), _demo_uuid('wi',15), 1),
  (_demo_uuid('o',10), _demo_uuid('wi',14), 2),
  (_demo_uuid('o',10), _demo_uuid('wi',24), 3),
  -- Outfit 11: Weekend Farmers Market [8,5,22,18]
  (_demo_uuid('o',11), _demo_uuid('wi',8),  0),
  (_demo_uuid('o',11), _demo_uuid('wi',5),  1),
  (_demo_uuid('o',11), _demo_uuid('wi',22), 2),
  (_demo_uuid('o',11), _demo_uuid('wi',18), 3),
  -- Outfit 12: Candlelit Dinner [17,15,14]
  (_demo_uuid('o',12), _demo_uuid('wi',17), 0),
  (_demo_uuid('o',12), _demo_uuid('wi',15), 1),
  (_demo_uuid('o',12), _demo_uuid('wi',14), 2),
  -- Outfit 13: Candlelit Dinner Walkable [17,5,14,22]
  (_demo_uuid('o',13), _demo_uuid('wi',17), 0),
  (_demo_uuid('o',13), _demo_uuid('wi',5),  1),
  (_demo_uuid('o',13), _demo_uuid('wi',14), 2),
  (_demo_uuid('o',13), _demo_uuid('wi',22), 3);

  -- ════════════════════════════════════════════════════════════
  -- TRIPS (3)
  -- ════════════════════════════════════════════════════════════
  INSERT INTO trips (id, user_id, name, destination, cover_image_url, start_date, end_date, weather_summary, weather_high, weather_low, luggage_type, activities) VALUES
  (_demo_uuid('tr',1), demo_uid, 'Weekend in Austin',      'Austin, TX',            'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=600&h=400&fit=crop', '2026-04-04', '2026-04-06', E'72\u201385\u00B0F, mostly sunny',    85, 72, 'carry-on',         ARRAY['Sightseeing','Dining out','Nightlife']),
  (_demo_uuid('tr',2), demo_uid, 'Thailand Backpacking',   'Bangkok & Chiang Mai',  'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop', '2026-05-10', '2026-05-20', E'82\u201395\u00B0F, humid with rain',  95, 82, 'backpack',         ARRAY['Sightseeing','Beach','Hiking','Dining out','Nightlife']),
  (_demo_uuid('tr',3), demo_uid, 'NYC Work Trip',          'New York City',         'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop', '2026-04-20', '2026-04-23', E'55\u201365\u00B0F, partly cloudy',    65, 55, 'carry-on-checked', ARRAY['Business meetings','Dining out','Sightseeing']);

  -- ════════════════════════════════════════════════════════════
  -- TRIP DAYS (17)
  -- ════════════════════════════════════════════════════════════
  INSERT INTO trip_days (id, trip_id, day_number, label, activity, outfit_name) VALUES
  -- Trip 1: Austin (3 days)
  (_demo_uuid('td',1),  _demo_uuid('tr',1), 1,  'Arrival & Dinner',          'Dining out',         'Effortless Evening'),
  (_demo_uuid('td',2),  _demo_uuid('tr',1), 2,  'Exploring South Congress',  'Sightseeing',        'City Explorer'),
  (_demo_uuid('td',3),  _demo_uuid('tr',1), 3,  'Brunch & Departure',        'Dining out',         'Casual Brunch'),
  -- Trip 2: Thailand (10 days)
  (_demo_uuid('td',4),  _demo_uuid('tr',2), 1,  'Arrival in Bangkok',        'Sightseeing',        'Temple Explorer'),
  (_demo_uuid('td',5),  _demo_uuid('tr',2), 2,  'Grand Palace & Markets',    'Sightseeing',        'Market Wanderer'),
  (_demo_uuid('td',6),  _demo_uuid('tr',2), 3,  'Bangkok Street Food Tour',  'Dining out',         'Casual Foodie'),
  (_demo_uuid('td',7),  _demo_uuid('tr',2), 4,  'Travel to Chiang Mai',      'Sightseeing',        'Travel Comfort'),
  (_demo_uuid('td',8),  _demo_uuid('tr',2), 5,  'Doi Suthep Hike',           'Hiking',             'Trail Ready'),
  (_demo_uuid('td',9),  _demo_uuid('tr',2), 6,  'Old City Temples',          'Sightseeing',        'Temple Day'),
  (_demo_uuid('td',10), _demo_uuid('tr',2), 7,  'Cooking Class',             'Dining out',         'Kitchen Ready'),
  (_demo_uuid('td',11), _demo_uuid('tr',2), 8,  'Night Bazaar',              'Nightlife',          'Bazaar Night'),
  (_demo_uuid('td',12), _demo_uuid('tr',2), 9,  'Elephant Sanctuary',        'Sightseeing',        'Nature Day'),
  (_demo_uuid('td',13), _demo_uuid('tr',2), 10, 'Departure Day',             'Sightseeing',        'Comfy Departure'),
  -- Trip 3: NYC (4 days)
  (_demo_uuid('td',14), _demo_uuid('tr',3), 1,  'Client Meeting',            'Business meetings',  'Power Meeting'),
  (_demo_uuid('td',15), _demo_uuid('tr',3), 2,  'Presentations & Lunch',     'Business meetings',  'Polished Professional'),
  (_demo_uuid('td',16), _demo_uuid('tr',3), 3,  'Free Afternoon & Dinner',   'Dining out',         'Off-Duty Chic'),
  (_demo_uuid('td',17), _demo_uuid('tr',3), 4,  'Morning Walk & Departure',  'Sightseeing',        'Comfy Travel');

  -- ════════════════════════════════════════════════════════════
  -- TRIP DAY ITEMS (junction)
  -- ════════════════════════════════════════════════════════════
  INSERT INTO trip_day_items (trip_day_id, item_id) VALUES
  -- td1: [6,3,15,14]
  (_demo_uuid('td',1), _demo_uuid('wi',6)),  (_demo_uuid('td',1), _demo_uuid('wi',3)),
  (_demo_uuid('td',1), _demo_uuid('wi',15)), (_demo_uuid('td',1), _demo_uuid('wi',14)),
  -- td2: [20,25,5,22]
  (_demo_uuid('td',2), _demo_uuid('wi',20)), (_demo_uuid('td',2), _demo_uuid('wi',25)),
  (_demo_uuid('td',2), _demo_uuid('wi',5)),  (_demo_uuid('td',2), _demo_uuid('wi',22)),
  -- td3: [1,2,5]
  (_demo_uuid('td',3), _demo_uuid('wi',1)),  (_demo_uuid('td',3), _demo_uuid('wi',2)),
  (_demo_uuid('td',3), _demo_uuid('wi',5)),
  -- td4: [11,13,5]
  (_demo_uuid('td',4), _demo_uuid('wi',11)), (_demo_uuid('td',4), _demo_uuid('wi',13)),
  (_demo_uuid('td',4), _demo_uuid('wi',5)),
  -- td5: [20,25,5,18]
  (_demo_uuid('td',5), _demo_uuid('wi',20)), (_demo_uuid('td',5), _demo_uuid('wi',25)),
  (_demo_uuid('td',5), _demo_uuid('wi',5)),  (_demo_uuid('td',5), _demo_uuid('wi',18)),
  -- td6: [1,25,5]
  (_demo_uuid('td',6), _demo_uuid('wi',1)),  (_demo_uuid('td',6), _demo_uuid('wi',25)),
  (_demo_uuid('td',6), _demo_uuid('wi',5)),
  -- td7: [11,2,5,22]
  (_demo_uuid('td',7), _demo_uuid('wi',11)), (_demo_uuid('td',7), _demo_uuid('wi',2)),
  (_demo_uuid('td',7), _demo_uuid('wi',5)),  (_demo_uuid('td',7), _demo_uuid('wi',22)),
  -- td8: [20,13,5]
  (_demo_uuid('td',8), _demo_uuid('wi',20)), (_demo_uuid('td',8), _demo_uuid('wi',13)),
  (_demo_uuid('td',8), _demo_uuid('wi',5)),
  -- td9: [1,13,5,18]
  (_demo_uuid('td',9), _demo_uuid('wi',1)),  (_demo_uuid('td',9), _demo_uuid('wi',13)),
  (_demo_uuid('td',9), _demo_uuid('wi',5)),  (_demo_uuid('td',9), _demo_uuid('wi',18)),
  -- td10: [11,25,5]
  (_demo_uuid('td',10), _demo_uuid('wi',11)), (_demo_uuid('td',10), _demo_uuid('wi',25)),
  (_demo_uuid('td',10), _demo_uuid('wi',5)),
  -- td11: [6,2,5,14]
  (_demo_uuid('td',11), _demo_uuid('wi',6)),  (_demo_uuid('td',11), _demo_uuid('wi',2)),
  (_demo_uuid('td',11), _demo_uuid('wi',5)),  (_demo_uuid('td',11), _demo_uuid('wi',14)),
  -- td12: [20,13,5,22]
  (_demo_uuid('td',12), _demo_uuid('wi',20)), (_demo_uuid('td',12), _demo_uuid('wi',13)),
  (_demo_uuid('td',12), _demo_uuid('wi',5)),  (_demo_uuid('td',12), _demo_uuid('wi',22)),
  -- td13: [11,2,5]
  (_demo_uuid('td',13), _demo_uuid('wi',11)), (_demo_uuid('td',13), _demo_uuid('wi',2)),
  (_demo_uuid('td',13), _demo_uuid('wi',5)),
  -- td14: [12,11,19,10]
  (_demo_uuid('td',14), _demo_uuid('wi',12)), (_demo_uuid('td',14), _demo_uuid('wi',11)),
  (_demo_uuid('td',14), _demo_uuid('wi',19)), (_demo_uuid('td',14), _demo_uuid('wi',10)),
  -- td15: [4,19,10,24]
  (_demo_uuid('td',15), _demo_uuid('wi',4)),  (_demo_uuid('td',15), _demo_uuid('wi',19)),
  (_demo_uuid('td',15), _demo_uuid('wi',10)), (_demo_uuid('td',15), _demo_uuid('wi',24)),
  -- td16: [21,9,15,14]
  (_demo_uuid('td',16), _demo_uuid('wi',21)), (_demo_uuid('td',16), _demo_uuid('wi',9)),
  (_demo_uuid('td',16), _demo_uuid('wi',15)), (_demo_uuid('td',16), _demo_uuid('wi',14)),
  -- td17: [4,2,5,22]
  (_demo_uuid('td',17), _demo_uuid('wi',4)),  (_demo_uuid('td',17), _demo_uuid('wi',2)),
  (_demo_uuid('td',17), _demo_uuid('wi',5)),  (_demo_uuid('td',17), _demo_uuid('wi',22));

  -- ════════════════════════════════════════════════════════════
  -- PACKING LIST ITEMS (34)
  -- ════════════════════════════════════════════════════════════
  INSERT INTO packing_list_items (id, trip_id, item_id, category, packed) VALUES
  -- Trip 1: Austin (10 items)
  (gen_random_uuid(), _demo_uuid('tr',1), _demo_uuid('wi',6),  'Tops',        true),
  (gen_random_uuid(), _demo_uuid('tr',1), _demo_uuid('wi',20), 'Tops',        true),
  (gen_random_uuid(), _demo_uuid('tr',1), _demo_uuid('wi',1),  'Tops',        false),
  (gen_random_uuid(), _demo_uuid('tr',1), _demo_uuid('wi',3),  'Bottoms',     true),
  (gen_random_uuid(), _demo_uuid('tr',1), _demo_uuid('wi',25), 'Bottoms',     false),
  (gen_random_uuid(), _demo_uuid('tr',1), _demo_uuid('wi',2),  'Bottoms',     true),
  (gen_random_uuid(), _demo_uuid('tr',1), _demo_uuid('wi',15), 'Shoes',       true),
  (gen_random_uuid(), _demo_uuid('tr',1), _demo_uuid('wi',5),  'Shoes',       false),
  (gen_random_uuid(), _demo_uuid('tr',1), _demo_uuid('wi',14), 'Accessories', true),
  (gen_random_uuid(), _demo_uuid('tr',1), _demo_uuid('wi',22), 'Accessories', false),
  -- Trip 2: Thailand (11 items)
  (gen_random_uuid(), _demo_uuid('tr',2), _demo_uuid('wi',11), 'Tops',        true),
  (gen_random_uuid(), _demo_uuid('tr',2), _demo_uuid('wi',20), 'Tops',        true),
  (gen_random_uuid(), _demo_uuid('tr',2), _demo_uuid('wi',1),  'Tops',        false),
  (gen_random_uuid(), _demo_uuid('tr',2), _demo_uuid('wi',6),  'Tops',        false),
  (gen_random_uuid(), _demo_uuid('tr',2), _demo_uuid('wi',13), 'Bottoms',     true),
  (gen_random_uuid(), _demo_uuid('tr',2), _demo_uuid('wi',25), 'Bottoms',     true),
  (gen_random_uuid(), _demo_uuid('tr',2), _demo_uuid('wi',2),  'Bottoms',     false),
  (gen_random_uuid(), _demo_uuid('tr',2), _demo_uuid('wi',5),  'Shoes',       true),
  (gen_random_uuid(), _demo_uuid('tr',2), _demo_uuid('wi',18), 'Accessories', false),
  (gen_random_uuid(), _demo_uuid('tr',2), _demo_uuid('wi',22), 'Accessories', false),
  (gen_random_uuid(), _demo_uuid('tr',2), _demo_uuid('wi',14), 'Accessories', true),
  -- Trip 3: NYC (13 items)
  (gen_random_uuid(), _demo_uuid('tr',3), _demo_uuid('wi',12), 'Outerwear',   true),
  (gen_random_uuid(), _demo_uuid('tr',3), _demo_uuid('wi',9),  'Outerwear',   true),
  (gen_random_uuid(), _demo_uuid('tr',3), _demo_uuid('wi',11), 'Tops',        true),
  (gen_random_uuid(), _demo_uuid('tr',3), _demo_uuid('wi',4),  'Tops',        false),
  (gen_random_uuid(), _demo_uuid('tr',3), _demo_uuid('wi',21), 'Dresses',     false),
  (gen_random_uuid(), _demo_uuid('tr',3), _demo_uuid('wi',19), 'Bottoms',     true),
  (gen_random_uuid(), _demo_uuid('tr',3), _demo_uuid('wi',2),  'Bottoms',     false),
  (gen_random_uuid(), _demo_uuid('tr',3), _demo_uuid('wi',10), 'Shoes',       true),
  (gen_random_uuid(), _demo_uuid('tr',3), _demo_uuid('wi',15), 'Shoes',       false),
  (gen_random_uuid(), _demo_uuid('tr',3), _demo_uuid('wi',5),  'Shoes',       false),
  (gen_random_uuid(), _demo_uuid('tr',3), _demo_uuid('wi',14), 'Accessories', true),
  (gen_random_uuid(), _demo_uuid('tr',3), _demo_uuid('wi',24), 'Accessories', true),
  (gen_random_uuid(), _demo_uuid('tr',3), _demo_uuid('wi',22), 'Accessories', false);

  -- ════════════════════════════════════════════════════════════
  -- CALENDAR ENTRIES (28)
  -- ════════════════════════════════════════════════════════════
  INSERT INTO calendar_entries (id, user_id, date, outfit_name, occasion, mood, photo_url, weather_temp, weather_condition, weather_description) VALUES
  -- February 2026 (12 entries)
  (_demo_uuid('ce',1),  demo_uid, '2026-02-02', 'Monday Power Move',    'Work',          NULL,             NULL, 52, 'Cloudy',        E'Layer up \u2014 overcast and cool'),
  (_demo_uuid('ce',2),  demo_uid, '2026-02-04', 'Rainy Day Polish',     'Work',          'Determined',     NULL, 48, 'Rainy',         E'Grab an umbrella \u2014 steady drizzle'),
  (_demo_uuid('ce',3),  demo_uid, '2026-02-05', 'Warm & Grounded',      'Casual',        NULL,             NULL, 45, 'Cloudy',        E'Cool and gray \u2014 sweater weather'),
  (_demo_uuid('ce',4),  demo_uid, '2026-02-07', 'Saturday Night Out',   'Date Night',    'Felt glamorous', NULL, 50, 'Clear',         E'Cool and clear \u2014 bring a wrap'),
  (_demo_uuid('ce',5),  demo_uid, '2026-02-10', 'Cozy Commute',         'Work',          NULL,             NULL, 42, 'Cloudy',        E'Bundle up \u2014 chilly morning ahead'),
  (_demo_uuid('ce',6),  demo_uid, '2026-02-11', 'Unexpected Sunshine',  'Casual',        'Energized',      NULL, 55, 'Sunny',         E'Surprise warm spell \u2014 enjoy it'),
  (_demo_uuid('ce',7),  demo_uid, '2026-02-13', 'Friday Layers',        'Casual',        NULL,             NULL, 47, 'Rainy',         E'Light rain expected \u2014 layer smart'),
  (_demo_uuid('ce',8),  demo_uid, '2026-02-16', 'Silk & Structure',     'Work',          NULL,             NULL, 50, 'Cloudy',        'Overcast but mild'),
  (_demo_uuid('ce',9),  demo_uid, '2026-02-18', 'Midweek Easy',         'Casual',        NULL,             NULL, 58, 'Sunny',         E'Warm for February \u2014 light layers only'),
  (_demo_uuid('ce',10), demo_uid, '2026-02-20', 'Trench Weather',       'Work',          'Put-together',   NULL, 44, 'Rainy',         E'Steady rain \u2014 trench coat day'),
  (_demo_uuid('ce',11), demo_uid, '2026-02-24', 'Errand Run Comfort',   'Casual',        NULL,             NULL, 52, 'Cloudy',        'Cool and breezy'),
  (_demo_uuid('ce',12), demo_uid, '2026-02-26', 'Gallery Opening',      'Special Event', 'Felt confident', NULL, 55, 'Clear',         E'Crisp evening \u2014 elegant weather'),
  -- March 2026 (16 entries)
  (_demo_uuid('ce',13), demo_uid, '2026-03-02', 'Fresh Start Monday',   'Work',          NULL,             NULL, 58, 'Cloudy',        'Mild start to the week'),
  (_demo_uuid('ce',14), demo_uid, '2026-03-03', 'Classic Commuter',     'Work',          NULL,             NULL, 55, 'Partly Cloudy', E'Sun peeking through \u2014 pleasant'),
  (_demo_uuid('ce',15), demo_uid, '2026-03-04', 'Cozy Cardigan Day',    'Casual',        NULL,             NULL, 50, 'Cloudy',        E'Cool and overcast \u2014 grab a layer'),
  (_demo_uuid('ce',16), demo_uid, '2026-03-05', 'Spring Preview',       'Casual',        'Adventurous',    NULL, 62, 'Sunny',         E'Warm and bright \u2014 feels like spring'),
  (_demo_uuid('ce',17), demo_uid, '2026-03-06', 'Casual Friday Ease',   'Casual',        NULL,             NULL, 54, 'Cloudy',        'Cool but comfortable'),
  (_demo_uuid('ce',18), demo_uid, '2026-03-08', 'Sunday Brunch Bloom',  'Special Event', 'Festive',        NULL, 65, 'Sunny',         E'Beautiful day \u2014 dress up and enjoy'),
  (_demo_uuid('ce',19), demo_uid, '2026-03-09', 'Boardroom Ready',      'Work',          NULL,             NULL, 58, 'Partly Cloudy', E'Comfortable \u2014 light blazer is perfect'),
  (_demo_uuid('ce',20), demo_uid, '2026-03-10', 'Market Morning',       'Casual',        'Relaxed',        NULL, 68, 'Sunny',         E'Gorgeous day \u2014 sun hat territory'),
  (_demo_uuid('ce',21), demo_uid, '2026-03-11', 'Midweek Reset',        'Casual',        NULL,             NULL, 56, 'Rainy',         E'Drizzly \u2014 stick with dark layers'),
  (_demo_uuid('ce',22), demo_uid, '2026-03-12', 'Presentation Day',     'Work',          'Focused',        NULL, 60, 'Cloudy',        'Overcast but mild'),
  (_demo_uuid('ce',23), demo_uid, '2026-03-13', 'TGIF Casual',          'Casual',        NULL,             NULL, 63, 'Sunny',         E'Sunny Friday \u2014 light and easy'),
  (_demo_uuid('ce',24), demo_uid, '2026-03-15', 'Candlelit Dinner',     'Date Night',    'Felt stunning',  NULL, 58, 'Clear',         E'Cool clear evening \u2014 classic LBD weather'),
  (_demo_uuid('ce',25), demo_uid, '2026-03-16', 'Clean Lines Monday',   'Work',          NULL,             NULL, 62, 'Partly Cloudy', 'Comfortable day ahead'),
  (_demo_uuid('ce',26), demo_uid, '2026-03-17', 'Olive & Easy',         'Casual',        'Laid-back',      NULL, 66, 'Sunny',         E'Warm and bright \u2014 spring is here'),
  (_demo_uuid('ce',27), demo_uid, '2026-03-18', 'Breezy Wednesday',     'Casual',        NULL,             NULL, 70, 'Sunny',         'Perfect for lightweight layers'),
  (_demo_uuid('ce',28), demo_uid, '2026-03-19', 'Thursday Structure',   'Work',          NULL,             NULL, 68, 'Partly Cloudy', 'Mild with a light breeze');

  -- ════════════════════════════════════════════════════════════
  -- CALENDAR ENTRY ITEMS (junction)
  -- ════════════════════════════════════════════════════════════
  INSERT INTO calendar_entry_items (calendar_entry_id, item_id) VALUES
  -- ce1: [12,11,19,10]
  (_demo_uuid('ce',1), _demo_uuid('wi',12)), (_demo_uuid('ce',1), _demo_uuid('wi',11)),
  (_demo_uuid('ce',1), _demo_uuid('wi',19)), (_demo_uuid('ce',1), _demo_uuid('wi',10)),
  -- ce2: [1,19,10,24]
  (_demo_uuid('ce',2), _demo_uuid('wi',1)),  (_demo_uuid('ce',2), _demo_uuid('wi',19)),
  (_demo_uuid('ce',2), _demo_uuid('wi',10)), (_demo_uuid('ce',2), _demo_uuid('wi',24)),
  -- ce3: [4,2,5]
  (_demo_uuid('ce',3), _demo_uuid('wi',4)),  (_demo_uuid('ce',3), _demo_uuid('wi',2)),
  (_demo_uuid('ce',3), _demo_uuid('wi',5)),
  -- ce4: [21,15,14]
  (_demo_uuid('ce',4), _demo_uuid('wi',21)), (_demo_uuid('ce',4), _demo_uuid('wi',15)),
  (_demo_uuid('ce',4), _demo_uuid('wi',14)),
  -- ce5: [4,19,10,24]
  (_demo_uuid('ce',5), _demo_uuid('wi',4)),  (_demo_uuid('ce',5), _demo_uuid('wi',19)),
  (_demo_uuid('ce',5), _demo_uuid('wi',10)), (_demo_uuid('ce',5), _demo_uuid('wi',24)),
  -- ce6: [20,2,7,5]
  (_demo_uuid('ce',6), _demo_uuid('wi',20)), (_demo_uuid('ce',6), _demo_uuid('wi',2)),
  (_demo_uuid('ce',6), _demo_uuid('wi',7)),  (_demo_uuid('ce',6), _demo_uuid('wi',5)),
  -- ce7: [1,2,7,22]
  (_demo_uuid('ce',7), _demo_uuid('wi',1)),  (_demo_uuid('ce',7), _demo_uuid('wi',2)),
  (_demo_uuid('ce',7), _demo_uuid('wi',7)),  (_demo_uuid('ce',7), _demo_uuid('wi',22)),
  -- ce8: [6,12,19,10]
  (_demo_uuid('ce',8), _demo_uuid('wi',6)),  (_demo_uuid('ce',8), _demo_uuid('wi',12)),
  (_demo_uuid('ce',8), _demo_uuid('wi',19)), (_demo_uuid('ce',8), _demo_uuid('wi',10)),
  -- ce9: [11,13,5,7]
  (_demo_uuid('ce',9), _demo_uuid('wi',11)), (_demo_uuid('ce',9), _demo_uuid('wi',13)),
  (_demo_uuid('ce',9), _demo_uuid('wi',5)),  (_demo_uuid('ce',9), _demo_uuid('wi',7)),
  -- ce10: [9,1,3,10]
  (_demo_uuid('ce',10), _demo_uuid('wi',9)),  (_demo_uuid('ce',10), _demo_uuid('wi',1)),
  (_demo_uuid('ce',10), _demo_uuid('wi',3)),  (_demo_uuid('ce',10), _demo_uuid('wi',10)),
  -- ce11: [4,2,5,22]
  (_demo_uuid('ce',11), _demo_uuid('wi',4)),  (_demo_uuid('ce',11), _demo_uuid('wi',2)),
  (_demo_uuid('ce',11), _demo_uuid('wi',5)),  (_demo_uuid('ce',11), _demo_uuid('wi',22)),
  -- ce12: [17,15,14,24]
  (_demo_uuid('ce',12), _demo_uuid('wi',17)), (_demo_uuid('ce',12), _demo_uuid('wi',15)),
  (_demo_uuid('ce',12), _demo_uuid('wi',14)), (_demo_uuid('ce',12), _demo_uuid('wi',24)),
  -- ce13: [12,11,19,10]
  (_demo_uuid('ce',13), _demo_uuid('wi',12)), (_demo_uuid('ce',13), _demo_uuid('wi',11)),
  (_demo_uuid('ce',13), _demo_uuid('wi',19)), (_demo_uuid('ce',13), _demo_uuid('wi',10)),
  -- ce14: [1,19,24,10]
  (_demo_uuid('ce',14), _demo_uuid('wi',1)),  (_demo_uuid('ce',14), _demo_uuid('wi',19)),
  (_demo_uuid('ce',14), _demo_uuid('wi',24)), (_demo_uuid('ce',14), _demo_uuid('wi',10)),
  -- ce15: [16,11,2,5]
  (_demo_uuid('ce',15), _demo_uuid('wi',16)), (_demo_uuid('ce',15), _demo_uuid('wi',11)),
  (_demo_uuid('ce',15), _demo_uuid('wi',2)),  (_demo_uuid('ce',15), _demo_uuid('wi',5)),
  -- ce16: [20,13,5,22]
  (_demo_uuid('ce',16), _demo_uuid('wi',20)), (_demo_uuid('ce',16), _demo_uuid('wi',13)),
  (_demo_uuid('ce',16), _demo_uuid('wi',5)),  (_demo_uuid('ce',16), _demo_uuid('wi',22)),
  -- ce17: [4,2,7,5]
  (_demo_uuid('ce',17), _demo_uuid('wi',4)),  (_demo_uuid('ce',17), _demo_uuid('wi',2)),
  (_demo_uuid('ce',17), _demo_uuid('wi',7)),  (_demo_uuid('ce',17), _demo_uuid('wi',5)),
  -- ce18: [8,15,14]
  (_demo_uuid('ce',18), _demo_uuid('wi',8)),  (_demo_uuid('ce',18), _demo_uuid('wi',15)),
  (_demo_uuid('ce',18), _demo_uuid('wi',14)),
  -- ce19: [6,12,3,10]
  (_demo_uuid('ce',19), _demo_uuid('wi',6)),  (_demo_uuid('ce',19), _demo_uuid('wi',12)),
  (_demo_uuid('ce',19), _demo_uuid('wi',3)),  (_demo_uuid('ce',19), _demo_uuid('wi',10)),
  -- ce20: [8,5,22,18]
  (_demo_uuid('ce',20), _demo_uuid('wi',8)),  (_demo_uuid('ce',20), _demo_uuid('wi',5)),
  (_demo_uuid('ce',20), _demo_uuid('wi',22)), (_demo_uuid('ce',20), _demo_uuid('wi',18)),
  -- ce21: [4,13,10,22]
  (_demo_uuid('ce',21), _demo_uuid('wi',4)),  (_demo_uuid('ce',21), _demo_uuid('wi',13)),
  (_demo_uuid('ce',21), _demo_uuid('wi',10)), (_demo_uuid('ce',21), _demo_uuid('wi',22)),
  -- ce22: [12,11,19,10]
  (_demo_uuid('ce',22), _demo_uuid('wi',12)), (_demo_uuid('ce',22), _demo_uuid('wi',11)),
  (_demo_uuid('ce',22), _demo_uuid('wi',19)), (_demo_uuid('ce',22), _demo_uuid('wi',10)),
  -- ce23: [11,2,7,5]
  (_demo_uuid('ce',23), _demo_uuid('wi',11)), (_demo_uuid('ce',23), _demo_uuid('wi',2)),
  (_demo_uuid('ce',23), _demo_uuid('wi',7)),  (_demo_uuid('ce',23), _demo_uuid('wi',5)),
  -- ce24: [17,15,14]
  (_demo_uuid('ce',24), _demo_uuid('wi',17)), (_demo_uuid('ce',24), _demo_uuid('wi',15)),
  (_demo_uuid('ce',24), _demo_uuid('wi',14)),
  -- ce25: [12,1,19,10]
  (_demo_uuid('ce',25), _demo_uuid('wi',12)), (_demo_uuid('ce',25), _demo_uuid('wi',1)),
  (_demo_uuid('ce',25), _demo_uuid('wi',19)), (_demo_uuid('ce',25), _demo_uuid('wi',10)),
  -- ce26: [20,13,5,22]
  (_demo_uuid('ce',26), _demo_uuid('wi',20)), (_demo_uuid('ce',26), _demo_uuid('wi',13)),
  (_demo_uuid('ce',26), _demo_uuid('wi',5)),  (_demo_uuid('ce',26), _demo_uuid('wi',22)),
  -- ce27: [1,2,5,7]
  (_demo_uuid('ce',27), _demo_uuid('wi',1)),  (_demo_uuid('ce',27), _demo_uuid('wi',2)),
  (_demo_uuid('ce',27), _demo_uuid('wi',5)),  (_demo_uuid('ce',27), _demo_uuid('wi',7)),
  -- ce28: [6,3,10,14]
  (_demo_uuid('ce',28), _demo_uuid('wi',6)),  (_demo_uuid('ce',28), _demo_uuid('wi',3)),
  (_demo_uuid('ce',28), _demo_uuid('wi',10)), (_demo_uuid('ce',28), _demo_uuid('wi',14));

  -- ════════════════════════════════════════════════════════════
  -- STYLIST CONVERSATION + MESSAGES
  -- ════════════════════════════════════════════════════════════
  INSERT INTO stylist_conversations (id, user_id, created_at)
  VALUES (_demo_uuid('cv',1), demo_uid, '2026-03-19T14:00:00Z');

  INSERT INTO stylist_messages (id, conversation_id, sender, type, content, outfit_id, created_at) VALUES
  (gen_random_uuid(), _demo_uuid('cv',1), 'user', 'text',   'I have a dinner date tonight at a nice Italian restaurant. Something classy but not overdressed.', NULL,                  '2026-03-19T14:00:01Z'),
  (gen_random_uuid(), _demo_uuid('cv',1), 'ai',   'text',   E'Great taste! A nice Italian dinner calls for something elegant yet relaxed \u2014 you want to look effortlessly put-together, not like you\u2019re trying too hard. Let me pull together something from your wardrobe.', NULL, '2026-03-19T14:00:05Z'),
  (gen_random_uuid(), _demo_uuid('cv',1), 'ai',   'outfit', '',                                                                                                                      _demo_uuid('o',12),    '2026-03-19T14:00:06Z'),
  (gen_random_uuid(), _demo_uuid('cv',1), 'user', 'text',   E'Love it, but can you swap the heels for flats? I\u2019ll be walking to the restaurant.',                                NULL,                  '2026-03-19T14:01:00Z'),
  (gen_random_uuid(), _demo_uuid('cv',1), 'ai',   'text',   'Of course! Walking in heels is no fun. Let me switch those out for something comfortable while keeping the same vibe.',   NULL,                  '2026-03-19T14:01:05Z'),
  (gen_random_uuid(), _demo_uuid('cv',1), 'ai',   'outfit', '',                                                                                                                      _demo_uuid('o',13),    '2026-03-19T14:01:06Z');

  RAISE NOTICE 'Demo account reset complete for user %', demo_uid;
END;
$fn$;

-- ============================================================
-- 3. Schedule nightly reset via pg_cron (if available)
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'reset-demo-account',
      '0 3 * * *',
      'SELECT public.reset_demo_account()'
    );
    RAISE NOTICE 'Scheduled nightly demo reset at 3:00 AM UTC';
  ELSE
    RAISE NOTICE 'pg_cron extension not found. Enable it in the Supabase dashboard and run: SELECT cron.schedule(''reset-demo-account'', ''0 3 * * *'', ''SELECT public.reset_demo_account()'');';
  END IF;
END;
$$;
