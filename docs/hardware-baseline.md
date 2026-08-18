# Hardware page baseline

This document records the public `/materiel` content and behavior before the
page becomes database-backed. The migration that introduces hardware records
must seed this content in this order.

## Card contract

| Position | Slug | Eyebrow | Title | Image | Width | Height |
| ---: | --- | --- | --- | --- | ---: | ---: |
| 1 | `speakers` | Monitoring | Enceintes Adam Audio A7V | `/matos/enceintes.jpg` | 480 | 480 |
| 2 | `soundcard` | Interface principale | Carte Son Apollo Twin USB | `/matos/carte-son.jpg` | 1920 | 1920 |
| 3 | `preamp` | Preamp | Preampli Neve 1073SPX | `/matos/preamp.jpg` | 800 | 599 |
| 4 | `mic1` | Micro 1 | Micro Sony C-80 | `/matos/mic1.jpg` | 600 | 600 |
| 5 | `mic2` | Micro 2 | Micro Neumann U87 | `/matos/mic2.jpg` | 600 | 600 |

The sound-card URL currently has the development cache-busting query `?v=2`.
The database seed should store the canonical path without that query. Uploaded
replacement images will use unique filenames instead.

## Description content

Bold spans are represented with Markdown because the database-backed editor
will support the same restricted formatting without accepting arbitrary HTML.

### Enceintes Adam Audio A7V

Le studio est équipé d'**enceintes Adam Audio A7V de dernière génération**,
utilisées comme référence principale pour le travail de mixage et de
mastering. Leur **technologie de tweeter à ruban** permet une restitution très
détaillée des hautes fréquences, essentielle pour contrôler la clarté des voix
et l’équilibre du spectre. **La calibration Sonarworks est intégrée** afin
d’adapter la réponse fréquentielle à la pièce et garantir une écoute neutre.

### Carte Son Apollo Twin USB

L’interface principale du studio est une **Apollo Twin USB de Universal
Audio**, reconnue pour ses **convertisseurs haut de gamme et son DSP intégré
UAD-2**. Elle permet l’**enregistrement avec monitoring temps réel** sans
latence perceptible, y compris avec des simulations analogiques (préamplis,
compresseurs, EQ) directement pendant la prise. En concert, elle sert également
de centre de traitement : gestion du micro, compression, EQ, de-essing et
effets en direct avec stabilité et rappel instantané des presets.

### Preampli Neve 1073SPX

**L'AMS Neve 1073SPX** combine un préamplificateur micro ultra performant
offrant **jusqu’à 80dB de gain, un égaliseur musical à trois bandes et des
transformateurs Marinair au rendu sonore exceptionnel**. Les distorsions
harmoniques ajoutées et les configurations personnalisées enrichissent les
possibilités de création sonore, plaçant l’AMS Neve 1073SPX parmi les
équipements essentiels des studios professionnels.

### Micro Sony C-80

**Le Sony C-80**, micro à condensateur large membrane inspiré du C-800, offre
une **grande définition et une restitution claire** particulièrement adaptée
aux voix modernes.

### Micro Neumann U87

**Le Neumann U87**, microphone à condensateur large membrane **considéré depuis
1967 comme la référence mondiale pour la voix studio**. Conçu à l’origine pour
remplacer les micros à lampes en apportant stabilité et précision, il s’est
imposé dans la quasi-totalité des studios professionnels et reste aujourd’hui
**un standard utilisé sur d’innombrables albums commerciaux**.

## Visual and interaction contract

- Cards appear in the order recorded above.
- Odd and even cards alternate their image/text orientation on desktop.
- The existing responsive mobile layout remains unchanged.
- Images retain their current crop, dimensions, and presentation.
- Clicking an image opens the existing lightbox with the matching title.
- Glass surfaces, typography, spacing, divider, and animations remain unchanged.
- A future hidden hardware item does not occupy a card or affect visible order.
- Empty, loading, and API-error states must not cause a disruptive layout shift.

