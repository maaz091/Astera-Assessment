# Implementation handoff

## Current status and boundaries

Planning is complete. The assessment PDF was text-extracted and visually inspected on both pages. No existing Astera UI was consulted. No application, React components or dependency installation has been performed. Stop after delivering these documents; wait for the user's next instruction before implementation. This file does not authorize delegation, publication or email submission.

Read order: PRODUCT_SPEC → DESIGN_SYSTEM → COMPONENT_CONTRACTS → DECISIONS → QA_CHECKLIST. PDF remains sole employer specification; explicit user constraints also apply. If a planning detail conflicts with the PDF, correct the planning detail and record the change. Avoid arbitrary visual decisions: use defined tokens, breakpoints, labels and fixtures.

## Intended result

Original light enterprise interface called Studio, fictional Northstar Supply sales data. Chat asks and pins; Dashboard summarizes and filters; Data trail connects every chart to a four-step pipeline. Phone edits happen in a readable full-screen step form; tablet uses list/inspector; desktop shows connected cards/inspector. Failed latest run coexists with readable last successful data. Correct join, save and rerun to recover.

## Staged 240-minute total target

The employer expects roughly 3–4 hours for the assessment. These allocations include planning, rather than silently adding a new four-hour implementation budget. Replace estimates with actual elapsed time; if planning exceeded its allowance, report actual effort and cut optional polish.

| Stage | Minutes | Work | Exit condition |
| --- | ---: | --- | --- |
| 0. Review and planning (this phase) | 35 | PDF, requirements, design choices and contracts | Six documents ready; user checkpoint |
| 1. Foundation | 25 | Authorized dependency setup, tokens, shell, hash routes, fixture/store/selectors | Responsive shell and verified Q3/Q2 values |
| 2. Ask and monitor | 45 | Chat parser/answer, shared charts, pinning, KPIs, filters | Journey 1 and dashboard filtering work at 375 and 1440 |
| 3. Inspect and edit | 55 | Sequence layouts, shared form, mobile editor, trail, run/schedule transitions | Journey 3 works at phone and tablet widths |
| 4. Verify and refine | 50 | Numerical/state tests; four-width touch/keyboard checks; fix hierarchy/layout | Core QA passes; actual remaining limitations recorded |
| 5. Package and note | 30 | Production artifact, README, one-page note, zip contents check | Browser-accessible package ready; identity needed only for final naming |
| Total | 240 | Includes initial planning allocation | No mandatory journey omitted |

If time is tight, omit optional entry animation and custom chart point interaction. Do not omit touch editing, freshness, real pin/filter state, required widths or submission note. A polished static screenshot is not an acceptable substitute for the clickable flows.

## Implementation order within stages

1. Inspect repository instructions/current files again before editing; preserve any user work. Only then initialize tooling if authorized.
2. Encode fixtures exactly; write pure aggregate/execution functions first. Validate baseline Q3 $1.20M/100%/2 and Q2 $1.08M/90%/2.
3. Establish tokens and shell. Build one reusable ChartCard, two simple SVG plots, values table and status/freshness treatment before duplicating views.
4. Connect Chat, pin and Dashboard to shared selectors. Keep saved scopes separate from overview filters.
5. Build one settings form, then place it in desktop/tablet inspector and phone modal. Add dirty guard before wiring navigation.
6. Implement failed join recovery and schedule simulation; keep configuration, runtime and successful snapshot separate.
7. Wire Data trail, direct-step links and return context. Test direct URL and Back, not just normal button clicks.
8. Complete QA, build static artifact, write truthful note and package. Never claim checks ran if they did not.

## Known sharp edges

- Initial committed config v2 fails while snapshot v1 is valid. This is intentional and must be explained in the UI.
- “Save” is not “Run”; changing configuration must not silently recompute charts.
- Source IDs (`south`) and target names (`South`) intentionally do not match; target region_id fixes the join.
- Filter rows and target rows to the same scope before computing attainment.
- Scheduled is reachable through an explicit demo action; do not imply a real scheduler will execute later.
- Demo timestamps are fixed PKT fixture times, separate from actual submission deadline/timezone.
- Use hash URLs and relative build assets; static HTTP is the supported launch mode, not untested file://.
- Mobile keyboard, focus restoration, dirty Back navigation and interrupted-run reload require deliberate testing.
- Persisted pins contain queries, not frozen divergent data arrays.

## Evidence and submission note

Capture four-width screenshots and an actual QA result log during implementation; current QA is unexecuted. Keep an honest record of AI prompts, actual manual edits and a genuinely evaluated/discarded idea. The Signal room comparison and rejected miniature canvas are planning decisions, not completed UI experiments. A quick annotated layout trial can supply real evidence without building a second application.

Final deliverable should contain dist assets, README and approximately one-page note. README states that data, chat and execution are simulated; describes supported prompts and repair path; supplies exact launch instructions. Applicant name, university and batch are unresolved and must be obtained before archive naming. Submission via Reply All is applicant-owned unless explicitly authorized later. A live site or repo is optional and is not published in this phase.

## Planning verification

Before handoff, verify all six files exist, all PDF requirements including submission details have acceptance criteria, data arithmetic agrees, and no application/install artifacts were introduced. This verifies the plan, not the future application. Final response should summarize direction, architecture, libraries and stages, then stop.

## Current foundation handoff (supersedes planning-only status above)

Authorized foundation and Chat are implemented using Next.js App Router/static export, React, TypeScript and Lucide. Routes: /, /style-guide/, /components/. Build output: out/. This supersedes Vite/hash-routing references in earlier planning sections. Dashboard and Pipeline Detail remain unimplemented; stop here pending the next instruction.

Shared UI primitives and Data trail are in src/ui.tsx; Chat and ChartCard in src/chat.tsx; canonical fixtures/selectors in src/data.ts. Versioned conversation/pins persist in studio-chat-v1 localStorage. Future Dashboard work must integrate those query pins with the shared store. Disabled navigation explicitly defers Dashboard/Pipeline. Data trail explains the Join failure but does not edit or rerun; those are next-stage responsibilities.

Production build and TypeScript checks passed. Bundled Playwright/Edge checked Chat prompts, pinning, reload persistence, Data trail and both component documentation routes at 375, 820 and 1440px with no overflow/page errors. Screenshots were visually inspected. Physical iOS keyboard verification remains pending. Temporary verification script/screenshots are in ignored tmp/. Run npm run dev, npm run build and npm run typecheck; serve out/ over HTTP.


## Dashboard handoff (current)

Implemented `/dashboard/` and enabled Dashboard navigation. Three KPI cards and two shared charts use the canonical fixtures/selectors, extended with region scope and aggregate KPIs; no second dataset. Q3 all-region output is $1,200,000 revenue / $1,200,000 target, 100% attainment, two regions below target. Q2/Q3 and all/four-region filters update metrics, chart values, scope and summary together. URL query parameters preserve overview scope on refresh. Saved Chat scopes remain independent.

Chat and Dashboard share validated persistence helpers for `studio-chat-v1`. Pin in Chat, navigate to Dashboard, unpin and refresh are integrated; conversation remains intact. Storage failures use a session-memory fallback and visible feedback; corrupt saved data recovers without breaking analytics. Saved insights have loading and empty states. Data trail includes the originating chart title/period/region, retains modal focus and restores its trigger. Publication freshness is distinct from latest failed execution; successful data stays available. Responsive monthly SVG maintains readable labels with ResizeObserver. README now includes Dashboard.

Verification: production build and `npm run typecheck` pass. Playwright/Edge tested 375, 768, 1024 and 1440px: all 10 quarter/region combinations at every width (40 total), exact KPI values, filter URL refresh, Chat pin → Dashboard, unchanged saved scope under overview filters, unpin persistence and Chat state, trail context/Escape/focus return, style-guide/component gallery regressions, corrupt-storage recovery, no page errors and no horizontal overflow. Screenshots inspected for phone, tablet and desktop. Verification script/screenshots are in ignored `tmp/dashboard-verify.cjs` and `tmp/dashboard-*.png`.

Remaining: Pipeline Detail/edit/validate/save/rerun and runtime transitions are intentionally unimplemented. Current execution/freshness are the approved fixed demo state, not a live scheduler. Physical iOS touch/keyboard verification and final assessment packaging remain pending. No new libraries. Stop after this Dashboard commit.
