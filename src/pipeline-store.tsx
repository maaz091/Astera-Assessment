'use client';
import {useEffect,useSyncExternalStore} from 'react';
import {regions,Region,setPublishedRegions} from './data';
export type Config={included:Region[];join:'region_name'|'region_id';version:number};
export type Runtime={config:Config;published:Config;status:'Failed'|'Running'|'Succeeded'|'Scheduled';clock:number;success:number;attempt:number;next:number|null;error:string};
export const steps=[{id:'read',title:'Read sales',description:'Read 24 monthly regional records from sales_2026.xlsx.'},{id:'filter',title:'Filter regions',description:'Keep the territories included in this sales dataset.'},{id:'join',title:'Join targets',description:'Match source region IDs to monthly regional targets.'},{id:'calculate',title:'Calculate attainment',description:'Divide revenue by target to publish attainment.'}] as const;
export type StepId=typeof steps[number]['id'];
const initial:Runtime={config:{included:[...regions],join:'region_name',version:2},published:{included:[...regions],join:'region_id',version:1},status:'Failed',clock:585,success:570,attempt:582,next:null,error:'Target names do not match source IDs. Choose region_id, save, then run again.'};
let state=initial,loaded=false,timer:ReturnType<typeof setTimeout>|undefined;
const listeners=new Set<()=>void>();
export const time=(m:number)=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')} PKT`;
function publish(next:Runtime){state=next;setPublishedRegions(next.published.included);try{localStorage.setItem('studio-pipeline-v1',JSON.stringify(next));}catch{}listeners.forEach(f=>f());}
export function usePipeline(){useEffect(()=>{if(loaded)return;loaded=true;try{const raw=JSON.parse(localStorage.getItem('studio-pipeline-v1')||'null');const valid=(c:Config)=>c&&Array.isArray(c.included)&&c.included.length&&c.included.every(r=>regions.includes(r))&&['region_name','region_id'].includes(c.join);if(raw&&valid(raw.config)&&valid(raw.published)&&['Failed','Running','Succeeded','Scheduled'].includes(raw.status)&&[raw.clock,raw.success,raw.attempt].every(Number.isFinite)){publish(raw.status==='Running'?{...raw,status:'Failed',error:'Run interrupted by refresh. Run again to retry.'}:raw);}}catch{}},[]);return useSyncExternalStore(f=>{listeners.add(f);return()=>{listeners.delete(f);}},()=>state,()=>initial);}
export function saveConfig(config:Config){if(state.status==='Running'||!config.included.length)return false;publish({...state,config:{...config,version:state.config.version+1}});return true;}
export function run(){if(state.status==='Running')return;const config=structuredClone(state.config);publish({...state,status:'Running',next:null,error:''});timer=setTimeout(()=>{const ok=config.join==='region_id';const clock=state.clock+1;publish({...state,clock,attempt:clock,status:ok?'Succeeded':'Failed',published:ok?config:state.published,success:ok?clock:state.success,error:ok?'':'Target names do not match source IDs. Choose region_id, save, then run again.'});},1200);}
export function schedule(){if(state.status!=='Running')publish({...state,status:'Scheduled',next:state.clock+15});}
export function reset(){clearTimeout(timer);publish(structuredClone(initial));}
export function stepStatus(id:StepId,s:Runtime){if(s.status==='Running')return 'Running';if(id==='read'||id==='filter')return 'Succeeded';if(s.error)return id==='join'?'Failed':'Skipped';return 'Succeeded';}
export function Freshness(){const s=usePipeline();return <span>Published 31 Oct 2026, {time(s.success)} · {s.clock-s.success} min ago · Latest run {s.status.toLowerCase()}</span>;}
