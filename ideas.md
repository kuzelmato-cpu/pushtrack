# PushTrack Design Ideas

## Approach 1: Industrial Brutalism
<response>
<text>
**Design Movement:** Neo-Brutalism / Industrial Dashboard
**Core Principles:**
- Raw, unapologetic typography — numbers dominate the screen
- Hard edges, no rounded corners, stark contrast
- Data-first: every pixel earns its place by conveying information
- Monochrome base with a single electric accent (neon orange or acid green)

**Color Philosophy:** Near-black (#0D0D0D) background with pure white text. One accent: electric orange (#FF4D00). The harshness communicates effort and discipline — this is a workout app, not a spa.

**Layout Paradigm:** Asymmetric grid with oversized number displays. Stats bleed to the edge. Navigation is a bottom strip of icon-only buttons. Cards have thick 2px borders, no fill.

**Signature Elements:**
- Giant monospace numbers (e.g., "247" fills half the screen)
- Thick horizontal rules as dividers
- Progress bar rendered as segmented blocks, not a smooth fill

**Interaction Philosophy:** Instant, no-nonsense. Tap → immediate feedback. No modals, inline editing only.

**Animation:** Zero decorative animation. Only functional: number counter ticks up when logging, progress block fills.

**Typography System:** `Space Grotesk` (headings, numbers) + `JetBrains Mono` (data values). All caps for labels.
</text>
<probability>0.07</probability>
</response>

---

## Approach 2: Tactical Dark — Military Fitness Tracker
<response>
<text>
**Design Movement:** Tactical / Military HUD aesthetic
**Core Principles:**
- Dark olive/charcoal palette evoking military gear
- Data displayed like a mission briefing — structured, hierarchical
- Subtle scanline texture on backgrounds
- Streaks and goals framed as "missions"

**Color Philosophy:** Deep charcoal (#1A1C1E) base, olive (#4A5240) as secondary surface, amber (#E8A838) as the primary accent. Communicates discipline and mission-focus.

**Layout Paradigm:** Card-based with angular clip-paths on headers. Bottom tab navigation with icon + label. Stat cards use a two-column asymmetric layout.

**Signature Elements:**
- Angled header banners (clip-path diagonal cuts)
- Dotted grid background texture on cards
- Progress bar styled as a "fuel gauge" with tick marks

**Interaction Philosophy:** Deliberate taps. Log button is large and centered — the primary action is always obvious.

**Animation:** Subtle entrance animations (slide up 200ms). Progress bar fills with a smooth ease-out.

**Typography System:** `Barlow Condensed` (headings) + `Inter` (body). Numbers in bold condensed style.
</text>
<probability>0.06</probability>
</response>

---

## Approach 3: Minimal Dark Precision — Sports Analytics
<response>
<text>
**Design Movement:** Precision Sports Analytics / Dark Minimal
**Core Principles:**
- Deep dark background, maximum legibility at a glance
- Numbers are the hero — large, weighted, impossible to miss
- Color used only to encode meaning (red/yellow/green for progress states)
- Generous whitespace makes dense data breathable

**Color Philosophy:** Background: `#0F1117` (near-black with slight blue tint). Surface: `#1A1D27`. Accent: `#4FFFB0` (electric mint — signals achievement). Red `#FF5252`, Yellow `#FFD166`, Green `#4FFFB0` for progress states. Muted text: `#6B7280`.

**Layout Paradigm:** Single-column mobile layout with a sticky bottom nav. Home screen has a hero stat block (today's count + smart target) above the fold. Cards stack vertically with clear visual hierarchy.

**Signature Elements:**
- Circular ring progress indicator for monthly goal
- Streak flame badge with numeric count
- Color-morphing progress bar (red → yellow → green)

**Interaction Philosophy:** One primary action per screen. Log button is a large floating action button. Editing is done inline with a number input sheet.

**Animation:** Smooth number count-up on load. Progress ring draws in on mount. Subtle spring animation on streak badge.

**Typography System:** `Syne` (display headings, big numbers) + `DM Sans` (body, labels). Numbers use tabular figures for alignment.
</text>
<probability>0.09</probability>
</response>
