# Pisces — constellation loader

An art deco progress indicator. Progress (0–100) draws a gold line from the top star through all 16 stars of Pisces.

| State    | Progress | What you see                                              |
|----------|----------|-----------------------------------------------------------|
| Default  | 0        | The 16 stars only, slightly dimmed, no lines              |
| Progress | 1–99     | A line travels star to star from the top; each star lights up as it's reached |
| Complete | 100      | All 17 links drawn; orbits turn slowly, the gold shimmers |

## Run
Open `index.html` in a browser (no build step, no dependencies), or serve the folder:

    npx serve .

## Use
```html
<div id="sky"></div>
<script src="pisces-loader.js"></script>
<script>
  const loader = PiscesLoader(document.getElementById('sky'), {
    onUpdate: ({ percent, state, from, to, litCount }) => {}
  });
  loader.setProgress(40);
</script>
```
Copy the `.pl-*` rules from `style.css` along with it.

## How it flows smoothly
- Everything is live SVG built in code, so it stays sharp at any size and has a transparent background.
- Progress maps to the drawn length of the whole path, so the line moves at an even speed whatever the segment lengths.
- The shown value eases toward the target (up to 55%/s forward, faster when rewinding), so bursty progress events still read as one continuous stroke.
- Each star pops and glows when the line reaches it; tick terminals and midpoint diamonds appear as each link is drawn.
- `loader.starMarks` gives the % at which each star is reached (used for the diamond notches on the progress track).
- Drawing order and star positions live in `STARS` and `EDGES` at the top of `pisces-loader.js`.
- Honors `prefers-reduced-motion`.

`pisces_artdeco.svg` and `pisces_artdeco_connected.svg` are the static start and end frames.

## Two indicators: indeterminate + determinate
- **Indeterminate** (progress unknown): `loader.setIndeterminate(true)`. A short gold comet runs the whole path from the top star to the circlet and wraps around; stars flare as it passes. No percentage is shown and the progress bar drops `aria-valuenow` in favour of "Loading, progress unknown".
- **Determinate** (0–100%): `loader.setIndeterminate(false)` then `loader.setProgress(n)` as usual. Calls to `setProgress` made during the loop are remembered and applied on hand-over, which eases from wherever the loop is.
- "Simulate" in the demo starts in indeterminate (waiting for the server), then hands over to determinate once progress is known.
