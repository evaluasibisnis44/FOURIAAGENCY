import type {Row} from './model';
export const platforms=['Instagram','TikTok'];
export const metrics=['views','reach','impressions','likes','comments','shares','saves','followersGained'] as const;
export const metricLabels:Record<string,string>={views:'Views',reach:'Reach',impressions:'Impressions',likes:'Likes',comments:'Comments',shares:'Shares',saves:'Saves',followersGained:'Followers dari konten'};
export const channel=(r:Row)=>r.data.platform||'Instagram';
export const scheduled=(r:Row)=>r.data.publishDate||r.data.due;
export const hasMetrics=(r:Row)=>metrics.some(k=>r.data[k]!==undefined&&r.data[k]!==null);
export function contentStats(rows:Row[]){const measured=rows.filter(hasMetrics);const total=Object.fromEntries(metrics.map(k=>[k,measured.reduce((s,r)=>s+Number(r.data[k]||0),0)]));const interactions=total.likes+total.comments+total.shares+total.saves;const paired=measured.filter(r=>Number(r.data.reach)>0&&['likes','comments','shares','saves'].every(k=>r.data[k]!=null));const reach=paired.reduce((s,r)=>s+r.data.reach,0);const engaged=paired.reduce((s,r)=>s+r.data.likes+r.data.comments+r.data.shares+r.data.saves,0);const coverage=Object.fromEntries(metrics.map(k=>[k,measured.filter(r=>r.data[k]!=null).length]));return {total,coverage,measured:measured.length,count:rows.length,published:rows.filter(r=>r.data.status==='Terbit').length,interactions,engagement:reach?engaged/reach*100:null};}
export function monthCells(month:string){const [y,m]=month.split('-').map(Number);const first=new Date(Date.UTC(y,m-1,1));const offset=(first.getUTCDay()+6)%7;const count=new Date(Date.UTC(y,m,0)).getUTCDate();return Array.from({length:Math.ceil((offset+count)/7)*7},(_,i)=>i<offset||i>=offset+count?null:month+'-'+String(i-offset+1).padStart(2,'0'));}
export function shiftMonth(month:string,delta:number){const [y,m]=month.split('-').map(Number);return new Date(Date.UTC(y,m-1+delta,1)).toISOString().slice(0,7);}
