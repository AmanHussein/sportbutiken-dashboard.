import {analyze,campaign} from './model.js';
const $=id=>document.getElementById(id),num=(n,d=0)=>new Intl.NumberFormat('sv-SE',{maximumFractionDigits:d,minimumFractionDigits:d}).format(n),money=n=>num(n)+' kr';
const data=await fetch('./data/source.json').then(r=>{if(!r.ok)throw Error('Kunde inte läsa datan');return r.json()});
const option=(value,label)=>{const o=document.createElement('option');o.value=value;o.textContent=label;return o};
for(const s of [...new Set(data.products.map(p=>p.supplier))])$('supplier').append(option(s,s));
for(const p of data.products){$('product').append(option(p.id,p.name));$('campaign-product').append(option(p.id,p.name))}
$('campaign-product').value='P009';
let rows=[];
function render(){rows=analyze(data,{supplier:$('supplier').value,product:$('product').value,buffer:Number($('buffer').value)});const total=k=>rows.reduce((a,r)=>a+r[k],0),risk=rows.filter(p=>p.risk).length;
 $('kpis').innerHTML=[['Lagervärde till inköpspris',money(total('value')),'Lagersaldo × inköpspris',''],['Inköpsförslagets värde',money(total('orderValue')),'Med vald säkerhetstid',''],['Artiklar med risk för lagerbrist',risk+' / '+rows.length,'Täcktiden understiger leveranstiden','risk'],['Försäljningsvolym',num(total('sold'))+' st','Totalt under fyra veckor','']].map(([label,val,note,cls])=>`<article class="kpi ${cls}"><div class="label">${label}</div><strong>${val}</strong><small>${note}</small></article>`).join('');
 const top=[...rows].sort((a,b)=>b.value-a.value)[0];$('insight').textContent=rows.length?`${risk} av ${rows.length} artiklar har en täcktid som understiger leveranstiden. ${top.name} har högst lagervärde i urvalet: ${money(top.value)} (${num(top.value/total('value')*100)} %).`:'Inga artiklar matchar filtren. Välj en annan kombination eller återställ filtren.';
 const ids=new Set(rows.map(p=>p.id)),weeks=[1,2,3,4].map(w=>data.sales.filter(s=>s.week===w&&ids.has(s.productId)).reduce((a,s)=>a+s.quantity,0)),max=Math.max(1,...weeks);
 $('sales-chart').innerHTML=weeks.map((n,i)=>`<div class="bar-col"><span class="bar-value">${n}</span><div class="bar" style="height:${n/max*145}px" role="img" aria-label="Vecka ${i+1}: ${n} sålda"></div><span class="bar-label">Vecka ${i+1}</span></div>`).join('');
 $('capital-chart').innerHTML=[...rows].sort((a,b)=>b.value-a.value).slice(0,5).map(p=>`<div class="capital-row"><div class="capital-label"><span>${p.name}</span><strong>${money(p.value)}</strong></div><div class="track"><span style="width:${p.value/(top?.value||1)*100}%"></span></div></div>`).join('')||'<p>Inga artiklar i urvalet.</p>';
 $('rows').innerHTML=[...rows].sort((a,b)=>Number(b.risk)-Number(a.risk)||b.orderValue-a.orderValue).map(p=>`<tr><td><strong>${p.name}</strong><small>${p.id} · ${p.supplier}</small></td><td>${p.stock} st</td><td>${num(p.coverage,2)}</td><td>${p.leadWeeks}</td><td>${money(p.value)}</td><td>${p.order} st</td><td>${money(p.orderValue)}</td><td><span class="status ${p.risk?'warn':''}">${p.risk?'Risk för lagerbrist':p.coverage>6?'Granska täcktiden':'Täcker leveranstiden'}</span></td></tr>`).join('')||'<tr><td colspan="8">Inga artiklar matchar filtren.</td></tr>';
}
function renderCampaign(){const p=data.products.find(p=>p.id===$('campaign-product').value),d=Number($('discount').value),c=campaign(p,d);$('discount-label').textContent=d+' %';$('campaign-result').innerHTML=[['Kampanjpris',moneyDecimal(c.price)],['Bruttovinst / st',moneyDecimal(c.profit)],['Bruttomarginal',num(c.margin*100,1)+' %']].map(([a,b])=>`<span>${a}<strong>${b}</strong></span>`).join('');const r=analyze(data).find(r=>r.id===p.id);$('campaign-note').textContent=r.risk?'Artikeln har risk för lagerbrist under leveranstiden. En kampanj kan sänka bruttomarginalen och öka risk för lagerbristen om försäljningen ökar.':'Rabatten minskar bruttovinsten per vara. Det krävs ökad försäljning för att kompensera; någon efterfrågeökning antas inte i modellen.';}
function moneyDecimal(n){return num(n,2)+' kr'}
for(const id of ['supplier','product','buffer'])$(id).addEventListener('change',render);
$('reset').onclick=()=>{$('supplier').value='';$('product').value='';$('buffer').value='1';render()};
$('discount').addEventListener('input',renderCampaign);$('campaign-product').addEventListener('change',renderCampaign);
render();renderCampaign();
