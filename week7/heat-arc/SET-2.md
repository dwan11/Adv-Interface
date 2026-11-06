# Set 2: Heat Arc

A toolbar of separate soft triangles that fan out of a glowing core. Each tile leaves the core as a circle and flows into a rounded triangle. Every touch heats a tile up in layered purples, like a heat map. Choosing a tool melts its triangle back into a round heat ball that sinks into the core, and the core becomes that tool.

**Prototype:** `week7/heat-arc/index.html` · [live](https://dwan11.github.io/Adv-Interface/week7/heat-arc/)

---

## 1. Tone and function

| | |
|---|---|
| **Tone** | Charged, kinetic, warm-blooded. Calm lilac when cool; energy shows up as heat that builds layer by layer and travels home. |
| **Function** | Pick one tool from a small set without leaving the canvas. The core always shows the current tool. |

**The logic is heat.** The core is the heat source. A tile is cool until you touch it; hovering warms it, pressing makes it hot, choosing it fills it completely. The heat then returns to the core as a single round ball.

---

## 2. References

| Reference | What is taken from it |
|---|---|
| Image 1, rounded-triangle driving controls | Separate soft triangles on an arc; the chosen one grows larger than the rest |
| Image 3, poster with blue shape | Big, bold, justified type as the background texture; one strong accent colour on a quiet field |
| Image 4, metaball heat map | Colour bands that follow the shape's own outline, all in one spectrum, giving momentum and energy |
| Image 3 of Set 1, widget board | The purple palette: lavender, lilac, plum, orchid |
| Pinterest motion | Tiles fan out from one pile along an arc with a spring |

**How it got here:** Set 1 (Bloom Arc) joined everything into one liquid band, but its hover and selection still read like fingers poking out of the band. Set 2 separates the tiles, gives each a clear shape (rounded triangle), and moves the energy into colour: a heat map instead of a bulge. A khaki-and-blue version was tried and replaced with purple to stay in the same family as Set 1.

---

## 3. Structure

```
Stage (blurred lavender backdrop + large justified poster text)
  Status pill
  Dock
    Arc (one SVG, centred on the core)
      Tile × n
        Clip (the tile's own outline)
        Halo (two blurred copies of the outline)
        Base (lilac)
        Warm rings (hover)
        Heat rings (pressed / selected), inner three breathe
        Rim, pulse ring, focus ring
        Icon / label (always upright)
        Tooltip (icon-only)
    Core (60 px round button)
Controls: Align · Button · Tools
States sheet · Selecting strip · System notes
```

### The system

| Option | Values |
|---|---|
| Alignment | **Center**: arc up to 160° over the core. **Left**: core in the left corner, 100° sweep clockwise. **Right**: mirrored. |
| Button | **Icon** (name as a tooltip on hover) · **Text** · **Icon + text** (icon above label) |
| Tools | 3, 4 or 5 (Add, Voice, Photo, List, Brush) |

### Measurements

| Part | Value |
|---|---|
| Core | 60 px circle |
| Tile depth | 80 (icon, text) · 92 (icon + text) |
| Tile shape | Rounded triangle, tip toward the core; corner radii 18 (tip) and 26 (outer); outer edge bowed to follow the arc; straight sides |
| Gap between tiles | 10 px at the outer edge |
| Outer edge length | about 95 px; the radius grows with the number of tools to keep it |
| Circle form | diameter 0.74 × tile depth, centred on the tile's centre |
| Type | Inter Tight 700, 10.5 px uppercase, +0.09 em |

### Colour

| Token | Hex | Use |
|---|---|---|
| Page | `#ebe6f0` | Page |
| Lilac | `#f9e9f9` | Tiles, light text on heat |
| Plum | `#5a1c5f` | Icons, labels, controls |
| Ink | `#3d1043` | Body text |

**Heat spectrum** (outer → inner, each band is the tile outline scaled around its centre, then softened with a 2.6 blur):

| Scale | Hex | Band |
|---|---|---|
| 1.00 | `#b04ad0` | Violet edge |
| 0.90 | `#f3c9f7` | Pale rim |
| 0.80 | `#6c2a72` | Plum body |
| 0.50 | `#e7a6ee` | Orchid ring |
| 0.37 | `#46124b` | Deep plum |
| 0.25 | `#1e0622` | Core |

**Warm spectrum** (hover): `#d7a3e4` → `#ecd0f2` → `#f5e2f7` → `#f9e9f9`.

Halo: the outline blurred twice, violet `#b04ad0` (blur 9) and plum `#6c2a72` (blur 22).

---

## 4. States

| State | Tile | Content |
|---|---|---|
| Enabled | Cool lilac, thin white rim | Plum |
| Hover | Warm rings fade in (pale orchid at the edge), faint halo, lifts 7 px outward, 105% | Icon 108%; tooltip after 250 ms (icon-only) |
| Pressed | Heat rings at 92%, squeezes to 93% | Lilac |
| Selected | Full heat map, violet halo breathing, 113% (117% on hover) | Lilac |

| Core | |
|---|---|
| Enabled | Purple heat-map circle with a breathing ring; shows the current tool (a target before anything is chosen) |
| Hover | 106%, soft lilac ring and violet glow |
| Pressed | 92% |
| Open | Icon turns into × |

Keyboard focus draws a plum outline around the tile.

---

## 5. Motion

| Moment | What happens |
|---|---|
| Open | Tiles fan out of the core on a spring (stiffness 210, damping 17), 36 ms apart from the middle outward. Each starts as a **circle** and flows into a **rounded triangle** over 620 ms (ease-out). |
| Close | Tiles turn back into circles (200 ms, ease-in) while they fold into the core (260 ms). |
| Breathing | The selected tile's core rings scale 86% ↔ 114% and its halo glows, on a 2.6 s cycle; the core button breathes on the same rhythm. |

### Selecting: melt and return (about 1 second)

| Frame | Time | What happens |
|---|---|---|
| Pick | 0 ms | Heat floods the tile; a pulse ring leaves its outline |
| Melt | 0–320 ms | The triangle melts into a round heat ball (ease-in-out) |
| Return | 320–700 ms | The ball sinks along its ray into the core, shrinking to the core's size (ease-in); the other tiles round off and fold away |
| Land | 700 ms | The ball disappears into the core, which flares and pops in the new tool's icon |

**How the morph works:** the triangle and the circle are drawn with the same 12 curve segments. Each point of the triangle has a partner on the circle at the same angle from the tile's centre, so every in-between shape is a smooth blend. All outlines in a tile (base, rings, halo, clip, rim) are redrawn together each frame.

With reduced motion on, tiles only fade and the morph is instant.

---

## 6. Interaction

| Input | Result |
|---|---|
| Click / Enter / Space on the core | Opens or closes the arc |
| ← → (or ↑ ↓) | Move along the arc; Home / End jump to the ends |
| Click / Enter / Space on a tile | Chooses it (melt and return) |
| Esc or a click outside | Closes and returns focus to the core |

The arc is a `toolbar`; each tile is a `button` with `aria-pressed`; the core has `aria-expanded` and names the current tool.

---

## 7. Deliverables

- **Prototype:** `week7/heat-arc/index.html`
- **Drawing:** the States sheet and the five-frame Selecting strip on the same page, generated from the prototype's own code. A Figma copy is still to do.
