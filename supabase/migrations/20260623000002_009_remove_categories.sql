-- Removes the Acne Treatment and Bundles categories per request. Any
-- products that were assigned to these categories will have their
-- category_id set to NULL automatically (FK is ON DELETE SET NULL) — they
-- are not deleted, just left uncategorized. Reassign them to a category
-- from the Admin > Products panel if needed.

DELETE FROM categories WHERE slug IN ('acne-treatment', 'bundles');
