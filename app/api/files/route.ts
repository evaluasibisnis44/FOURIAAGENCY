import {authorize,failure} from '../../../lib/server';
const allowed=['application/pdf','image/jpeg','image/png','image/webp'];
export async function POST(req:Request){try{const {db,bucket}=await authorize(req);if(!bucket)throw new Error('Penyimpanan file belum tersedia');
 if(Number(req.headers.get('content-length')||0)>11*1024*1024)throw new Error('Maksimum file 10 MB');
 const form=await req.formData(),file=form.get('file') as File,recordId=String(form.get('recordId')||'');
 if(!file||!allowed.includes(file.type)||file.size>10*1024*1024||!file.size)throw new Error('Gunakan PDF, JPG, PNG atau WebP, maksimum 10 MB');
 if(!await db.prepare('SELECT id FROM records WHERE id=?').bind(recordId).first())throw new Error('Transaksi tidak ditemukan');
 const id=crypto.randomUUID();await bucket.put(id,await file.arrayBuffer(),{httpMetadata:{contentType:file.type}});
 try{await db.prepare('INSERT INTO files(id,record_id,name,type,size,created_at) VALUES(?,?,?,?,?,?)').bind(id,recordId,file.name.slice(0,200),file.type,file.size,new Date().toISOString()).run();}catch(e){await bucket.delete(id);throw e;}
 return Response.json({id});}catch(e){return failure(e);}}
export async function GET(req:Request){try{const {db,bucket}=await authorize(req);const id=new URL(req.url).searchParams.get('id');
 const file:any=await db.prepare('SELECT * FROM files WHERE id=?').bind(id).first();if(!file||!bucket)return new Response('File tidak ditemukan',{status:404});
 const object=await bucket.get(file.id);if(!object)return new Response('File tidak ditemukan',{status:404});
 return new Response(object.body,{headers:{'Content-Type':file.type,'Content-Disposition':`inline; filename*=UTF-8''${encodeURIComponent(file.name)}`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
}catch(e){return failure(e);}}
export async function DELETE(req:Request){try{const {db,bucket}=await authorize(req);const {id}=await req.json() as any;await db.prepare('DELETE FROM files WHERE id=?').bind(id).run();await bucket?.delete(id);return Response.json({ok:true});}catch(e){return failure(e);}}
