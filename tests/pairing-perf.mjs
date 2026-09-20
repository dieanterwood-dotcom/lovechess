import fs from 'node:fs';
import vm from 'node:vm';
import { performance } from 'node:perf_hooks';

const code = fs.readFileSync('js/pairing/pairing.js','utf8');
vm.runInThisContext(code);

function makeState(n, seed){
  let x=seed>>>0;
  const rnd=()=>{x=(1664525*x+1013904223)>>>0; return x/4294967296};
  const ids=Array.from({length:n},(_,i)=>'P'+i);
  const points=[0,1,1.5,2,2.5,3,3.5];
  const players={};
  ids.forEach((id,i)=>players[id]={points:points[Math.floor(rnd()*points.length)],tpn:i+1,played:[],colors:[],floatHistory:[],unplayed:0});
  for(let r=0;r<Math.min(4,n-1);r++){
    const pool=ids.slice().sort(()=>rnd()-.5), used=new Set();
    for(let i=0;i+1<pool.length;i++){
      const a=pool[i],b=pool[i+1];
      if(used.has(a)||used.has(b)||players[a].played.includes(b)) continue;
      used.add(a);used.add(b);
      players[a].played.push(b); players[b].played.push(a);
      const white=rnd()<.5?a:b;
      players[white].colors.push('W');
      players[white===a?b:a].colors.push('B');
    }
  }
  return {ids,players};
}

for(const n of [10,14,18,20]){
  const times=[];
  for(let k=0;k<3;k++){
    const {ids,players}=makeState(n,100+n*10+k);
    globalThis.pairingContext={players,previousByes:new Set(),round:5,totalRounds:7,finalRound:false};
    const t0=performance.now();
    const out=swissPairing(ids);
    const ms=performance.now()-t0;
    if(!out) throw new Error('No pairing for '+n+' players');
    const seen=new Set();
    for(const [a,b] of out.pairs){
      if(seen.has(a)||seen.has(b)) throw new Error('Player paired twice at '+n);
      seen.add(a);seen.add(b);
      if(players[a].played.includes(b)) throw new Error('Repeat opponent at '+n);
      if(Math.abs(players[a].points-players[b].points)>2) throw new Error('Score gap >2 at '+n);
    }
    if(seen.size!==n) throw new Error('Not all players paired at '+n);
    times.push(ms);
  }
  times.sort((a,b)=>a-b);
  console.log(`${n} players: ${times.map(x=>x.toFixed(1)).join(', ')} ms; median ${times[1].toFixed(1)} ms`);
}
console.log('PAIRING SELF-TEST: PASS');
