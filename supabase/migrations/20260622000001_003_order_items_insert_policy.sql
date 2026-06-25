-- Missing policy: customers could never insert order_items because RLS was
-- enabled on the table with no INSERT policy, so every checkout silently
-- failed to save its line items after the order itself was created.

-- Guest checkout: orders.user_id can be NULL, but the original policy only
-- allowed INSERT for authenticated users where user_id = auth.uid(), which
-- blocked guest (anon) checkout entirely.
CREATE POLICY "orders_insert_guest" ON orders FOR INSERT
    TO anon WITH CHECK (user_id IS NULL);

CREATE POLICY "order_items_insert_own" ON order_items FOR INSERT
    TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Allow guest checkout (no logged-in user) to insert order_items too, since
-- orders.user_id can be NULL for guest orders.
CREATE POLICY "order_items_insert_guest" ON order_items FOR INSERT
    TO anon WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id IS NULL
        )
    );
