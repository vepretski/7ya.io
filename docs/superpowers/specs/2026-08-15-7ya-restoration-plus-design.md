# 7YA Restoration+ — Canonical Design Spec

**Status:** Approved design direction

**Date:** 2026-08-15

**Owner:** Igor Vepretski

**Canonical statement:** `IGOR VEPRETSKI × #7YA🥷 — NOT FASHION. FORCE.`

## 1. Purpose

Restore 7ya.io to its original identity as a personal, editorial, evidence-first public world centered on Igor Vepretski — not a generic startup site, NGO site, SaaS dashboard, or card-based portfolio.

7YA is the media/system umbrella. Igor is the human center. StartOn, public work, social media, music, writing, research, civic activity and evidence are chapters of one living public record.

## 2. Source of truth

The design system must prioritize the recovered 7YA DNA:

- `#7YA — NOT FASHION. FORCE.`
- manifesto/editorial composition over application UI
- dark black/graphite foundation
- warm white foreground
- acid green brand accent (`#8CFF00`)
- documentary photography and real public-source media
- mono metadata, record IDs, timestamps, coordinates and evidence labels
- square/industrial section markers such as `■`, `→`, `↗`, brackets and quoted labels
- restrained motion
- visual asymmetry used intentionally, not decorative clutter
- one strong message per viewport where possible
- minimal rounded UI, minimal gradients, no generic AI aesthetic

Recovered later design systems (amber/electric blue, beige/red/blue/gold dossier styling) are secondary experiments, not the canonical root identity.

## 3. Brand architecture

### 3.1 Root identity

`7ya.io` = **Igor Vepretski inside the #7YA system**.

The homepage must make Igor unmistakably present within the first viewport through name, portrait, voice, public record and the #7YA signature.

### 3.2 Internal chapters

The site should organize around these canonical rooms:

1. `THE PERSON` — biography, origin, transitions, values and personal journey
2. `PUBLIC RECORD` — evidence, source-linked claims, chronology and corrections
3. `VIRAL WORK` — influential posts, social media, public campaigns and digital reach
4. `MUSIC` — tracks, clips, collaborations and creative identity
5. `STARTON` — the social-impact mission, programs, partners and opportunities
6. `WRITING / IDEAS` — articles, research, frameworks, books and public thinking
7. `BUILD WITH ME` — community, creation path, contact, collaboration and user participation

Existing routes may remain technically stable during migration, but navigation and visual hierarchy must map to this seven-chapter system.

## 4. Homepage composition

### 4.1 Hero

The hero is a statement, not a biography card.

Primary composition:

- `IGOR VEPRETSKI`
- `#7YA🥷`
- `NOT FASHION. FORCE.`
- Hebrew equivalent or contextual line where appropriate
- supporting principle: `Person → Evidence → Action → Growth`

The dominant visual is a real, high-quality portrait of Igor, ideally near full-height on desktop and still visually dominant on mobile.

Small metadata may include items such as:

- `IGOR / 1990—NOW`
- `ISRAEL / DIGITAL / CIVIC / CULTURE`
- `RECORD 001`

Metadata must feel archival/editorial, not like a dashboard.

### 4.2 Immediate record index

Replace generic pathway cards with an editorial chapter index:

- `01 — THE PERSON`
- `02 — PUBLIC RECORD`
- `03 — VIRAL WORK`
- `04 — MUSIC`
- `05 — STARTON`
- `06 — WRITING`
- `07 — BUILD WITH ME`

Each item should feel like a chapter marker in a publication or exhibition catalogue.

### 4.3 Personal density

The homepage must show materially more Igor than the current version:

- portraits
- public-source photos
- social posts
- interviews
- video
- press
- public documents
- music
- quotes
- timeline moments
- StartOn field work

No section should rely on generic imagery when a verified Igor/7YA asset exists.

## 5. Visual system

### 5.1 Core palette

- Background: `#0B0B0C`
- Primary foreground: `#E9E9EE`
- Muted foreground: `#9A9AA3`
- Brand accent: `#8CFF00`

Warm-white surfaces may be used as editorial inversions, but the root identity remains dark-first.

### 5.2 Typography

- primary: neutral grotesk / Helvetica-like / Inter-compatible sans serif
- metadata: monospace
- very large display typography for statements and chapter numbers
- tight tracking for large Latin display text where legible
- strong RTL handling for Hebrew without imitating Latin spacing patterns

### 5.3 Geometry

- square corners by default
- 1px rules and section dividers
- editorial columns and asymmetrical grids
- no repeated rounded cards as the default content primitive
- images can crop aggressively when the subject remains recognizable

### 5.4 Signature marks

Use sparingly:

- `#7YA🥷`
- `■`
- `→`
- `↗`
- `[ ]`
- record numbers
- timestamps
- source labels
- short quoted labels

`#7YA🥷` acts as a stamp/signature rather than a large repeated logo.

## 6. Content hierarchy

Order of trust:

1. real Igor / StartOn / public-record media
2. original post/video/document imagery
3. verified screenshots or archival evidence
4. controlled editorial graphics
5. generated imagery only where no authentic visual source exists and only when clearly non-documentary

The site must never make generated visuals look like historical evidence.

## 7. Motion

Motion is restrained and meaningful:

- short hover displacement
- subtle reveal transitions
- controlled media movement where useful
- reduced-motion support is mandatory

No floating particle fields, cinematic glow loops, generic parallax or decorative AI effects as default behavior.

## 8. Mobile behavior

Mobile is not a compressed desktop.

Requirements:

- Igor remains visually dominant in the first viewport
- chapter index is easily scannable by thumb
- large type remains intentional but cannot force horizontal clipping
- media becomes a deliberate sequence rather than dense masonry
- full RTL correctness for Hebrew
- interactions remain obvious without hover
- no carousel is required for core comprehension

## 9. Content/route behavior

Existing public assets and URLs should not be removed solely for redesign.

Migration principles:

- preserve crawlability
- preserve evidence links
- preserve multilingual support: Hebrew, English, Russian
- preserve media/source attribution
- do not silently rewrite historical claims
- do not merge StartOn into political messaging
- keep public-record and interpretive copy visually distinguishable when needed

## 10. Current-state correction

The current code contains competing visual systems in the same homepage styling layer. Restoration+ must remove this ambiguity by establishing one canonical root token system and one clearly scoped component language.

The homepage must no longer switch conceptually between:

- dark amber/electric-blue startup/editorial styling
- beige/red/blue/gold dossier styling

Those may survive only as deliberately scoped historical/secondary motifs if they serve a specific room.

## 11. Acceptance criteria

The redesign passes only when all are true:

- first viewport unmistakably reads as Igor Vepretski + #7YA
- `NOT FASHION. FORCE.` is visible or immediately discoverable as a canonical brand statement
- recovered black / warm-white / acid-green DNA is visibly dominant
- authentic Igor media appears before generic explanatory UI
- seven chapters are legible and reachable
- no generic SaaS/card-dashboard impression
- no excessive rounded cards
- no generic gradient/AI visual language
- homepage is visually coherent on desktop and mobile
- Hebrew RTL, English and Russian remain functional
- existing evidence and public-source links remain reachable
- reduced-motion behavior remains intact
- performance should not materially regress from the current production baseline

## 12. Non-goals

This redesign does not:

- rewrite Igor's biography from scratch
- delete the evidence architecture
- merge StartOn and political activity into one lane
- add speculative claims or invented metrics
- introduce a new app framework without necessity
- redesign every internal route before the homepage system is proven

## 13. Recommended implementation sequence

1. create canonical 7YA design tokens and visual primitives
2. rebuild the homepage hero and seven-chapter index
3. migrate authentic media into the homepage hierarchy
4. remove/disable competing homepage visual overrides
5. verify desktop/mobile visually
6. verify RTL and three-language content
7. preserve source/evidence links
8. extend the approved language to internal rooms incrementally

## 14. Final design principle

**7YA is not a site about Igor. It is Igor's living public world, organized as evidence, media, culture and action.**
