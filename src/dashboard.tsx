'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ChartCard } from './chat';
import {
  isQuery,
  kpis,
  money,
  percent,
  Query,
  Region,
  regions,
  scopeLabel,
  summary,
} from './data';
import { readChat, writeChat } from './persistence';
import { Badge } from './ui';

type Scope = { quarter: 2 | 3; region: Region | 'all' };
const defaultScope: Scope = { quarter: 3, region: 'all' };

function readScope(): Scope {
  const params = new URLSearchParams(window.location.search);
  const region = regions.find(r => r.toLowerCase() === params.get('region')) || 'all';
  return { quarter: params.get('period') === 'q2' ? 2 : 3, region };
}

export function KpiCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="kpi-item">
      <h2 className="kpi-label">{label}</h2>
      <p className="kpi-value">{value}</p>
      <p className="meta">{detail}</p>
    </div>
  );
}

export default function Dashboard() {
  const [scope, setScope] = useState<Scope>(defaultScope);
  const [pins, setPins] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState('');
  const savedHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const syncScope = () => setScope(readScope());
    const syncPins = () => {
      const { data, warning } = readChat();
      setPins(data.pins);
      setFeedback(warning);
    };
    syncScope();
    syncPins();
    setReady(true);
    window.addEventListener('popstate', syncScope);
    window.addEventListener('storage', syncPins);
    window.addEventListener('focus', syncPins);
    return () => {
      window.removeEventListener('popstate', syncScope);
      window.removeEventListener('storage', syncPins);
      window.removeEventListener('focus', syncPins);
    };
  }, []);

  function changeScope(next: Scope) {
    setScope(next);
    const url = new URL(window.location.href);
    url.searchParams.set('period', `q${next.quarter}`);
    url.searchParams.set('region', next.region.toLowerCase());
    window.history.replaceState(null, '', url);
  }

  function unpin(key: string) {
    const { data } = readChat();
    const next = data.pins.filter(pin => pin !== key);
    const warning = writeChat({ ...data, pins: next });
    setPins(next);
    setFeedback(warning || 'Insight removed from Saved from Chat.');
    savedHeading.current?.focus({ preventScroll: true });
  }

  const query: Query = { ...scope, kind: 'region' };
  const metrics = kpis(query);
  const saved = pins.flatMap(key => {
    try {
      const parsed: unknown = JSON.parse(key);
      return isQuery(parsed) ? [{ key, query: parsed }] : [];
    } catch {
      return [];
    }
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-heading">
          <div className="page-heading">
            <h1>Sales overview</h1>
            <p>Performance against regional targets across Northstar Supply.</p>
          </div>
          <Link className="button secondary" href="/">
            <span>Ask a question</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <section className="overview-filters" aria-label="Overview filters">
          <div className="filter-fields">
            <div>
              <label htmlFor="period">Period</label>
              <select
                id="period"
                value={scope.quarter}
                onChange={e =>
                  changeScope({ ...scope, quarter: Number(e.target.value) as 2 | 3 })
                }
              >
                <option value="2">Q2 2026</option>
                <option value="3">Q3 2026</option>
              </select>
            </div>
            <div>
              <label htmlFor="region">Region</label>
              <select
                id="region"
                value={scope.region}
                onChange={e =>
                  changeScope({ ...scope, region: e.target.value as Scope['region'] })
                }
              >
                <option value="all">All regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="meta filter-note">
            Filters apply to overview · Saved Chat insights keep their original scope
          </p>
        </section>
      </div>

      <section className="dataset-status" aria-label="Dataset freshness and pipeline status">
        <div className="publication">
          <strong>Published 31 Oct 2026, 09:30 PKT (15m ago)</strong>
          <span>Showing last successful data · Inspect Join issue in Data trail</span>
        </div>
        <div className="execution">
          <Badge status="Failed" />
          <span>Run 09:42 PKT · Clock 09:45 PKT</span>
        </div>
      </section>

      <section className="kpi-section" aria-label="Overview metrics">
        <div className="kpi-scope-row">
          <span className="scope-heading" aria-live="polite">
            {scopeLabel(query)}
          </span>
          <span className="meta">USD</span>
        </div>
        <div className="kpi-grid">
          <KpiCard
            label="Revenue"
            value={money(metrics.revenue)}
            detail={`Against ${money(metrics.target)} target`}
          />
          <KpiCard
            label="Target attainment"
            value={metrics.attainment === null ? '—' : percent(metrics.attainment)}
            detail={
              metrics.revenue >= metrics.target
                ? 'Target met for this view'
                : `${money(metrics.target - metrics.revenue)} below target`
            }
          />
          <KpiCard
            label="Regions below target"
            value={String(metrics.below.length)}
            detail={
              metrics.below.length
                ? metrics.below.join(' and ')
                : 'All selected regions met target'
            }
          />
        </div>
        <p className="overview-summary">{summary(query)}</p>
      </section>

      <div className="chart-grid" aria-label="Overview charts">
        <ChartCard query={query} overview />
        <ChartCard query={{ ...query, kind: 'monthly' }} overview />
      </div>

      <section className="saved-section" aria-labelledby="saved-heading">
        <div className="saved-heading">
          <div>
            <h2 id="saved-heading" ref={savedHeading} tabIndex={-1}>
              Saved from Chat
            </h2>
            <p className="meta">Your pinned answers, preserved at the scope you asked for.</p>
          </div>
          <span className="saved-count">{ready ? `${saved.length} saved` : 'Loading…'}</span>
        </div>

        <p className="storage-feedback" role="status">
          {feedback}
        </p>

        {!ready ? (
          <div className="saved-empty" role="status" aria-busy="true">
            Loading saved insights…
          </div>
        ) : saved.length ? (
          <div className="saved-grid">
            {saved.map(({ key, query: savedQuery }) => (
              <ChartCard key={key} query={savedQuery} saved onUnpin={() => unpin(key)} />
            ))}
          </div>
        ) : (
          <div className="saved-empty">
            <div>
              <h3>Keep useful answers here</h3>
              <p>Pin an answer in Chat to revisit it alongside your overview.</p>
              <Link className="text-link" href="/">
                <span>Ask your sales data</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
