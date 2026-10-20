import {authorize,failure} from '../../../lib/server';
import {schemas} from '../../../lib/validation';
export async function GET(request:Request){try{const {db}=await authorize(request);const {results}=await db.prepare('SELECT * FROM records ORDER BY updated_at DESC').all();const files=await db.prepare('SELECT * FROM files ORDER BY created_at DESC').all();return Response.json({rows:results.map((r:any)=>({id:r.id,kind:r.kind,clientId:r.client_id,data:JSON.parse(r.payload),version:r.version,updatedAt:r.updated_at})),files:files.results},{headers:{'Cache-Control':'no-store'}});}catch(e){return failure(e);}}
export async function POST(request:Request){try{
 const {db,user}=await authorize(request);const b:any=await request.json();if(!schemas[b.kind])throw new Error('Jenis data tidak valid');
 const data=schemas[b.kind].parse(b.data);const id=b.id||crypto.randomUUID();const clientId=b.kind==='client'?id:b.kind==='bank'?'agency':b.clientId;
 if(!['client','bank'].includes(b.kind)&&!await db.prepare("SELECT id FROM records WHERE id=? AND kind='client'").bind(clientId).first())throw new Error('Klien tidak ditemukan');
 if(b.kind==='period'){
 const periods=await db.prepare("SELECT id,payload FROM records WHERE kind='period' AND client_id=? AND id<>?").bind(clientId,id).all();
 if(periods.results.some((r:any)=>JSON.parse(r.payload).month===data.month))throw new Error('Periode untuk klien ini sudah ada. Edit periode yang tersedia.');
 }
 const old:any=await db.prepare('SELECT * FROM records WHERE id=?').bind(id).first();
 if(old){if(old.kind!==b.kind||old.client_id!==clientId)throw new Error('Identitas data tidak valid');if(old.version!==b.version)throw new Error('Data berubah oleh pengguna lain. Muat ulang sebelum menyimpan.');
 const updated=await db.prepare('UPDATE records SET payload=?,version=version+1,updated_at=?,updated_by=? WHERE id=? AND version=?').bind(JSON.stringify(data),new Date().toISOString(),user.email,id,b.version).run();if(!updated.meta.changes)throw new Error('Data berubah. Muat ulang.');
 }else await db.prepare('INSERT INTO records(id,kind,client_id,payload,version,updated_at,updated_by) VALUES(?,?,?,?,1,?,?)').bind(id,b.kind,clientId,JSON.stringify(data),new Date().toISOString(),user.email).run();
 return Response.json({id});
}catch(e){return failure(e);}}
export async function DELETE(request:Request){try{const {db,bucket}=await authorize(request);const {id,version}=await request.json() as any;
 const record:any=await db.prepare('SELECT * FROM records WHERE id=?').bind(id).first();if(!record)throw new Error('Data tidak ditemukan');if(record.version!==version)throw new Error('Data berubah. Muat ulang.');
 if(record.kind==='client'&&(await db.prepare('SELECT id FROM records WHERE client_id=? AND id<>? LIMIT 1').bind(id,id).first()))throw new Error('Klien masih memiliki transaksi. Gunakan status Arsip.');
 const f=await db.prepare('SELECT id FROM files WHERE record_id=?').bind(id).all();
 const deleted=await db.prepare('DELETE FROM records WHERE id=? AND version=?').bind(id,version).run();if(!deleted.meta.changes)throw new Error('Data berubah. Muat ulang.');
 await db.prepare('DELETE FROM files WHERE record_id=?').bind(id).run();if(bucket)for(const x of f.results)await bucket.delete(String(x.id));return Response.json({ok:true});
}catch(e){return failure(e);}}
