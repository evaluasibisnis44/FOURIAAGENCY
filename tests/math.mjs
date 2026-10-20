import assert from 'node:assert/strict';
import {calc,paymentStatus,csv} from '../lib/model.ts';import {seedRows} from '../lib/seed.ts';
let c=calc(seedRows(),'batavia','2026-11');assert.equal(c.budget,17000000);assert.equal(c.planned,7900000);assert.equal(c.profit,9100000);assert.equal(c.agency,4550000);assert.equal(c.sheren,2275000);assert.equal(c.jessen,2275000);assert.equal(c.cash,0);
assert.equal(calc(seedRows(),'mureh','2026-10').budget,5000000);assert.equal(calc(seedRows(),'batavia','all').budget,51000000);
assert.equal(paymentStatus(17000000,0),'Non payment');assert.equal(paymentStatus(17000000,8500000),'DP ≥50% · follow-up full payment');assert.equal(paymentStatus(17000000,17000000),'Full payment');
const loss=calc([{kind:'period',clientId:'a',data:{month:'2026-11',budget:100},id:'1'},{kind:'expense',clientId:'a',data:{month:'2026-11',planned:200,actual:200},id:'2'}]);assert.equal(loss.profit,-100);assert.equal(loss.agency,0);assert.equal(loss.sheren,0);
assert.ok(csv([['=SUM(1,1)']]).includes("'=SUM"));console.log('PASS: monthly/contract math, 50/25/25 split, DP and paid status, loss handling, safe CSV.');
