# Product specification

Status: planning only; no application implementation authorized in this phase.

## Authority and scope

The sole product brief is `reference/Software Developer Intern (Take-Home Design Assessment).pdf`, read in full, including both rendered pages. Page references below refer to that file. This is an original interface, not a reconstruction of any existing Astera product. Working identity: **Studio / Sales workspace**; fictional company: **Northstar Supply**.

PDF requirements are labelled R. Additional user constraints are labelled U. Choices made to turn the brief into a coherent prototype are labelled D; they are not employer requirements. External documentation informs implementation mechanics only.

## Requirement-to-acceptance matrix

| ID | Source / requirement | Explicit acceptance criterion |
| --- | --- | --- |
| R01 | p1: responsive, touch-friendly, clickable HTML mockup | Chat, Dashboard and Pipeline Detail are connected, interactive browser views; all primary flows work with taps and keyboard. |
| R02 | p1: approximately 3–4 hours | Bound implementation to the 240-minute plan in AGENT_HANDOFF; record actual time honestly, including planning time where applicable. |
| R03 | p1: 24-hour deadline; p2: Saturday 31 October, 6 PM | Submission checklist records the stated deadline verbatim. Client date is 31 October 2026; PDF does not state a timezone or year. Do not invent an extension or silently assert an employer timezone. |
| R04 | p1: AI tools allowed; ideas and judgment matter | Make deliberate original design decisions; document AI usage truthfully in the final note. AI use is permission, not a requirement to use extra tools. |
| R05 | p1: chat-first analytics for business users | Initial route is Chat, with a plain-language question field, example prompts and no technical setup required. |
| R06 | p1: answer as chart plus short summary | Supported question produces a labelled chart and one or two factual sentences from shared selectors, not independent hard-coded totals. |
| R07 | p1: pin answer to dashboard | Pin creates one persistent dashboard card with the same query and pipeline identity; repeat pin is idempotent; View dashboard reaches that card. |
| R08 | p1: dashboard with a few KPIs and charts | Default dashboard has three KPI cards and two charts, with scope labels and working period/region controls. |
| R09 | p1: freshness and feeding pipeline status | Every chart exposes last successful refresh and current pipeline status. Running, Succeeded, Failed and Scheduled are reachable, distinct labelled states. Failure never erases the last successful snapshot or pretends it refreshed. |
| R10 | p1: pipeline step detail and connections | Selecting each of four ordered steps reveals its purpose, input/output and settings; connections and upstream/downstream context remain explicit. |
| R11 | p1: applicable graph actions of designer's choice | Implement pin, dashboard filtering and View pipeline; also implement retry after correcting the join. These satisfy the discretionary graph-actions requirement. Chart-type chat editing and graph drilldown are optional examples, not mandatory deliverables. |
| R12 | p1: check and lightly edit pipelines on iPad/iPhone | A user can inspect the failing Join step, correct a join key, save, rerun and see the outcome at 375px and 768px without dragging or zooming a node canvas. Filter regions can also be edited. |
| R13 | p1: invented data; no backend needed | All data are fictional local fixtures; questions and runs are deterministic simulations, clearly identified as a demo. No API keys, accounts, uploads or network data services. |
| R14 | p1: HTML/CSS/JS, single file or small folder; framework unrestricted | Deliver compiled HTML/CSS/JS plus a README with an exact browser launch method; reviewer does not need to compile source. Static HTTP hosting is the planned launch method. |
| R15 | p1: 375px, 768–1024px, 1440px; adapt rather than shrink | Verify 375, 768, 1024 and 1440 CSS-pixel widths. Phone uses stacked content and a dedicated editor; tablet uses touch-sized split views; desktop uses wider spatial connections. |
| R16 | p2: comfortable touch targets; no hover-only functionality | Interactive targets are at least 44×44 CSS px; actions, chart values, provenance and errors work by tap/focus. No required gesture, tooltip or context action depends on hover. |
| R17 | p2: mockup zip/readme, repo or live link | Supply built mockup and README. A live URL is useful if later requested, but final packaging follows the more specific zip instruction below. |
| R18 | p2: about one-page design note | Note explains design ideas, especially pipeline detail; one idea actually tried and dropped; AI tools used; 2–3 actual key prompts; and any changes actually made by hand. Do not misrepresent a concept comparison as an implemented experiment. |
| R19 | p2: folder zipped as name_uni_batch | Package mockup, README and note together; obtain applicant name, university and batch before final naming. Example in PDF is illustrative, not applicant identity. |
| R20 | p2: send zip via Reply All by deadline | Final checklist assigns email submission to applicant; do not send email without an explicit later instruction. |
| U01 | user: original, subtle, professional, functional interface | Follow chosen tokens and layout rules; no existing Astera UI references or copied layouts. |
| U02 | user: modular, reusable implementation | Shared chart card, pipeline status, editor and selectors serve all routes; no duplicated fixtures per screen. |
| U03 | user: plan first, six documents, no installs/components/app | This delivery contains only the six requested planning documents. Implementation begins only after a new instruction. |

## User problem and journeys

A sales manager needs an answer they can trust, keep and revisit. A pipeline failure makes a chart's apparent certainty dangerous: the manager needs to know what the chart includes, when its data last updated and whether a small correction can restore the feed without becoming a data engineer.

1. **Ask and keep an insight.** Start in Chat → choose “Which regions missed target last quarter?” → read regional comparison and shortfall summary → Pin to dashboard → View dashboard. Success: the saved insight retains its question scope and provenance; no duplicate card appears after repeat taps.
2. **Check business performance and trust.** Open Dashboard → read sales, attainment and regions below target → choose Q3 / South → inspect the changed values → notice “Latest run failed; showing last successful data” → open Data trail. Success: filtering changes all overview metrics consistently; historical data remain available with honest freshness.
3. **Repair a pipeline on the move.** Open the trail's failed Join step → inspect mismatch → choose `region_id` in Targets field → Save changes → Run pipeline → observe Running then Succeeded → return to originating chart. Success: edits persist, charts advance to the new successful snapshot, and the user returns to the same card and scope. Tablet and phone are first-class paths.

## Screen content and behaviour

### Chat

Header: “Ask your sales data”, subheading “Northstar Supply · Demo data”. Initial conversation area contains a welcome and three 44px-high wrapping prompt buttons: “Which regions missed target last quarter?”, “Show monthly sales for Q3”, “Compare sales with target in Q2”. No fake pre-existing user message. Composer: labelled textarea, Send button, brief “Sample questions supported” disclosure. Enter sends; Shift+Enter adds a line; ignore Enter during IME composition. Empty submissions disabled. A short, non-blocking 400ms thinking state precedes the deterministic reply.

Supported intents: region target comparison (Q2/Q3), monthly sales (Q2/Q3). Parse case-insensitive keywords and explicit Q2/Q3; “last quarter” means Q3 2026 relative to the fixed demo clock. Default period Q3; default region all. Other requests return “This demo supports regional targets and monthly sales” with the three working prompts, without fabricating an answer. Each answer owns an immutable query scope, a current snapshot reference, summary, ChartCard and pin action. A successful pipeline run refreshes answers through selectors, including their summary and timestamp.

### Dashboard

Title “Sales overview”; period Q3 2026 and region All regions by default. KPI sequence: Revenue, Target attainment, Regions below target. Default charts: horizontal regional revenue bars with target markers; monthly revenue line with monthly target line. Two charts avoid an oversized library requirement. Pinned answers appear below under “Saved from chat”, each labelled “Saved scope · Q3 2026 · All regions”; overview filters do not silently change saved questions. Each saved card has Unpin. Overview title explicitly says “Filters apply to overview”. Empty saved section is an explanatory line, not a large illustration.

Chart data table is available through a visible “View values” disclosure; it provides exact values on touch and to assistive technology. No bar-click drilldown is required. An excluded region yields “No data: this region is excluded by the pipeline” and a Reset filters action, never a misleading zero target.

### Pipeline detail and mobile editing

Pipeline “Regional sales performance”; persistent summary shows status, last successful refresh, configuration changes since success and a clearly labelled demo schedule. Four steps: Read sales → Filter regions → Join targets → Calculate attainment. Initial selection is the failed join when entered from a failed chart; otherwise Read sales.

Desktop: non-draggable connected step cards across the main area with a 320px inspector at right; no infinite canvas, zoom controls or decorative grid. Tablet: ordered vertical steps, minimum 260px column, beside the inspector. Phone: full-width numbered vertical step list; selecting a step opens a full-screen modal editor with step name, “Step 3 of 4”, input/output labels, previous/next controls, settings, and sticky Cancel / Save changes footer. Native page scrolling and 16px inputs; footer stays above safe-area inset. Changing steps with dirty fields requires Save, Discard or Keep editing. No drag handles or hidden side panel.

Read: read-only `sales_2026.xlsx`, sheet `Regional sales`, 24 fixture rows. Filter: checkbox group North/South/East/West; at least one required. Join: read-only source key `region_id`; editable target field `region_name` or `region_id`; explain that names will not match source IDs. Calculate: read-only formulas and output preview from the last successful run, labelled accordingly. Save commits configuration only; “Changes saved. Run to refresh charts.” Run is disabled while dirty or already running, with visible reason. Cancel discards local edits only.

### Data trail: distinctive chart-to-pipeline navigation

Every ChartCard ends with a quiet bordered footer: small connected-dot motif, “Data trail · 4 steps”, explicit status and a chevron. The entire footer button is at least 44px high; do not nest buttons. Tap/Enter opens a compact provenance dialog: chart title and scope, last successful refresh, four ordered step links with failure indicator, and “Open pipeline”. Selecting Join opens that step directly. At <768px it is a bottom sheet with max-height 85dvh and a visible Close button; at larger widths a centred 480px dialog. Status text never relies on the motif's colour.

Opening the pipeline stores origin route, chart ID, scope and scroll position. A visible “Back to [chart title]” link restores the route, scroll and focus to its Data trail button. On entry, the selected step gets a 160ms border emphasis; reduced motion removes the transition. Direct links without an origin use “Back to dashboard”. This is navigation with traceable context, not an ornamental animated connector.

## Shared fictional dataset (D)

One fixture module owns all facts. USD integer amounts; values below are in **USD thousands**, to be multiplied by 1,000 at fixture creation. One sales row per month/region, 24 total. Region IDs: `north`, `south`, `east`, `west`; labels title-cased. Each region has a target of **100,000 per month** in a separate 24-row targets fixture keyed by month + region_id. Both fixtures also contain region_name labels; joining source IDs to names intentionally returns no match.

| Month 2026 | North | South | East | West | Monthly revenue | Monthly target |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| April | 100 | 80 | 80 | 100 | 360 | 400 |
| May | 100 | 80 | 80 | 100 | 360 | 400 |
| June | 100 | 80 | 80 | 100 | 360 | 400 |
| July | 100 | 70 | 80 | 110 | 360 | 400 |
| August | 110 | 80 | 90 | 120 | 400 | 400 |
| September | 120 | 90 | 100 | 130 | 440 | 400 |

Canonical row shapes: SalesRow = {id, month: YYYY-MM-01, regionId, revenueUsd}; TargetRow = {month, region_id, region_name, targetUsd}. Quarter ranges use inclusive start, exclusive next-quarter start. There are no orders, profit or growth figures unsupported by these fixtures.

| Q3 output | Revenue | Target | Attainment | Variance |
| --- | ---: | ---: | ---: | ---: |
| North | $330,000 | $300,000 | 110% | +$30,000 |
| South | $240,000 | $300,000 | 80% | -$60,000 |
| East | $270,000 | $300,000 | 90% | -$30,000 |
| West | $360,000 | $300,000 | 120% | +$60,000 |
| All | $1,200,000 | $1,200,000 | 100% | $0 |

Q2 total is $1,080,000 / $1,200,000 = 90%; South and East are below target. Q3 example summary: “South missed target by $60,000 and East by $30,000. Combined revenue reached the $1.20M target.” Compute this wording from selectors. Use unrounded values for comparisons. Attainment = sum revenue / sum targets ×100, not an average of region percentages. Below-target count includes only in-scope regions with revenue < target. Display one decimal only when needed; absent/zero denominator yields “—”, not Infinity.

Dashboard filters operate on the **last successful pipeline output**, then aggregate. Pipeline Filter controls available output regions; period/region overview filters never mutate pipeline configuration. Chat and saved queries use their own scope against the same output. Filter targets to the same output months and regions before aggregation. A successful run with South excluded gives Q3 $960,000 / $900,000 = 106.7%, one region below target; monthly revenues $290k/$320k/$350k. This is a required consistency test.

## Simulation, freshness and state

Fixed demo clock starts 2026-10-31 09:45 Asia/Karachi; UI labels “Demo clock · 09:45 PKT”. This is fixture time, not a claim about the current time. Data cover Apr–Sep 2026. Last successful refresh: 09:30, configuration v1 (all regions, region_id join). Latest attempt: 09:42, configuration v2 (all regions, region_name join), Failed at Join. Snapshot v1 remains visible. Initial freshness says “Updated 15 min ago · Latest run failed”; absolute date/time is available in trail. Freshness and run outcome are independent.

Rerun uses committed configuration captured at run start. Running is visible for about 1.2s. With region_name it fails at Join, preserves snapshot and timestamp and offers “Review join”; with region_id it succeeds, replaces output atomically and advances last success to demo time. Advance demo clock by one minute per completed run so relative labels are deterministic. Read/Filter succeed, Join fails or succeeds, Calculate is skipped after a failure. Steps have separate Idle/Running/Succeeded/Failed/Skipped statuses.

“Schedule next run” sets pipeline status Scheduled and next run demo time +15 minutes; retain last attempt result separately. No background timer: show “Demo schedule; use Run now to simulate”. Run now consumes the schedule and transitions to Running. Failed → Running → Failed/Succeeded and Succeeded → Scheduled → Running → Succeeded cover all required statuses without unrelated pipelines. Editing is disabled during Running; runs are owned by the app, not a route component, so leaving the page does not cancel them. Refresh during a run restores the previous snapshot and marks the attempt interrupted/Failed. Reset demo returns initial fixtures and state.

Non-goals: real AI, backend, real file connections, SQL editing, node creation/reordering, authentication, multiple workspaces, dashboard layout dragging, dark mode, exports and arbitrary date ranges. These are deliberately excluded to protect the assessment timebox.

## Approved refinement

Desktop step connectors have arrowheads in reading order; selected step has a reserved 2px teal outline and Selected label. Inspector identifies upstream and downstream steps by name. Failed latest runs never block Chat or Dashboard: answer/chart warnings explicitly retain last-success data and link to Data trail. Keep landing welcoming and business-first. Essential delivery priority: inspect → edit Join/Filter → validate → save → rerun → updated status/data. Scope remains three KPIs, two charts, four steps.

## Approved Neutral Carbon visual override

At the user's explicit instruction (`f59b7b2`), the visual direction moved from light/teal to the **Neutral Carbon** dark analytical system (`docs/DESIGN_SYSTEM.md`), superseding the `dark mode` exclusion in line 110 and replacing the `2px teal outline` above with the `#8EA8D8` cool-blue selection outline (`1px` border + `1px` inset ring on `--surface-elevated` `#232326`, or `2px` inset left bar on compact mobile step rows). All product journeys, canonical dataset figures, freshness semantics, and `R01–R20` functional requirements remain unchanged.
