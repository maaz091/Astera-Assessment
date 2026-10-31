'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { Button, Badge } from './ui';
import { regions, kpis, money } from './data';
import {
  usePipeline,
  steps,
  StepId,
  Config,
  saveConfig,
  run,
  schedule,
  reset,
  stepStatus,
  Freshness,
  time,
} from './pipeline-store';

export default function Pipeline() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(max-width:767px)');
    const sync = () => {
      setMobile(mq.matches);
      if (!mq.matches) dialog.current?.close();
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const s = usePipeline();
  const [selected, setSelected] = useState<StepId>('join');
  const [draft, setDraft] = useState<Config>(s.config);
  const [message, setMessage] = useState('');
  const [origin, setOrigin] = useState<{ url: string; context: string; scroll: number } | null>(
    null,
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(s.config);
  const busy = s.status === 'Running';
  const step = steps.find(x => x.id === selected)!;
  const index = steps.indexOf(step);

  useEffect(() => {
    setDraft(s.config);
  }, [s.config]);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get('step');
    if (steps.some(x => x.id === id)) setSelected(id as StepId);
    try {
      setOrigin(JSON.parse(sessionStorage.getItem('pipeline-origin') || 'null'));
    } catch {}
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const before = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    const click = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a') && !confirm('Discard unsaved changes?')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const back = () => {
      if (!confirm('Discard unsaved changes?')) history.forward();
    };
    window.addEventListener('popstate', back);
    window.addEventListener('beforeunload', before);
    document.addEventListener('click', click, true);
    return () => {
      window.removeEventListener('popstate', back);
      window.removeEventListener('beforeunload', before);
      document.removeEventListener('click', click, true);
    };
  }, [dirty]);

  function discard() {
    return !dirty || confirm('Discard unsaved changes?');
  }

  function select(id: StepId) {
    if (!discard()) return;
    setDraft(s.config);
    setSelected(id);
    setMessage('');
    lastTrigger.current = document.activeElement as HTMLElement;
    if (innerWidth < 768) dialog.current?.showModal();
  }

  function cancel() {
    if (!discard()) return;
    setDraft(s.config);
    dialog.current?.close();
    setMessage('Changes discarded.');
  }

  function save() {
    if (!draft.included.length) {
      setMessage('Select at least one region.');
      return;
    }
    if (saveConfig(draft)) {
      setMessage('Changes saved. Run to publish updated data.');
      dialog.current?.close();
    }
  }

  const editor = (
    <>
      <div className="inspector-head">
        <div>
          <p className="meta">Step {index + 1} of 4</p>
          <h2>{step.title}</h2>
        </div>
        <div className="inspector-head-right">
          <Badge status={stepStatus(selected, s)} />
          {mobile && (
            <button
              type="button"
              className="icon-close"
              aria-label="Close step editor"
              onClick={cancel}
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <p className="inspector-summary">{step.description}</p>

      <dl className="inspector-grid">
        <div>
          <dt>Upstream</dt>
          <dd>{index ? steps[index - 1].title : 'sales_2026.xlsx · Regional sales'}</dd>
        </div>
        <div>
          <dt>Downstream</dt>
          <dd>{index < 3 ? steps[index + 1].title : 'Published sales dataset'}</dd>
        </div>
        <div>
          <dt>Input</dt>
          <dd>
            {selected === 'read'
              ? '24 fixture rows'
              : selected === 'filter'
                ? '24 sales rows'
                : `${s.config.included.length * 6} regional rows`}
          </dd>
        </div>
        <div>
          <dt>Output</dt>
          <dd>
            {selected === 'join' && s.error
              ? 'No matches in latest attempt; previous data retained'
              : selected === 'calculate'
                ? `Published Q3 revenue ${money(kpis({ kind: 'region', quarter: 3 }).revenue)}`
                : selected === 'read'
                  ? '24 validated rows'
                  : `${draft.included.length * 6} rows after filtering`}
          </dd>
        </div>
      </dl>

      {selected === 'join' && s.error && (
        <div className="diagnostic-block inspector-diagnostic">
          <strong>Join fields do not match</strong>
          <p>{s.error}</p>
        </div>
      )}

      <div className="pipeline-config">
        <fieldset disabled={busy} className="pipeline-fields">
          <legend>Configuration</legend>
          <div className="pipeline-fields-body">
            {selected === 'filter' ? (
              <>
                <p className="field-intro">Include regions in the published dataset.</p>
                <div className="region-options-list">
                  {regions.map(region => (
                    <label className="region-option" key={region}>
                      <input
                        type="checkbox"
                        checked={draft.included.includes(region)}
                        onChange={e =>
                          setDraft({
                            ...draft,
                            included: e.target.checked
                              ? [...draft.included, region]
                              : draft.included.filter(r => r !== region),
                          })
                        }
                      />
                      <span>{region}</span>
                    </label>
                  ))}
                </div>
              </>
            ) : selected === 'join' ? (
              <div className="field-group">
                <p className="field-intro">
                  Source field: <strong>region_id</strong>
                </p>
                <label htmlFor="join-key">Target join key</label>
                <select
                  id="join-key"
                  value={draft.join}
                  onChange={e => setDraft({ ...draft, join: e.target.value as Config['join'] })}
                >
                  <option value="region_name">region_name</option>
                  <option value="region_id">region_id</option>
                </select>
                <p className="meta field-hint">
                  Use region_id to match source IDs such as south. Names such as South do not match.
                </p>
              </div>
            ) : (
              <p className="meta inspector-readonly">
                {selected === 'read'
                  ? 'Source: sales_2026.xlsx · Sheet: Regional sales. Read-only sample data.'
                  : 'Attainment = sum(revenue) / sum(target) × 100. Read-only calculation.'}
              </p>
            )}
          </div>
        </fieldset>
      </div>

      <p className="editor-feedback" role="status">
        {message}
      </p>

      <div className="editor-actions">
        <Button className="secondary" onClick={cancel}>
          Cancel
        </Button>
        <Button disabled={!dirty || busy} onClick={save}>
          Save changes
        </Button>
      </div>
    </>
  );

  return (
    <div className="pipeline-page">
      <Link className="text-link back-link" href={origin?.url || '/dashboard/'}>
        {origin ? `← Back to ${origin.context}` : '← Back to dashboard'}
      </Link>

      <div className="pipeline-header">
        <div className="dashboard-heading">
          <div className="page-heading">
            <h1>Regional sales performance</h1>
            <p>Four steps from source data to a trusted answer.</p>
          </div>
          <Badge status={s.status} />
        </div>

        <div className="pipeline-toolbar">
          <Button disabled={dirty || busy} onClick={run}>
            {busy ? 'Running…' : 'Run pipeline'}
          </Button>
          <Button className="secondary" disabled={dirty || busy} onClick={schedule}>
            Schedule next run
          </Button>
          <Button
            className="ghost"
            onClick={() => {
              if (
                discard() &&
                confirm(
                  'Reset pipeline configuration and published data to the demo starting state?',
                )
              ) {
                reset();
                setMessage('Demo reset.');
              }
            }}
          >
            Reset demo
          </Button>
        </div>

        <div className="pipeline-meta-bar">
          <p className="meta">
            <Freshness /> · Demo clock {time(s.clock)}
          </p>
          <p className="meta">
            Configuration v{s.config.version} · Published v{s.published.version} · Local simulated
            execution
          </p>
        </div>

        {dirty && (
          <p className="pipeline-notice warning" role="status">
            Unsaved changes. Save or cancel before running.
          </p>
        )}
        {s.status === 'Scheduled' && (
          <p className="pipeline-notice scheduled">
            Scheduled for {time(s.next!)}. Demo schedule; use Run pipeline to simulate.
          </p>
        )}
      </div>

      <div className="pipeline-workspace">
        <ol className="execution-flow" aria-label="Pipeline steps">
          {steps.map((item, i) => {
            const status = stepStatus(item.id, s);
            const active = selected === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`pipeline-node ${active ? 'is-selected' : ''} ${
                    status === 'Failed' ? 'is-failed' : ''
                  }`.trim()}
                  onClick={() => select(item.id)}
                  aria-pressed={active}
                >
                  <span className="pipeline-node-top">
                    <span className="pipeline-node-num">0{i + 1}</span>
                    <Badge status={status} />
                  </span>
                  <strong className="pipeline-node-title">{item.title}</strong>
                  <span className="pipeline-node-meta">{item.description}</span>
                  <span className="pipeline-node-cue">{active ? 'Selected' : 'Inspect →'}</span>
                </button>
                {i < 3 && (
                  <span className="execution-arrow" aria-hidden="true">
                    <ArrowRight size={14} />
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <section className="pipeline-inspector desktop-editor">{!mobile && editor}</section>
      </div>

      <dialog
        className="mobile-step-editor"
        ref={dialog}
        aria-label={`${step.title} editor`}
        onCancel={e => {
          e.preventDefault();
          cancel();
        }}
        onClose={() => lastTrigger.current?.focus()}
      >
        {mobile && editor}
      </dialog>
    </div>
  );
}
