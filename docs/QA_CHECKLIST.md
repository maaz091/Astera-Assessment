# QA checklist

Status: acceptance plan only. No application tests have run; unchecked boxes are intentional. Record actual result, viewport/browser and issue reference during implementation. R/U IDs trace to PRODUCT_SPEC. Required defects block delivery; optional polish does not.

## Requirements and main journeys

- [ ] R01/R05/R06: default Chat; submit supplied regional question by tap and Enter; chart + factual summary appear; unsupported question returns honest supported prompts.
- [ ] R07: Pin once, repeat tap, navigate and refresh; exactly one saved insight retains its scope; Unpin removes it; it can be pinned again.
- [ ] R08/R11: Dashboard starts with three KPIs and two charts; Q2/Q3 and region selectors update overview; saved queries explicitly retain saved scope.
- [ ] R09: chart shows last success and latest run separately; all four pipeline states are reachable through retry/schedule; no refresh timestamp advances on failure.
- [ ] R10/R12: each of four steps has purpose, connections and input/output detail; edit Filter and Join with touch; Save/Cancel behave correctly.
- [ ] R11/R12: initial failed Join → choose region_id → Save → Run → Running → Succeeded → originating chart; values and status update everywhere.
- [ ] R13: fixtures and deterministic simulations only; no backend/AI claims, API key input or external data requests.
- [ ] U01/U02: one token system and reused chart/editor components; no imitation of existing Astera screens or per-screen fixture duplication.

## Exact numerical checks

| Scenario | Expected output |
| --- | --- |
| Q3 all | Revenue $1.20M; target $1.20M; attainment 100%; 2 regions below target |
| Q3 regional | North 330k/300k; South 240k/300k; East 270k/300k; West 360k/300k |
| Q3 monthly | Jul 360k; Aug 400k; Sep 440k; target 400k each |
| Q2 all | 1.08M/1.20M; 90%; 2 regions below target; each month 360k/400k |
| Q3 South | 240k/300k; 80%; 1 region below; monthly 70k/80k/90k vs 100k each |
| Successful config excluding South | Q3 960k/900k; 106.7%; 1 region below; monthly 290k/320k/350k |
| Dashboard South selected after South excluded | No data with pipeline exclusion explanation; reset action works; no Infinity/NaN |

- [ ] Check each scenario against Chat, overview, saved matching query and last-success pipeline preview.
- [ ] Summary shortfalls use the same selectors; Q3 South $60k, East $30k.
- [ ] Save alone does not change chart totals; failed run preserves totals; success changes snapshot atomically.
- [ ] Currency units, target marker and target series match the table; axes include zero and do not clip labels.

## State and recovery

- [ ] Initial state: Failed 09:42, last success 09:30, demo clock 09:45; show 15-minute age and v2 differs from successful v1.
- [ ] Rerun without fixing join fails; retained snapshot and actionable mismatch error remain.
- [ ] Schedule shows Scheduled and next demo time; Run now consumes schedule; no promise of a real background job.
- [ ] Repeated Run/Send cannot create parallel operations; navigating away during run does not cancel it.
- [ ] Reset during run invalidates completion; old timer cannot overwrite reset state.
- [ ] Refresh restores saved state; interrupted run restores previous snapshot with interrupted message.
- [ ] Invalid storage and blocked storage recover gracefully; reset only touches app-owned keys.
- [ ] Empty region group cannot save; error linked to field group; join setting saves but runtime validates actual matching.
- [ ] Dirty Save/Discard/Keep editing works for Close, Escape, step change, navigation and browser Back.
- [ ] Invalid route, pipeline and step links have defined fallback; direct pipeline link works without origin.
- [ ] Trail return restores matching card, scope, scroll and focus; missing origin/card falls back to dashboard heading.

## Responsive and touch matrix

Run the three main journeys at every required width. Heights are test recommendations, not employer requirements.

| Viewport | Expected layout | Evidence to capture |
| --- | --- | --- |
| 375×812 | Bottom nav, stacked dashboard, full-screen step editor | Chat answer; dashboard; dirty editor with keyboard; trail |
| 768×1024 | Rail, wrapped overview as needed, vertical steps with inspector | Dashboard and editable Join |
| 1024×768 | Tablet rail and split editor; no tiny desktop chain | Pipeline, filters and trail |
| 1440×900 | Sidebar, three KPIs, two charts, connected steps + inspector | All three routes |

- [ ] R15: no page-level horizontal scroll, clipping, hidden action or overlapping text at any width.
- [ ] R16: all interactive hit areas ≥44×44px, with ≥8px separation for adjacent small actions where practical.
- [ ] Touch-only journey works without hover, drag, pinch, double-tap or precision node selection.
- [ ] Phone virtual keyboard leaves focused field and Save/Send reachable; dismissing keyboard restores usable layout.
- [ ] Bottom navigation and editor actions respect safe areas; last content can scroll above sticky UI.
- [ ] Tablet orientation change preserves draft and selected step; inspect iOS Safari behaviour if a device/simulator is available, otherwise disclose emulation-only verification.
- [ ] 200% zoom reflows; long chart title/status does not collide; empty and failure states fit 375px.

## Accessibility and visual verification

- [ ] Keyboard complete journeys; logical tab order, visible focus, skip link, page headings and landmarks.
- [ ] Dialog title announced; focus contained; Escape respects dirty guard; trigger focus restored on close.
- [ ] Status/shortfall use icon/text as well as colour; no essential content only in a tooltip.
- [ ] Chart has title/description and exact semantic values table with scope caption and header cells.
- [ ] Measure actual text contrast ≥4.5:1 and essential graphic/control contrast ≥3:1; record failures and fix tokens rather than lowering the goal.
- [ ] Screen-reader smoke check: navigation label, Send, pin state, status updates, join field errors and table headers.
- [ ] Reduced motion removes emphasis/spinner motion while retaining progress text.
- [ ] Loading does not shift card height; persistent success state remains after toast disappears.
- [ ] Visual review compares screens to DESIGN_SYSTEM: tokens, type sizes, spacing, chart scales and exact copy. Inspect rendered pages, not source alone.

## Build and submission

- [ ] R14: production build succeeds; browser opens compiled artifact via documented static server; no developer build step required to review.
- [ ] No console errors, missing assets or unexpected network requests; refresh hash routes under subdirectory hosting works.
- [ ] R17–R19: README includes launch steps, demo limitations, supported interactions; about-one-page note includes ideas, genuine discarded experiment, actual AI tools/prompts and truthful manual-change account.
- [ ] Include compiled HTML/CSS/JS, README and note in one folder; verify extracted zip works. Exclude node_modules, caches, tmp screenshots and secrets.
- [ ] Applicant supplies name/university/batch; archive name follows name_uni_batch.zip.
- [ ] R02/R03/R20: record actual time, deadline wording and applicant-owned Reply All submission. Never mark email sent without evidence.
- [ ] U03: planning delivery contains exactly the six requested documents, no installed dependencies, application source or React components.
