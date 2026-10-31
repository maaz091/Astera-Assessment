# Astera Studio

Interactive frontend prototype for **Astera Studio** (`Northstar Supply` workspace), designed and built for the Software Developer Intern take-home design assessment. It connects conversational sales analytics, an executive monitoring dashboard, and a device-adapted data pipeline studio around a single shared dataset and local execution store.

- **Source repository:** https://github.com/maaz091/Astera-Assessment
- **Design & technical note:** [`DESIGN_NOTE.md`](./DESIGN_NOTE.md)

## What the Prototype Contains

- **Chat (`/`)** — Natural-language sales and target-attainment questions answered with charts, concise plain-language summaries, pinned insight controls, and direct **Data trail** provenance links.
- **Dashboard (`/dashboard/`)** — Executive KPI strip, regional vs. target comparison chart, monthly sales trend chart, URL-synced `Period` and `Region` overview filters, pipeline health/freshness status, and a persistent **Saved from Chat** section where pinned answers keep their original question scope.
- **Pipeline Detail (`/pipeline/`)** — Four-step sales attainment pipeline (`Read sales → Filter regions → Join targets → Calculate attainment`) with step inspection, editable `Filter regions` and `Join targets` configurations, separated draft-save vs. run/publish semantics, and deterministic simulated execution across `Succeeded`, `Running`, `Failed`, and `Scheduled` states.
- **Data Trail** — Accessible on every chart in Chat and Dashboard, explaining both the latest pipeline run state and the last valid published snapshot before deep-linking into the relevant pipeline step.
- **Living Design System (`/style-guide/` and `/components/`)** — Reference routes rendering the actual Neutral Carbon tokens, typography scale, status indicators, chart primitives, and interactive controls used across the application.

## Quick Start

### Option 1: View the Compiled Static Export (`mockup/` or `out/`)

Because Next.js static exports reference root-relative `/_next/` bundles and route directories, serve the static folder over any local HTTP server rather than opening `index.html` via `file://`.

From the submission archive root (serving `mockup/`):

```bash
npx serve mockup -l 4173
```

Or with Python 3 (no Node packages required):

```bash
python -m http.server 4173 -d mockup
```

Then open `http://localhost:4173` in your browser. (If serving directly after building from source, replace `mockup` with `out`.)

### Option 2: Run and Build from Source

Requires **Node.js 20+** and **npm**. From the repository root (or the `source/` folder in the submission archive):

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Additional verification and production export scripts:

```bash
npm run typecheck   # TypeScript check (tsc --noEmit)
npm run build       # Static production export to out/
```

## Supported Viewport Sizes & Touch Ergonomics

Layouts adapt structurally to each form factor rather than shrinking desktop views, with minimum `44×44px` touch targets and zero hover-only interactions:

- **iPhone (`375px`)** — Compact top bar with modal navigation drawer, stacked readable KPIs and charts, and a dedicated vertical pipeline execution timeline that opens a full-screen `<dialog>` step editor.
- **iPad (`768px–1024px`)** — Multi-column KPI/chart grids and touch-sized vertical pipeline step cards paired side-by-side with a contextual configuration inspector.
- **Desktop (`1440px`)** — Persistent left navigation rail, hairline-separated KPI strip, two-column overview charts, and a horizontal directional four-step pipeline chain beside a persistent step inspector.

## Guided Demo Journey

1. **Open Chat (`/`)** and click a suggested prompt such as *"Which regions missed target last quarter?"* (or submit your own Q2/Q3 sales question).
2. **Pin the answer** using **Pin answer** on the generated chart card; confirm the button updates to **Pinned**.
3. **Open Dashboard (`/dashboard/`)** to view Q3 executive KPIs (`$1,200,000` revenue, `100%` attainment, `2` regions below target), try switching `Period` (`Q3 2026` / `Q2 2026`) or `Region`, and verify the pinned card under **Saved from Chat** retains its original scope.
4. **Click `Data trail · 4 steps`** on any chart to inspect lineage: notice that published figures still reflect the last valid snapshot (`09:30 PKT`), while the latest run (`09:42 PKT`) failed at **Join targets**. Click **Open pipeline** (or the `03 Join targets` step row) to jump directly to Pipeline Detail.
5. **Inspect `Join targets` (`Step 3 of 4`)** on `/pipeline/?step=join` to read the schema-mismatch diagnostic (`region_name` values like `South` do not match `region_id` values like `south`, leaving `Calculate attainment` `Skipped`).
6. **Correct `Target join key`** from `region_name` to `region_id` and click **Save changes**. Notice configuration state updates (`Changes saved. Run to publish updated data.`) without overwriting published numbers prematurely.
7. **Click `Run pipeline`** to execute the four-step simulation (`Running` → `Succeeded`), updating pipeline status and dataset freshness (`09:46 PKT`), then use **← Back to ...** to return to the originating chart. *(Optional: uncheck `South` in `Filter regions`, click **Save changes**, and click **Run pipeline** to observe live KPI and chart totals recompute across Dashboard and Chat.)*

## Fictional Dataset & Simulated Execution

All screens share a single deterministic fixture (`src/data.ts`) representing **Northstar Supply** (`Apr–Sep 2026`, 24 monthly regional rows across `North`, `South`, `East`, and `West`, with a `$100,000`/month target per region).

To make troubleshooting verifiable immediately on load without a backend, the prototype starts at a fixed demo clock (`09:45 PKT`) with published dataset `v1` (`09:30 PKT`) intact and Configuration `v2` (`09:42 PKT`) failing on `Join targets`. Pipeline edits, run states, and pinned Chat insights persist locally in `localStorage` (`studio-chat-v1`, `studio-pipeline-v1`) and can be reset at any time via **Reset demo** on Pipeline Detail.

## Tech Stack

- **Framework:** Next.js 16 (App Router, `output: 'export'` static site generation) & React 19
- **Language:** TypeScript (strict mode)
- **Visuals & Charts:** Custom CSS token system (`Neutral Carbon`), accessible native SVG bar/line charts with hidden semantic data `<table>` fallbacks, and `lucide-react` iconography
- **Typography:** Self-hosted `Geist Sans` (`400`, `500`, `600`) with `tabular-nums` bundled into static `.woff2` assets at build time

## Relevant Limitations

- **No backend or live LLM:** Question matching covers curated Q2/Q3 2026 regional performance, target attainment, and monthly trend prompts against the fictional ledger; unsupported prompts return helpful guidance toward available metrics.
- **Fixed four-step topology:** Users can inspect all four pipeline steps, edit `Filter regions` and `Join targets`, toggle schedule state, and run/reset deterministic executions, but cannot drag nodes or add arbitrary new pipeline steps.
- **Browser-local persistence & demo clock:** State is stored per browser origin in `localStorage`/`sessionStorage`, and timestamps use deterministic demo labels (`09:30` / `09:42` / `09:45` / `09:46 PKT`) for repeatable evaluation.
- **Static HTTP serving required:** Exported builds (`mockup/` or `out/`) require a local or hosted static HTTP server rather than `file://`.
