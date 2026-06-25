-- Removes the New Arrivals category per request — five core categories
-- (Whitening Cream, Face Wash, Serums, Sunblock, Body Lotion) are enough.
-- Any products assigned to this category will have category_id set to
-- NULL automatically (FK is ON DELETE SET NULL), not deleted.

DELETE FROM categories WHERE slug = 'new-arrivals';
