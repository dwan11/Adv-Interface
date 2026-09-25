# The Coupe — pour loader

A progress indicator built from a pour animation. Progress (0–100) drives the pour frame by frame.

| State    | Progress | What you see                       |
|----------|----------|------------------------------------|
| Empty    | 0        | Clean, empty coupe                 |
| Pouring  | 25       | Stream running, glass ¼ full       |
| Full     | 100      | Pour finished, glass full, glow on |

## Run
Any static server (images won't load from `file://` in some browsers):

    npx serve .        # or: python3 -m http.server

## Use
```html
<canvas id="cup"></canvas>
<script src="loader.js"></script>
<script>
  const loader = CoupeLoader(document.getElementById('cup'), {
    onFrame: ({ percent, state }) => { /* 'empty' | 'progress' | 'complete' */ }
  });
  loader.ready.then(() => loader.setProgress(25));
</script>
```

## How it flows smoothly
- `frames/` holds the 122 frames of `source-pour.mp4` as WebP (1.5 MB total), preloaded once.
- Adjacent frames are cross-faded, so the pour stays fluid at any speed.
- The playhead chases the target at up to 24 fps (real time) and eases into the last frames, so bursty progress events still read as one pour.
- Going backwards (e.g. reset) fades the glass out and back in instead of "un-pouring".
- Progress→frame mapping is in `KEYS` inside `loader.js`: `[[0,0],[25,38],[100,121]]`. Frame 38 is where the glass is a quarter full; adjust if you swap the video.
- The video has a black background; the canvas uses `mix-blend-mode: screen`, so place it on a dark surface.
- Honors `prefers-reduced-motion` (jumps straight to the frame).

## Two indicators: indeterminate + determinate
- **Indeterminate** (progress unknown): `loader.setIndeterminate(true)`. The glass pours to about a third, pauses, fades empty and pours again. No percentage is shown and the progress bar drops `aria-valuenow` in favour of "Loading, progress unknown".
- **Determinate** (0–100%): `loader.setIndeterminate(false)` then `loader.setProgress(n)` as usual. Calls to `setProgress` made during the loop are remembered and applied on hand-over, which eases from wherever the loop is.
- "Simulate" in the demo starts in indeterminate (waiting for the server), then hands over to determinate once progress is known.
