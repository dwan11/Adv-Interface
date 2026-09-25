# The Diamond Bee — 3D brooch loader

A 3D bee brooch in yellow gold and platinum, built in three.js from primitives: a canary oval diamond for the abdomen, a white round for the thorax, a small round for the head, translucent enamel wings (plique-à-jour style) framed in platinum and gold with pavé and veins, gold antennae and claws.

## Two indicators
| Mode | State | What you see |
|------|-------|--------------|
| Determinate | 0% | Static: wings folded, resting on a soft golden glow |
| Determinate | 1–99% | Takes off and flies: wings beat, body bobs up and down and climbs as progress rises; the honeycomb fills cell by cell |
| Determinate | 100% | Lands back in place; wings flicker, then flicker again every few seconds |
| Indeterminate | — | A waggle dance (the figure-eight honeybees use to signal): loops for as long as progress is unknown; the honeycomb hums in a wave, no number shown |

## Run
Open `index.html` over a local server (`npx serve .`). three.js r128 loads from cdnjs, with the bundled `three.min.js` as an offline fallback.

## Use
```html
<div id="stage" style="height:480px"></div>
<script src="three.min.js"></script>
<script src="bee-loader.js"></script>
<script>
  const loader = BeeLoader(document.getElementById('stage'), {
    onUpdate: ({ percent, state }) => {}   // state: 'empty' | 'progress' | 'complete' | 'indeterminate' (percent null)
  });
  loader.setIndeterminate(true);            // while you don't know how long it will take
  loader.setIndeterminate(false); loader.setProgress(40);
</script>
```

## How it flows smoothly
- One `flight` value (0 resting → 1 airborne) eases in and out, and every motion is scaled by it, so take-off, landing and mode switches never jump.
- Progress eases toward the target (up to 45%/s forward), so bursty updates still read as one steady climb.
- Wings pivot at the thorax: a fast beat while flying, a decaying flicker after landing.
- Materials use a procedural studio light box (PMREM) so gold, platinum and the faceted stones catch highlights; twinkles are additive sprites on the stones.
- Drag the stage to turn the brooch. Honors `prefers-reduced-motion` (no beat or bob; states still change).

`diamond_bee_3d.png` is a transparent still of the resting brooch.

## Diamonds
Each stone is a real round-brilliant layout (table, 8 stars, 8 bezels, 16 upper girdles, girdle, 16 lower girdles, 8 pavilion mains), rendered with a custom shader: reflection plus refraction off a pseudo-random back facet, with a separate refractive index per colour channel (2.407 / 2.426 / 2.451) for dispersion, the rainbow "fire". A second, darker bounce gives the high-contrast facet pattern of a real brilliant, and the pattern shifts as the bee moves.
