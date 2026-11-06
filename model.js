export function analyze(data,{supplier='',product='',buffer=1}={}) {
 return data.products.filter(p=>(!supplier||p.supplier===supplier)&&(!product||p.id===product)).map(p=>{
 const sold=data.sales.filter(s=>s.productId===p.id).reduce((a,s)=>a+s.quantity,0),average=sold/4;
 const coverage=average?p.stock/average:Infinity,target=Math.ceil(average*(p.leadWeeks+buffer)),order=Math.max(0,target-p.stock);
 return {...p,sold,average,coverage,target,order,orderValue:order*p.cost,value:p.stock*p.cost,risk:coverage<p.leadWeeks};
 });
}
export function campaign(p,discount){const price=p.price*(1-discount/100);return {price,profit:price-p.cost,margin:price?(price-p.cost)/price:0};}
