CREATE TABLE hardware_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE
        CHECK (
            char_length(slug) BETWEEN 1 AND 80
            AND slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
        ),
    eyebrow TEXT NOT NULL
        CHECK (char_length(eyebrow) BETWEEN 1 AND 80),
    title TEXT NOT NULL
        CHECK (char_length(title) BETWEEN 1 AND 160),
    description TEXT NOT NULL
        CHECK (char_length(description) BETWEEN 1 AND 10000),
    image_url TEXT NOT NULL
        CHECK (char_length(image_url) BETWEEN 1 AND 2048),
    image_width SMALLINT NOT NULL
        CHECK (image_width > 0),
    image_height SMALLINT NOT NULL
        CHECK (image_height > 0),
    display_order SMALLINT NOT NULL
        CHECK (display_order >= 0),
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX hardware_items_visible_order_idx
    ON hardware_items (display_order, id)
    WHERE is_visible;

INSERT INTO hardware_items (
    slug,
    eyebrow,
    title,
    description,
    image_url,
    image_width,
    image_height,
    display_order
) VALUES
    (
        'speakers',
        'Monitoring',
        'Enceintes Adam Audio A7V',
        $description$Le studio est équipé d'**enceintes Adam Audio A7V de dernière génération**, utilisées comme référence principale pour le travail de mixage et de mastering. Leur **technologie de tweeter à ruban** permet une restitution très détaillée des hautes fréquences, essentielle pour contrôler la clarté des voix et l’équilibre du spectre. **La calibration Sonarworks est intégrée** afin d’adapter la réponse fréquentielle à la pièce et garantir une écoute neutre.$description$,
        '/matos/enceintes.jpg',
        480,
        480,
        1
    ),
    (
        'soundcard',
        'Interface principale',
        'Carte Son Apollo Twin USB',
        $description$L’interface principale du studio est une **Apollo Twin USB de Universal Audio**, reconnue pour ses **convertisseurs haut de gamme et son DSP intégré UAD-2**. Elle permet l’**enregistrement avec monitoring temps réel** sans latence perceptible, y compris avec des simulations analogiques (préamplis, compresseurs, EQ) directement pendant la prise. En concert, elle sert également de centre de traitement : gestion du micro, compression, EQ, de-essing et effets en direct avec stabilité et rappel instantané des presets.$description$,
        '/matos/carte-son.jpg',
        1920,
        1920,
        2
    ),
    (
        'preamp',
        'Preamp',
        'Preampli Neve 1073SPX',
        $description$**L'AMS Neve 1073SPX** combine un préamplificateur micro ultra performant offrant **jusqu’à 80dB de gain, un égaliseur musical à trois bandes et des transformateurs Marinair au rendu sonore exceptionnel**. Les distorsions harmoniques ajoutées et les configurations personnalisées enrichissent les possibilités de création sonore, plaçant l’AMS Neve 1073SPX parmi les équipements essentiels des studios professionnels.$description$,
        '/matos/preamp.jpg',
        800,
        599,
        3
    ),
    (
        'mic1',
        'Micro 1',
        'Micro Sony C-80',
        $description$**Le Sony C-80**, micro à condensateur large membrane inspiré du C-800, offre une **grande définition et une restitution claire** particulièrement adaptée aux voix modernes.$description$,
        '/matos/mic1.jpg',
        600,
        600,
        4
    ),
    (
        'mic2',
        'Micro 2',
        'Micro Neumann U87',
        $description$**Le Neumann U87**, microphone à condensateur large membrane **considéré depuis 1967 comme la référence mondiale pour la voix studio**. Conçu à l’origine pour remplacer les micros à lampes en apportant stabilité et précision, il s’est imposé dans la quasi-totalité des studios professionnels et reste aujourd’hui **un standard utilisé sur d’innombrables albums commerciaux**.$description$,
        '/matos/mic2.jpg',
        600,
        600,
        5
    );
