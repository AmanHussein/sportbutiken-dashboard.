import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {analyze,campaign} from './model.js';
const data=JSON.parse(readFileSync(new URL('./data/source.json',import.meta.url),'utf8'));
test('Grundscenario stämmer med Excel',()=>{const r=analyze(data),sum=k=>r.reduce((a,p)=>a+p[k],0);assert.equal(sum('sold'),527);assert.equal(sum('value'),37820);assert.equal(sum('orderValue'),14035);assert.equal(r.filter(p=>p.risk).length,6)});
test('Ändrad buffert räknar om inköp men ändrar inte nuvarande risk',()=>{const r=analyze(data,{buffer:2});assert.equal(r.reduce((a,p)=>a+p.orderValue,0),22160);assert.equal(r.filter(p=>p.risk).length,6)});
test('Filter och tomma kombinationer',()=>{assert.equal(analyze(data,{product:'P007'})[0].order,27);assert.equal(analyze(data,{supplier:'Nordic Sport',product:'P007'}).length,0)});
test('Kampanj och nollrabatt',()=>{const p=data.products.find(p=>p.id==='P009');assert.ok(Math.abs(campaign(p,20).profit-289.2)<1e-9);assert.equal(campaign(p,0).profit,449)});
