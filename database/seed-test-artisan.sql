-- Seed Scarlet Weaver (Ohio State artisan) – runs only if she doesn't exist yet
INSERT OR IGNORE INTO users (email, password_hash, name)
VALUES ('scarlet@handcraftedhaven.com', 'dev-only-hash', 'Scarlet Weaver');

INSERT OR IGNORE INTO sellers (user_id, shop_name, bio, profile_image_url)
SELECT id, 'Scarlet''s Scarlet Crafts',
       'Passionate Ohio State artisan crafting Buckeye-inspired treasures since 2015.',
       '/images/artisans/scarlet.jpg'
FROM users WHERE email = 'scarlet@handcraftedhaven.com';

-- Add her first product
INSERT OR IGNORE INTO products 
  (seller_id, title, description, price_cents, category, image_urls, stock, is_active)
SELECT 
  s.id,
  'Hand-Painted Buckeye Ornament',
  'Gorgeous scarlet & gray Christmas ornament – perfect for any Ohio State tree!',
  2999,
  'Home Decor',
  '["/images/products/ornament-1.jpg","/images/products/ornament-2.jpg"]',
  25,
  1
FROM sellers s
JOIN users u ON s.user_id = u.id
WHERE u.email = 'scarlet@handcraftedhaven.com';