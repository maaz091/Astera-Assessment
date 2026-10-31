export const regions = ['North', 'South', 'East', 'West'] as const;
export type Region = typeof regions[number];
export const sales = [[100,80,80,100],[100,80,80,100],[100,80,80,100],[100,70,80,110],[110,80,90,120],[120,90,100,130]];
export type Query = { kind: 'region' | 'monthly'; quarter: 2 | 3; region?: Region | 'all' };
export const scopeLabel = (q: Query) => `Q${q.quarter} 2026 · ${q.region && q.region !== 'all' ? q.region : 'All regions'}`;
export function parse(text: string): Query | null {
  if (!/sales|target|region|revenue/i.test(text)) return null;
  return { kind: /monthly|month/i.test(text) ? 'monthly' : 'region', quarter: /q2/i.test(text) ? 2 : 3 };
}
let publishedRegions: readonly Region[] = regions;
export function setPublishedRegions(value: Region[]) { publishedRegions = value; }
export function series(q: Query) {
  const rows = sales.slice(q.quarter === 2 ? 0 : 3, q.quarter === 2 ? 3 : 6);
  const indices = regions.map((_, i) => i).filter(i => publishedRegions.includes(regions[i]) && (!q.region || q.region === 'all' || regions[i] === q.region));
  return q.kind === 'region'
    ? indices.map(i => ({ label: regions[i] as string, value: rows.reduce((s, r) => s + r[i], 0) * 1000, target: rows.length * 100000 }))
    : rows.map((r, i) => ({ label: (q.quarter === 2 ? ['Apr', 'May', 'Jun'] : ['Jul', 'Aug', 'Sep'])[i], value: indices.reduce((s, j) => s + r[j], 0) * 1000, target: indices.length * 100000 }));
}
export const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
export const percent = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(n) + '%';
export function kpis(q: Query) {
  const rows = series({ ...q, kind: 'region' });
  const revenue = rows.reduce((s, r) => s + r.value, 0);
  const target = rows.reduce((s, r) => s + r.target, 0);
  return { revenue, target, attainment: target ? revenue / target * 100 : null, below: rows.filter(r => r.value < r.target).map(r => r.label) };
}
export function summary(q: Query) {
  const data = series({ ...q, kind: 'region' });
  if (!data.length) return 'No data: this region is excluded by the pipeline.';
  const missed = data.filter(r => r.value < r.target);
  const detail = missed.length ? missed.map(r => `${r.label} missed target by ${money(r.target - r.value)}`).join(' and ') + '.' : 'Every region in this view met its target.';
  return `${detail} Combined revenue was ${money(data.reduce((s, r) => s + r.value, 0))}.`;
}
export function isQuery(value: unknown): value is Query {
  if (!value || typeof value !== 'object') return false;
  const q = value as Query;
  return [2, 3].includes(q.quarter) && ['region', 'monthly'].includes(q.kind) && (q.region === undefined || q.region === 'all' || regions.includes(q.region));
}
