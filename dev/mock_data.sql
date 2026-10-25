INSERT INTO urls (code, url, custom_text, status) VALUES
('a1b2c', 'https://example.com/products/shoes', 'sale-', 'active'),
('x9y8z', 'https://example.com/blog/2026-trends', NULL, 'active'),
('m4n5p', 'https://example.com/signup', 'promo-', 'active'),
('q1w2e', 'https://example.com/about-us', NULL, 'inactive'),
('j7k8l', 'https://example.com/pricing', 'tier1-', 'active'),
('z3x2c', 'https://example.com/download/app', NULL, 'active'),
('v5b6n', 'https://example.com/contact', 'help-', 'active'),
('h9g8f', 'https://example.com/features/analytics', NULL, 'inactive'),
('r2t3y', 'https://example.com/docs/api', 'dev-', 'active'),
('l1k2j', 'https://example.com/case-studies/acme', NULL, 'active');

WITH RECURSIVE generate_clicks(n) AS (
    SELECT 1
    UNION ALL
    SELECT n + 1 FROM generate_clicks WHERE n < 500
),
raw_clicks AS (
    SELECT 
        ((abs(random()) % 10) + 1) AS url_id,
        datetime('2026-01-01 00:00:00', '+' || (abs(random()) % 31536000) || ' seconds') AS click_timestamp
    FROM generate_clicks
)
INSERT INTO clicks (url_id, click_time, click_date)
SELECT 
    url_id,
    click_timestamp AS click_time,
    date(click_timestamp) AS click_date
FROM raw_clicks;