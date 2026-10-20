import {authorize,failure} from '../../../lib/server';import {seedRows} from '../../../lib/seed';
export async function POST(req:Request){try{const {db,user}=await authorize(req);
 const existing=await db.prepare('SELECT id FROM records LIMIT 1').first();if(existing)return Response.json({ok:true});
 await db.batch(seedRows().map(r=>db.prepare('INSERT OR IGNORE INTO records(id,kind,client_id,payload,version,updated_at,updated_by) VALUES(?,?,?,?,1,?,?)').bind(r.id,r.kind,r.clientId,JSON.stringify(r.data),new Date().toISOString(),user.email)));
 return Response.json({ok:true});}catch(e){return failure(e);}}
