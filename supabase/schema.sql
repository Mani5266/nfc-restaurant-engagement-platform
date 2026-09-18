-- ============================================
-- TapDine — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: restaurants
-- ============================================
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT '',
  tagline TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  hero_image_url TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  hours TEXT DEFAULT '',
  google_review_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  instagram_handle TEXT DEFAULT '',
  whatsapp_number TEXT DEFAULT '',
  whatsapp_message TEXT DEFAULT 'Hi! I found you through your TapDine page.',
  website_url TEXT DEFAULT '',
  menu_url TEXT DEFAULT '',
  maps_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Table: offers
-- ============================================
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  badge TEXT DEFAULT '🎁 Today''s Offer',
  cta TEXT DEFAULT 'Explore Offer',
  cta_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Table: events (click tracking)
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'page_view', 'google_review', 'instagram', 'whatsapp',
    'menu', 'website', 'directions', 'offer', 'call'
  )),
  source TEXT DEFAULT 'unknown' CHECK (source IN ('nfc', 'qr', 'direct', 'unknown')),
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Table: restaurant_members
-- ============================================
CREATE TABLE restaurant_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'manager')),
  UNIQUE(user_id, restaurant_id)
);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX idx_events_restaurant_id ON events(restaurant_id);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_restaurant_date ON events(restaurant_id, created_at);
CREATE INDEX idx_offers_restaurant_id ON offers(restaurant_id);
CREATE INDEX idx_restaurant_members_user ON restaurant_members(user_id);
CREATE INDEX idx_restaurants_slug ON restaurants(slug);

-- ============================================
-- Auto-update updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_members ENABLE ROW LEVEL SECURITY;

-- --- RESTAURANTS ---

-- Public can read all restaurants (for landing pages)
CREATE POLICY "Public can read restaurants"
  ON restaurants FOR SELECT
  TO anon, authenticated
  USING (true);

-- Owners can update their own restaurant
CREATE POLICY "Owners can update own restaurant"
  ON restaurants FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT restaurant_id FROM restaurant_members
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    id IN (
      SELECT restaurant_id FROM restaurant_members
      WHERE user_id = auth.uid()
    )
  );

-- --- OFFERS ---

-- Public can read active offers
CREATE POLICY "Public can read active offers"
  ON offers FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR restaurant_id IN (
    SELECT restaurant_id FROM restaurant_members
    WHERE user_id = auth.uid()
  ));

-- Owners can insert offers for their restaurant
CREATE POLICY "Owners can insert offers"
  ON offers FOR INSERT
  TO authenticated
  WITH CHECK (
    restaurant_id IN (
      SELECT restaurant_id FROM restaurant_members
      WHERE user_id = auth.uid()
    )
  );

-- Owners can update their offers
CREATE POLICY "Owners can update own offers"
  ON offers FOR UPDATE
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM restaurant_members
      WHERE user_id = auth.uid()
    )
  );

-- Owners can delete their offers
CREATE POLICY "Owners can delete own offers"
  ON offers FOR DELETE
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM restaurant_members
      WHERE user_id = auth.uid()
    )
  );

-- --- EVENTS ---

-- Anyone can insert events (anon click tracking)
CREATE POLICY "Anyone can insert events"
  ON events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Owners can read their restaurant's events
CREATE POLICY "Owners can read own events"
  ON events FOR SELECT
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM restaurant_members
      WHERE user_id = auth.uid()
    )
  );

-- --- RESTAURANT MEMBERS ---

-- Members can read their own memberships
CREATE POLICY "Members can read own memberships"
  ON restaurant_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- Seed data: The Daily Bean
-- ============================================
-- Note: After creating an auth user for the owner,
-- replace 'OWNER_USER_ID' with the actual auth.users.id

-- INSERT INTO restaurants (slug, name, category, tagline, logo_url, hero_image_url, phone, address, city, hours, google_review_url, instagram_url, instagram_handle, whatsapp_number, whatsapp_message, website_url, menu_url, maps_url)
-- VALUES (
--   'daily-bean',
--   'The Daily Bean',
--   'Café & Kitchen',
--   'Good Food. Brighter Days.',
--   '/images/logo.png',
--   '/images/hero.jpg',
--   '+919876543210',
--   'Road No. 12, Banjara Hills',
--   'Hyderabad',
--   '11:00 AM – 11:00 PM',
--   'https://search.google.com/local/writereview?placeid=PLACEHOLDER',
--   'https://instagram.com/thedailybean',
--   '@thedailybean',
--   '919876543210',
--   'Hi! I found you through your TapDine page.',
--   'https://thedailybean.in',
--   'https://thedailybean.in/menu',
--   'https://maps.google.com/?q=The+Daily+Bean+Banjara+Hills+Hyderabad'
-- );
