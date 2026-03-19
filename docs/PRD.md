# Kaitlyn's Kloset — Product Requirements Document (Frontend)

**Version:** 1.0
**Date:** March 19, 2026
**Scope:** Frontend UI only — no backend, database, APIs, or deployment

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Data:** All screens use hardcoded placeholder/mock data (realistic names, images from picsum.photos or unsplash placeholders, representative numbers)

---

## Information Architecture

```
Home (Dashboard)
├── My Wardrobe
│   ├── Gallery (grid of all items)
│   ├── Item Detail (single item view)
│   └── Add Item (upload flow)
├── Outfit Stylist (AI chat interface)
│   ├── Chat conversation
│   └── Saved Outfits gallery
├── Trip Planner
│   ├── Trip list
│   ├── New Trip form
│   └── Trip detail (day-by-day packing view)
└── Profile & Insights
    ├── Wardrobe stats & gap analysis
    └── Settings
```

---

## Build Phases

### Phase 1 — Project Setup, App Shell, Navigation & Home Screen

**Goal:** Stand up the project, establish the visual identity, and build the persistent layout that every other screen lives inside. After this phase, a user can open the app and see a polished home screen with working navigation to placeholder pages.

#### What to build

**Project initialization**
- Create a Next.js project with the App Router
- Install and configure Tailwind CSS
- Install Lucide React for icons
- Set up the base folder structure (`app/`, `components/`, `lib/`, `data/`)

**Global design tokens and styling**
- Color palette: soft, warm tones — a muted rose or blush accent color against warm off-white backgrounds, with dark charcoal text. The feel should be feminine, modern, and calm (think Glossier or Aritzia).
- Typography: clean sans-serif (Inter or similar via Google Fonts). Clear hierarchy — large bold headings, medium subheadings, comfortable body text.
- Spacing and radius: generous whitespace, softly rounded corners on cards and buttons.
- Consistent component primitives: card, button, badge, avatar, input field.

**App shell and layout**
- Mobile-first responsive layout
- Bottom navigation bar (mobile) with icons and labels for: Home, Wardrobe, Stylist, Trips, Profile
- On larger screens, the nav becomes a left sidebar
- Persistent top header with the app name/logo and a minimal action area (notifications icon placeholder, avatar)

**Home screen (`/`)**
- Greeting section: "Good morning, Kaitlyn" with the current date
- Quick-action cards: "Plan an outfit," "Start packing," "Add to wardrobe" — each links to the relevant section
- "Recently added" row: horizontal scroll of 4–6 clothing item thumbnail cards (mock data)
- "Outfit of the day" card: a single styled outfit suggestion card with 3–4 item thumbnails composed together, a title ("Casual Friday"), and a short description (mock data)
- "Wardrobe at a glance" stat bar: small counters showing total items, number of categories, items added this month (mock numbers)

**Placeholder pages**
- `/wardrobe` — heading + "Coming in Phase 2" message
- `/stylist` — heading + "Coming in Phase 3" message
- `/trips` — heading + "Coming in Phase 4" message
- `/profile` — heading + "Coming in Phase 4" message

#### Mock data needed
- 6–8 clothing item objects with: name, category, image URL (use picsum.photos or unsplash fashion/clothing images), color, season tag
- 1 sample outfit object with a name, description, and array of 3–4 item references

---

### Phase 2 — Digital Wardrobe

**Goal:** Build the core wardrobe management screens — the browsable gallery, item detail view, and the add-item flow. After this phase, a user can browse a realistic-looking closet, tap into item details, and walk through the flow of adding a new piece.

#### Screens and components

**Wardrobe Gallery (`/wardrobe`)**
- Category filter bar at the top: horizontal scrollable pill buttons for All, Tops, Bottoms, Dresses, Outerwear, Shoes, Accessories
- Grid of item cards (2 columns on mobile, 3–4 on desktop)
  - Each card shows: item image (square, slightly rounded), item name below, category badge, and a small color dot
  - Tapping a card navigates to the item detail view
- Search bar at the top with a text input and filter icon
- Sort dropdown: "Recently added," "Category," "Color," "Season"
- Floating action button (bottom-right on mobile): "+" icon to add a new item
- Empty state message if a filtered category has no items (won't occur with mock data, but the component should exist)

**Item Detail (`/wardrobe/[id]`)**
- Large hero image of the item (fills the top half of the screen on mobile)
- Back button to return to the gallery
- Item name as heading
- Metadata section displayed as labeled chips/tags:
  - Category (e.g., "Tops")
  - Color (with a small color swatch)
  - Season (e.g., "Summer," "All-season")
  - Formality (e.g., "Casual," "Smart-casual")
  - Fabric weight (e.g., "Lightweight")
  - Custom tags (e.g., "Favorite," "Date night staple")
- "Outfits with this item" section: horizontal scroll of 2–3 outfit cards that include this piece (mock data)
- Action buttons: "Edit" (opens edit state, does not need to function), "Delete" (shows a confirmation dialog, does not need to actually delete)

**Add Item Flow (`/wardrobe/add`)**
- Step 1 — Photo: large upload area with a dashed border, camera icon, and "Tap to upload a photo" label. Below it, a small "Choose from gallery" text link. When "tapped," show a mock preview image in the upload area (hardcoded swap).
- Step 2 — Details: form fields for item name (text input), category (dropdown), color (color picker or preset swatches), season (multi-select chips), formality (single-select chips), custom tags (text input that creates tag chips)
- Step 3 — Review: summary card showing the photo, all entered details, and a "Save to Wardrobe" button
- Progress indicator across the top showing the current step (1, 2, 3)
- "Back" and "Next" navigation between steps
- On "Save," show a brief success toast/message and redirect to the wardrobe gallery

#### Mock data needed
- 20–25 clothing items spread across all categories, each with: id, name, image URL, category, color, colorHex, season, formality, fabricWeight, tags array
- 3–4 outfit objects that reference item IDs, to populate the "Outfits with this item" section

---

### Phase 3 — AI Outfit Stylist

**Goal:** Build the conversational AI stylist interface and the saved outfits gallery. After this phase, a user can see a realistic chat experience with outfit suggestions rendered as visual cards, and browse previously saved outfits.

#### Screens and components

**Stylist Chat (`/stylist`)**
- Full-screen chat interface styled similarly to a messaging app (think iMessage or WhatsApp)
- Top bar: "AI Stylist" title with a sparkle/magic icon
- Message thread area (scrollable):
  - User messages: right-aligned bubbles in the accent color with white text
  - AI messages: left-aligned bubbles in a light neutral with dark text
  - AI outfit suggestion cards (inline within the chat): a special card component that displays:
    - Outfit name (e.g., "Effortless Brunch Look")
    - A grid or row of 3–5 item thumbnail images representing the outfit
    - Brief explanation text ("A relaxed linen top paired with high-waisted jeans and white sneakers — easy and put-together.")
    - Action row: "Save outfit" heart icon button, "Try another" refresh icon button, thumbs up/down feedback buttons
- Input area at the bottom:
  - Text input with placeholder: "Describe your occasion, mood, or ask for ideas..."
  - Send button
  - Quick-context chips above the input (tappable pills): "Date night," "Work," "Casual," "Going out," "Travel day"
  - Tapping a chip populates the input with a starter message (e.g., "I need an outfit for date night")
- Pre-populated mock conversation on first load showing:
  1. A user message: "I have a dinner date tonight at a nice Italian restaurant. Something classy but not overdressed."
  2. An AI text reply acknowledging the request
  3. An AI outfit suggestion card with items from the mock wardrobe
  4. A user follow-up: "Love it, but can you swap the heels for flats?"
  5. An AI reply with a revised outfit card

**Saved Outfits (`/stylist/saved`)**
- Accessed via a "Saved" tab or icon in the stylist top bar
- Grid of saved outfit cards (1 column on mobile, 2 on desktop)
  - Each card shows: outfit name, the item image grid, the date it was saved, and occasion tag
  - Tapping a card expands it to show the full item list and AI explanation
- Empty state: "No saved outfits yet. Start a conversation with the AI Stylist to build some!"

#### Mock data needed
- 5–7 pre-built outfit objects, each with: name, occasion tag, array of item references (pulling from the Phase 2 wardrobe data), AI explanation text, date
- The pre-populated chat conversation (array of message objects with sender, type, content, and optional outfit reference)

---

### Phase 4 — Trip Planner, Wardrobe Insights & Profile

**Goal:** Build the trip packing planner, the wardrobe insights/gap analysis screen, and the user profile page. After this phase, every section of the app is visually complete with realistic content.

#### Screens and components

**Trip List (`/trips`)**
- List of trip cards, each showing: trip name, destination, date range, a small cover image (destination photo from picsum/unsplash), item count badge ("14 items packed")
- "Plan a new trip" button at the top
- 2–3 mock trips pre-populated (e.g., "Weekend in Austin," "Thailand Backpacking," "NYC Work Trip")
- Tapping a card opens the trip detail

**New Trip Form (`/trips/new`)**
- Fields:
  - Trip name (text input)
  - Destination (text input)
  - Start and end dates (date pickers)
  - Activities (multi-select chips: Sightseeing, Beach, Hiking, Dining out, Nightlife, Business meetings, Working out)
  - Luggage type (single-select cards with icons: Backpack, Carry-on, Carry-on + Checked Bag, No restrictions)
- "Generate Packing Plan" button at the bottom
- On submit, navigate to a pre-populated trip detail page (the generation is mocked)

**Trip Detail (`/trips/[id]`)**
- Trip header: destination name, date range, weather summary (e.g., "72–85°F, mostly sunny" — mocked), luggage type badge
- Packing efficiency stat: "8 outfits from 11 items" with a small visual indicator
- Day-by-day view:
  - Each day is a collapsible section with: "Day 1 — Arrival & Dinner", a listed outfit (row of item thumbnails + outfit name), and activity tags
  - Tapping an outfit row expands to show the individual items with names
- Packing checklist tab (toggleable with the day view):
  - Flat list of all unique items across all days, grouped by category
  - Each item has a checkbox, item image thumbnail, and name
  - Checked items get a strikethrough and fade slightly
  - Progress bar at the top: "9 of 14 items packed"
- "Forgotten essentials" reminder section at the bottom: small callout cards for things like underwear count, pajamas, toiletries, chargers (mocked suggestions)

**Wardrobe Insights (`/profile/insights` or a tab within `/profile`)**
- "Wardrobe Score" hero section: a large circular progress indicator showing a score out of 100 (e.g., 72/100) with a label like "Well-rounded wardrobe"
- Category breakdown: horizontal bar chart (pure CSS/Tailwind, no charting library needed) showing how many items in each category, color-coded
- "Style gaps" section: 2–3 cards suggesting missing pieces:
  - "You don't have a neutral blazer — this would unlock 5+ smart-casual outfits"
  - "A pair of white sneakers would complement 8 items in your wardrobe"
  - Each card has an icon, the suggestion text, and an "Explore" button (non-functional placeholder)
- "Underused items" section: horizontal scroll of item cards that haven't been included in any outfit, with a prompt: "These pieces haven't appeared in any outfits — try asking the stylist to incorporate them"
- Seasonal readiness: a small section showing if the wardrobe is prepared for the upcoming season (e.g., "Spring is coming — you're set on lightweight tops but could use a rain jacket")

**Profile & Settings (`/profile`)**
- User avatar (placeholder image), name ("Kaitlyn"), and member-since date
- Wardrobe stats row: total items, total outfits saved, trips planned
- Navigation list for sub-sections:
  - "Wardrobe Insights" → links to the insights view described above
  - "Outfit History" → placeholder page
  - "Preferences" → placeholder page
  - "Notifications" → placeholder page
  - "Help & Feedback" → placeholder page
- Each list item is a tappable row with an icon, label, and chevron

#### Mock data needed
- 2–3 trip objects with: id, name, destination, dateRange, weather summary, luggage type, array of day objects (each with day number, activity label, outfit reference), packing list array
- Wardrobe insights data: total score, category counts, gap suggestions array, underused items array
- User profile object: name, avatar URL, memberSince date, stats

---

## Mock Data Strategy

All mock data should live in a centralized `/data` directory (e.g., `data/wardrobe.ts`, `data/outfits.ts`, `data/trips.ts`, `data/user.ts`) as exported TypeScript constants. This keeps the UI components clean and makes it straightforward to replace mock data with real API calls later.

Image URLs should use `https://picsum.photos/seed/{keyword}/{width}/{height}` or Unsplash source URLs to produce consistent, realistic-looking placeholder images that don't change between reloads.

---

## Design Principles

1. **Mobile-first.** Every screen should look and feel native on a phone. Desktop is a wider, more spacious version of the same layout — not a separate design.
2. **Warm and approachable.** Soft color palette, rounded shapes, generous whitespace. This is a personal, intimate app — it should feel like opening a journal, not a spreadsheet.
3. **Visually rich.** Clothing is visual — the UI should prioritize large images, image grids, and visual outfit compositions over text lists.
4. **Progressive disclosure.** Show the essentials first, let the user tap or scroll for more detail. Don't overwhelm any single screen.
5. **Consistent.** Every card, button, badge, and interaction pattern should feel like it belongs to the same app regardless of which screen it's on.
