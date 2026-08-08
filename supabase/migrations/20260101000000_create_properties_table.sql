-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT NOT NULL,
  description_en TEXT,
  price INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'nou',
  location TEXT NOT NULL,
  area INTEGER NOT NULL,
  rooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  floor TEXT,
  year_built INTEGER,
  heating TEXT,
  parking BOOLEAN DEFAULT FALSE,
  balcony BOOLEAN DEFAULT FALSE,
  storage BOOLEAN DEFAULT FALSE,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  cover_image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  created_at TEXT NOT NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_properties_published ON public.properties (published);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties (featured);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties (slug);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties (type);

CREATE POLICY "Allow authenticated users to insert properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update properties"
  ON public.properties FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to published properties"
  ON public.properties FOR SELECT
  USING (published = true);