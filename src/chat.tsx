'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Pin, Send } from 'lucide-react';
import { MonthlyChart, ValuesTable } from './charts';
import { parse, Query, scopeLabel, series, summary } from './data';
import { readChat, writeChat } from './persistence';
import { Button, Card, Trail } from './ui';

export function ChartCard({
  query,
  pinned = false,
  onPin,
  onUnpin,
  overview = false,
  saved = false,
}: {
  query: Query;
  pinned?: boolean;
  onPin?: () => void;
  onUnpin?: () => void;
  overview?: boolean;
  saved?: boolean;
}) {
  const rows = series(query);
  const rawMax = Math.max(...rows.flatMap(r => [r.value, r.target]), 100000);
  const ceiling = Math.max(400000, Math.ceil((rawMax * 1.08) / 100000) * 100000);
  const half = Math.round(ceiling / 2000);
  const quarter = Math.round(ceiling / 4000);
  const threeQuarter = Math.round((ceiling * 3) / 4000);
  const topTick = Math.round(ceiling / 1000);
  const title = query.kind === 'region' ? 'Revenue by region' : 'Monthly revenue';

  return (
    <Card className="chart-card">
      <div className="card-heading">
        <div>
          <h2>{title}</h2>
          <p className="meta">
            {saved ? 'Saved scope · ' : ''}
            {scopeLabel(query)} · USD
          </p>
        </div>
        {onPin && (
          <Button
            className={pinned ? 'secondary is-pinned' : 'secondary'}
            onClick={onPin}
            aria-pressed={pinned}
          >
            {pinned ? <Check size={16} aria-hidden="true" /> : <Pin size={16} aria-hidden="true" />}
            <span>{pinned ? 'Pinned' : 'Pin answer'}</span>
          </Button>
        )}
        {onUnpin && (
          <Button
            className="secondary"
            onClick={onUnpin}
            aria-label={`Unpin ${title}, ${scopeLabel(query)}`}
          >
            Unpin
          </Button>
        )}
      </div>

      {!overview && <p className="answer-summary">{summary(query)}</p>}

      <div className="legend">
        <span>
          <i className="legend-revenue" aria-hidden="true" /> Revenue
        </span>
        <span>
          <i className="legend-target" aria-hidden="true" /> Target
        </span>
      </div>

      {query.kind === 'region' ? (
        <div className="regional-plot">
          <div className="bars">
            {rows.map(r => {
              const delta = r.value - r.target;
              const deltaText =
                delta < 0
                  ? `−$${Math.abs(delta) / 1000}k`
                  : delta > 0
                    ? `+$${delta / 1000}k`
                    : 'On target';
              return (
                <div className="bar-row" key={r.label}>
                  <span className="bar-label">{r.label}</span>
                  <div className="track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(r.value / ceiling) * 100}%` }}
                    />
                    <i
                      className="target-tick"
                      style={{ left: `${(r.target / ceiling) * 100}%` }}
                    />
                  </div>
                  <div className="bar-metrics">
                    <strong>${r.value / 1000}k</strong>
                    <span className="bar-delta">{deltaText}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bar-axis" aria-hidden="true">
            <span>$0</span>
            <span className="axis-mid">${quarter}k</span>
            <span>${half}k</span>
            <span className="axis-mid">${threeQuarter}k</span>
            <span>${topTick}k</span>
          </div>
        </div>
      ) : (
        <MonthlyChart query={query} />
      )}

      <div className="chart-footer">
        <ValuesTable query={query} />

        <p className="chart-freshness meta">
          {overview
            ? 'Published 31 Oct, 09:30 PKT · Last successful data'
            : 'Published 31 Oct, 09:30 PKT · Latest run failed — showing last successful data'}
        </p>

        <Trail context={`${title} · ${scopeLabel(query)}`} />
      </div>
    </Card>
  );
}

const prompts = [
  'Which regions missed target last quarter?',
  'Show monthly sales for Q3',
  'Compare sales with target in Q2',
];

type Message = { text: string; query: Query | null };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [pins, setPins] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const { data, warning } = readChat();
    setMessages(data.messages);
    setPins(data.pins);
    setNotice(warning);
  }, []);

  function persist(ms: Message[], ps: string[]) {
    const warning = writeChat({ messages: ms, pins: ps });
    if (warning) setNotice(warning);
    return warning;
  }

  function submit(value: string) {
    if (!value.trim() || pending) return;
    setPending(true);
    setTimeout(() => {
      const next = [...messages, { text: value.trim(), query: parse(value) }];
      setMessages(next);
      persist(next, pins);
      setText('');
      setPending(false);
    }, 400);
  }

  return (
    <div className="chat">
      <div className="page-heading">
        <h1>Ask your sales data</h1>
        <p>Explore regional performance, compare targets, or review monthly revenue trends.</p>
      </div>

      {!messages.length && (
        <section className="welcome" aria-label="Suggested questions">
          <h2 className="welcome-heading">Suggested questions</h2>
          <div className="prompts">
            {prompts.map(p => (
              <button key={p} type="button" onClick={() => submit(p)} disabled={pending}>
                <span>{p}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
          <p className="meta">Northstar Supply · Sample sales data, Apr–Sep 2026</p>
        </section>
      )}

      <div className="messages" aria-live="polite">
        {messages.map((m, i) => (
          <div className="turn" key={i}>
            <p className="question">{m.text}</p>
            {m.query ? (
              <ChartCard
                query={m.query}
                pinned={pins.includes(JSON.stringify(m.query))}
                onPin={() => {
                  const key = JSON.stringify(m.query);
                  const next = pins.includes(key) ? pins : [...pins, key];
                  setPins(next);
                  const warning = persist(messages, next);
                  setNotice(warning || 'Insight saved to your dashboard.');
                }}
              />
            ) : (
              <Card className="unsupported-card">
                <p>This demo supports regional targets and monthly sales across Q2 and Q3 2026.</p>
                <div className="fallback-prompts">
                  {prompts.map(p => (
                    <Button className="secondary" key={p} onClick={() => submit(p)}>
                      {p}
                    </Button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        ))}
        {pending && (
          <p className="pending-note" role="status">
            Looking at your sales data…
          </p>
        )}
      </div>

      <form
        className="composer"
        onSubmit={e => {
          e.preventDefault();
          submit(text);
        }}
      >
        <label htmlFor="question">Your question</label>
        <div className="composer-row">
          <textarea
            id="question"
            rows={2}
            placeholder="Ask about sales, regions, or targets…"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit(text);
              }
            }}
          />
          <Button
            className="send-btn"
            disabled={!text.trim() || pending}
            type="submit"
            aria-label="Send question"
          >
            <Send size={17} aria-hidden="true" />
          </Button>
        </div>
        <small>Sample questions supported · No live connections</small>
      </form>

      <p className="chat-status meta" role="status">
        {notice ? <span>{notice}</span> : null}
        {pins.length > 0 ? (
          <Link className="dashboard-link" href="/dashboard/">
            View dashboard →
          </Link>
        ) : null}
      </p>
    </div>
  );
}
