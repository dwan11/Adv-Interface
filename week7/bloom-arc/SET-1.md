# Set 1: Bloom Arc

A toolbar folded inside one round button. Tapping the button pours out a single bent pill of tools above it. Choosing a tool pinches it off like a drop of water, and the drop falls back into the button, which then becomes that tool.

**Prototype:** `week7/bloom-arc/index.html` · [live](https://dwan11.github.io/Adv-Interface/week7/bloom-arc/)

---

## 1. Tone and function

| | |
|---|---|
| **Tone** | Soft, liquid, playful. Nothing is square or split; the toolbar behaves like water, swelling, pinching and dripping. |
| **Function** | Pick one tool from a small set without leaving the canvas. The button always shows the current tool. |

**The logic is a drop of water.** The tools live together as one body of liquid. Choosing a tool separates it from the body as a single drop, and the drop goes home to the button.

---

## 2. References

| Reference | What is taken from it |
|---|---|
| Image 1, frosted arc menu | A half-circle band of choices sitting above a round button |
| Image 2 and the Pinterest motion | Items fan out from one pile along an arc, rotating into place with a slight overshoot |
| Image 3, widget board | Colour (plum, lilac, orchid), soft blurred backdrop, fully rounded shapes |

| Image 5, metaball poster | Lobes that join through necks which thin gradually, never with a hard step |

**Changes from the first versions:**
1. The first version split the arc into separate tiles with seams, which read as too close to Google's Material style. The arc became one continuous rounded pill with no dividers, and selection became a liquid cut.
2. In the second version, hover and selection pushed a whole slice outward. That made stiff, stepped bumps, the end tools turned into shapeless blobs, and the plum selection smeared into the band. Now every state is a **round bead** that swells out of the band through soft, thinning necks, with a **crisp disk** on top that gives each state a clear circular shape and clean colour.

---

## 3. Structure

```
Stage (blurred lavender, pink and peach backdrop)
  Status pill
  Dock
    Arc (one SVG, centred on the bud)
      Goo layer: bud blob + per tool: one band slice and one bead (circle)
      Content layer: per tool: hit area, disk, icon, label, tooltip, focus ring
    Bud (56 px round button)
Controls: Align · Button · Tools
States sheet
The drop (6 frames)
System notes
```

### The system

Every configuration uses the same basic structure: a bud plus a band divided into equal slices.

| Option | Values |
|---|---|
| Alignment | **Center**: arc up to 160°, symmetric over the bud. **Left**: bud in the left corner, arc sweeps 100° clockwise. **Right**: mirrored. |
| Button | **Icon** (name shows as a tooltip on hover) · **Text** (word curves along the arc) · **Icon + text** |
| Tools | 3, 4 or 5 (Add, Voice, Photo, List, Brush) |

### Measurements

| Part | Value |
|---|---|
| Bud | 56 px circle |
| Band depth | 52 icon · 48 text · 64 icon + text |
| Band ends | Fully round (radius = half the band depth) |
| Slice length | about 70 px of arc; the radius grows with the number of tools to keep it |
| Icon | 24 px, 1.8 stroke, rounded |
| Label | Figtree 500, 12 px |

### Colour

| Token | Hex | Use |
|---|---|---|
| Plum | `#5a1c5f` | Bud, selected tool, icons |
| Plum hover / press | `#6c2a72` / `#46124b` | Bud and selected states |
| Lilac | `#f9e9f9` | Band |
| Lilac hover | `#f1d5f3` | Hovered tool |
| Orchid | `#e7a6ee` | Pressed tool |
| Ink | `#3d1043` | Labels |

---

## 4. States

Each tool has two circles at its centre:
- a **bead** in the liquid layer, the same lilac as the band. At rest it hides inside the band. When it grows, the liquid filter joins it to the band with smooth necks, so the band swells into a round lobe.
- a **disk** in the crisp layer on top. It carries the colour, so the colour has a clean round edge and never smears.

| State | Bead (band diameter + …) | Disk | Icon |
|---|---|---|---|
| Enabled | hidden (−8 px) | hidden | Plum |
| Hover | +24 px, 4 px outward: a round swell | Light lilac `#f1d5f3` | Lifts 2 px, 112% |
| Pressed | +4 px | Orchid, 86% | 90% |
| Selected | +10 px | Plum | Lilac |
| Selected + hover | +24 px | Plum hover, 106% | Lilac |

The end tools (Add and Brush) behave exactly like the middle ones, so they get the same clear round shape instead of a loose blob.

| Bud | |
|---|---|
| Enabled | Plum, shows the current tool (a star before anything is chosen) |
| Hover / Pressed | Lighter plum at 105% / darker plum at 92% |
| Open | Icon turns into × |

Keyboard focus draws a thin circle around the tool's disk.

---

## 5. Motion

### Liquid

The band, beads and bud are drawn in one single-colour layer with a blur (10) followed by a hard alpha threshold. Shapes that touch flow together, and shapes that pull apart stretch a neck that thins gradually before it breaks, like water. Because this layer is one colour, the blur never mixes colours; colour lives only on the crisp disks above it.

### Open and close

| | |
|---|---|
| Open | Slices start folded at 12 o'clock at 36% size inside the bud, then fan out to their angles on a spring (stiffness 210, damping 17), 34 ms apart, from the middle outward (from the top in corner layouts) |
| Close | Slices sweep back into the bud in 260 ms, ease-in |

### Selecting: the drop (1 second)

| Frame | Time | What happens |
|---|---|---|
| Pick | 0 ms | A plum disk blooms in the chosen slice |
| Pinch | 0–250 ms | Its square sides round in; it lifts 6 px |
| Neck | 150–450 ms | It rises 1.1× the band depth and shrinks to a 44 px ball carrying its plum disk; the liquid between it and its neighbours thins gradually into a neck |
| Snap | 360–580 ms | The strands break and the two cut ends spring back into round tips |
| Fall | 520–920 ms | The band folds into the bud while the drop falls straight down and merges into it |
| Land | 900 ms | The bud squishes and pops in the new tool's icon |

With reduced motion on, slices only fade, and the drop takes 350 ms.

---

## 6. Interaction

| Input | Result |
|---|---|
| Click / Enter / Space on the bud | Opens or closes the arc |
| ← → (or ↑ ↓) | Move along the arc; Home / End jump to the ends |
| Click / Enter / Space on a tool | Chooses it (the drop) |
| Esc or a click outside | Closes and returns focus to the bud |

The arc is a `toolbar`; each tool is a `button` with `aria-pressed`; the bud has `aria-expanded` and names the current tool.

---

## 7. Deliverables

- **Prototype:** `week7/bloom-arc/index.html`
- **Drawing:** the States sheet and the six-frame drop strip on the same page. They are generated from the same code as the prototype, so they always match it. A Figma copy is still to do.
