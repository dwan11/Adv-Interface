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

## Tooltip motion revision

The tooltip now follows the Cosmos reference exactly. It is a window over one strip containing all six names. Moving between items slides the strip through the window, so the end of one name and the start of the next pass by, while the window resizes to the new name. Both move over 340 ms on a slight-overshoot curve. On first hover the window appears in place and fades up from 94%. In the left and right layouts the names are stacked and slide vertically. This replaces the 220 ms label entry described above; everything else on the page is unchanged.

The three large studies are slightly see-through, at 82% opacity.

## Icon revision

| Feedback | Change |
|---|---|
| Use actual icons, like chess pieces | The jewellery thumbnails in the toolbar are replaced by six drawn line icons (ring, earrings, cuff, brooch, pendant, watch) on a 24 px grid, shown at 26 px. Each icon is built as a solid body plus inner details, so it works as both a white and a black chess piece. The large studies keep the generated artwork |
| Default outlined, selected filled | Unselected icons are 1.3 px moss outlines. The selected icon's body fills solid moss, its inner details turn paper colour, and its name goes bold. Chains and hooks stay as lines. The ochre underline is removed. In text-only mode each name sits in an outlined pill, and the selected pill fills moss with paper-coloured text |
| Watch the top and bottom padding | The label used to hang below each icon outside its slot, which made the toolbar look heavier at the top. Icon and label are now stacked and centred inside each slot. The strip has the same 8 px padding all round (8 px × 10 px horizontally), so the first and last items each sit 17 px from the edge |


## Label and background fix

- The selected label is no longer bold; the filled icon alone marks the selection.
- The large studies no longer sit on tinted boxes. A colour-matrix filter turns their paper transparent and keeps the ink, and the bottom of each cell fades out so neighbouring drawings don't show. They stay at 82% opacity.

## Calmer motion and a looser layout

- **Motion without bounce:** the tooltip window's resize and the name strip's slide now use `cubic-bezier(.25,.8,.3,1)` over 340 ms, which eases out with no overshoot. The spring that moves the hover disk and the tooltip is now critically damped (k 260, c 34, previously c 24), so they settle without swinging past the target.
- **Looser studies layout:** the three studies are no longer a stiff two-plus-one grid. They're placed like plates pinned to a board: one large and two smaller at different heights, each tilted by up to 1.5°, with left-aligned captions. There are three arrangements, and each category uses one (Ring, Brooch → 1; Earrings, Pendant → 2; Cuff, Watch → 3), so the sheet changes as you browse. All three fit inside the plate area at every alignment.

## Water ripple and vintage paper

- **Water ripple following the pointer:** a damped wave simulation runs on a quarter-resolution grid behind the toolbar and studies.
  - Every pointer move drops a small disturbance, harder when the pointer has just arrived. A click drops a larger one.
  - The surface slope is drawn as light and shade (lit from the upper left) and overlay-blended into the paper, so rings spread out from the cursor and fade (damping 0.984).
  - It sleeps when the water is still, and it is off with reduced motion.
- **Vintage paper:** one fixed layer over the whole page adds
  - long horizontal paper fibres
  - fine grain
  - sparse dark dust specks
  - six brown foxing spots
  - a warm toned edge, like an old gift box or archive sheet.
- **Not yet done:** the hover text motion from the two screen recordings. The recordings were in a temporary macOS folder that had been emptied before they could be read.

## Ripple refraction and glass toolbar

- **Refraction:** the ripple now bends what lies under it, not just the paper. Each frame, the water surface's slope is also written into a displacement map: red is the horizontal slope, green the vertical. While the water moves, an SVG displacement filter (scale 10) applies that map to the whole layout, so the jewellery studies and the toolbar wobble as the rings pass through them.
  - The map updates every second frame.
  - Damping is 0.972, so the water settles in about a second.
  - When it is still, the filter is removed, so the drawings stay crisp.
- **Glass toolbar:** the pill is now a clear pane:
  - a near-transparent white gradient over a 10 px backdrop blur with a little extra saturation and brightness
  - a bright white rim and a faint moss underside line
  - a soft top highlight with a diagonal glint
  - a soft shadow
  The paper, foxing and ripples show through it.

**Softer ripple (follow-up):** shading opacity is down from 0.75 to 0.4 and the light gain from 1.6 to 1.1. Pointer drops are about a third weaker (9 / 4, click 11), and the refraction scale is down from 10 to 6. The water reads as a faint shimmer rather than visible rings.

## Ground behind the glass

Glass only reads if there is something behind it, so a band of material now runs behind the toolbar. It is horizontal across the stage when the toolbar is centred, and vertical when it is left or right. A **Ground** switch picks the material:

| Ground | What it is |
|---|---|
| Marbled (default) | A vintage book endpaper: indigo, oxblood, ochre and moss bands combed by turbulence, drawn as one seamless sheet |
| Ribbon | Diagonal moss, ochre and ivory silk stripes with a fine weave |
| Velvet | A moss jewellery-box velvet with a soft sheen. The glass gets darker, and the icons and labels turn ivory so they stay readable |
| Paper | No band, as before |

The band is edged with a fine ivory rule. Through the pane it shows blurred and brightened, and the ripple bends it like everything else.

## Aura background (replaces the ground band)

The band behind the toolbar and its Ground switch are removed. The whole page now sits on one background, after the two pastel references.

- **Soft colour field:** blurred clouds of pink, lilac, mint, aqua, butter, peach and periwinkle, with a few faint smoky pockets. It is painted once on a fixed, full-viewport canvas and repainted on resize.
- **Light on threads:** fine vertical threads of green, red, violet, orange, yellow, teal, gold and purple, carrying glowing beads. Some beads have a bright core, like light caught on strung jewels.
- **Stipple grain:** coloured noise blended soft-light, plus a fine grey speckle, like the grainy print. The vintage fibres, dust and foxing stay on top, lighter.
- **Ripple:** it now bends the background too, through the same map placed in viewport coordinates. Outside the stage the map is flat grey, so nothing shifts there. The ripple's own light-and-shade is reduced to 0.22, because the bending of the colour field already shows the water.
- **Performance:**
  - The bend map is half resolution and sent as a JPEG every third frame.
  - The water runs on real time (up to 10 simulation steps per frame), so slow frames don't stretch it out.
  - It always stops 1.6 s after the last pointer movement, then the filters come off.

**Ripple that merges into the background (follow-up, after the grainy ripple reference):** the grey light-and-shade rings are replaced by rings drawn in the background's own palette. Crests lift toward cream. Troughs tint teal on the left of the page shading to pink on the right. Opacity follows the wave height, and the layer is blurred 5 px and sits under the grain, so the rings dissolve into the colour field. The background now bends more strongly (scale 90), so beads and threads visibly warp in the rings. The jewellery and toolbar stay at a gentle scale of 6. The waves are a touch longer-lived (damping 0.968) and stop 2.4 s after the last touch.

## Studies in the aura palette

The three large studies are recoloured into the background's palette and are much less see-through (opacity 0.82 → 0.96).

- A gradient-map filter maps the ink's tone through deep teal → teal → aqua → pink → butter. Metalwork reads teal, gemstones and highlights pink and butter.
- The same filter turns the paper transparent, with a stronger alpha curve ((0.925 − L) × 3.2), so the lines are dense rather than washed out.
- The bottom fade now runs from 85 % to 91 %, so no slivers of neighbouring atlas drawings show.

**Toolbar in the palette (follow-up):** the toolbar takes the same colours as the studies.
- Icon outlines and labels are deep teal `#2b6a72`, and inner details are pink `#e2869f`.
- The selected icon fills teal `#4aa6aa` with cream details.
- In text mode the selected pill fills teal with cream text.
- The hover disk is a soft pink, and the tooltip text is deep teal.

**Calmer ripple (follow-up):**
- Drops fire at most every 40 ms and only after the pointer has moved 14 px, so slow or small movements barely stir the water.
- Drops are about half as strong (4.5 on arrival, 2 while moving, 7 on click).
- Ring colour is capped lower (opacity 120 instead of 170, gain 34 instead of 46).
- The background bends at scale 55 (was 90) and the jewellery and toolbar at scale 4 (was 6).
- Waves fade a little faster (damping 0.96).

**Quieter beads (follow-up):**
- There are about 40 % fewer threads, and the threads are fainter.
- Each thread carries 1–3 beads instead of 2–6.
- The beads are smaller (1–3 px) and drawn at 32 % opacity with a wider glow, so they read as soft points of light rather than solid dots.

**Clear glass for the toolbar and tooltip (follow-up, after the frosted-panel reference):** both are now mostly transparent. Each has a 14–16 px backdrop blur with extra saturation, so the colour field behind stays visible but softened. A soft diagonal sheen crosses the surface, the top edge is bright, and the lower edge is a faint teal. The tooltip window is no longer an opaque cream pill; it is the same glass, and its names still slide through it.

## Outfit matching workbench

Search opens a translucent, scrollable category picker with live filtering (including Bracelet/Cuff). Scan opens a local image picker; the selected image is displayed in-browser via an object URL and is never uploaded. This is a manual outfit moodboard, not AI recognition or calibrated virtual try-on. Add saves the individually selected design to a removable look tray. Play cycles saved pieces at 2.2-second intervals, with a jewellery overlay when an outfit photo exists; Pause stops playback. Empty and duplicate selections have feedback.

The background now uses #f2f4ee mist with four low-opacity, blurred jewellery silhouettes at varied depths; the rainbow cloud gradient and coloured noise are removed. Controls and tooltips share translucent white glass with backdrop blur. Water impulse and crest opacity rise modestly; troughs are grey-green. Reduced-motion still disables the ripple.

Verified in the 8766 browser: category search/filtering, three-design category switching, selecting and adding design 2 independently, playback state and no console errors. Local image selection code has not been exercised with a personal outfit photo.
