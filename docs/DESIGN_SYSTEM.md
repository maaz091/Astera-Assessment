# Design system: Neutral Carbon

## Visual direction

Studio uses a neutral, typography-led dark analytical workspace designed for enterprise sales reporting and inspectable pipeline workflows. Visual hierarchy comes from typographic scale, measured contrast, deliberate spacing, and minimal structural separators rather than coloured tiles, gradients, glow effects, or decorative chrome.

Core principles:
- **Neutral foundation**: Pure carbon/zinc neutrals (`#101012` through `#303034`) with zero navy or cyberpunk tint.
- **Restrained product accent**: One muted cool-blue accent (`#8EA8D8`) reserved for primary actions, active navigation, selection, and the primary revenue series.
- **Editorial data typography**: Tabular lining numerals in `Geist Sans` (`400`, `500`, `600`) instead of monospace metrics or bolded labels.
- **Whitespace before containers**: Headline KPIs sit in a unified hairline-divided strip rather than heavy individual cards; ordinary metadata uses plain sentence-case text instead of pill badges.

---

## Colour tokens & verified contrast

Contrast ratios below are computed via WCAG 2.2 relative luminance against the primary content surface (`#19191C`) and application canvas (`#101012`). Small essential text targets `>= 4.5:1`; meaningful graphical marks and controls target `>= 3.0:1`.

| Token | Hex | Usage & verified contrast |
| --- | --- | --- |
| `--canvas` | `#101012` | Application background |
| `--nav-bg` | `#141416` | Sidebar rail, compact freshness bar, recessed bar tracks |
| `--surface` | `#19191C` | Chart containers, composer, modal dialogs |
| `--surface-elevated` | `#232326` | Active navigation item, interactive hover, user message |
| `--border` | `#303034` | Hairline separators, table dividers, chart grid lines |
| `--border-strong` | `#43434A` | Resting input, select, and secondary button borders |
| `--text` | `#F4F4F5` | Primary headings, KPI values, body copy (`15.96:1` on surface, `17.29:1` on canvas) |
| `--text-secondary` | `#A1A1AA` | Labels, metadata, axis ticks, helper copy (`6.84:1` on surface, `7.42:1` on canvas) |
| `--text-tertiary` | `#77777F` | Placeholders, disabled text, dashed target series (`3.95:1` on surface, `4.28:1` on canvas) |
| `--accent` | `#8EA8D8` | Primary buttons (`7.91:1` vs `#101012` ink), active indicator, primary chart series (`7.30:1` on surface) |
| `--accent-hover` | `#A2B9E3` | Primary button and link hover (`9.58:1` vs `#101012` ink) |
| `--accent-ink` | `#101012` | High-contrast dark ink on `--accent` primary buttons |
| `--status-success` / bg | `#7CC49B` / `#16231C` | `Succeeded` pipeline state (`7.92:1` internal contrast) |
| `--status-warning` / bg | `#D9AE6B` / `#241E14` | Freshness caution accent (`8.04:1` internal contrast) |
| `--status-failed` / bg | `#E0878C` / `#261719` | `Failed` pipeline state and join diagnostic accent (`6.57:1` internal contrast) |
| `--status-scheduled` / bg | `#B59CE0` / `#1F1B29` | `Scheduled` pipeline state (`7.05:1` internal contrast) |
| `--status-running` / bg | `#8EA8D8` / `#18202C` | `Running` pipeline state (`6.82:1` internal contrast) |

Semantic status badges (`4px` radius, icon + text) appear strictly on pipeline execution states (`Running`, `Succeeded`, `Failed`, `Scheduled`). Percentages, deltas, scopes, counts, and timestamps render as plain text.

---

## Typography and spacing rhythm

Font family: self-hosted `Geist Sans` (`--font-sans`) loaded via `next/font/google` in weights `400`, `500`, and `600`, with system sans fallback. Financial figures, percentages, deltas, and axis ticks apply `font-variant-numeric: tabular-nums lining-nums` in `Geist Sans` (never monospace).

| Role | Desktop | Tablet | Phone | Weight / line-height / tracking |
| --- | --- | --- | --- | --- |
| Page heading (`h1`) | `28px` | `28px` | `24px` | `600` / `1.2` / `-0.022em` |
| KPI value (`.kpi-value`) | `34px` | `30px` | `26px` | `600` / `1.1` / `-0.03em` (`tabular-nums`) |
| Section heading (`h2`) | `18px` | `18px` | `18px` | `600` / `1.3` / `-0.015em` |
| Card heading (`h2`) | `17px` | `17px` | `17px` | `600` / `1.3` / `-0.015em` |
| Sub-heading (`h3`) | `15px` | `15px` | `15px` | `500` / `1.35` / normal |
| Body copy | `15px` | `15px` | `15px` | `400` / `1.55` / normal |
| Form controls (`select`, `textarea`) | `14px` (`16px` textarea) | `14px` | `16px` | `400–500` / `1.4` (prevents iOS focus zoom) |
| Navigation & buttons | `14px` | `14px` (`11.5px` rail) | `14px` (`12px` dock) | `500` / `1.2` |
| Metadata & chart labels | `13px` (`12px` ticks) | `13px` | `13px` | `400–500` / `1.45` |

All labels and headings use sentence case (no uppercase tracked eyebrows). Spacing follows the `4, 8, 12, 16, 24, 32, 40px` scale. Corner radii remain disciplined: `4px` status tags and bars, `6px` controls and status strip, `8px` primary cards and composer, `10px` modal dialog (`12px` top sheet on mobile).

---

## Responsive composition

Tested across `1440px`, `1024px`, `768px`, and `375px` with zero horizontal overflow and `>= 44px` interactive hit targets:

| Element | Phone (`<= 767px`) | Tablet (`768–1199px`) | Desktop (`>= 1200px`) |
| --- | --- | --- | --- |
| Navigation | `48px` top brand bar + `60px` bottom bar (`Chat`, `Dashboard`, `Pipeline`) with safe-area inset | `76px` left icon+label rail | `220px` left sidebar with brand, primary nav, and system reference links |
| Workspace container | `16px` horizontal inset, `88px` bottom clearance | `24px` inset | `40px` inset, `1120px` max width |
| Chat column | Full content width | Centered `720px` max width | Centered `720px` max width |
| Dashboard filters | Two-column full-width selects (`16px` text) | Inline labelled selects (stacked note below `960px`) | Inline aligned beneath header with right-aligned scope note |
| KPI presentation | Hairline-divided editorial rows (label/detail left, value right) | Three hairline-divided columns | Three hairline-divided columns |
| Overview & saved charts | Single column | Single column `768–959px`; two columns `960–1199px` | Two equal columns (`24px` gap) |
| Data trail | Bottom sheet (`max-height: 86dvh`) | Centered `520px` modal dialog | Centered `520px` modal dialog |
| Pipeline sequence | Native vertical step rows + stacked inspector | `2×2` step grid + inspector | 4-step horizontal directional chain + inspector |

---

## Component & chart rules

- **Charts**:
  - *Regional comparison*: Ordered `North, South, East, West` on a clean round `$0–$400k` domain (`$0, $200k, $400k` on phone; `$100k` steps on desktop/tablet). Single `#8EA8D8` bar fill inside a recessed `#141416` track, `2px` `#F4F4F5` vertical target marker with `1px` dark halo, and tabular revenue + signed target variance text (`+$30k`, `−$60k`) so comparison never depends on colour alone.
  - *Monthly trend*: Clean round `$0–$450k` domain (all regions) or `$0–$150k` domain (single region), `1px` `#303034` horizontal grid lines, dashed `#77777F` target line with square `#A1A1AA` markers, and solid `#8EA8D8` revenue line with haloed circle markers.
  - *Values disclosure*: Semantic HTML `<table>` with scope `<caption>` and `Region/Month`, `Revenue`, `Target`, and `Attainment` columns.
- **Provenance & freshness**: Failed pipeline notices stay understated (`2px` warning left accent on `#141416`) so business answers remain primary while preserving access to Data trail.
- **Motion & focus**: `120ms` colour/border transitions disabled under `prefers-reduced-motion: reduce`; `2px solid #8EA8D8` `:focus-visible` outline (`2px` offset) across all interactive controls.
