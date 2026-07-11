-- FIX: Orders and order_items were failing to save because the original
-- schema had NO INSERT policy on order_items (only SELECT), and the guest
-- INSERT policy on orders was also missing. RLS blocks everything with no
-- matching policy, so checkout silently failed at the line-items step.
--
-- This script uses DROP POLICY IF EXISTS before re-creating, so it is safe
-- to run multiple times and will not error if policies already exist.

-- ── orders ──────────────────────────────────────────────────────────────────

-- Authenticated customers: INSERT their own order
DROP POLICY IF EXISTS "orders_insert_own" ON orders;
CREATE POLICY "orders_insert_own" ON orders FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Guest / anonymous customers: INSERT orders where user_id is NULL
DROP POLICY IF EXISTS "orders_insert_guest" ON orders;
CREATE POLICY "orders_insert_guest" ON orders FOR INSERT
    TO anon
    WITH CHECK (user_id IS NULL);

-- Authenticated customers: UPDATE their own order (needed for status changes)
DROP POLICY IF EXISTS "orders_update_own" ON orders;
CREATE POLICY "orders_update_own" ON orders FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

-- ── order_items ──────────────────────────────────────────────────────────────

-- Authenticated customers: INSERT items that belong to their own order
DROP POLICY IF EXISTS "order_items_insert_own" ON order_items;
CREATE POLICY "order_items_insert_own" ON order_items FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Guest / anonymous customers: INSERT items that belong to a guest order
DROP POLICY IF EXISTS "order_items_insert_guest" ON order_items;
CREATE POLICY "order_items_insert_guest" ON order_items FOR INSERT
    TO anon
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id IS NULL
        )
    );
