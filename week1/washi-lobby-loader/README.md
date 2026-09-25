# Washi Lobby — painting loader

A progress indicator built from an illustration of a double-height hotel lobby: glowing washi walls, a stone wall, a still reflecting pool and a cherry blossom arrangement.

| State    | Progress | What you see |
|----------|----------|--------------|
| Default  | 0        | Sepia ink sketch only, no colour |
| Progress | 1–99     | Colour descends from the skylight like light filling the room: washi walls, then stone and water. Blossoms open one by one from the vase outward. |
| Complete | 100      | Fully painted. The washi wall breathes softly and the blossom shimmers. |

## Run
Open `index.html` in a browser. No build step, no dependencies (fonts load from Google Fonts, with fallbacks).

## Use
```html
<!-- paste the contents of art.svg inline -->
<script src="lobby-loader.js"></script>
<script>
  const loader = LobbyLoader(document.querySelector('svg.lobby'), {
    onUpdate: ({ percent, state, stage }) => {}   // state: 'empty' | 'progress' | 'complete'
  });
  loader.setProgress(40);
</script>
```
Copy the `.lobby[...]` rules from `style.css` for the completed-state breathing.

## How it flows smoothly
- The artwork has two layers: ink lines and colour. The colour sits under a mask whose soft, 220-unit gradient edge slides down from the skylight as progress rises (eased, so the light lingers on the washi).
- Each of the 294 blossoms and 101 buds has its own reveal point based on distance from the vase, so the arrangement opens outward instead of fading in all at once.
- The ink recedes to 60% as the paint takes over, like a finished gouache.
- The shown value chases the target (up to 45%/s forward, faster when rewinding), so bursty progress still reads as one continuous pour of light.
- Only changed opacities are written each frame. Honors `prefers-reduced-motion`.

## Regenerate the art
`python3 gen3.py` rebuilds `art.svg` (edit palette gradients, blossom density, branch spread there).

`washi_lobby_ink.png` and `washi_lobby_painted.png` are transparent stills of the start and end frames.

## Two indicators: indeterminate + determinate
- **Indeterminate** (progress unknown): `loader.setIndeterminate(true)`. A soft band of colour drifts down the sketch and fades away; blossoms open and close in a wave rolling out from the vase. No percentage is shown and the progress bar drops `aria-valuenow` in favour of "Loading, progress unknown".
- **Determinate** (0–100%): `loader.setIndeterminate(false)` then `loader.setProgress(n)` as usual. Calls to `setProgress` made during the loop are remembered and applied on hand-over, after a short cross-fade from the band back to the sketch.
- "Simulate" in the demo starts in indeterminate (waiting for the server), then hands over to determinate once progress is known.
