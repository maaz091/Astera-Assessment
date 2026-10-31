# Component contracts and state architecture

These are planned contracts, not implemented components. PRODUCT_SPEC owns behaviour/data; DESIGN_SYSTEM owns tokens/layout. Components must not introduce independent metrics or status logic.

## Routes and navigation

Use hash navigation for static-host compatibility. Routes: `#/chat` (default), `#/dashboard`, `#/pipelines/sales-performance?step=join`. Allowed step IDs: read, filter, join, calculate. Unknown route shows a compact Not found view with Go to Chat; unknown pipeline shows Pipeline unavailable; invalid step falls back to read. Browser Back/Forward must work. Route title updates document.title and route navigation focuses the page heading, except a return-to-chart action restores its triggering button.

Dashboard scope is serialized as `?period=q3&region=all` on its hash route; accepted periods q2/q3, regions all/north/south/east/west; invalid values normalize to defaults. Chat query scopes live on messages. Origin context is session state `{route, chartId, scrollY, triggerId}` and survives a refresh through sessionStorage. Direct pipeline URLs need no origin. Route handler must guard navigation when editor draft is dirty; use centralized navigation and restore the current hash if browser Back triggers the guard.

## Planned module layout

| Module | Responsibility |
| --- | --- |
| src/app | App, AppShell, hash route parser, route guard, StoreProvider, simulation effect |
| src/data | Immutable sales and targets fixtures, initial snapshot/config and demo clock |
| src/domain | Types, query parser, aggregate selectors, pipeline executor, formatters, reducer, persistence validation |
| src/components/ui | Button, IconButton, Field, StatusBadge, Dialog, Toast, EmptyState |
| src/components/analytics | KpiCard, ChartCard, RegionBarChart, MonthlyLineChart, ValuesTable, DataTrail |
| src/components/pipeline | StepSequence, StepCard, StepInspector, StepSettingsForm, RunControls |
| src/features/chat | ChatPage, MessageList, Composer, PromptSuggestions |
| src/features/dashboard | DashboardPage, OverviewFilters, SavedInsights |
| src/features/pipeline | PipelinePage, MobileStepEditor; same settings form as inspector |
| src/styles | tokens.css, global.css, layout.css, component styles |

No generic graph engine, generalized schema form framework or plugin architecture. CSS Grid/Flexbox handles layout; semantic HTML handles interaction; SVG handles the two charts. Desktop and phone sequence presentations share the same ordered step data and selection state.

## Domain contracts

| Entity | Fields / invariant |
| --- | --- |
| QuerySpec | kind: region-target or monthly-sales; period: q2/q3; region: all or RegionId; label derived from query; immutable after creation |
| PipelineConfig | version integer; includedRegions nonempty unique RegionId[]; targetJoinField region_id/region_name |
| Snapshot | id, configVersion, config copy, refreshedAt, joinedRows; only replaced after successful execution |
| JoinedRow | month, regionId, revenueUsd, targetUsd; unique month/region; amounts integer dollars |
| PipelineRuntime | status Running/Succeeded/Failed/Scheduled; lastAttempt result + errorStepId + attemptedAt; lastSuccessAt; nextRunAt nullable; activeRunId nullable |
| Message | id, role user/assistant, content; assistant optional QuerySpec and chartId; status thinking/ready/unsupported; no JSX in state |
| PinnedInsight | id, query, sourceMessageId, createdAt; dedupe by normalized kind+period+region; chart ID stable across rerenders |
| EditorDraft | stepId, initialConfigVersion, editable values, dirty, fieldErrors; local until saved |
| TrailOrigin | route including scope, chartId, triggerId, scrollY; references existing card when possible |

Selectors: selectRows(snapshot, query), selectRegionComparison, selectMonthlySeries, selectKpis, selectSummary, selectFreshness(runtime, clock), selectStepPreview. All return data structures, not presentation markup. Empty results and zero denominators are explicit. Formatters centralized: USD full/compact, percentage, absolute PKT date/time. No reading Date.now during render for demo freshness.

## Component API boundaries

| Component | Inputs | Outputs / responsibilities |
| --- | --- | --- |
| AppShell | route, workspace label | Navigation landmarks, skip link, responsive shell; emits navigate intent |
| StatusBadge | exact status enum | Icon + text + semantic colour; no fetching or inferred freshness |
| Composer | pending, onSubmit(text) | Trimmed nonempty text; preserves unsent text on unsupported response; accessible Send |
| ChartCard | id, query, selected data, summary, pipeline runtime, pinned, action permissions | Shared heading, scope, plot, values disclosure, pin action and trail; emits pin/unpin/openTrail; no nested clickable card |
| RegionBarChart / MonthlyLineChart | normalized series, accessible title, units | Responsive SVG, stable scales, legend; no local dataset or app-state mutation |
| ValuesTable | same normalized series as chart | HTML table with caption, headers and exact values |
| KpiCard | label, formatted value, supporting text | Presentation only; never aggregates |
| OverviewFilters | period, region, available options | Emits complete next scope; native labelled select controls |
| DataTrail | chart context, steps, runtime, origin | Modal semantics; emits navigateToStep or navigateToPipeline; closes before route changes |
| StepSequence | ordered steps, selectedId, step results | Ordered semantic list; desktop connectors decorative; emits selectStep |
| StepInspector | selected step, draft, last successful preview | Shared information layout; embeds settings form and run-state explanation |
| StepSettingsForm | draft, field errors, disabled, onChange | Same form on all sizes; labelled read-only output for noneditable steps |
| MobileStepEditor | open, step, draft, callbacks | Full-screen dialog, previous/next step guard, dirty-close guard, safe-area footer |
| RunControls | runtime, dirty, configChanged, onRun, onSchedule | Primary action matches state; blocks concurrent runs; explains disabled state |
| Dialog | open, titleId, initialFocusRef, returnFocusRef, onCloseRequest | Native dialog wrapper; focus return, scroll lock, Escape, no inaccessible custom overlay |

## State ownership and events

Use React useReducer + separate state/dispatch contexts. Store owns committed pipeline config, runtime, snapshot, conversation, pins, demo clock and dashboard filters. Local state owns open trail, editor draft, values disclosure and input text. Hash owns current route. App-level effect owns a single simulated run timer; reducer remains pure. Built-in reducer/context is sufficient for this small shared graph; see [React guidance](https://react.dev/learn/scaling-up-with-reducer-and-context).

Events: SUBMIT_QUESTION → RESOLVE_QUESTION; PIN_INSIGHT / UNPIN_INSIGHT; SET_OVERVIEW_SCOPE; SAVE_CONFIG; START_RUN → COMPLETE_RUN; SCHEDULE_RUN; RESET_DEMO. START_RUN captures config and creates unique runId; COMPLETE_RUN must match activeRunId, otherwise ignore stale completion. SAVE_CONFIG increments version but never updates snapshot. COMPLETE_RUN atomically updates status, step results, clock and (only on success) snapshot. Reset cancels timer and invalidates activeRunId. Repeated Pin, Send and Run taps are guarded.

Persist schemaVersion=1 under localStorage `studio-sales-demo-v1`: config, snapshot, messages excluding pending entries, pins, scope, clock, runtime excluding timer handles. Validate on load and fall back to initial fixture state if invalid. A persisted Running state becomes Failed with “Run interrupted by refresh”, retaining snapshot; pending chat is discarded with a nonblocking notice. Missing/blocked storage falls back to memory with “Changes last for this session” notice, never crashes. Reset clears only this application's keys. No network or personal data.

## Validation and error contracts

Filter requires ≥1 region; show error at the group and focus it on invalid Save. Join field choices are constrained to fixture schema; `region_name` is a valid saved configuration but fails execution with a clear mismatch diagnostic. This is intentional: validation does not pretend to execute the join. Read/Calculate are read-only. Save with stale initialConfigVersion rejects with “Settings changed; reload this step” (single-user safeguard). Runtime errors never clear a successful chart.

For modal behaviour use standard [HTML dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) with explicit close handling and iOS testing. Do not rely only on native behaviour for focus restoration, dirty-state guarding or labelling. Backdrop tap requests close rather than bypassing the guard. Keep editors and trail dialogs mutually exclusive.

## Delivery contract

Build with Vite to dist, relative asset base `./`, hash routes. README provides static-server instructions and optional deployed link; do not claim double-click file:// support unless verified separately. Include compiled assets in the delivery so no build is required for review. No CDN runtime libraries, network fonts or remote data. Desktop and mobile must use the same artifact. Lock exact dependency versions when implementation is authorized; no packages are installed at planning time.

## Foundation implementation override

User authorized Next.js foundation and Chat only. App Router paths replace hash routes; static export replaces Vite dist. Dashboard and Pipeline Detail remain deferred. Shared ChartCard, Button, Badge, Card and Trail are exercised by /components and /style-guide. Chat owns versioned local persistence pending integration with the future shared reducer.
