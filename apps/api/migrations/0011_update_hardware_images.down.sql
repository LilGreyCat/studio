UPDATE hardware_items
SET
    image_url = CASE slug
        WHEN 'speakers' THEN '/matos/enceintes.jpg'
        WHEN 'soundcard' THEN '/matos/carte-son.jpg'
        WHEN 'mic1' THEN '/matos/mic1.jpg'
        WHEN 'mic2' THEN '/matos/mic2.jpg'
    END,
    image_width = CASE slug
        WHEN 'speakers' THEN 480
        WHEN 'soundcard' THEN 1920
        WHEN 'mic1' THEN 600
        WHEN 'mic2' THEN 600
    END,
    image_height = CASE slug
        WHEN 'speakers' THEN 480
        WHEN 'soundcard' THEN 1920
        WHEN 'mic1' THEN 600
        WHEN 'mic2' THEN 600
    END,
    updated_at = NOW()
WHERE slug IN ('speakers', 'soundcard', 'mic1', 'mic2');
