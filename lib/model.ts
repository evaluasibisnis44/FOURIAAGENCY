export type Row = {id:string;kind:string;clientId:string;data:Record<string,any>;version:number;updatedAt?:string};
export type Attachment = {id:string;record_id:string;name:string;type:string;size:number};
export const categories=['Produksi','Talent','Ongkos','Makanan','Lainnya'];
export const stages=['Ide','Produksi','Editing','Review','Approved','Terbit'];
export const money=(n:number)=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n||0);
export const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export const sum=(rows:Row[],key:string)=>rows.reduce((a,r)=>a+Number(r.data[key]||0),0);
export function calc(rows:Row[],clientId?:string,month='all'){
 const scope=rows.filter(r=>(!clientId||r.clientId===clientId)&&(month==='all'||r.data.month===month));
 const budgets=scope.filter(r=>r.kind==='period'), expenses=scope.filter(r=>r.kind==='expense'), payments=scope.filter(r=>r.kind==='payment');
 const budget=sum(budgets,'budget'),planned=sum(expenses,'planned'),actual=sum(expenses,'actual'),received=sum(payments,'amount');
 const profit=budget-planned,cash=received-actual;
 return {budget,planned,actual,received,profit,cash,outstanding:Math.max(0,budget-received),agency:Math.max(0,profit)*.5,sheren:Math.max(0,profit)*.25,jessen:Math.max(0,profit)*.25,budgets,expenses,payments};
}
export function paymentStatus(budget:number,received:number){
 if(!budget)return 'Belum ada budget';if(received>=budget)return 'Full payment';if(!received)return 'Non payment';if(received>=budget*.5)return 'DP ≥50% · follow-up full payment';return 'Pembayaran sebagian';
}
export function csv(rows:any[][]){return '\ufeff'+rows.map(row=>row.map(v=>'"'+(typeof v==='string'&&/^[=+@\-\t\r]/.test(v)?"'"+v:String(v??'')).replace(/"/g,'""')+'"').join(',')).join('\r\n');}
