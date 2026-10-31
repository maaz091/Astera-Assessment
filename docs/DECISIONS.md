# Decisions and tradeoffs

All product requirements derive from the PDF; the following are explicit implementation/design choices. External links are primary technical references checked during planning, not product specifications.

| Decision | Reason | Tradeoff / alternative rejected |
| --- | --- | --- |
| Fieldnotes light palette | Consistent chart contrast, calm hierarchy, fewer theme states | Signal room concept offers stronger monitoring atmosphere but costs extra visual QA |
| Chat is default route | Reflects chat-first brief; leads directly to a demonstrable question | Dashboard-first would surface more numbers immediately but obscure the core ask-and-pin flow |
| Four fixed pipeline steps | Enough to show dependencies, a realistic failure and light editing | Arbitrary graph authoring expands scope and undermines mobile clarity |
| Phone ordered list + full-screen editor | Large touch controls and readable field explanations | Miniature canvas and pinch/zoom demand precision; reject as the primary phone interaction |
| Tablet vertical sequence + inspector | Uses width without removing context while editing | Phone layout stretched to tablet wastes space; desktop horizontal chain would be cramped |
| Data trail footer on every chart | Makes lineage discoverable without competing with the insight | Hidden kebab-only provenance saves space but is difficult to discover |
| Last successful snapshot separate from latest run | Honest freshness during failures; shared across every view | A single status/date pair can falsely imply failed data are current |
| Saved questions keep their own scope | Preserves what the business user actually asked | Global filters over all saved charts would silently rewrite the question |
| Deterministic failed join at entry | Demonstrates inspect → edit → rerun on all devices | Random failures make review unreliable; silent auto-success makes correction meaningless |
| Fixed demo clock | Repeatable labels and test evidence | Not wall-clock freshness; clearly label it as a demo |
| Two chart primitives, one fixture model | Coherent numbers and attainable delivery scope | More chart types increase polish/testing effort without satisfying more requirements |

## Library recommendations

| Choice | Purpose and justification | Deliberately omitted alternative |
| --- | --- | --- |
| React + React DOM | Shared ChartCard/forms and explicit reactive state across three views; reducer/context keeps state changes traceable | Vanilla JS is feasible, but repeated imperative updates across saved charts and runs risk inconsistency |
| TypeScript | Small domain types prevent region, step and status mismatches; no elaborate type abstractions | Plain JS is acceptable if setup time threatens delivery, but planned baseline is TS |
| Vite with React/TS template | Small static production bundle and quick local dev; relative base supports hosting in a subfolder | Next.js/SSR adds server-oriented concepts unnecessary for the brief |
| lucide-react | Consistent restrained icons, import only used icons; labels remain visible | Full UI kit would impose another visual system and require overrides |
| Native SVG + CSS | Two simple plots and four fixed connections are small enough to control precisely and pair with semantic tables | Recharts/ECharts would add API and responsive/accessibility adaptation cost; React Flow is unnecessary for a non-draggable chain |
| Native dialog + form controls | Accessible browser primitives with explicit app focus/guard logic | Headless modal library can help larger apps but is not needed for two constrained dialogs |
| Built-in useReducer/context and hash routing | Small state/route surface; static deployment without rewrites | Redux/Zustand and React Router add dependencies without needed capabilities here |

Technical basis: [React reducer/context](https://react.dev/learn/scaling-up-with-reducer-and-context), [Vite production builds and relative base](https://vite.dev/guide/build), [Lucide React integration](https://lucide.dev/guide/react/), [native dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog). Recommendations are project-specific judgments, not claims that alternatives cannot work. Resolve current compatible stable versions and create a lockfile only when installation is authorized; no unverified version numbers are prescribed.

Testing: use available browser automation if already provided; otherwise prioritize the manual scripted QA checklist plus small domain tests using an existing runner or Node's built-in test facilities. Do not add a large testing stack just for this prototype. Test selectors and state transitions because incorrect totals/stale updates affect core credibility; avoid tests that merely mirror markup.

## Scope budget and cuts

The 3–4 hours are an employer expectation for the assessment, not permission to omit required screens. Treat 240 minutes as a total target including review/planning; see staged budget in AGENT_HANDOFF. If planning consumes more than its allocation, record that fact and reduce optional polish before changing required behaviours.

Keep: all three routes, working question/answer/pin, three KPIs/two charts, freshness and four statuses, responsive connections and phone editing, correction/retry, touch/keyboard support, README/note/zip.

Cut first: animated entry emphasis, toast refinement, custom chart point interactions, extra supported phrasings. Already excluded: dark mode, drag layout, general-purpose pipeline authoring, exports and real AI. No scope cut may leave a visible button nonfunctional; remove optional controls instead.

## Submission-note evidence log

Known AI tool used in planning: OpenAI Codex. Actual prompt 1 is the user's initial instruction to read the PDF, extract requirements, compare directions, define dataset/architecture and produce six documents without implementation. Preserve its wording in the final working log; use a concise quoted excerpt in the note. Prompts 2–3 must come from later actual implementation/verification requests, not invented retrospectively.

Known decisions: compared Fieldnotes and Signal room on paper; rejected a shrunken phone canvas concept. Neither is an implemented experiment yet. To satisfy the “tried and dropped” note honestly, during implementation briefly evaluate a wireframe of the phone canvas or another genuine alternative, record what was tried and the observed reason to drop it. Do not spend time building a full discarded UI. Record actual manual changes; if none were made by the applicant, say so rather than claiming AI edits were manual work.

Open delivery facts: applicant name/university/batch; employer timezone if deadline ambiguity matters; hosting destination if live publication is requested. These do not block planning or implementation. They must not be guessed during packaging/submission. Do not create a repo, publish or send email as part of this planning phase.

## Approved foundation refinement

Next.js replaces Vite at the user's implementation instruction. Use App Router paths and static export (`out/`), not hash routing; no backend features. Reference: https://nextjs.org/docs/app/guides/static-exports . Retain React, TypeScript, native SVG and Lucide. Desktop pipeline must use directional arrow connections, selected outline plus label, and explicit upstream/downstream context. Prioritize inspect → edit Join/Filter → validate → save → rerun → updated data over animation. Keep three KPIs, two charts, four steps. Chat landing stays business-first; failure context belongs with answers and Data trail, prominently explaining retained last-success data.
