import { env } from 'cloudflare:workers';
import {getChatGPTUser} from '../app/chatgpt-auth';
export async function authorize(request:Request){
 const u=await getChatGPTUser();if(!u)throw new Error('AUTH');
 if(request.method!=='GET'){
  const origin=request.headers.get('origin');
  if(!origin||origin!==new URL(request.url).origin)throw new Error('ORIGIN');
 }
 if(!env.DB)throw new Error('Database belum tersedia');
 return {db:env.DB,user:u,bucket:env.BUCKET};
}
export function failure(e:any){const message=e.message||'Gagal menyimpan';return Response.json({error:message==='AUTH'?'Silakan masuk dengan ChatGPT.':message==='ORIGIN'?'Permintaan tidak diizinkan.':message},{status:message==='AUTH'?401:message==='ORIGIN'?403:400});}
