'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  LayoutDashboard,
  LoaderCircle,
  MessageSquare,
  Workflow,
  X,
} from 'lucide-react';
import { useRef, useState } from 'react';

export function Button({
  className = '',
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} {...props} className={`button ${className}`.trim()} />;
}

export function Badge({ status }: { status: string }) {
  const key = status.toLowerCase();
  return (
    <span className={`badge ${key}`}>
      {status === 'Failed' && <AlertCircle size={13} aria-hidden="true" />}
      {status === 'Succeeded' && <Check size={13} aria-hidden="true" />}
      {status === 'Scheduled' && <Clock3 size={13} aria-hidden="true" />}
      {status === 'Running' && <LoaderCircle size={13} className="spin" aria-hidden="true" />}
      <span>{status}</span>
    </span>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`card ${className}`.trim()}>{children}</section>;
}

const TRAIL_STEPS = [
  {
    step: '01',
    id: 'read',
    title: 'Read sales',
    detail: 'Monthly regional sales ledger · Apr–Sep 2026',
    input: 'sales_2026 (24 region-month records)',
    output: '24 validated ledger rows',
    status: 'Succeeded',
  },
  {
    step: '02',
    id: 'filter',
    title: 'Filter regions',
    detail: 'Included territories: North, South, East, West',
    input: '24 ledger rows',
    output: '24 active territory rows',
    status: 'Succeeded',
  },
  {
    step: '03',
    id: 'join',
    title: 'Join targets',
    detail: 'Match sales.region_id with targets.region_name',
    input: '24 active rows + 4 regional targets',
    output: '0 matched rows (key mismatch)',
    status: 'Failed',
  },
  {
    step: '04',
    id: 'calculate',
    title: 'Calculate attainment',
    detail: 'Aggregate revenue against quarterly target',
    input: 'Joined regional rows',
    output: 'Retaining 09:30 PKT published snapshot',
    status: 'Skipped',
  },
] as const;

export function Trail({ context }: { context?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="trail"
        onClick={() => ref.current?.showModal()}
      >
        <span className="trail-label">Data trail · 4 steps</span>
        <span className="trail-status">
          <Badge status="Failed" />
          <ArrowUpRight size={15} aria-hidden="true" />
        </span>
      </button>

      <dialog
        aria-label="Data trail"
        ref={ref}
        onClose={() => trigger.current?.focus({ preventScroll: true })}
        onClick={e => {
          if (e.target === ref.current) ref.current.close();
        }}
      >
        <div className="dialog-header">
          <div>
            <h2>Behind this answer</h2>
            <p className="trail-context">{context || 'Regional sales performance'}</p>
          </div>
          <button
            type="button"
            className="icon-close"
            aria-label="Close data trail"
            onClick={() => ref.current?.close()}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="trail-summary">
          Pipeline · Regional sales performance. Latest run failed at{' '}
          <strong>Join targets</strong>; your last successful dataset remains active.
        </p>

        <ol className="steps">
          {TRAIL_STEPS.map(item => (
            <li key={item.id} className={item.status === 'Failed' ? 'step-row is-failed' : 'step-row'}>
              <span className="step-num">{item.step}</span>
              <div className="step-body">
                <div className="step-title-line">
                  <strong>{item.title}</strong>
                  {item.status === 'Failed' ? (
                    <Badge status="Failed" />
                  ) : (
                    <span className={`step-state ${item.status.toLowerCase()}`}>
                      {item.status === 'Succeeded' && <Check size={13} aria-hidden="true" />}
                      {item.status}
                    </span>
                  )}
                </div>
                <span className="step-detail">{item.detail}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className="diagnostic-block">
          <strong>Join fields do not match</strong>
          <p>
            Source <code>region_id</code> was matched against target <code>region_name</code>. The
            next implementation stage will enable changing the target field to{' '}
            <code>region_id</code> and rerunning.
          </p>
        </div>

        <div className="dialog-footer">
          <p className="meta">
            Last successful refresh: 31 Oct 2026, 09:30 PKT
            <br />
            Latest attempt: 09:42 PKT · Demo clock: 09:45 PKT
          </p>
          <Button className="secondary" onClick={() => ref.current?.close()}>
            Close data trail
          </Button>
        </div>
      </dialog>
    </>
  );
}

export function PipelineSequencePreview() {
  const [selectedId, setSelectedId] = useState<(typeof TRAIL_STEPS)[number]['id']>('join');
  const [joinKey, setJoinKey] = useState<'region_name' | 'region_id'>('region_name');
  const selected = TRAIL_STEPS.find(s => s.id === selectedId) ?? TRAIL_STEPS[2];

  return (
    <div className="pipeline-preview">
      <ol className="pipeline-chain" aria-label="Pipeline steps">
        {TRAIL_STEPS.map((item, idx) => {
          const active = item.id === selectedId;
          return (
            <li key={item.id} className="pipeline-chain-item">
              <button
                type="button"
                className={`pipeline-node ${active ? 'is-selected' : ''} ${
                  item.status === 'Failed' ? 'is-failed' : ''
                }`.trim()}
                aria-pressed={active}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="pipeline-node-top">
                  <span className="pipeline-node-num">Step {item.step}</span>
                  {item.status === 'Failed' ? (
                    <Badge status="Failed" />
                  ) : (
                    <span className={`step-state ${item.status.toLowerCase()}`}>
                      {item.status === 'Succeeded' && <Check size={13} aria-hidden="true" />}
                      {item.status}
                    </span>
                  )}
                </div>
                <strong className="pipeline-node-title">{item.title}</strong>
                <span className="pipeline-node-meta">{item.detail}</span>
              </button>
              {idx < TRAIL_STEPS.length - 1 && (
                <span className="pipeline-connector" aria-hidden="true">
                  <ArrowRight size={14} />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="pipeline-inspector" aria-live="polite">
        <div className="inspector-head">
          <div>
            <span className="meta">Step {selected.step} inspector</span>
            <h3>{selected.title}</h3>
          </div>
          {selected.status === 'Failed' ? (
            <Badge status="Failed" />
          ) : (
            <span className={`step-state ${selected.status.toLowerCase()}`}>{selected.status}</span>
          )}
        </div>

        <dl className="inspector-grid">
          <div>
            <dt>Upstream input</dt>
            <dd>{selected.input}</dd>
          </div>
          <div>
            <dt>Step output</dt>
            <dd>{selected.output}</dd>
          </div>
        </dl>

        {selected.id === 'join' ? (
          <div className="inspector-form">
            <div className="field-group">
              <label htmlFor="preview-join-field">Target join key</label>
              <select
                id="preview-join-field"
                value={joinKey}
                onChange={e => setJoinKey(e.target.value as 'region_name' | 'region_id')}
              >
                <option value="region_name">region_name (key mismatch)</option>
                <option value="region_id">region_id (matches source)</option>
              </select>
              <span className="field-hint">
                {joinKey === 'region_name'
                  ? 'Target names (South) do not match source IDs (south).'
                  : 'Ready to save and rerun on the Pipeline Detail screen.'}
              </span>
            </div>
          </div>
        ) : (
          <p className="meta inspector-readonly">
            Read-only preview · Editable configuration lives on Filter regions and Join targets.
          </p>
        )}
      </div>
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <aside aria-label="Workspace navigation">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-copy">
            <strong>Studio</strong>
            <small>Northstar Supply</small>
          </span>
        </Link>

        <nav aria-label="Primary">
          <Link
            aria-current={path === '/' ? 'page' : undefined}
            className={path === '/' ? 'active' : ''}
            href="/"
          >
            <MessageSquare size={18} aria-hidden="true" />
            <span>Chat</span>
          </Link>
          <Link
            aria-current={path.startsWith('/dashboard') ? 'page' : undefined}
            className={path.startsWith('/dashboard') ? 'active' : ''}
            href="/dashboard/"
          >
            <LayoutDashboard size={18} aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
          <button type="button" disabled title="Planned for the next stage">
            <Workflow size={18} aria-hidden="true" />
            <span>Pipeline</span>
          </button>
        </nav>

        <div className="devlinks">
          <Link
            aria-current={path.startsWith('/style-guide') ? 'page' : undefined}
            className={path.startsWith('/style-guide') ? 'active' : ''}
            href="/style-guide/"
          >
            Style guide
          </Link>
          <Link
            aria-current={path.startsWith('/components') ? 'page' : undefined}
            className={path.startsWith('/components') ? 'active' : ''}
            href="/components/"
          >
            Components
          </Link>
          <small className="sidebar-note">Sample data · Local session</small>
        </div>
      </aside>

      <div className="workspace-body">
        <header className="mobile-header">
          <Link className="mobile-brand" href="/">
            <span className="brand-mark" aria-hidden="true" />
            <strong>Studio</strong>
            <span className="mobile-sub">Northstar Supply</span>
          </Link>
          <span className="meta">Apr–Sep 2026</span>
        </header>
        <main id="main">{children}</main>
      </div>
    </>
  );
}
