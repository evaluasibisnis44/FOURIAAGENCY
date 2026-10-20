import type {Row} from './model';
export type LineItem={description:string;detail:string;qty:number;price:number;serviceMonth?:string};
export function invoiceFromQuotation(quote:Row,periods:Row[],month:string){
 const items:LineItem[]=structuredClone(quote.data.items);
 const chosen=periods.find(p=>p.data.month===month);
 const tagged=items.filter(i=>i.serviceMonth===month);
 if(tagged.length)return {items:tagged,message:'Rincian disalin dari quotation untuk periode yang dipilih.'};
 if(items.some(i=>i.serviceMonth))return {items:[],message:'Quotation ini tidak memiliki rincian untuk periode tersebut.'};
 const total=items.reduce((s,i)=>s+i.qty*i.price,0);
 if(!chosen||total===chosen.data.budget)return {items,message:'Rincian disalin sama persis dari quotation. Periksa periode dan nominal sebelum menyimpan.'};
 const contractTotal=periods.reduce((s,p)=>s+Number(p.data.budget),0);
 if(periods.length>1&&total===contractTotal&&items.length===1){
  return {items:[{...items[0],qty:1,price:chosen.data.budget,serviceMonth:month}],message:'Detail layanan mengikuti quotation; nominal memakai budget bulan yang dipilih.'};
 }
 return {items,message:'Quotation tidak memisahkan rincian per bulan. Rincian disalin utuh; sesuaikan qty dan harga untuk bulan ini sebelum menyimpan.'};
}
export function referenceQuotation(clientId:string):Row|null{
 const common={type:'Quotation',recipientName:'',recipientAddress:'',notes:'Major revision dikenakan tambahan 50% dari harga per konten. Creative assets untuk Instagram.',terms:'Untuk kolaborasi pertama, full payment wajib diterima di awal sebelum eksekusi dimulai.'};
 if(clientId==='batavia')return {id:'reference-batavia',kind:'document',clientId,version:1,data:{...common,number:'Referensi Batavia · Nov 2026–Jan 2027',items:[{description:'Social Media Handling',qty:3,price:17000000,detail:'15 konten/bulan: 7 Instagram Feed (Static/Carousel) dan 8 Reels. Creative concept, copywriting, caption dan hashtag; fotografi produk dan styling; editing video, motion graphics dan animasi dasar; talent dari agency; creative assets Instagram; greeting Story gratis; monthly performance report. Maksimal 3 minor revision/konten. 1 event visit/bulan, dokumentasi foto-video dan event recap untuk Instagram Reels. Fotografer/videografer, kamera, lensa, lighting, stabilizer, audio dan crew sesuai kebutuhan.'}]}};
 if(clientId==='mureh')return {id:'reference-mureh',kind:'document',clientId,version:1,data:{...common,number:'Referensi Minuman Mureh · terakhir',terms:'Full payment (100%).',notes:'Add-on opsional: tambahan produksi Rp1.000.000, di luar total.',items:[{description:'Social Media Management Instagram',detail:'Copywriting dan brief: 15 Reels + 8 Instagram Stories; admin publishing dan DM; optimasi landing page dan bio; 3 kali revisi minor.',qty:1,price:2500000},{description:'Production',detail:'1 kali produksi untuk video shoot, editing, dan desain.',qty:1,price:1500000},{description:'Talent',detail:'2 talent',qty:1,price:1000000}]}};
 return null;
}
