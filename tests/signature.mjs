import fs from 'node:fs';import assert from 'node:assert/strict';import {transform} from 'esbuild';import {renderToStaticMarkup} from 'react-dom/server';import React from 'react';
const source=fs.readFileSync('app/document-signature.tsx','utf8');const built=await transform(source,{loader:'tsx',format:'esm',jsx:'automatic'});const tmp=new URL('../app/.signature-test.mjs',import.meta.url);fs.writeFileSync(tmp,built.code);
try{const {default:Signature}=await import(tmp.href);const data={type:'Invoice',issuer:'Jessen',issuerTitle:'Founder',company:'PT Lentera'};
 const invoice=renderToStaticMarkup(React.createElement(Signature,{data}));assert.ok(!invoice.includes('Approved by'));assert.ok(invoice.includes('Jessen'));assert.ok(invoice.includes('Founder'));assert.ok(invoice.includes('PT Lentera'));
 const quote=renderToStaticMarkup(React.createElement(Signature,{data:{...data,type:'Quotation'}}));assert.ok(quote.includes('Approved by'));console.log('PASS: invoice signature has issuer name/title and no approval; quotation approval preserved.');
}finally{fs.unlinkSync(tmp);}
