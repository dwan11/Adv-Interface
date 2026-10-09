# Tidal Glass & Night Console

The two sets share a functional system and differ in material and mechanism. The page presents components only; “System & specifications” and “State review” are collapsed below each set.

## Purpose

Tidal Glass belongs in a personal evening ritual app. The switch enables a quiet session, checkboxes enable independent sensory options, and radios choose one session duration. These are preferences, not completed tasks, so selecting a checkbox does not strike through its label.

Night Console belongs in a personal music player. The switch enables continuous playback, checkboxes select independent sound processing options, and radios select one sound profile. The prototype saves local preferences; it does not process audio or silence device notifications.

## Shared rules

- Native inputs own state and keyboard behavior. One labeled row is one target. The radio group names differ between sets.
- Row minimum: 64px; panel inset: 28px; label gap: 16px; group spacing: 28px. Mobile inset is 24px, or 20px below 350px.
- Labels use 14/20 medium text. Their reserved width remains fixed across selection. Glass labels float upward 2px; console labels press downward 2px. Neither changes layout. Longer labels wrap; rows may grow.
- Selection communicates through a check/dot, a persistent label surface, and text emphasis. Motion and color are supplementary.
- Default, hover, pressed, selected, focus, disabled, and error are defined together. Hover and press keep selection visible. Disabled inputs cannot change state. Errors include a symbol and readable message.
- Keyboard focus belongs to the complete row. Reduced motion removes movement; forced-color mode reveals native inputs.
- All material highlights assume one upper-left light. Recesses retain dark upper shadows. Mounting plates remain anchored.

## Mechanisms

Tidal Glass: the glass lens travels 38px; the square fills upward; a 10px radio center scales at the fixed SVG point (15,15). The square and dot keep their native proportions in a 40px control column. The label wash flows for 720ms while the words rise 2px over 620ms; a radio ring expands for 700ms.

Night Console: a 96 × 48 mounting plate supports a pivoting rocker; square and circular caps travel 2px into their sockets. Their 38px housings share the rocker’s horizontal center in a 96px column. The label plate and words press downward over 180ms, then the contact illuminates. The amber center/contact indicates engagement; ON/OFF engraving agrees with the current-state text.

## Choreography and resilience

State changes immediately. CSS transitions run from their current visual value, including reversal midway through movement. There are no queued timers, scripted animation restarts, or layout changes during selection. Tidal motion is buoyant: lens 620ms, liquid 560ms, label 620ms and wash 720ms. Console motion is mechanical: rocker 210ms, square cap 150ms, circular cap 190ms, and label plate 180ms. Amber contacts follow travel after 110–160ms.

Selections persist in browser storage. Input values are validated on restoration. Restored states skip entrance transitions. Storage failure leaves controls usable. The two groups remain independent.

## Reviewing

Open State review to inspect hover, press, focus, disabled, and simulated save failure; selected options retain their state in every preview. Enable longer labels and review the complete list at 320px, 390px, and desktop widths. Return to Live interaction for normal input.

## Reference principle

[Inspora’s soft glass workspace picker](https://www.inspora.design/posts/soft-glass-workspace-picker) uses a distinct selected surface while keeping its label stable. We borrow that relationship, rather than its exact rendering. [Refero](https://refero.design/search) provided public product previews; detailed screen inspection required sign-in.

## Motion skill refinement

Selection motion uses reversible CSS transitions. Console caps compress into their sockets while labels scale subtly around a fixed vertical center; no one-shot label keyframes restart during rapid input. Glass labels float without animating letter spacing. Label washes use transform and opacity rather than animated clipping. Indicators engage after the console mechanism seats and release immediately when deselected. Restoring saved state and reduced-motion mode skip movement.
