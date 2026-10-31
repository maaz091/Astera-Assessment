import { Badge, Button } from '../../src/ui';

const CORE_SWATCHES = [
  { name: 'Canvas', hex: '#101012', note: 'Application background' },
  { name: 'Navigation tier', hex: '#141416', note: 'Sidebar, status bar, recessed tracks' },
  { name: 'Content surface', hex: '#19191C', note: 'Charts, dialogs, composer' },
  { name: 'Elevated surface', hex: '#232326', note: 'Active navigation, interactive hover' },
  { name: 'Subtle separator', hex: '#303034', note: 'Hairlines, chart grid, borders' },
  { name: 'Primary text', hex: '#F4F4F5', note: '15.96:1 on surface · Headings & values' },
  { name: 'Secondary text', hex: '#A1A1AA', note: '6.84:1 on surface · Labels & metadata' },
  { name: 'Tertiary text', hex: '#77777F', note: '3.95:1 on surface · Placeholders & target line' },
  { name: 'Product accent', hex: '#8EA8D8', note: '7.30:1 on surface · Actions & primary series' },
];

export default function StyleGuidePage() {
  return (
    <div className="system-page">
      <div className="page-heading">
        <h1>Style guide</h1>
        <p>
          Neutral carbon analytical system built on typographic hierarchy, measured contrast, and
          disciplined spacing.
        </p>
      </div>

      <section className="system-section">
        <h2>Core neutral palette</h2>
        <p className="meta">
          Opaque neutral surfaces with a single restrained cool-blue accent. Contrast ratios
          measured against primary content surface (#19191C).
        </p>
        <div className="swatches">
          {CORE_SWATCHES.map(swatch => (
            <div className="swatch-item" key={swatch.hex}>
              <div
                className="swatch-chip"
                style={{ background: swatch.hex }}
                aria-hidden="true"
              />
              <div className="swatch-meta">
                <strong>{swatch.name}</strong>
                <span>{swatch.hex}</span>
              </div>
              <p className="meta">{swatch.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="system-section">
        <h2>Typography scale</h2>
        <p className="meta">
          Geist Sans across weights 400, 500, and 600 with tabular lining numerals on financial
          metrics.
        </p>
        <div className="type-specimens">
          <div className="type-row">
            <span className="meta">Page heading · 28px / 600</span>
            <p className="specimen-h1">Sales overview</p>
          </div>
          <div className="type-row">
            <span className="meta">KPI numeral · 34px / 600 · tabular-nums</span>
            <p className="kpi-value">$1,200,000</p>
          </div>
          <div className="type-row">
            <span className="meta">Section heading · 18px / 600</span>
            <p className="specimen-h2">Revenue by region</p>
          </div>
          <div className="type-row">
            <span className="meta">Body copy · 15px / 400</span>
            <p>
              South missed target by $60,000 and East missed target by $30,000. Combined revenue
              was $1,200,000.
            </p>
          </div>
          <div className="type-row">
            <span className="meta">Metadata · 13px / 400</span>
            <p className="meta">Published 31 Oct 2026, 09:30 PKT · Q3 2026 · All regions · USD</p>
          </div>
        </div>
      </section>

      <section className="system-section">
        <h2>Actions & semantic execution states</h2>
        <p className="meta">
          Semantic colour is reserved strictly for pipeline execution state; ordinary metadata
          uses plain text.
        </p>
        <div className="inline-showcase">
          <Button>Primary action</Button>
          <Button className="secondary">Secondary action</Button>
          <Button disabled>Unavailable</Button>
        </div>
        <div className="inline-showcase">
          <Badge status="Running" />
          <Badge status="Succeeded" />
          <Badge status="Failed" />
          <Badge status="Scheduled" />
        </div>
      </section>
    </div>
  );
}
