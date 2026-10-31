export const regions=['North','South','East','West'];
export const sales=[[100,80,80,100],[100,80,80,100],[100,80,80,100],[100,70,80,110],[110,80,90,120],[120,90,100,130]];
export type Query={kind:'region'|'monthly';quarter:2|3};
export function parse(text:string):Query|null {if(!/sales|target|region|revenue/i.test(text))return null;return {kind:/monthly|month/i.test(text)?'monthly':'region',quarter:/q2/i.test(text)?2:3};}
export function series(q:Query){const rows=sales.slice(q.quarter===2?0:3,q.quarter===2?3:6);return q.kind==='region'?regions.map((label,i)=>({label,value:rows.reduce((s,r)=>s+r[i],0)*1000,target:300000})):rows.map((r,i)=>({label:(q.quarter===2?['Apr','May','Jun']:['Jul','Aug','Sep'])[i],value:r.reduce((a,b)=>a+b,0)*1000,target:400000}));}
export const money=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
export function summary(q:Query){const data=series({...q,kind:'region'});const missed=data.filter(r=>r.value<r.target);return missed.map(r=>`${r.label} missed target by ${money(r.target-r.value)}`).join(' and ')+`. Combined revenue was ${money(data.reduce((s,r)=>s+r.value,0))}.`;}
