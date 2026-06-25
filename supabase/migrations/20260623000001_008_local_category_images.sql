-- Switch category images from remote pexels URLs to local files served from
-- public/images/categories/. Matched by slug, so safe to re-run.
--
-- Note: Acne Treatment and Bundles are handled in a later migration that
-- deletes those categories entirely, so they're intentionally not updated
-- here. New Arrivals and Best Sellers don't have local images yet, so they
-- are left untouched until images are provided for them.

UPDATE categories SET image_url = '/images/categories/whitening-cream.jpg' WHERE slug = 'whitening-cream';
UPDATE categories SET image_url = '/images/categories/face-wash.jpg' WHERE slug = 'face-wash';
UPDATE categories SET image_url = '/images/categories/serums.jpg' WHERE slug = 'serums';
UPDATE categories SET image_url = '/images/categories/sunblock.jpg' WHERE slug = 'sunblock';
UPDATE categories SET image_url = '/images/categories/body-lotion.jpg' WHERE slug = 'body-lotion';
