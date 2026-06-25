-- Popup promo banner shown to customers when they open the site.
-- Admins manage a single banner record (image + optional link + active toggle)
-- from the Admin Panel.
CREATE TABLE promo_banner (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE promo_banner ENABLE ROW LEVEL SECURITY;

-- Anyone can read an active banner (needed for the public popup).
CREATE POLICY "promo_banner_select_policy" ON promo_banner FOR SELECT
    USING (is_active = true);

-- Only admins can read inactive rows / manage banners from the admin panel.
CREATE POLICY "promo_banner_admin_select_policy" ON promo_banner FOR SELECT
    TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "promo_banner_admin_write_policy" ON promo_banner FOR ALL
    TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    ) WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Storage bucket for banner images, uploaded by admins via the Admin Panel.
INSERT INTO storage.buckets (id, name, public)
VALUES ('promo-banners', 'promo-banners', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "promo_banners_public_read" ON storage.objects FOR SELECT
    USING (bucket_id = 'promo-banners');

CREATE POLICY "promo_banners_admin_insert" ON storage.objects FOR INSERT
    TO authenticated WITH CHECK (
        bucket_id = 'promo-banners'
        AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "promo_banners_admin_update" ON storage.objects FOR UPDATE
    TO authenticated USING (
        bucket_id = 'promo-banners'
        AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "promo_banners_admin_delete" ON storage.objects FOR DELETE
    TO authenticated USING (
        bucket_id = 'promo-banners'
        AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
