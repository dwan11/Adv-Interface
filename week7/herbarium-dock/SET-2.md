# Set 2: Archival Toolbar (Herbarium Dock)

A vertical toolbar of twelve pressed-flower prints, one birth flower for each month of 2026. The pointer works like a magnifying glass: the print under it swells and its neighbours ease aside. Choosing a month strikes its print in silver foil and opens that month's plate and calendar.

**Prototype:** `week7/herbarium-dock/index.html` (linked from the Week 7 tab of the site)

---

## 1. The idea

Set 1 (Bloom Arc) is playful: a bud springs open into a half-circle of tools. Set 2 uses the same toolbar requirements, but its tone is **archival**. It treats the toolbar like a drawer of specimen prints that you look at through a lens.

**The logic is a stone calendar. Each month is an object, and months fill in as the year goes on.**

| State on the stone calendar | State in the toolbar |
|---|---|
| Future month: an empty outlined stone | Future month: a silver **outline** print |
| Current month: a stone placed | Open month: a print **struck in silver foil** |
| Past months: stones already stacked | Filed months: **grey impressions** |

Choosing a month is a function, not decoration. It opens that month: a plate with the large print, its name and meaning, and a ledger with the days of the week set like the stone calendar.

---

## 2. References

| Reference | What is taken from it |
|---|---|
| Stone calendar (image 1) | One object per month. Outline means empty, solid means filled. Months filling up in order. Thin, spaced vertical month letters, `/05` plate numbers, and italic weekday ledgers. The text button is the stone itself: a pebble with the month inside. |
| Silver foil book page (image 2) | Colour. Silver foil prints and white hairline rules on a cool grey board. Monospaced caps for labels. |
| Dried flower print (image 3) | Texture. Ink like a stamp or screen print: rough edges and small gaps where the ink did not take. A lighter grey **shadow print** offset behind the main print. |
| Pinterest motion reference | Vertical toolbar that magnifies under the pointer. The scroll buttons in the reference are **left out on purpose**: the pointer itself is the lens. |

---

## 3. Structure

```
Stage (grey board, grain)
├── Dock column
│   └── Toolbar  role="toolbar", aria-orientation="vertical"
│       ├── Strip: ruled paper strip; its length follows the magnified stack
│       ├── 12 × Tool (button)
│       │   └── Face (drawn at max size, scaled down)
│       │       ├── Art: four stacked prints
│       │       │   ├── shadow: grey print, offset down-left
│       │       │   ├── mark: grey impression (filed)
│       │       │   ├── ink: silver foil (open)
│       │       │   └── line: silver outline (future)
│       │       └── Label: text pebble or icon + text label
│       └── Tooltip slip (paper slip + 14 px hairline)
├── Plate: vertical month letters, /no, large foil print + shadow, flower name, Latin name, meaning
└── Ledger: mon–sun with the month's dates
```

### Slots

| Button type | Rest slot | Max magnification | Max size |
|---|---|---|---|
| Icon | 40 × 40 | 2.15× | 86 × 86 |
| Text (pebble) | 57 × 36 | 1.75× | 100 × 63 |
| Icon + text | 140 × 36 | 1.85× | 259 × 67 |

- Strip padding 12 px, gap between slots 6 px
- Strip width = slot width + 24 px
- Strip has white hairlines down both long sides and a short rule inset at each end, like the ruled lines in image 2

### The twelve prints

All prints are drawn in code from simple petal, leaf and stem shapes, so outline, foil and grey versions always match.

| /  | Month | Birth flower | Latin | Meaning |
|---|---|---|---|---|
| 01 | January | Carnation | *Dianthus caryophyllus* | admiration |
| 02 | February | Violet | *Viola odorata* | faithfulness |
| 03 | March | Daffodil | *Narcissus pseudonarcissus* | new beginnings |
| 04 | April | Daisy | *Bellis perennis* | innocence |
| 05 | May | Lily of the valley | *Convallaria majalis* | return of happiness |
| 06 | June | Rose | *Rosa gallica* | love |
| 07 | July | Larkspur | *Consolida ajacis* | lightness |
| 08 | August | Gladiolus | *Gladiolus communis* | strength of character |
| 09 | September | Aster | *Aster amellus* | patience |
| 10 | October | Marigold | *Calendula officinalis* | warmth |
| 11 | November | Chrysanthemum | *Chrysanthemum morifolium* | longevity |
| 12 | December | Holly | *Ilex aquifolium* | domestic happiness |

The prototype opens on **November**, the current month (6 Nov 2026), so January to October start out as filed impressions.

---

## 4. Configurations

The same structure supports every configuration the brief asks for.

### Alignment

| Align | Strip position | Prints grow | Tooltip slip | Layout |
|---|---|---|---|---|
| Left | Left wall | To the right | Right of the print | toolbar · plate · ledger |
| Center | Middle | Both ways evenly | Right of the print | plate · toolbar · ledger |
| Right | Right wall | To the left | Left of the print | ledger · plate · toolbar |

With right alignment the icon + text label also flips: the print is on the outer edge and the text is right-aligned.

### Button type

| Type | What is in the slot |
|---|---|
| Icon | Flower print only |
| Text | A pebble (from the stone calendar) with the month abbreviation inside. The pebble takes the outline, foil or grey state. |
| Icon + text | Flower print, then `05 · MAY` in mono caps above *Lily of the valley* in italic serif |

All 9 combinations are shown on the page under **Configurations**, each frozen with the lens over its third item.

---

## 5. States

| State | Outline layer | Shadow print | Foil | Grey impression | Size |
|---|---|---|---|---|---|
| **Enabled** (future) | 100% | hidden | hidden | hidden | 1× |
| **Hover** | 100% | 80%, offset −5% / +6.5% (lifts off the page) | hidden | hidden | magnified (up to 2.15×) |
| **Pressed** | 35% | 95%, offset closes to −0.8% / +1% | 90% (ink transfers) | hidden | × 0.9 |
| **Selected** (open month) | hidden | 85%, offset −3% / +4% | 100% | hidden | 1× |
| **Filed** (before the open month) | 45% | hidden | hidden | 100% | 1× |

- Hovering a filed month brings its outline back to 100% over the grey impression.
- Hovering the open month pushes its shadow further out (−6% / +7.5%).
- Text labels go from `#6c7273` to graphite `#2f3435` on hover and when selected.
- Keyboard focus: a dashed graphite ring around the print or pebble. Focus also moves the lens.

### Tooltip slip

A 178 px paper slip (`#eef0f0`) with a grey offset shadow like the prints. It is joined to the magnified print by a 14 px hairline and moves with the print every frame.

```
/05                 MAY
Lily of the valley          ← italic serif 19
Convallaria majalis         ← italic serif 13
───────────────────────
FILED · RETURN OF HAPPINESS ← mono caps; "OPEN ·" for the open month
```

---

## 6. Motion

### The magnifier (hover)

1. The pointer's vertical position is read in the toolbar's **resting** coordinates.
2. Each slot's scale is a cosine bump around the pointer:
   `s = 1 + (M − 1) · p · (cos(π·d/R) + 1) / 2`, for `d < R`
   - `d` = distance from the pointer to the slot's resting centre
   - `R` = 2.8 slots (≈ 129 px for icons)
   - `p` = how present the lens is (0 to 1)
3. Gaps grow 60% as much as the prints.
4. The stack is then shifted so **the point under the cursor stays still**. The print you aim at grows in place instead of sliding away from you, and the strip grows up and down from that point.
5. Smoothing: the pointer follows with τ 45 ms, and the lens fades in and out (`p`) with τ 85 ms.

Only `transform` is animated. Each face is drawn at its largest size and scaled down, so the stamped prints are rasterised once and never redrawn during motion.

| Distance (slots) | 0 | ±1 | ±2 | ±3 |
|---|---|---|---|---|
| Icon scale | 2.15× | 1.82× | 1.22× | 1.00× |

### Press and select (stamp)

| Phase | Time | What happens |
|---|---|---|
| Press | τ 50 ms | Print shrinks to 0.9×, shadow closes up under it, foil starts to show |
| Strike | 0–560 ms | Foil comes down from 1.14× and slightly up-right, overshoots to 0.95×, then 1.015×, then settles |
| Lift | 0–700 ms | Shadow stays under the print for the first 30%, then slides out to −3% / +4% |
| Plate | 0–900 ms | The large print on the plate is struck the same way. The ledger and plate text change at once |

Months before the chosen one switch to grey impressions and months after it switch back to outline, with a 240 ms crossfade.

### Reduced motion

The lens still works but follows the pointer with no smoothing. The strike and lift animations are turned off.

---

## 7. Texture and colour

| Token | Value | Use |
|---|---|---|
| Board | `#cfd2d2` (+ `#e2e4e4` highlight) | Stage, sheets |
| Strip | `#d8dbdb` | Toolbar strip |
| Rule | `rgba(255,255,255,.85)` | Hairlines, outline prints |
| Foil | gradient `#fbfcfc → #c3c7c8 → #f1f3f3 → #a9aeaf → #e9ebeb → #b7bbbc` | Open month, plate print |
| Impression | `#9da3a4` | Filed months, shadow prints |
| Plate | `#b9bebe` | Plate card |
| Graphite | `#2f3435` / `#4b5152` / `#6c7273` | Text |

**Stamp filter** (foil and grey prints):
- Fractal noise displacement (1.8) for rough, hand-printed edges
- A second noise layer knocks small holes in the ink where it "did not take"
- A fine dark grain over the ink only, so the foil looks like image 2

**Outline filter:** a light displacement (1) and a 0.9 px grey drop shadow under the white line, which gives the silver line an embossed edge.

**Grain:** a multiply noise layer over the board, plate and sheets.

### Type

| Use | Font |
|---|---|
| Month letters, plate number | Inter 200, spaced vertical letters (from image 1) |
| Flower names, weekdays, dates | Cormorant Garamond italic |
| Labels, plate notes, controls | IBM Plex Mono caps, letter-spacing .12–.14em (from image 2) |

---

## 8. Interaction and accessibility

| Input | Behaviour |
|---|---|
| Mouse | Move along the strip to magnify; click to open the month |
| Touch | Drag along the strip to scrub (the lens follows the finger); lift to open the month under it |
| `↑` `↓` | Move along the strip (roving tabindex; only the open month is in the tab order) |
| `Home` / `End` | First / last month |
| `Enter` / `Space` | Open the focused month |

- `role="toolbar"`, `aria-orientation="vertical"`, label "Months of 2026"
- Each button: `aria-label="May, Lily of the valley"`, `aria-pressed` on the open month
- A polite live region announces "July 2026 open: Larkspur."
- Keyboard focus drives the same lens and tooltip, so keyboard users see the same magnifier as mouse users

### Small screens

- Under 980 px the ledger is hidden
- Under 760 px the plate gets smaller and the configuration grid becomes one column
- Under 520 px only the toolbar remains on the stage, and the bottom corner captions are hidden

---

## 9. Page sections

1. **Stage**: live toolbar, plate and ledger, with Align and Button controls
2. **States**: Enabled, Hover, Pressed, Selected and Filed for icon, text and icon + text
3. **Configurations**: 3 alignments × 3 button types
4. **The magnifier**: the falloff curve, with each slot's scale marked
5. **System**: structure, alignment, motion and key notes
