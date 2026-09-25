# Fresh Cut — a 90s film loader

A progress indicator built from your final photograph. The fringe starts whole, and as progress rises an invisible blade runs along the diagonal and each lock drops away.

| State    | Progress | What you see |
|----------|----------|--------------|
| Default  | 0        | Hair uncut: the lower locks sit joined to the fringe |
| Progress | 1–99     | The blade (a soft glint) travels left to right along the cut line; locks it passes drop and settle with a tiny bounce. 50% = half the fringe cut |
| Complete | 100      | The full cut, matching the original photo |

## Run
Serve the folder (canvas needs the images over http):

    npx serve .        # or: python3 -m http.server

## Use
```html
<canvas id="cut"></canvas>
<script src="cut-loader.js"></script>
<script>
  const loader = CutLoader(document.getElementById('cut'), {
    onUpdate: ({ percent, state }) => {}   // 'empty' | 'progress' | 'complete'
  });
  loader.ready.then(() => loader.setProgress(50));
</script>
```

## How it works
- `base.webp` is your photo with the cut locks removed and the skin rebuilt underneath.
- `frag.webp` holds only the cut locks, on transparency.
- The canvas draws the locks in 5-pixel strips. Each strip is offset back up toward the fringe (`UNCUT` in `cut-loader.js`) until the blade reaches it, then eases into its original place. That's why 50% shows exactly half the fringe cut.
- The shown value chases the target (up to 50%/s forward, faster when rewinding), so jumpy progress still reads as one steady snip.

## The 90s camera look
- A warm film grade on the canvas (slight sepia, lower saturation, a touch of contrast).
- Animated film grain, redrawn about 12 times a second.
- An orange light leak drifting on the left edge, plus a soft vignette.
- An orange date stamp in the classic `'98 M DD` layout, using today's date.
- A white-bordered print, slightly tilted, with a frame counter.
- An LCD readout with a 24-exposure film counter that counts down as the cut progresses.

`uncut_start_frame.jpg` is a still of the 0% state.

## Two indicators: indeterminate + determinate
- **Indeterminate** (progress unknown): `loader.setIndeterminate(true)`. The blade snips part of the fringe, pauses, the hair grows back, and it repeats. No percentage is shown and the progress bar drops `aria-valuenow` in favour of "Loading, progress unknown".
- **Determinate** (0–100%): `loader.setIndeterminate(false)` then `loader.setProgress(n)` as usual. Calls to `setProgress` made during the loop are remembered and applied on hand-over, which eases from wherever the loop is.
- "Simulate" in the demo starts in indeterminate (waiting for the server), then hands over to determinate once progress is known.
