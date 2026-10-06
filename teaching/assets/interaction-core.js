'use strict';
// All numerical interaction data are local. No analytics or network requests.
const $ = id => document.getElementById(id);
const svgEl=(name,attrs,text)=>{const e=document.createElementNS('http://www.w3.org/2000/svg',name);for(const [k,v] of Object.entries(attrs||{}))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;return e;};
function plot(svg,series,xmax,ymax,selected){
 svg.replaceChildren(); const w=640,h=Number(svg.viewBox.baseVal.height)||270,p={l:80,r:15,t:36,b:72};
 const x=v=>p.l+v/xmax*(w-p.l-p.r),y=v=>h-p.b-v/ymax*(h-p.t-p.b);
 for(let j=0;j<=4;j++){let v=ymax*j/4;svg.append(svgEl('line',{x1:p.l,x2:w-p.r,y1:y(v),y2:y(v),stroke:'#ddd'}));svg.append(svgEl('text',{x:p.l-8,y:y(v)+4,'text-anchor':'end','font-size':13,fill:'#444'},v.toFixed(ymax<=1?2:1)));}
 for(let j=0;j<=4;j++){let v=xmax*j/4;svg.append(svgEl('text',{x:x(v),y:h-p.b+22,'text-anchor':'middle','font-size':13,fill:'#444'},v.toFixed(xmax<=1?2:0)));}
 svg.append(svgEl('text',{x:(p.l+w-p.r)/2,y:h-8,'text-anchor':'middle','font-size':14,fill:'#444'},xmax===1?'True event probability':'Time (months)'));
 for(const s of series){const d=s.points.map((v,i)=>!i?'M'+x(v[0]).toFixed(3)+','+y(v[1]).toFixed(3):s.step?'H'+x(v[0]).toFixed(3)+'V'+y(v[1]).toFixed(3):'L'+x(v[0]).toFixed(3)+','+y(v[1]).toFixed(3)).join(' ');svg.append(svgEl('path',{d,fill:'none',stroke:s.color,'stroke-width':2.4,...(s.dash?{'stroke-dasharray':s.dash}:{})}));}
 if(selected!==undefined)svg.append(svgEl('line',{x1:x(selected),x2:x(selected),y1:p.t,y2:h-p.b,stroke:'#333','stroke-dasharray':'3 4'}));
}
function binom(k,n,p){if(p===0)return k===0?1:0;if(p===1)return k===n?1:0;let c=1;for(let j=1;j<=k;j++)c*= (n-j+1)/j;return c*p**k*(1-p)**(n-k);}
function risks(p,fp,fn){const n=10,v=p*(1-p),m=[v/n,(n*v+(1-2*p)**2)/(n+2)**2],cost=[0,0],disagree=[];for(let k=0;k<=n;k++){const a=[(fp+fn)*k>fp*n,(fp+fn)*(k+1)>fp*(n+2)];if(a[0]!==a[1])disagree.push(k);for(let j=0;j<2;j++)cost[j]+=binom(k,n,p)*(a[j]?fp*(1-p):fn*p);}return{m,cost,b:m.map(q=>q+v),disagree};}
if($('decision-explorer')){
 let revealed=false;
 const reset=()=>{revealed=false;$('decision-result').hidden=true;$('decision-prompt').hidden=false;$('p-label').textContent=Number($('truth-p').value).toFixed(2);};
 function draw(){const p=Number($('truth-p').value),[fp,fn]=$('costs').value.split(',').map(Number),r=risks(p,fp,fn);
 $('decision-rows').replaceChildren();['Sample proportion','Shrinkage'].forEach((name,j)=>{const row=document.createElement('tr');[name,r.m[j].toFixed(6),r.b[j].toFixed(6),r.cost[j].toFixed(6)].forEach(value=>{const cell=document.createElement('td');cell.textContent=value;row.append(cell);});$('decision-rows').append(row);});
 const relation=Math.abs(r.cost[1]-r.cost[0])<1e-12?'the same expected decision cost':r.cost[1]<r.cost[0]?'lower expected decision cost':'higher expected decision cost';
 $('decision-explanation').textContent=`The action threshold is ${(fp/(fp+fn)).toFixed(4)}, with action 0 on a tie. The rules ${r.disagree.length?'disagree at K = '+r.disagree.join(', '):'always choose the same action'}. At p = ${p.toFixed(2)}, shrinkage has ${relation}. An MSE comparison and a cost comparison answer different questions.`;
 const curves=[[],[]];let max=0;for(let i=0;i<=200;i++){let x=i/200,q=risks(x,fp,fn);for(let j=0;j<2;j++){curves[j].push([x,q.cost[j]]);max=Math.max(max,q.cost[j]);}}
 plot($('decision-plot'),[{points:curves[0],color:'#002d72'},{points:curves[1],color:'#b05218'}],1,Math.ceil(max*2)/2,p);
 $('decision-result').hidden=false;$('decision-prompt').hidden=true;revealed=true;}
 $('truth-p').addEventListener('input',reset);$('costs').addEventListener('change',reset);$('reveal-decision').addEventListener('click',draw);
}
if($('censoring-explorer')){
 const data=window.CENSORING_DATA||{};
 $('censoring-regime').addEventListener('change',()=>{$('censoring-result').hidden=true;$('censoring-prompt').hidden=false;});
 $('reveal-censoring').addEventListener('click',()=>{const key=$('censoring-regime').value,rows=data[key];if(!rows){$('censoring-prompt').textContent='Local numerical data are unavailable; consult the static figure and R script.';return;}
 plot($('censoring-plot'),[{points:rows.map(r=>[r.time,r.target]),color:'#002d72'},{points:rows.map(r=>[r.time,r.pooled_limit]),color:'#777',dash:'6 4'},{points:rows.map(r=>[r.time,r.sample_km]),color:'#b05218',step:true}],8,1);
 const at5=rows.reduce((a,b)=>Math.abs(b.time-5)<Math.abs(a.time-5)?b:a);const direction=key==='independent'?'The pooled limit equals the target under marginal independence.':key==='high_dropout'?'Faster dropout of high-risk individuals lowers the observed hazard and raises the pooled survival limit.':'Faster dropout of low-risk individuals raises the observed hazard and lowers the pooled survival limit.';
 $('censoring-explanation').textContent=`${direction} At five months, true survival is ${at5.target.toFixed(4)}, the pooled limit is ${at5.pooled_limit.toFixed(4)}, and this sample’s KM estimate is ${at5.sample_km.toFixed(4)}. The sample has ${at5.n_risk} individuals at risk. Under the model, ${(100*at5.high_risk_fraction).toFixed(1)}% of the observed risk set belongs to the high-risk group. Conditional independence alone does not justify a pooled curve.`;
 $('censoring-result').hidden=false;$('censoring-prompt').hidden=true;});
}
