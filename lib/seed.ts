import type {Row} from './model';
export function seedRows():Row[]{
 const result:Row[]=[];
 const add=(id:string,kind:string,clientId:string,data:any)=>result.push({id,kind,clientId,data,version:1});
 add('batavia','client','batavia',{name:'Batavia Whisky',contact:'',email:'',company:'',status:'Aktif',notes:'Kontrak November 2026–Januari 2027. Rp17.000.000 per bulan. Pembayaran aktual belum dicatat.'});
 add('mureh','client','mureh',{name:'Outlet Minuman Mureh',contact:'',email:'',company:'',status:'Aktif',notes:'Quotation Rp5.000.000, full payment. Add-on tambahan produksi Rp1.000.000 di luar paket.'});
 for(const month of ['2026-11','2026-12','2027-01'])add('batavia-'+month,'period','batavia',{month,budget:17000000,reels:8,feeds:7,stories:0,productions:0,events:1,due:month+'-01',notes:'15 konten per bulan; 1 event visit. Jadwal jatuh tempo awal bulan dapat disesuaikan.'});
 add('mureh-2026-10','period','mureh',{month:'2026-10',budget:5000000,reels:15,feeds:0,stories:8,productions:1,events:0,due:'2026-10-14',notes:'Periode Oktober untuk pencatatan awal quotation; silakan sesuaikan tanggal proyek.'});
 const costs=[['Videographer / Photo','Produksi',3500000],['Talent','Talent',700000],['Graphic Designer','Produksi',700000],['Video Editor','Produksi',800000],['Account Executive','Lainnya',1200000],['Visit event','Produksi',1000000]];
 costs.forEach(([detail,category,planned],i)=>add('budget-example-'+i,'expense','batavia',{month:'2026-11',date:'2026-11-01',category,detail,planned,actual:0,vendor:'',notes:'Rencana budgeting dari gambar referensi. Bukan pengeluaran aktual.'}));
 return result;
}
