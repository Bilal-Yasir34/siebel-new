-- Keep products.rating and products.reviews_count in sync with approved
-- reviews automatically, so newly submitted reviews are reflected without
-- any extra application code.

CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_product_id UUID;
BEGIN
    target_product_id := COALESCE(NEW.product_id, OLD.product_id);

    UPDATE products
    SET
        rating = COALESCE((
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM reviews
            WHERE product_id = target_product_id AND is_approved = true
        ), 0),
        reviews_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE product_id = target_product_id AND is_approved = true
        )
    WHERE id = target_product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_product_rating ON reviews;
CREATE TRIGGER trg_update_product_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- New reviews default to approved so they show up immediately; the admin
-- can still moderate by flipping is_approved if needed later.
ALTER TABLE reviews ALTER COLUMN is_approved SET DEFAULT true;
