'use client';

import { useEffect, useRef, useState } from 'react';
import { money, percent, Query, series } from './data';

function buildTicks(rawMax: number): { ceiling: number; ticks: number[] } {
  const step =
    rawMax <= 150000
      ? 50000
      : rawMax <= 450000
        ? 150000
        : Math.ceil((rawMax * 1.1) / 300000) * 100000;
  const ceiling = step * 3;
  return { ceiling, ticks: [0, step, step * 2, ceiling] };
}

export function MonthlyChart({ query }: { query: Query }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(240, Math.round(entry.contentRect.width)))
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const rows = series(query);
  const rawMax = Math.max(...rows.flatMap(r => [r.value, r.target]), 100000);
  const { ceiling, ticks } = buildTicks(rawMax);

  const left = 52;
  const right = 24;
  const top = 28;
  const bottom = 192;
  const plotHeight = bottom - top;
  const span = Math.max(120, width - left - right);

  const x = (i: number) =>
    rows.length === 1 ? left + span / 2 : left + (i * span) / (rows.length - 1);
  const y = (value: number) => bottom - (value / ceiling) * plotHeight;
  const formatAxis = (v: number) => (v === 0 ? '$0' : `$${Math.round(v / 1000)}k`);

  return (
    <div ref={ref} className="monthly-plot">
      <svg viewBox={`0 0 ${width} 228`} role="img" aria-label="Monthly revenue versus target">
        <title>Monthly revenue versus target</title>
        <desc>
          Revenue uses a solid line with circle markers; target uses a dashed line with square
          markers. Exact values are available in View values below.
        </desc>

        {ticks.map(value => (
          <g key={value}>
            <line
              x1={left}
              y1={y(value)}
              x2={width - right}
              y2={y(value)}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text x={left - 10} y={y(value) + 4} textAnchor="end" className="axis-label">
              {formatAxis(value)}
            </text>
          </g>
        ))}

        <polyline
          fill="none"
          stroke="var(--text-tertiary)"
          strokeDasharray="5 4"
          strokeWidth="1.5"
          points={rows.map((r, i) => `${x(i)},${y(r.target)}`).join(' ')}
        />
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={rows.map((r, i) => `${x(i)},${y(r.value)}`).join(' ')}
        />

        {rows.map((r, i) => {
          const vy = y(r.value);
          const ty = y(r.target);
          const labelAbove = r.value >= r.target || ty - vy > 18;
          const labelY = labelAbove ? vy - 10 : vy + 18;
          const anchor = i === 0 ? 'start' : i === rows.length - 1 ? 'end' : 'middle';
          const labelX = i === 0 ? x(i) - 2 : i === rows.length - 1 ? x(i) + 2 : x(i);

          return (
            <g key={r.label}>
              <line
                x1={x(i)}
                y1={bottom}
                x2={x(i)}
                y2={bottom + 4}
                stroke="var(--border-strong)"
                strokeWidth="1"
              />
              <rect
                x={x(i) - 3}
                y={ty - 3}
                width="6"
                height="6"
                rx="1"
                fill="var(--surface)"
                stroke="var(--text-secondary)"
                strokeWidth="1.5"
              />
              <circle
                cx={x(i)}
                cy={vy}
                r="4.5"
                fill="var(--accent)"
                stroke="var(--surface)"
                strokeWidth="2"
              />
              <text x={labelX} y={labelY} textAnchor={anchor} className="point-label">
                ${Math.round(r.value / 1000)}k
              </text>
              <text x={x(i)} y="216" textAnchor="middle" className="axis-label">
                {r.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function ValuesTable({ query }: { query: Query }) {
  const rows = series(query);
  return (
    <details className="values-disclosure">
      <summary>View values</summary>
      <table>
        <caption>
          {query.kind === 'region' ? 'Regional' : 'Monthly'} values · Q{query.quarter} 2026 ·{' '}
          {query.region && query.region !== 'all' ? query.region : 'All regions'} · USD
        </caption>
        <thead>
          <tr>
            <th scope="col">{query.kind === 'region' ? 'Region' : 'Month'}</th>
            <th scope="col" className="num">
              Revenue
            </th>
            <th scope="col" className="num">
              Target
            </th>
            <th scope="col" className="num">
              Attainment
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td className="num">{money(r.value)}</td>
              <td className="num">{money(r.target)}</td>
              <td className="num">{r.target ? percent((r.value / r.target) * 100) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
