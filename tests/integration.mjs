import assert from 'node:assert/strict';
const base='http://127.0.0.1:5173';
const sign=await fetch(base+'/signin-with-chatgpt?return_to=/',{redirect:'manual'});
const cookie=sign.headers.get('set-cookie').split(';')[0];
async function api(path,method='GET',body,extra={}){const r=await fetch(base+path,{method,headers:{Cookie:cookie,Origin:base,...(body instanceof FormData?{}:{'Content-Type':'application/json'}),...extra},body:body?(body instanceof FormData?body:JSON.stringify(body)):undefined});const text=await r.text();let data;try{data=JSON.parse(text)}catch{data={error:text}}return {status:r.status,data};}
assert.equal((await fetch(base+'/api/records')).status,401);
assert.equal((await api('/api/records','POST',{}, {Origin:'https://wrong.example'})).status,403);
let data=(await api('/api/records')).data;
const testId='qa-local-'+Date.now();
let res=await api('/api/records','POST',{id:testId,kind:'client',data:{name:'QA LOCAL',status:'Prospek',notes:'Disposable local integration test'}});assert.equal(res.status,200);
const p={kind:'period',clientId:testId,data:{month:'2026-11',budget:17000000,reels:8,feeds:7,stories:0,productions:1,events:1,due:'2026-11-01',notes:''}};
res=await api('/api/records','POST',p);assert.equal(res.status,200);const periodId=res.data.id;
assert.equal((await api('/api/records','POST',p)).status,400);
const expense={kind:'expense',clientId:testId,data:{month:'2026-11',date:'2026-11-01',category:'Produksi',detail:'QA',planned:7900000,actual:7900000,vendor:'',notes:''}};
res=await api('/api/records','POST',expense);assert.equal(res.status,200);const eid=res.data.id;
assert.equal((await api('/api/records','POST',{...expense,data:{...expense.data,actual:-1}})).status,400);
res=await api('/api/records','POST',{kind:'payment',clientId:testId,data:{month:'2026-11',date:'2026-11-01',amount:8500000,method:'Transfer bank',reference:'QA'}});assert.equal(res.status,200);const payId=res.data.id;
res=await api('/api/records','POST',{kind:'content',clientId:testId,data:{month:'2026-11',title:'QA Reel',type:'Reels',status:'Approved',due:'2026-11-02'}});assert.equal(res.status,200);const contentId=res.data.id;
res=await api('/api/records','POST',{kind:'followup',clientId:testId,data:{month:'2026-11',title:'QA Follow-up',type:'Pembayaran',status:'Terjadwal',date:'2026-11-03'}});assert.equal(res.status,200);const followId=res.data.id;
res=await api('/api/records','POST',{kind:'document',clientId:testId,data:{type:'Quotation',number:'QA/1',date:'2026-11-01',period:'November',items:[{description:'QA',detail:'',qty:1,price:17000000}],issuer:'Daniel Tambunan',company:'PT Lentera Indonesia Group'}});assert.equal(res.status,200);const docId=res.data.id;
const form=new FormData();form.append('recordId',eid);form.append('file',new File(['%PDF-1.4\nQA'],'qa-invoice.pdf',{type:'application/pdf'}));
res=await api('/api/files','POST',form);assert.equal(res.status,200);const fid=res.data.id;
const file=await fetch(base+'/api/files?id='+fid,{headers:{Cookie:cookie}});assert.equal(file.status,200);assert.equal(await file.text(),'%PDF-1.4\nQA');assert.equal((await fetch(base+'/api/files?id='+fid)).status,401);
res=await api('/api/records','POST',{...expense,id:eid,version:1,data:{...expense.data,actual:100}});assert.equal(res.status,200);
assert.equal((await api('/api/records','POST',{...expense,id:eid,version:1})).status,400);
assert.equal((await api('/api/records','DELETE',{id:testId,version:1})).status,400);
data=(await api('/api/records')).data;assert.equal(data.rows.find(x=>x.id===eid).data.actual,100);assert.ok(data.files.find(x=>x.id===fid));
for(const id of [periodId,payId,contentId,followId,docId,eid]){const row=data.rows.find(x=>x.id===id);assert.equal((await api('/api/records','DELETE',{id,version:row.version})).status,200);}
assert.equal((await api('/api/records','DELETE',{id:testId,version:1})).status,200);
const missing=await fetch(base+'/api/files?id='+fid,{headers:{Cookie:cookie}});assert.equal(missing.status,404);
console.log('PASS: auth, origin checks, client and period CRUD, duplicate month, negative amount rejection, payment, content, follow-up, quotation, persistent attachment retrieval, edit conflicts and cleanup.');
// Invoice update: bank library is shared, document retains an independent account snapshot.
let bank=await api('/api/records','POST',{kind:'bank',data:{bankName:'QA bank',accountNumber:'1234500000',accountHolder:'QA Recipient'}});assert.equal(bank.status,200);const bankId=bank.data.id;
let invoice=await api('/api/records','POST',{kind:'document',clientId:'batavia',data:{type:'Invoice',number:'INV-QA-FIELDS',date:'2026-10-20',period:'November 2026',recipientName:'QA Client',recipientAddress:'QA Street\nJakarta',billingMonth:'2026-11',sourceQuotationId:'reference-batavia',paymentAccounts:[{bankName:'QA bank',accountNumber:'1234500000',accountHolder:'QA Recipient'}],items:[{description:'Monthly scope',detail:'Copied quotation',qty:1,price:17000000,serviceMonth:'2026-11'}],issuer:'Daniel Tambunan',company:'PT Lentera Indonesia Group'}});assert.equal(invoice.status,200);const invoiceId=invoice.data.id;
let saved=(await api('/api/records')).data.rows;const savedInvoice=saved.find(r=>r.id===invoiceId);assert.equal(savedInvoice.data.recipientAddress,'QA Street\nJakarta');assert.equal(savedInvoice.data.paymentAccounts[0].accountHolder,'QA Recipient');assert.equal(saved.find(r=>r.id===bankId).clientId,'agency');
assert.equal((await api('/api/records','DELETE',{id:bankId,version:1})).status,200);
saved=(await api('/api/records')).data.rows;assert.equal(saved.find(r=>r.id===invoiceId).data.paymentAccounts[0].accountNumber,'1234500000');
assert.equal((await api('/api/records','DELETE',{id:invoiceId,version:1})).status,200);
console.log('PASS: invoice recipient/address, quotation month metadata, bank library, document bank snapshot and persistence.');
