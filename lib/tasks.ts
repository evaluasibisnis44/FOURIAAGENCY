import type {Row} from './model';
export const taskStatuses=['Belum dikerjakan','Dalam proses','Selesai','Dibatalkan'];
export const taskPics=['Sheren','Jessen','Sheren & Jessen'];
export type WorkItem={id:string;row:Row;title:string;due:string;planned:string;pic:string;source:string;phase:string;completed:boolean};
export function deadlineState(due:string,today:string){return due<today?'Terlambat':due===today?'Hari ini':'Mendatang';}
export function buildWorkQueue(rows:Row[]):WorkItem[]{
 const items:WorkItem[]=[];
 for(const r of rows){
  const d=r.data;
  if(r.kind==='task')items.push({id:r.id,row:r,title:d.title,due:d.due,planned:d.date||d.due,pic:d.pic||'',source:'To-do',phase:d.category||'Pekerjaan',completed:['Selesai','Dibatalkan'].includes(d.status)});
  if(r.kind==='content'){
   if(!['Approved','Terbit'].includes(d.status))items.push({id:r.id+':production',row:r,title:d.title,due:d.due,planned:d.due,pic:d.pic||'',source:'Content plan',phase:'Selesai produksi',completed:false});
   if(!['Produksi','Event'].includes(d.type)&&d.publishDate&&d.status!=='Terbit')items.push({id:r.id+':publish',row:r,title:d.title,due:d.publishDate,planned:d.publishDate,pic:d.pic||'',source:'Content plan',phase:'Tayang'+(d.publishTime?' · '+d.publishTime+' WIB':''),completed:false});
  }
 }
 return items.filter(i=>i.due).sort((a,b)=>a.due.localeCompare(b.due)||a.title.localeCompare(b.title));
}
export function filterWorkQueue(items:WorkItem[],filter:{pic:string;scope:string;today:string;includeCompleted?:boolean}){
 const end=new Date(filter.today+'T12:00:00Z');end.setUTCDate(end.getUTCDate()+7);const day7=end.toISOString().slice(0,10);
 return items.filter(i=>{
  if(!filter.includeCompleted&&i.completed)return false;
  if(filter.pic!=='Semua'&&!i.pic.toLowerCase().includes(filter.pic.toLowerCase()))return false;
  if(filter.scope==='Hari ini')return i.due===filter.today||i.planned===filter.today;
  if(filter.scope==='Terlambat')return i.due<filter.today;
  if(filter.scope==='7 hari')return i.due>=filter.today&&i.due<=day7;
  return true;
 });
}

// One warning per client, ranked by the earliest unfinished deadline.
export function urgentByClient(items:WorkItem[]){
 const groups=new Map<string,{item:WorkItem;count:number}>();
 for(const item of [...items].filter(i=>!i.completed).sort((a,b)=>a.due.localeCompare(b.due)||a.title.localeCompare(b.title))){
  const group=groups.get(item.row.clientId);
  if(group)group.count++;else groups.set(item.row.clientId,{item,count:1});
 }
 return [...groups.values()];
}
