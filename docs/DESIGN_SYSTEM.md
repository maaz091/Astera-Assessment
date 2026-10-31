# Design system: Fieldnotes

## Direction comparison and selection

Both directions are original concepts developed from the brief, without inspecting an existing Astera UI.

| Criterion | A — Fieldnotes (selected) | B — Signal room |
| --- | --- | --- |
| Visual language | Warm off-white workspace, white panels, ink typography, restrained teal; spacious editorial hierarchy | Deep navy navigation and pipeline surfaces, cool white analytics panels, blue accents; compact operational hierarchy |
| Hierarchy | One obvious action per context; business answer before technical metadata | Status and operational controls first; excellent for constant monitoring, less natural for chat-first users |
| Typography | System sans, large concise headings, tabular numerals, generous line height | Tighter sans with monospace metadata; more technical texture and greater density |
| Usability | Familiar forms and quiet trail footer; reads comfortably on phone | Strong region separation, but more surface transitions and tighter controls need additional touch tuning |
| Chart readability | One consistent white chart surface, dark marks and labels | Light charts remain readable, but moving between dark pipeline and light charts makes semantic colour consistency harder |
| Accessibility | Simple surface/foreground pairs to validate, visible focus ring | Achievable, but needs separate dark/light focus, disabled and status tokens |
| Time cost | Small token set, no theme infrastructure | Additional surface palette and more visual QA |

Select A because hierarchy, legibility and touch editing matter more than a monitoring-console aesthetic. B is not inherently inaccessible; it costs more verification without solving a required journey better. Avoid generic decoration: no gradients, oversized hero artwork, glass effects, dense card shadows or tiny uppercase labels. Distinction comes from proportion, restrained typography and the Data trail pattern.

## Colour tokens

All values are final starting tokens. Verify computed contrast during implementation; do not assume a whole palette passes because a single pair does. Small text target ≥4.5:1; meaningful controls/graphics ≥3:1; focus visible against adjacent surfaces. These are chosen accessibility targets informed by [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/), not additional PDF requirements.

| Token | Hex | Usage |
| --- | --- | --- |
| canvas | #F6F5F1 | Application background |
| surface | #FFFFFF | Cards, inputs, inspector |
| surface-subtle | #EFEFE9 | Read-only blocks and hovered neutral rows |
| text | #202B2A | Titles, body, data labels |
| text-secondary | #52615D | Metadata and helper text; never opacity-reduced |
| border | #D9DED8 | Decorative dividers and card edges |
| control-border | #7C8983 | Input edges and necessary boundaries |
| accent | #176B5B | Primary buttons, active navigation text, revenue marks |
| accent-hover | #105445 | Primary hover/pressed |
| accent-subtle | #E7F2ED | Selected navigation/step background |
| focus | #2459B8 | 3px outline, 2px offset |
| success-text / surface | #246341 / #EDF6EF | Check icon + Succeeded |
| warning-text / surface | #805400 / #FFF4D9 | Freshness caution and excluded scope |
| error-text / surface | #A32D35 / #FCEEEF | Alert icon + Failed and field errors |
| info-text / surface | #2459A6 / #EDF3FC | Running spinner + label |
| scheduled-text / surface | #65508B / #F2EEF8 | Clock + Scheduled |
| chart-secondary | #526CA2 | Optional second actual series only |
| chart-target | #66736E | Dashed target line or target tick |
| chart-grid | #E4E8E2 | Nonessential grid lines |

Primary button text is white. Never use pale surfaces as meaningful chart marks without a contrasting border. Status combines icon, word and colour; do not make revenue red solely because a pipeline failed. Disabled controls use surface-subtle + text-secondary, a disabled attribute and an adjacent reason where needed; no global opacity reduction.

## Typography and rhythm

Font stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. No font download; Inter is used only if locally available. Design and verify using the system fallback. Monospace only for field keys and formulas. Monetary and KPI numbers use tabular-nums.

| Role | Desktop / tablet | Phone | Weight / line-height |
| --- | --- | --- | --- |
| Page title | 28px | 24px | 650 / 1.2 |
| KPI value | 32px | 28px | 650 / 1.15 |
| Section title | 20px | 20px | 600 / 1.3 |
| Card title | 16px | 16px | 600 / 1.4 |
| Body and input | 16px | 16px | 400 / 1.5 |
| Button / compact label | 14px | 14px | 600 / 1.4 |
| Metadata / chart label | 13px | 13px | 400 or 500 / 1.4 |

No text below 13px; inputs stay 16px on phone to avoid focus zoom. Paragraph line length ≤68ch. Heading tracking -0.02em, body normal. Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48px. Page gap 24px desktop/tablet, 20px phone; internal card padding 24px desktop, 20px tablet, 16px phone; label-to-field 8px; field groups 20px. No arbitrary one-off spacing without a documented reason.

Radii: input/button 8px; cards 12px; dialog 16px; status pills 999px. Borders 1px, selected step 2px (reserve space to prevent layout shift). Cards have no shadow. Dialog only: 0 16px 48px rgba(32,43,42,.16), backdrop rgba(20,30,28,.32). Icon size 18px or 20px, stroke 1.75; icon button target 44px. Layer order: base 0, sticky headers 10, mobile navigation 20; modal uses native top layer.

## Responsive composition

Breakpoints: phone <768px; tablet 768–1199px; desktop ≥1200px. Explicitly test 375, 768, 1024 and 1440. Grid children use min-width:0; never hide overflow to mask layout bugs.

| Element | Phone | Tablet | Desktop |
| --- | --- | --- | --- |
| Navigation | Bottom bar: Chat, Dashboard, Pipeline, 64px + safe area; text labels visible | 72px rail with icon + short label, 64px targets | 208px sidebar with workspace name and full labels |
| Content | 16px side inset, single column | 24px inset | 32px inset; max width 1200px |
| Chat | Full width; composer in document/sticky bottom above nav; keyboard must not cover it | Centred conversation, max 760px | Centred conversation, max 800px |
| KPI cards | Revenue full width; other two side by side, labels may wrap | Three equal columns | Three equal columns |
| Charts | Single column, bar min height 248px; line 224px | Two equal columns only if each has ≥300px; otherwise stack | Two equal columns, plot min height 260px |
| Filters | Period and region stacked or two rows; full-width selects | Inline labelled selects, wrapping allowed | Inline aligned to title region |
| Pipeline | Ordered list → full-screen step dialog | Vertical step list + inspector; 20px gap | Connected four-card chain + 320px inspector; 24px gap |
| Trail | Bottom sheet, max 85dvh | Centred 480px dialog | Centred 480px dialog |

At 1440px the 208px rail leaves 1232px; 64px page insets leave 1168px. The pipeline's inspector + gap leaves 824px for four 188px cards and three 24px connectors. At tablet widths use vertical list and minmax(0,1fr) inspector, not that horizontal chain. At 375px there are 343px of content; reserve 72px region labels, 48px value labels and remaining plot width. Use a deliberate sparse scale, not clipped labels.

Content has bottom padding equal to mobile nav + safe area + 24px. Use min-height:100dvh with 100vh fallback. Avoid a fixed composer that fights the virtual keyboard. Modal editor uses its own scrolling body and sticky actions; focus field scrolls into view. At 200% zoom allow breakpoint reflow; no page-level horizontal scroll. Rotate tablet without losing selection or form draft.

## Component states

| Component | Required states and treatment |
| --- | --- |
| Button | Default; pointer hover darkens; pressed uses same dark surface; focus-visible ring; disabled with reason; busy text + spinner and duplicate activation blocked |
| Navigation | Active teal text + pale fill + aria-current; nonactive dark label; full touch target; hover supplementary |
| Form input | Default border; focus ring; error border + message linked via aria-describedby; read-only labelled; dirty form Save enabled; pristine Save disabled |
| Checkbox | Native semantics; 44px row target; checked icon; selected label retained; not colour only |
| Chart card | Ready; loading reserved plot height and aria-busy; no data with reset; pipeline failure keeps last chart and warning; unavailable snapshot explains reason |
| Step | Number, title and status label always visible; selected outline; failed error icon; downstream skipped textual label |
| Dialog | Labelled title, visible close/cancel, initial focus on title or first relevant control, trapped focus, Escape handling, restored trigger focus |
| Toast | role=status, concise text, 5-second duration; persistent card/button state communicates the same result after dismissal |

Dirty dialog Escape/Close opens a confirmation within the same dialog surface, not stacked modal dialogs: Keep editing, Discard changes. Save remains in editor footer. Route navigation while dirty uses the same guard. Error messages describe recovery: “Target names do not match source IDs. Choose region_id, save, then run again.”

## Charts

Regional chart order North, South, East, West remains stable across screens. Horizontal bars start at zero. Shared domain includes max(actual,target) ×1.1; labels show $330k etc., table shows full USD. Target marker per row is a 2px dark vertical tick, labelled in legend. Below-target rows show signed shortfall text; no red/green encoding requirement. On narrow screens use zero and max ticks, not rotated text.

Monthly line: three month labels for each selected quarter, zero-based y axis, solid teal actual with circle markers and dashed dark target with square markers. Legend text “Revenue” / “Target”. Never smooth curves or animate numbers; that would imply precision or intermediate values. Visible values table has Month/Region, Revenue, Target, Attainment columns and a caption identifying scope. SVG has accessible title/description; table is canonical equivalent. No tooltip is needed for essential values.

Only brief 120–160ms opacity/colour transitions; no layout-shifting entry animation. Respect prefers-reduced-motion by disabling transitions and replacing spinner rotation with static progress icon plus Running text. All required actions remain visible on touch; hover adds no exclusive information.

## Desktop flow refinement

Connected steps use visible directional arrowheads, a Selected text label plus 2px accent outline, and named upstream/downstream relationships in the inspector. Preserve the four-step scope and all existing Fieldnotes tokens. Failure warnings retain chart usability and expose Data trail; operational detail does not dominate the welcome screen.
