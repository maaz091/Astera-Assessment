'use client';
import { useEffect, useRef, useState } from 'react';
import { series, Query, money } from './data';
export function MonthlyChart({ query }: { query: Query }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(260, entry.contentRect.width)));
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const rows = series(query);
  const max = Math.max(...rows.flatMap(r => [r.value, r.target])) * 1.1;
  const x = (i: number) => 60 + i * (width - 100) / 2;
  const y = (value: number) => 204 - value / max * 150;
  return <div ref={ref} className="monthly-plot"><svg viewBox={`0 0 ${width} 256`} role="img" aria-label="Monthly revenue versus target">
    <title>Monthly revenue versus target</title><desc>Revenue uses circles and a solid line; target uses squares and a dashed line. Exact values are available below.</desc>
    {[0, max / 2, max].map(value => <g key={value}><line x1="54" y1={y(value)} x2={width - 20} y2={y(value)} stroke="#E4E8E2"/><text x="46" y={y(value) + 4} textAnchor="end">${Math.round(value / 1000)}k</text></g>)}
    <polyline fill="none" stroke="#66736E" strokeDasharray="6 5" strokeWidth="2" points={rows.map((r,i) => `${x(i)},${y(r.target)}`).join(' ')}/>
    <polyline fill="none" stroke="#176B5B" strokeWidth="3" points={rows.map((r,i) => `${x(i)},${y(r.value)}`).join(' ')}/>
    {rows.map((r,i) => <g key={r.label}><rect x={x(i)-3} y={y(r.target)-3} width="6" height="6" fill="#66736E"/><circle cx={x(i)} cy={y(r.value)} r="5" fill="#176B5B"/><text x={x(i)} y="236" textAnchor="middle">{r.label}</text></g>)}
  </svg></div>;
}
export function ValuesTable({ query }: { query: Query }) {
  return <details><summary>View values</summary><table><caption>{query.kind === 'region' ? 'Regional' : 'Monthly'} values · Q{query.quarter} 2026 · {query.region && query.region !== 'all' ? query.region : 'All regions'} · USD</caption><thead><tr><th scope="col">{query.kind === 'region' ? 'Region' : 'Month'}</th><th scope="col">Revenue</th><th scope="col">Target</th></tr></thead><tbody>{series(query).map(r => <tr key={r.label}><th scope="row">{r.label}</th><td>{money(r.value)}</td><td>{money(r.target)}</td></tr>)}</tbody></table></details>;
}
