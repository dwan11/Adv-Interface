# Set 2 — Jewellery Archive

## Current implementation

The archive now contains Ring, Earrings, Cuff, Brooch, Pendant and Watch. Generated jewellery specimens replace the procedural flowers in the toolbar, magnifying lens and main display. Selecting a category displays one dominant specimen; all six choices have distinct artwork. The only display phrase is “Objects of adornment”.

## mono-color workflow

Applied the source instructions from https://github.com/yanliudesign/mono-color-skill and its colors, typography, composition, rhythm and imperfection catalogs. The source instructions are preserved in assets/mono-color-reference.md for traceability; this is a project-local application, not a global skill installation.

The generated original asset sheet is assets/jewellery-print-atlas.png. The complete generation prompt and recipe are in assets/GENERATION.md. CSS selects its six cells without modifying the source image.

## Material and hierarchy

Pale Beige substrate #F5F1E8. User-directed moss #596344 carries jewellery structure and shadows; antique ochre #A58B52 is reserved for gemstones and small engraved details. The generated screening uses ink density, dry edges and exposed paper highlights rather than a colour filter. Page-level noise is minimal, and typography stays clear. Soft edge masks blend the asset paper into the page.

One large selected object is the focal point. The title uses a literary italic serif; identifiers use small monospaced numerals. The large green field and framed ivory footer from the prior version are removed to restore exposed paper and quiet space. The layout remains an interactive archival plate rather than a flattened screenshot.

## Interaction

Click or touch-drag/release selects a piece. Arrow keys, Home and End move focus; Enter and Space select. The existing 1.9× loupe and name-only tooltip follow focus or pointer. The lens copy is inert and aria-hidden. Accessible category labels, pressed states and live announcements remain. Reduced-motion behavior remains supported. Alignment and icon/text controls remain available.

## Scope

Applied across this archive page and its interaction states. Other weekly projects were not restyled. Generated pieces are fictional decorative jewellery, not branded products or authenticated historical records.

## Collection toolbar revision

Each category now shows three distinct designs, using the original generated 18-design atlas in assets/jewellery-design-variants.png. The heading is removed; icon + text shows small category names rather than numbers. Center is a horizontal toolbar at the top with horizontal arrow-key navigation. Left and Right remain vertical. Default, hover, pressed, selected and keyboard focus have separate treatments. Tooltips are associated with the active control through aria-describedby and support Escape dismissal.

References: https://www.metmuseum.org/art/collection/search/738791 and https://www.vam.ac.uk/articles/jewellery-designs — design albums with multiple pieces per category. Motion reference supplied by user: https://www.cosmos.so/e/828420136 .

## Cosmos motion adaptation

Analyzed the supplied 9.78-second reference video through extracted frames. Replaced the magnifying loupe with a shared circular hover backdrop inside a single rounded toolbar shell. A shared tooltip sits above the horizontal toolbar (beside vertical placements); its position follows the existing spring while labels enter horizontally over 220 ms. Top-center is now the initial layout. Persistent selection has a small ochre underline, distinct from the transient hover disk. Escape dismisses the tooltip. Reduced-motion bypasses the spring and label animation.

The exact source spring constants are not available from video; timing is an approximation of the observed motion. Browser interaction verification for this revision was blocked because local browser use was disabled in Work settings; JavaScript syntax was checked successfully.
