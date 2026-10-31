# Astera Studio — Design & Technical Note

I approached this assessment as an interaction-design and analytical-trust problem rather than a dashboard-styling exercise. Someone asking a sales question in Chat, checking quarterly KPIs on an iPad, and fixing a broken join on an iPhone is working inside one analytical workflow, so the interface and state architecture needed to connect those steps without contradictory numbers.

## Main Design and Technical Decisions

**Chat-first analytics, scoped pinning, and shared data.** The app opens in Chat so users start from a plain-language business question rather than a complex pipeline editor. Answers pair a chart with a short summary and can be pinned to the Dashboard. Technically, one fictional Northstar Supply ledger and shared TypeScript selectors feed Chat, Dashboard, and Pipeline Detail so totals never diverge across screens. Dashboard `Period` and `Region` filters live in the URL and affect only the executive overview, while pinned Chat answers keep their original question scope and persist locally. Every chart exposes a **Data trail** linking to the pipeline steps behind its numbers, and execution status (`Failed`, `Running`, `Succeeded`, `Scheduled`) is separated from the last published snapshot timestamp so a failed run never overwrites or misrepresents valid data. Timestamps use a deterministic demo clock (`09:45 PKT`) for repeatable reviewer evaluation.

**Modular foundation and zero-dependency visualization.** Before building Dashboard and Pipeline Detail, I defined explicit acceptance criteria, design tokens, component contracts, and living `/style-guide` and `/components` routes rendered from real React and SVG primitives. Using React 19, TypeScript, native `<dialog>` elements for accessible focus trapping, and lightweight native SVG plots instead of heavy charting or graph libraries (such as Recharts or React Flow) kept bundle size small, screen-reader accessibility predictable via hidden semantic data `<table>` fallbacks, and static export (`out/`) seamless without backend infrastructure.

**Responsive Pipeline Detail and simulated execution.** Rather than treating Pipeline Detail as a desktop-only graph, attempting arbitrary DAG authoring, or shrinking a miniature canvas onto phones (which I ruled out at the design stage), the four-step flow (`Read sales → Filter regions → Join targets → Calculate attainment`) adapts per device over one shared store:
- **Desktop (`1440px`):** Horizontal directional step chain beside a persistent inspector so upstream/downstream context stays visible.
- **Tablet (`768–1024px`):** Touch-sized vertical steps paired side-by-side with a contextual inspector.
- **Phone (`375px`):** Connected vertical execution timeline opening a focused `<dialog>` step editor for thumb-friendly field editing without horizontal panning.

Deterministic client-side simulation makes a real repair workflow testable without a backend: inspecting the failed `Join targets` step, changing `region_name` to `region_id`, saving the draft without prematurely altering published figures, and rerunning to publish updated attainment data.

## An Idea Tried and Dropped

The first implemented UI used a **Fieldnotes** direction with warm cream surfaces (`#F6F5F1`) and forest-green accents across bordered cards. After reviewing the rendered Chat and Dashboard screens in the browser, I dropped and replaced it: uniform light cards flattened hierarchy between headline KPIs and metadata, and the palette felt generic. A brief dark `/design-lab` trial also surfaced generic AI-dashboard habits—navy-tinted surfaces, nested borders, and coloured pill badges—which I discarded as well. That iteration led to **Neutral Carbon**: neutral graphite surfaces, `Geist Sans` with `tabular-nums`, hairline KPI grouping, round chart scales, and one restrained blue accent (`#8EA8D8`). Browser testing also caught practical usability bugs fixed before delivery, including a mobile pipeline connector transform that interfered with touch step selection.

## AI Tools, Key Prompts, and My Direction

I used **OpenAI Codex** to decompose requirements, compare initial visual directions, define tokens/component contracts and the shared dataset, implement the React/Next.js screens and responsive pipeline store, and run verification checks. I used **Google Antigravity (Gemini Argon)** to inspect rendered views across viewports, critique weak visual treatments, iterate to Neutral Carbon, verify responsive/touch behaviour, and prepare final documentation and packaging.

Key prompts that shaped the implementation:
1. **Architecture & data:** *"Extract every requirement and convert it into explicit acceptance criteria."* / *"Define a shared fictional sales dataset that will drive Chat, Dashboard and Pipeline Detail consistently."* — Established the single ledger, shared selectors, and retained-snapshot model.
2. **Reusable system:** *"Build reusable UI components."* / *"Create /style-guide and /components using actual reusable components."* — Enforced token-driven primitives verified in living routes before full screen assembly.
3. **Pipeline UX & state:** *"Do NOT shrink the desktop pipeline into a miniature canvas."* / *"Build a dedicated connected vertical execution timeline."* / *"Save without automatically publishing new data."* — Drove the phone timeline + dialog editor and decoupled draft saves from execution.

Throughout, I directed the product and engineering decisions: requiring an original interface and design-system-first build order, reviewing rendered UI to reject Fieldnotes and decorative AI-dashboard patterns, enforcing consistent data and mobile pipeline ergonomics, requiring multi-viewport touch verification, and coordinating Codex and Antigravity across iterations.
