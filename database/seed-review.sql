INSERT INTO reviews (product_id, user_id, rating, review_text) 
SELECT 1, u.id, 5, 'Absolutely stunning! Perfect Buckeye gift!' 
FROM users u WHERE email = 'scarlet@handcraftedhaven.com';