import assert from 'node:assert/strict';
import {invoiceFromQuotation,referenceQuotation} from '../lib/invoice.ts';
import {seedRows} from '../lib/seed.ts';
import {schemas} from '../lib/validation.ts';
const periods=seedRows().filter(r=>r.kind==='period'&&r.clientId==='batavia');
const quote=referenceQuotation('batavia');const copied=invoiceFromQuotation(quote,periods,'2026-11');assert.equal(copied.items[0].price,17000000);assert.equal(copied.items[0].qty,1);assert.equal(copied.items[0].detail,quote.data.items[0].detail);assert.equal(quote.data.items[0].qty,3);
const tagged={...quote,data:{...quote.data,items:[{description:'November',detail:'Monthly SOW',qty:1,price:17000000,serviceMonth:'2026-11'},{description:'December',detail:'Monthly SOW',qty:1,price:17000000,serviceMonth:'2026-12'}]}};
assert.equal(invoiceFromQuotation(tagged,periods,'2026-11').items.length,1);assert.equal(invoiceFromQuotation(tagged,periods,'2027-01').items.length,0);
const mureh=referenceQuotation('mureh');assert.equal(invoiceFromQuotation(mureh,seedRows().filter(r=>r.kind==='period'&&r.clientId==='mureh'),'2026-10').items.reduce((s,i)=>s+i.qty*i.price,0),5000000);
const d={type:'Invoice',number:'INV/QA',date:'2026-10-20',period:'November 2026',issuer:'Daniel',company:'PT Lentera Indonesia Group',recipientName:'PT Client',recipientAddress:'Jl. Contoh 1\nJakarta',billingMonth:'2026-11',sourceQuotationId:quote.id,items:copied.items,paymentAccounts:[{bankName:'Mandiri',accountNumber:'1550016437454',accountHolder:'JESSEN NATHANAEL'}]};
const parsed=schemas.document.parse(d);assert.equal(parsed.recipientAddress,d.recipientAddress);assert.equal(parsed.paymentAccounts[0].accountHolder,'JESSEN NATHANAEL');
assert.equal(schemas.document.safeParse({...d,paymentAccounts:[{bankName:'Mandiri',accountNumber:'abc',accountHolder:'Jessen'}]}).success,false);
assert.equal(schemas.bank.safeParse({bankName:'Mandiri',accountNumber:'1550016437454',accountHolder:''}).success,false);
const legacy=schemas.document.parse({type:'Quotation',number:'Q/old',date:'2026-10-14',period:'November',items:[{description:'Scope',qty:1,price:100}],issuer:'Daniel',company:'PT Lentera'});assert.deepEqual(legacy.paymentAccounts,[]);assert.equal(legacy.recipientAddress,'');
console.log('PASS: month-one copy, exact detail preservation, tagged month filtering, no invented proration, legacy documents, address and bank validation.');
const {invoiceTotals}=await import('../lib/invoice.ts');
const grossed=invoiceTotals({...d,taxMode:'pph23_gross_up'});
assert.deepEqual(grossed,{subtotal:17000000,grossUp:true,gross:17346939,allowance:346939,withholding:346939,net:17000000});
assert.equal(invoiceTotals({...d,taxMode:'none'}).gross,17000000);
assert.equal(invoiceTotals(d).net,17000000);
assert.equal(invoiceTotals({...d,type:'Quotation',taxMode:'pph23_gross_up'}).grossUp,false);
assert.equal(schemas.document.parse({...d,taxMode:'pph23_gross_up'}).taxMode,'pph23_gross_up');
assert.equal(schemas.document.parse(d).taxMode,'none');
assert.equal(schemas.document.safeParse({...d,taxMode:'2percent_add'}).success,false);
for(const fee of [0,1,24,25,49,50,51,100,1000000,5000000,17000000,51000000]){
 const t=invoiceTotals({type:'Invoice',taxMode:'pph23_gross_up',items:[{qty:1,price:fee}]});
 assert.equal(t.net,fee);assert.equal(t.gross-t.withholding,t.net);assert.equal(t.subtotal+t.allowance,t.gross);
}
console.log('PASS: optional PPh 23 gross-up, 2% withholding, rupiah rounding, net preserved, legacy totals unchanged.');

assert.equal(schemas.document.parse(d).showSubtotal,true);
assert.equal(schemas.document.parse({...d,showSubtotal:false}).showSubtotal,false);
assert.equal(schemas.document.safeParse({...d,showSubtotal:'false'}).success,false);
