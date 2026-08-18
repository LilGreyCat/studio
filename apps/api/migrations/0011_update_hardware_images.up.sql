UPDATE hardware_items
SET
    image_url = CASE slug
        WHEN 'speakers' THEN '/matos/enceintes.png'
        WHEN 'soundcard' THEN '/matos/carte-son.png'
        WHEN 'mic1' THEN '/matos/mic1.png'
        WHEN 'mic2' THEN '/matos/mic2.png'
    END,
    image_width = CASE slug
        WHEN 'speakers' THEN 816
        WHEN 'soundcard' THEN 1023
        WHEN 'mic1' THEN 1023
        WHEN 'mic2' THEN 1023
    END,
    image_height = CASE slug
        WHEN 'speakers' THEN 997
        WHEN 'soundcard' THEN 1122
        WHEN 'mic1' THEN 1066
        WHEN 'mic2' THEN 1047
    END,
    updated_at = NOW()
WHERE slug IN ('speakers', 'soundcard', 'mic1', 'mic2');
