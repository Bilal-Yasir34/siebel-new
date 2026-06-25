-- Customers cannot UPDATE coupons directly (only admins can, per
-- coupons_admin_policy), so usage_count must be incremented server-side via
-- a trigger whenever an order is placed with a coupon attached.

CREATE OR REPLACE FUNCTION increment_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.coupon_id IS NOT NULL THEN
        UPDATE coupons
        SET usage_count = usage_count + 1
        WHERE id = NEW.coupon_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_increment_coupon_usage ON orders;
CREATE TRIGGER trg_increment_coupon_usage
    AFTER INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION increment_coupon_usage();
