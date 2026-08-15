# 7YA Igor Living Record Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public 7ya.io experience as Igor Vepretski's living personal record: authentic source media, seven editorial rooms, evidence-first navigation, and the restored black / warm-white / acid-green #7YA visual DNA.

**Architecture:** Keep the existing React/Vite application and working routes. Introduce a new isolated homepage component and a single canonical brand stylesheet rather than adding more overrides to the conflicted `conversion-home.css`. Reuse already-audited public source images, video thumbnails, archive data and existing route components; preserve existing APIs and backend behavior.

**Tech Stack:** React 19, TypeScript, Vite, existing locale helpers, existing AppDeploy runtime, CSS, existing public-source media corpus.

## Global Constraints

- `IGOR VEPRETSKI × #7YA🥷 — NOT FASHION. FORCE.` is the canonical identity statement.
- Igor is the human center; #7YA is the system/signature; Virgil Abloh is a design methodology, not copied branding.
- Background `#0B0B0C`; foreground `#E9E9EE`; muted `#9A9AA3`; accent `#8CFF00`.
- Real Igor / StartOn / public-record media outranks generated imagery.
- No AI-generated image may be presented as documentary evidence.
- No generic SaaS dashboard, gradient glow language, rounded-card soup, or decorative particle field.
- Preserve Hebrew, English and Russian, correct RTL, existing public source links and evidence status.
- Preserve reduced-motion behavior and keyboard/accessibility fundamentals.
- Do not alter backend endpoints in this redesign.
- Production is not considered visually complete until AppDeploy desktop and mobile QA screenshots are manually inspected.

---

### Task 1: Canonical homepage shell and visual test

**Files:**
- Create: `src/IgorLivingRecordHome.tsx`
- Create: `src/igor-living-record.css`
- Modify: `src/App.tsx`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: `useLocale`, `rootHref`, `pageHref`, existing public route URLs and public-source image URLs.
- Produces: `IgorLivingRecordHome(): JSX.Element`, the new home view used by `AppContent`.

- [ ] **Step 1: Reconcile the homepage QA test**

Add a desktop sanity workflow that opens home, verifies `IGOR VEPRETSKI`, `NOT FASHION. FORCE.`, the seven-room index, and follows the public-record/evidence route. Add a mobile workflow that confirms the hero, portrait, room index and primary navigation remain visible without horizontal clipping.

- [ ] **Step 2: Run the existing AppDeploy test baseline**

Use AppDeploy status/version inspection to establish the currently applied v98 baseline and retain it as rollback target.

- [ ] **Step 3: Build the new homepage component**

The component contains, in this order:

1. technical record rail (`7YA / IGOR VEPRETSKI`, current public-record label),
2. full-height Igor hero using a real public portrait,
3. `NOT FASHION. FORCE.` manifesto and person → evidence → action → growth axis,
4. seven editorial room rows: ORIGIN, SERVICE, SIGNAL, CULTURE, STARTON, IDEAS, BUILD,
5. real-source archive spread using known public imagery and direct links,
6. selected public-signal stories with dated/source labels,
7. music section with official clip thumbnails and credits,
8. StartOn mission section with public StartOn imagery/source links,
9. ideas/research/writing section linking to blog, museum and research surfaces,
10. closing invitation into Creator Path / 7YA Companion.

The homepage must not duplicate backend logic or create new private-data flows.

- [ ] **Step 4: Build one canonical homepage stylesheet**

Implement typography as architecture, square geometry, 1px rules, asymmetric editorial grids, large source imagery, monospace metadata, restrained hover movement and dedicated mobile composition. Do not import `conversion-home.css` into the new component.

- [ ] **Step 5: Switch only the home route**

In `src/App.tsx`, replace the home render target from `ConversionHome` to `IgorLivingRecordHome` and update the release label. Leave museum/media/speaker/blog/create/growth routing unchanged.

- [ ] **Step 6: Build/type-check**

Expected: TypeScript/Vite validation passes with no new frontend or backend errors.

---

### Task 2: Make authentic source material the visual body

**Files:**
- Modify: `src/IgorLivingRecordHome.tsx`
- Reuse data/source URLs from: `src/PostPortraitWall.tsx`, `src/EditorialEnrichment.tsx`, `src/ViralFrontispiece.tsx`, `src/MusicSpotlight.tsx`, `src/LifeArchive.tsx`

**Interfaces:**
- Consumes: existing verified public URLs and labels.
- Produces: source-linked visual objects with explicit source/date/status metadata.

- [ ] **Step 1: Select the canonical portrait set**

Use the existing public Wikimedia portrait, mynet public press image, local `igor-hero.jpg`, and original video frames where appropriate. Every source must retain its existing provenance label.

- [ ] **Step 2: Select historical anchor objects**

Represent at minimum: early public record (2011), service era, return to Jesse Cohen / StartOn (2022), fatherhood/identity public signal (2023), media/public-action trail, music/culture, research/7YA system.

- [ ] **Step 3: Preserve evidence boundaries**

External press stays labelled as external/independent coverage; Igor-owned posts stay labelled as owned publishing; StartOn remains a distinct social-impact mission; no metric is recombined into a fictional total.

- [ ] **Step 4: Verify image fallback behavior**

Every remote image gets a truthful local or source-appropriate fallback. A failed remote source must never turn into a fake reconstruction presented as the original.

---

### Task 3: Global brand frame without breaking internal products

**Files:**
- Modify: `src/GlobalNav.tsx` only if markup needs a minimal semantic hook.
- Modify: `src/global-nav.css`
- Create: `src/7ya-brand-frame.css`
- Modify: `src/App.tsx` to import the brand frame.

**Interfaces:**
- Consumes: existing routes and language switcher.
- Produces: consistent header, accent, typography and surface geometry across public pages while preserving each page's functional UI.

- [ ] **Step 1: Restyle global navigation**

Make the header a restrained black editorial rail with warm-white type, acid-green active/interaction signal, square menu surfaces and readable mobile controls.

- [ ] **Step 2: Add scoped internal-page normalization**

Normalize root background, text, border radius, excessive glow/gradient and accent use for `museum-page`, `media-page`, `speaker-page`, `blog-page`, `creator-path` without changing their component logic or forms.

- [ ] **Step 3: Preserve functional exceptions**

Inputs, dialogs, consent controls, destructive/validation states and media players remain clear and conventional enough for usability; aesthetic rules must not hide system state.

---

### Task 4: Deploy, inspect with eyes, and iterate

**Files:**
- AppDeploy remote snapshot files from Tasks 1–3.
- `tests/tests.txt`

**Interfaces:**
- Consumes: AppDeploy deployment + QA screenshots.
- Produces: a visually accepted desktop/mobile build with rollback available to v98.

- [ ] **Step 1: Run AppDeploy preflight**

Call `get_deploy_instructions`, verify no new SDK feature is required, and ensure only changed frontend/test files are submitted.

- [ ] **Step 2: Deploy the redesign**

Deploy once, then poll until terminal status. If validation/build fails, read the deployed snapshot and repair all reported errors in one pass.

- [ ] **Step 3: Inspect actual desktop screenshot**

Manually evaluate first-view identity, portrait crop, hierarchy, line lengths, negative space, image authenticity, section rhythm, CTA visibility and whether the page still resembles a template.

- [ ] **Step 4: Inspect actual mobile screenshot**

Manually evaluate portrait prominence, line wrapping, thumb scanning, room-index density, RTL, navigation, source labels, overflow and bottom-dock/companion collisions.

- [ ] **Step 5: Reject and repair visual failures**

If either screenshot is visually weak, modify the smallest responsible CSS/markup and redeploy. Repeat up to three corrective passes in this execution cycle.

- [ ] **Step 6: Functional verification**

Confirm home, evidence/public record, media, music, StartOn, museum, blog, speaker and creator-path links remain reachable; confirm HE/EN/RU switching; inspect frontend/network errors.

- [ ] **Step 7: Sync successful source to the design branch**

After visual/functional acceptance, commit the new/modified source files to `design/7ya-igor-living-record`. Do not fast-forward `dev` unless the deployed visual result is accepted.

---

## Self-review

- Spec coverage: homepage identity, real media, seven rooms, visual system, mobile, multilingual, evidence, motion and visual QA all map to explicit tasks.
- Placeholder scan: no TBD/TODO or undefined implementation step remains.
- Scope: first release proves the canonical home and global frame; it does not rewrite every internal route's information architecture.
- Safety: no backend/data migration, no invented metrics, v98 remains the rollback target.
