import { ChartCard } from '../../src/chat';
import { KpiCard } from '../../src/dashboard';
import { Badge, Button, Card, PipelineSequencePreview, Trail } from '../../src/ui';

export default function ComponentsPage() {
  return (
    <div className="system-page">
      <div className="page-heading">
        <h1>Components</h1>
        <p>Shared UI primitives, analytical charts, and pipeline step patterns used across Studio.</p>
      </div>

      <section className="system-section">
        <h2>Buttons, status indicators & lineage trigger</h2>
        <Card>
          <div className="inline-showcase">
            <Button>Primary action</Button>
            <Button className="secondary">Secondary</Button>
            <Button className="ghost">Quiet action</Button>
            <Button disabled>Unavailable</Button>
          </div>
          <div className="inline-showcase">
            {['Running', 'Succeeded', 'Failed', 'Scheduled'].map(s => (
              <Badge key={s} status={s} />
            ))}
          </div>
          <Trail context="Component gallery · Q3 2026 · All regions" />
        </Card>
      </section>

      <section className="system-section">
        <h2>Editorial KPI strip</h2>
        <div className="kpi-grid">
          <KpiCard label="Revenue" value="$1,200,000" detail="Against $1,200,000 target" />
          <KpiCard label="Target attainment" value="100%" detail="Target met for this view" />
          <KpiCard label="Regions below target" value="2" detail="South and East" />
        </div>
      </section>

      <section className="system-section">
        <h2>Analytical chart cards</h2>
        <div className="chart-grid">
          <ChartCard query={{ kind: 'region', quarter: 3 }} />
          <ChartCard query={{ kind: 'monthly', quarter: 3 }} overview />
        </div>
      </section>

      <section className="system-section">
        <h2>Pipeline sequence & step inspector</h2>
        <p className="meta">
          Directional step chain and inspector hierarchy prepared for Pipeline Detail. Adapts from
          horizontal flow on desktop to native step rows on tablet and phone.
        </p>
        <PipelineSequencePreview />
      </section>
    </div>
  );
}
