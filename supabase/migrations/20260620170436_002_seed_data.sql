-- Insert categories
INSERT INTO categories (name, slug, description, image_url, display_order) VALUES
('Whitening Cream', 'whitening-cream', 'Brighten and even out your skin tone with our premium whitening creams', '/images/categories/whitening-cream.jpg', 1),
('Face Wash', 'face-wash', 'Gentle cleansers that remove impurities without stripping moisture', '/images/categories/face-wash.jpg', 2),
('Serums', 'serums', 'Concentrated formulas targeting specific skin concerns', '/images/categories/serums.jpg', 3),
('Sunblock', 'sunblock', 'Protect your skin from harmful UV rays with our SPF products', '/images/categories/sunblock.jpg', 4),
('Body Lotion', 'body-lotion', 'Nourish your body with hydrating and moisturizing lotions', '/images/categories/body-lotion.jpg', 5),
('Acne Treatment', 'acne-treatment', 'Effective solutions for clearer, healthier skin', '/images/categories/acne-treatment.jpg', 6),
('Bundles', 'bundles', 'Curated sets for complete skincare routines', '/images/categories/bundles.jpg', 7),
('Best Sellers', 'best-sellers', 'Our most loved products by customers', '/images/categories/best-sellers.jpg', 9);

-- Insert products
INSERT INTO products (name, slug, short_description, description, ingredients, benefits, how_to_use, price, discount_price, category_id, stock, sku, images, featured, best_seller, new_arrival, rating, reviews_count) VALUES
-- Whitening Cream Products
('Radiance Brightening Cream', 'radiance-brightening-cream',
'S luxurious cream that brightens skin and reduces dark spots',
'Experience the transformative power of our Radiance Brightening Cream. Formulated with advanced brightening agents and natural extracts, this luxurious cream works to reduce the appearance of dark spots, even out skin tone, and restore your natural luminosity. The rich, velvety texture absorbs quickly, leaving skin soft, supple, and glowing.',
'Niacinamide, Vitamin C, Alpha Arbutin, Licorice Root Extract, Hyaluronic Acid, Squalane',
'{''Visibly reduces dark spots and hyperpigmentation'', ''Evens out skin tone for a radiant complexion'', ''Hydrates and plumps skin'', ''Protects against environmental stressors'', ''Suitable for all skin types''}',
'Apply a generous amount to cleansed face and neck. Gently massage in upward circular motions until fully absorbed. Use morning and evening for best results. Always follow with SPF during the day.',
89.99, 74.99, (SELECT id FROM categories WHERE slug = 'whitening-cream'), 150, 'WHT-001',
ARRAY['https://images.pexels.com/photos/3685540/pexels-photo-3685540.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800'],
true, true, false, 4.8, 127),

('Luminous Glow Night Cream', 'luminous-glow-night-cream',
'An intensive overnight treatment that brightens while you sleep',
'Wake up to luminous skin with our Luminous Glow Night Cream. This intensive overnight treatment harnesses the power of retinol and brightening botanicals to fade dark spots and promote cell turnover while you sleep. Wake up to smoother, brighter, more even-toned skin.',
'Retinol, Vitamin B3, Tranexamic Acid, Mulberry Extract, Ceramides, Shea Butter',
'{''Intensive overnight brightening'', ''Stimulates cell renewal'', ''Fades dark spots and discoloration'', ''Strengthens skin barrier'', ''Rich, nourishing formula''}',
'Apply to cleansed face and neck in the evening. Allow to absorb before applying other treatments. Start with 2-3 times per week and gradually increase frequency. Always use SPF during the day when using retinol.',
79.99, NULL, (SELECT id FROM categories WHERE slug = 'whitening-cream'), 85, 'WHT-002',
ARRAY['https://images.pexels.com/photos/4042808/pexels-photo-4042808.jpeg?auto=compress&cs=tinysrgb&w=800'],
false, true, true, 4.6, 89),

-- Face Wash Products
('Gentle Hydrating Cleanser', 'gentle-hydrating-cleanser',
'A moisture-rich cleanser that gently removes impurities',
'Start your skincare journey with our Gentle Hydrating Cleanser. This soap-free formula effectively removes makeup, dirt, and impurities without stripping your skin of essential moisture. Infused with hydrating ingredients, it leaves skin feeling soft, refreshed, and perfectly prepped for the rest of your routine.',
'Aloe Vera, Glycerin, Hyaluronic Acid, Chamomile Extract, Vitamin E, Coco-Glucoside',
'{''Gently removes impurities and makeup'', ''Maintains skin moisture balance'', ''Soothes and calms sensitive skin'', ''pH-balanced formula'', ''No artificial fragrances''}',
'Wet face with lukewarm water. Apply a small amount to fingertips and massage onto face in circular motions. Rinse thoroughly and pat dry. Use morning and evening.',
34.99, 29.99, (SELECT id FROM categories WHERE slug = 'face-wash'), 200, 'CLN-001',
ARRAY['https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=800'],
true, true, false, 4.9, 203),

('Purifying Charcoal Face Wash', 'purifying-charcoal-face-wash',
'Deep cleansing formula with activated charcoal for clear pores',
'Draw out impurities and detoxify your skin with our Purifying Charcoal Face Wash. The activated charcoal acts like a magnet for dirt, oil, and pollutants, unclogging pores and preventing breakouts. The refreshingly light formula leaves skin feeling clean, clear, and balanced.',
'Activated Charcoal, Salicylic Acid, Tea Tree Oil, Witch Hazel, Menthol, Green Tea Extract',
'{''Deep cleans pores and removes blackheads'', ''Controls excess oil production'', ''Prevents acne and breakouts'', ''Detoxifies skin'', ''Refreshing, cooling sensation''}',
'Wet face and apply a small amount. Massage in circular motions focusing on oily areas. Rinse thoroughly. Use daily for best results. Suitable for oily and combination skin.',
29.99, NULL, (SELECT id FROM categories WHERE slug = 'face-wash'), 175, 'CLN-002',
ARRAY['https://images.pexels.com/photos/3735696/pexels-photo-3735696.jpeg?auto=compress&cs=tinysrgb&w=800'],
true, false, true, 4.5, 156),

-- Serums
('Hyaluronic Acid Serum', 'hyaluronic-acid-serum',
'Intense hydration serum that plumps and smooths skin',
'Quench your skin thirst with our Hyaluronic Acid Serum. This lightweight, fast-absorbing serum contains multiple molecular weights of hyaluronic acid to hydrate at every layer of your skin. Instantly plumps fine lines and creates a smooth, dewy canvas.',
'Hyaluronic Acid (3 molecular weights), Vitamin B5, Glycerin, Sodium PCA, Peptides',
'{''Intense multi-layer hydration'', ''Plumps and smooths fine lines'', ''Creates dewy, glowing skin'', ''Improves skin elasticity'', ''Layer-friendly formula''}',
'Apply 2-3 drops to cleansed skin. Gently press into face and neck. Follow with moisturizer. Can be used morning and evening. Layer under other serums and treatments.',
59.99, 49.99, (SELECT id FROM categories WHERE slug = 'serums'), 180, 'SRM-001',
ARRAY['https://images.pexels.com/photos/4041507/pexels-photo-4041507.jpeg?auto=compress&cs=tinysrgb&w=800'],
true, true, false, 4.9, 312),

('Vitamin C Brightening Serum', 'vitamin-c-brightening-serum',
'Powerful antioxidant serum that brightens and protects',
'Illuminate your complexion with our Vitamin C Brightening Serum. Powered by 20% stabilized Vitamin C, this potent serum shields skin from free radicals, diminishes dark spots, and boosts collagen production. Watch your skin transform into a brighter, more youthful version.',
'20% L-Ascorbic Acid, Vitamin E, Ferulic Acid, Hyaluronic Acid, Aloe Leaf Juice',
'{''Brightens dull skin'', ''Fades dark spots and pigmentation'', ''Protects against environmental damage'', ''Boosts collagen production'', ''Smooths fine lines''}',
'Apply 3-4 drops to clean, dry skin in the morning. Allow to absorb for 1-2 minutes before applying other products. Always follow with SPF. Start with every other day use if new to Vitamin C.',
69.99, NULL, (SELECT id FROM categories WHERE slug = 'serums'), 120, 'SRM-002',
ARRAY['https://images.pexels.com/photos/4042805/pexels-photo-4042805.jpeg?auto=compress&cs=tinysrgb&w=800'],
true, true, false, 4.7, 245),

('Retinol Renewal Serum', 'retinol-renewal-serum',
'Anti-aging serum with encapsulated retinol for minimal irritation',
'Experience the power of retinol without the irritation. Our Retinol Renewal Serum features encapsulated retinol that slowly releases into the skin, minimizing sensitivity while maximizing results. Wake up to smoother, firmer, more youthful-looking skin.',
'Encapsulated Retinol, Bakuchiol, Squalane, Vitamin E, Peptides, Niacinamide',
'{''Reduces wrinkles and fine lines'', ''Improves skin texture'', ''Minimizes pores'', ''Fights signs of aging'', ''Time-release formula minimizes irritation''}',
'Apply 1-2 pumps to cleansed face in the evening. Start with 2-3 times per week and gradually increase. Always use SPF during the day. Avoid using with other retinoids.',
79.99, 69.99, (SELECT id FROM categories WHERE slug = 'serums'), 95, 'SRM-003',
ARRAY['https://images.pexels.com/photos/4042808/pexels-photo-4042808.jpeg?auto=compress&cs=tinysrgb&w=800'],
false, true, false, 4.6, 178),

-- Sunblock
('Daily Defense SPF 50', 'daily-defense-spf-50',
'Lightweight, invisible sun protection for everyday wear',
'Your skin deserves the best protection. Our Daily Defense SPF 50 offers broad-spectrum UVA/UVB protection in an ultra-lightweight, invisible formula. No white cast, no greasy residue – just weightless, breathable protection that layers perfectly under makeup.',
'Zinc Oxide, Titanium Dioxide, Vitamin E, Green Tea Extract, Niacinamide, Hyaluronic Acid',
'{''Broad spectrum SPF 50 protection'', ''Lightweight, non-greasy formula'', ''No white cast, invisible finish'', ''Hydrates while protecting'', ''Works well under makeup''}',
'Apply generously 15 minutes before sun exposure. Reapply every 2 hours or after swimming or sweating. Use as the last step of your morning skincare routine.',
39.99, NULL, (SELECT id FROM categories WHERE slug = 'sunblock'), 220, 'SPF-001',
ARRAY['https://images.pexels.com/photos/3938016/pexels-photo-3938016.jpeg?auto=compress&cs=tinysrgb&w=800'],
true, true, false, 4.8, 289),

('Tinted Glow Sunscreen', 'tinted-glow-sunscreen',
'Universal tint sunscreen that enhances your natural glow',
'Get protected and glow with our Tinted Glow Sunscreen. This universal-tinted formula not only shields your skin from harmful rays but also provides a subtle, radiant finish that enhances your natural complexion. Perfect for no-makeup days.',
'Zinc Oxide, Titanium Dioxide, Iron Oxides, Vitamin C, Jojoba Oil, Mica',
'{''SPF 40 broad spectrum protection'', ''Universal tint suits all skin tones'', ''Creates a radiant, glowing finish'', ''Can replace foundation'', ''Water-resistant for 80 minutes''}',
'Shake well before use. Apply as the last step of your morning skincare routine. Blend evenly for a seamless finish. Reapply every 2 hours.',
44.99, 39.99, (SELECT id FROM categories WHERE slug = 'sunblock'), 160, 'SPF-002',
ARRAY['https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=800'],
false, false, true, 4.7, 134),

-- Body Lotion
('Silky Body Whip', 'silky-body-whip',
'Luxuriously rich body moisturizer with a whipped texture',
'Pamper your skin with our Silky Body Whip. This ultra-rich, whipped cream melts into skin, delivering intense hydration that lasts all day. Formulated with nourishing butters and oils, it leaves skin feeling impossibly soft and smelling divine.',
'Shea Butter, Cocoa Butter, Coconut Oil, Sweet Almond Oil, Vitamin E, Vanilla Extract',
'{''Rich, whipped texture'', ''Deep, lasting hydration'', ''Nourishes and softens skin'', ''Divine vanilla scent'', ''Absorbs quickly without greasiness''}',
'Scoop a generous amount and massage onto clean, damp skin. Focus on dry areas like elbows and knees. Use daily after showering for best results.',
32.99, NULL, (SELECT id FROM categories WHERE slug = 'body-lotion'), 185, 'BDY-001',
ARRAY['https://images.pexels.com/photos/4107112/pexels-photo-4107112.jpeg?auto=compress&cs=tinysrgb&w=800'],
true, true, false, 4.8, 167),

('Radiant Body Oil', 'radiant-body-oil',
'Luxe dry body oil for a subtle, all-over shimmer',
'Get luminous from head to toe with our Radiant Body Oil. This fast-absorbing dry oil delivers a subtle, pearl-like shimmer while nourishing skin with precious botanical oils. Perfect for highlighting shoulders, legs, and dcollet.',
'Jojoba Oil, Squalane, Rosehip Oil, Mica, Vitamin E, Grapeseed Oil, Argan Oil',
'{''Fast-absorbing dry oil formula'', ''Creates a subtle, luminous glow'', ''Deeply nourishes skin'', ''Non-staining, non-greasy'', ''Perfect for highlighting''}',
'Spray onto skin and massage in circular motions. Allow to dry for 2-3 minutes before dressing. Focus on arms, legs, and dcollet for a radiant finish.',
38.99, NULL, (SELECT id FROM categories WHERE slug = 'body-lotion'), 140, 'BDY-002',
ARRAY['https://images.pexels.com/photos/4042805/pexels-photo-4042805.jpeg?auto=compress&cs=tinysrgb&w=800'],
false, false, true, 4.5, 98),

-- Acne Treatment
('Clarifying Acne Treatment', 'clarifying-acne-treatment',
'Targeted treatment that clears blemishes fast',
'Say goodbye to breakouts with our Clarifying Acne Treatment. This powerful yet gentle formula targets blemishes at the source, reducing inflammation and preventing future breakouts. See visible results in just days.',
'Benzoyl Peroxide 5%, Niacinamide, Salicylic Acid, Tea Tree Oil, Aloe Vera, Zinc PCA',
'{''Clears existing blemishes fast'', ''Prevents future breakouts'', ''Reduces inflammation and redness'', ''Minimizes pore appearance'', ''Balances oil production''}',
'Cleanse skin thoroughly before applying. Apply a thin layer to affected areas once daily. Increase to twice daily if needed. May cause dryness - start slowly.',
24.99, NULL, (SELECT id FROM categories WHERE slug = 'acne-treatment'), 175, 'ACN-001',
ARRAY['https://images.pexels.com/photos/3735696/pexels-photo-3735696.jpeg?auto=compress&cs=tinysrgb&w=800'],
true, true, false, 4.4, 234),

('Acne Control Serum', 'acne-control-serum',
'Daily serum that prevents breakouts and refines pores',
'Keep breakouts at bay with our Acne Control Serum. This lightweight daily treatment uses a blend of AHAs, BHAs, and soothing botanicals to keep pores clear, control oil, and prevent future breakouts without drying out your skin.',
'Salicylic Acid 2%, Glycolic Acid, Niacinamide, Witch Hazel, Tea Tree Oil, Hyaluronic Acid',
'{''Prevents breakouts before they start'', ''Refines and minimizes pores'', ''Controls excess oil'', ''Gentle enough for daily use'', ''Improves overall skin clarity''}',
'Apply 2-3 drops to cleansed skin morning and/or evening. Follow with moisturizer. Start with once daily use. Use SPF during the day.',
34.99, 29.99, (SELECT id FROM categories WHERE slug = 'acne-treatment'), 155, 'ACN-002',
ARRAY['https://images.pexels.com/photos/4041507/pexels-photo-4041507.jpeg?auto=compress&cs=tinysrgb&w=800'],
false, false, true, 4.6, 156),

-- Bundles
('Complete Glow Bundle', 'complete-glow-bundle',
'Everything you need for luminous, glowing skin',
'Transform your routine with our Complete Glow Bundle. This carefully curated set includes our bestselling brightening heroes: Gentle Hydrating Cleanser, Vitamin C Brightening Serum, Radiance Brightening Cream, and Daily Defense SPF 50. Save 25% compared to buying separately.',
NULL,
'{''Full brightening skincare routine'', ''Bestselling products'', ''Save 25% vs individual purchase'', ''Suitable for all skin types'', ''Beautiful gift packaging''}',
NULL,
199.99, 149.99, (SELECT id FROM categories WHERE slug = 'bundles'), 50, 'BND-001',
ARRAY['https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=800'],
true, true, false, 4.9, 89),

('Anti-Aging Essentials Set', 'anti-aging-essentials-set',
'Powerful anti-aging routine for youthful skin',
'Maintain a youthful complexion with our Anti-Aging Essentials Set. This comprehensive set targets fine lines, wrinkles, and loss of firmness: Gentle Hydrating Cleanser, Hyaluronic Acid Serum, Retinol Renewal Serum, and Luminous Glow Night Cream.',
NULL,
'{''Complete anti-aging routine'', ''Targets multiple signs of aging'', ''Gentle formulas suitable for all skin'', ''Save 20% vs individual purchase'', ''Ideal for mature skin''}',
NULL,
249.99, NULL, (SELECT id FROM categories WHERE slug = 'bundles'), 35, 'BND-002',
ARRAY['https://images.pexels.com/photos/4042808/pexels-photo-4042808.jpeg?auto=compress&cs=tinysrgb&w=800'],
false, false, true, 4.7, 67),

-- More products for Best Sellers
('Clay Detox Mask', 'clay-detox-mask',
'Purifying clay mask that draws out impurities',
'Self-care Sunday essential. Our Clay Detox Mask combines three purifying clays with activated charcoal to draw out impurities, unclog pores, and leave skin refreshed and balanced. Feel it working as it dries, then rinse to reveal clearer, brighter skin.',
'Kaolin Clay, Bentonite Clay, French Green Clay, Activated Charcoal, Tea Tree Oil, Witch Hazel',
'{''Draws out deep impurities'', ''Unclogs and minimizes pores'', ''Controls oil and shine'', ''Detoxifies and purifies'', ''Suitable for oily and acne-prone skin''}',
'Apply an even layer to clean, dry face. Avoid eye area. Leave for 10-15 minutes until dry. Rinse thoroughly with warm water. Use 1-2 times weekly.',
42.99, NULL, (SELECT id FROM categories WHERE slug = 'face-wash'), 130, 'MSK-001',
ARRAY['https://images.pexels.com/photos/4042808/pexels-photo-4042808.jpeg?auto=compress&cs=tinysrgb&w=800'],
false, true, false, 4.6, 189);

-- Insert sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, start_date, end_date, usage_limit) VALUES
('WELCOME10', '10% off your first order', 'percentage', 10, 30, NOW(), NOW() + INTERVAL '1 year', 1000),
('GLOW20', '20% off all brightening products', 'percentage', 20, 50, NOW(), NOW() + INTERVAL '6 months', 500),
('FLAT15', '$15 off orders over $75', 'fixed', 15, 75, NOW(), NOW() + INTERVAL '3 months', 200);

-- Insert sample blogs
INSERT INTO blogs (title, slug, excerpt, content, featured_image, author, category, tags, is_published, published_at) VALUES
('10 Steps to Build the Perfect Skincare Routine', '10-steps-perfect-skincare-routine',
'A comprehensive guide to building a skincare routine that works for your unique skin type.',
'Building a skincare routine can be overwhelming with so many products and steps. Whether you are a beginner or looking to upgrade your current routine, this guide will help you create a personalized skincare regimen that addresses your specific concerns...

## 1. Know Your Skin Type
The foundation of any good skincare routine is understanding your skin type. Is it oily, dry, combination, or sensitive? Each skin type has unique needs and responds differently to ingredients...

## 2. Start with the Basics
Every routine needs three essential steps: cleanse, treat, and protect. Master these before adding more products...

## 3. Order Matters
Apply products from thinnest to thickest consistency. This ensures each product can penetrate properly without being blocked by heavier formulas...',
'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=800',
'The Siebel Team', 'Skincare Tips', '{skincare, routine, beginner, guide}', true, NOW() - INTERVAL '5 days'),

('The Science Behind Hyaluronic Acid', 'science-behind-hyaluronic-acid',
'Discover why hyaluronic acid is the skincare ingredient everyone is talking about.',
'Hyaluronic acid has become a superstar ingredient in skincare, and for good reason. This naturally occurring molecule can hold up to 1,000 times its weight in water, making it one of the most powerful hydrating ingredients available...

## What is Hyaluronic Acid?
Hyaluronic acid (HA) is a glycosaminoglycan, a fancy word for a type of sugar molecule that our bodies produce naturally. It is found in our skin, connective tissues, and eyes...

## Why Your Skin Needs It
As we age, our natural HA production decreases. This leads to drier skin, fine lines, and loss of firmness. Topically applying HA helps replenish these levels...',
'https://images.pexels.com/photos/4042808/pexels-photo-4042808.jpeg?auto=compress&cs=tinysrgb&w=800',
'Dr. Sarah Chen', 'Ingredients', '{hyaluronic acid, hydration, science, ingredients}', true, NOW() - INTERVAL '12 days'),

('Winter Skincare: Maintaining Your Glow in Cold Weather', 'winter-skincare-glow-cold-weather',
'Expert tips to keep your skin hydrated and glowing throughout the winter months.',
'Winter brings cozy sweaters and hot cocoa, but it also brings challenges for our skin. Cold air, low humidity, and indoor heating can strip moisture from your skin, leaving it dry, dull, and irritated...

## Why Winter Affects Your Skin
Cold air holds less moisture than warm air, and indoor heating further reduces humidity. This double whammy draws moisture from your skin, compromising the protective barrier...

## Essential Winter Skincare Tips

### Switch to a Cream Cleanser
Foaming cleansers can be too drying in winter. Switch to a cream or oil-based cleanser that wont strip your natural oils...

### Layer Your Hydration
Apply multiple thin layers of hydration rather than one thick cream. Start with a hydrating serum, then seal it in with a richer moisturizer...',
'https://images.pexels.com/photos/3938016/pexels-photo-3938016.jpeg?auto=compress&cs=tinysrgb&w=800',
'The Siebel Team', 'Seasonal Care', '{winter, skincare, hydration, tips}', true, NOW() - INTERVAL '20 days');
