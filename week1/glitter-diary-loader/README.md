# Glitter Diary — a 2010s sticker loader

An open diary covered in stickers: retro reward badges ("SO FETCH", "WOW!", "RAD!", "YAY!", "COOL", "TOTALLY"), embroidered iron-on patches (star, disco ball, glitter smiley, lightning bolt, daisy, disco cherries), rhinestone strips on clear plastic, a holographic glitter star cluster, and shiny holographic foil stars and hearts. Mall receipts dated 10/03/2010. All artwork is original and drawn in SVG.

| Mode | State | What you see |
|------|-------|--------------|
| Determinate | 0% | Everything still; LOADING is only a faint pencil guide |
| Determinate | 1–99% | Pages flip; every sticker tips to +10° or −10° with each page. The letters of LOADING are pressed on one letter sticker at a time: each lifts in, squashes down onto the page and settles (a new letter every 12.5%, all seven down before 100%) |
| Determinate | 100% | Flipping stops, stickers settle, LOADING peels off in reverse and READY is pressed on; the caption pops to READY |
| Indeterminate | — | Pages keep flipping; letters are pressed on one by one, held, peeled off, and it repeats. No number |

## Run
Open `index.html` in a browser. No build step, no dependencies (fonts from Google Fonts with fallbacks).

## Use
```html
<div id="diary" style="height:540px"></div>
<script src="diary-loader.js"></script>
<script>
  const loader = DiaryLoader(document.getElementById('diary'), {
    onUpdate: ({ percent, state, flips }) => {}   // state: 'empty' | 'progress' | 'complete' | 'indeterminate'
  });
  loader.setIndeterminate(true);
  loader.setIndeterminate(false); loader.setProgress(40);
</script>
```
Copy the `.dl-*` rules from `style.css`.

## How it's made
- Stickers are inline SVG. A shared SVG filter dilates each shape to give it a white die-cut border and a soft shadow; patches use a satin-thread pattern and stitched borders; gems use radial highlights on clear plastic; the star cluster has a silver holographic glitter border.
- Letter stickers are text with an ink outline, a white die-cut ring and a lift shadow. The press animation lifts, squashes and settles; the peel lifts and fades in reverse order.
- Page turns are CSS 3D leaves that fade into the page as they land. Sticker tips use an overshoot curve so they bounce.
- Progress eases toward the target (up to 45%/s forward). Honors `prefers-reduced-motion`.

## Light, texture and "stuck-down" realism
- **Light follows the pointer.** Each sticker's highlight is moved into the sticker's own rotated frame, so the shine always sits on the side facing the light, and gets brighter as the pointer comes closer. Foil stickers also swing their rainbow colours with the light angle. When the pointer is away (or on touch screens) a slow "desk lamp" drifts across instead; with reduced motion it stays put.
- **Different finishes:** embroidered patches are matte thread, badges are glossy vinyl, gems and foil flash hardest.
- **Stuck, not floating:** tight contact shadows; a star straddles the spine and picks up the gutter shadow; stickers hang off the page edges; the receipts have a fold crease and thermal-paper grain.
- **Paper:** a generated paper texture (grain, fibres and soft cloudiness) on the pages, turning leaves and receipts. The same grain and the page's curvature shading are laid over the stickers and letters too, so everything sits in one light.
