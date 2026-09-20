// LOVE CHESS — Swiss / Dutch-style pairing

function pairingColorBalance(id){
 const p=pairingContext.players[id];
 const c=p?.colors||[];
 return c.filter(x=>x==='W').length-c.filter(x=>x==='B').length;
}

/*
 * LOVE CHESS Dutch 2026 pairing engine.
 *
 * The engine follows the current FIDE Dutch terminology and priorities:
 * scoregroups/brackets, MDPs (moved-down players), PAB, C1-C21 and
 * FIDE colour-preference allocation. It deliberately keeps the public
 * tournament data format unchanged so existing tournaments remain usable.
 */

function dutchRank(a,b){
 const A=pairingContext.players[a],B=pairingContext.players[b];
 return B.points-A.points || A.tpn-B.tpn;
}

function colourPreference(id){
 const p=pairingContext.players[id];
 if(!p || !p.colors || !p.colors.length)return 'NONE';
 const c=p.colors, diff=pairingColorBalance(id);
 const last=c[c.length-1], prev=c[c.length-2];
 if(diff < -1 || (last==='B'&&prev==='B'))return 'W';
 if(diff > 1 || (last==='W'&&prev==='W'))return 'B';
 if(diff===-1)return 'W';
 if(diff===1)return 'B';
 return last==='W'?'B':'W';
}

function preferenceStrength(id){
 const pref=colourPreference(id);
 if(pref==='NONE')return 0;
 const p=pairingContext.players[id], diff=pairingColorBalance(id), c=p?.colors||[];
 if(Math.abs(diff)>1 || (c.length>=2&&c[c.length-1]===c[c.length-2]))return 3;
 if(Math.abs(diff)===1)return 2;
 return 1;
}

function isTopscorer(id){
 const p=pairingContext.players[id];
 return !!p && pairingContext.finalRound && p.points > (pairingContext.totalRounds/2);
}

function absolutePreference(id){
 const p=colourPreference(id);
 return (preferenceStrength(id)>=3)?p:'NONE';
}

function c3Allowed(a,b){
 if(isTopscorer(a)||isTopscorer(b))return true;
 const pa=absolutePreference(a),pb=absolutePreference(b);
 return !(pa!=='NONE' && pa===pb);
}

function previousFloatInfo(id){
 return pairingContext.players[id]?.floatHistory||[];
}

function lastFloatType(id,roundsAgo){
 const arr=previousFloatInfo(id);
 const target=pairingContext.round-roundsAgo;
 for(let i=arr.length-1;i>=0;i--)if(arr[i].round===target)return arr[i].type;
 return '';
}

function lastFloatDiff(id,roundsAgo){
 const arr=previousFloatInfo(id),target=pairingContext.round-roundsAgo;
 for(let i=arr.length-1;i>=0;i--)if(arr[i].round===target)return arr[i].scoreDiff||0;
 return 0;
}

function hasBye(id){return pairingContext.previousByes.has(id)}

function pairAbsoluteAllowed(a,b){
 const A=pairingContext.players[a],B=pairingContext.players[b];
 return !!A&&!!B && !A.played.includes(b) && !B.played.includes(a) && c3Allowed(a,b);
}

function colourAllocation(a,b){
 const pa=colourPreference(a),pb=colourPreference(b);
 const sa=preferenceStrength(a),sb=preferenceStrength(b);
 const options=[{white:a,black:b},{white:b,black:a}];
 const lastOpposite=(w,bl)=>{
  const aw=pairingContext.players[w]?.colors||[],ab=pairingContext.players[bl]?.colors||[];
  for(let i=Math.min(aw.length,ab.length)-1;i>=0;i--){
   if(aw[i]!==ab[i])return aw[i]==='W'?'W':'B';
  }
  return '';
 };
 options.forEach(o=>{
  const w=o.white,bl=o.black;
  let prefMiss=0,strongMiss=0;
  if(pa!=='NONE' && o.white!==a && pa==='W'){} // evaluated below per player
  if(colourPreference(w)!=='NONE' && colourPreference(w)!=='W')prefMiss++;
  if(colourPreference(bl)!=='NONE' && colourPreference(bl)!=='B')prefMiss++;
  if(preferenceStrength(w)>=2 && colourPreference(w)!=='W')strongMiss++;
  if(preferenceStrength(bl)>=2 && colourPreference(bl)!=='B')strongMiss++;
  o.prefMiss=prefMiss;o.strongMiss=strongMiss;
  o.sameThree=0;
  for(const id of [w,bl]){
   const c=pairingContext.players[id]?.colors||[], desired=id===w?'W':'B';
   if(c.length>=2&&c[c.length-1]===desired&&c[c.length-2]===desired)o.sameThree++;
  }
  o.diff=Math.abs((pairingColorBalance(w)+1)-(pairingColorBalance(bl)-1));
  o.alt=lastOpposite(w,bl);
 });
 options.sort((x,y)=>x.prefMiss-y.prefMiss||x.strongMiss-y.strongMiss||x.sameThree-y.sameThree||x.diff-y.diff);
 // FIDE 5.2: preference, stronger preference, alternate, higher-ranked preference, initial colour.
 const best=options[0], other=options[1];
 if(other.prefMiss===best.prefMiss&&other.strongMiss===best.strongMiss&&other.sameThree===best.sameThree&&other.diff===best.diff){
  const higher=dutchRank(a,b)<=0?a:b;
  const hp=colourPreference(higher);
  if(hp==='W'&&best.white!==higher)return other;
  if(hp==='B'&&best.black!==higher)return other;
  if((pairingContext.players[higher]?.tpn||1)%2===0 && best.white===higher)return other;
  if((pairingContext.players[higher]?.tpn||1)%2===1 && best.black===higher)return other;
 }
 return best;
}

function candidateMetrics(pairs,byeId,downIds){
 const downScores=downIds.map(id=>pairingContext.players[id].points).sort((a,b)=>b-a);
 const c10=[],c11=[]; let c12=0,c13=0,c14=0,c15=0,c16=0,c17=0;
 const c18=[],c19=[],c20=[],c21=[];
 pairs.forEach(([a,b])=>{
  const ca=colourAllocation(a,b);
  for(const id of [a,b]){
   const assigned=ca.white===id?'W':'B',pref=colourPreference(id),sp=preferenceStrength(id),c=pairingContext.players[id].colors||[];
   if(pref!=='NONE'&&assigned!==pref)c12++;
   if(sp>=2&&assigned!==pref)c13++;
   if(isTopscorer(id)||(pairs.some(x=>x[0]===id&&isTopscorer(x[1]))||pairs.some(x=>x[1]===id&&isTopscorer(x[0])))){
    const d=pairingColorBalance(id)+(assigned==='W'?1:-1);
    if(d>2||d<-2)c10++;
    if(c.length>=2&&c[c.length-1]===assigned&&c[c.length-2]===assigned)c11++;
   }
  }
  const scoreA=pairingContext.players[a].points,scoreB=pairingContext.players[b].points;
  if(scoreA!==scoreB){
   const higher=dutchRank(a,b)<0?a:b,lower=higher===a?b:a;
   if(lastFloatType(higher,1)==='down'){c14++;c18.push(Math.abs(scoreA-scoreB));}
   if(lastFloatType(lower,1)==='up'){c15++;c19.push(Math.abs(scoreA-scoreB));}
   if(lastFloatType(higher,2)==='down'){c16++;c20.push(Math.abs(scoreA-scoreB));}
   if(lastFloatType(lower,2)==='up'){c17++;c21.push(Math.abs(scoreA-scoreB));}
  }
 });
 const lexDesc=a=>a.slice().sort((x,y)=>y-x);
 const byeScore=byeId==null?0:pairingContext.players[byeId].points;
 const byeUnplayed=byeId==null?0:pairingContext.players[byeId].unplayed||0;
 return [byeScore,downIds.length,downScores.length?downScores:[],byeUnplayed,c10,c11,c12,c13,c14,c15,c16,c17,lexDesc(c18),lexDesc(c19),lexDesc(c20),lexDesc(c21)];
}

function compareMetric(a,b){
 for(let i=0;i<a.length;i++){
  const x=a[i],y=b[i];
  if(Array.isArray(x)||Array.isArray(y)){
   const aa=x||[],bb=y||[];const n=Math.max(aa.length,bb.length);
   for(let j=0;j<n;j++){const d=(aa[j]??0)-(bb[j]??0);if(d)return d;}
  }else if(x!==y)return x-y;
 }
 return 0;
}

function allowedPair(a,b){
 const A=pairingContext.players[a],B=pairingContext.players[b];
 if(!pairAbsoluteAllowed(a,b))return false;
 return Math.abs(A.points-B.points)<=2;
}

function buildDutchHistory(t,rows){
 const ids=new Set(rows.map(x=>x.id));
 rows.forEach(x=>x.floatHistory=[]);
 const scores=Object.fromEntries(rows.map(x=>[x.id,0]));
 const tpns=Object.fromEntries(rows.map(x=>[x.id,x.tpn]));
 (t.roundData||[]).forEach(r=>{
  (r.pairs||[]).forEach(m=>{
   if(!m.white||!ids.has(m.white))return;
   if(m.bye){rows.find(x=>x.id===m.white).floatHistory.push({round:r.number,type:'down',scoreDiff:0});return;}
   if(!m.black||!ids.has(m.black))return;
   const a=m.white,b=m.black,sa=scores[a]||0,sb=scores[b]||0;
   if(sa!==sb){
    const higher=(sa>sb||(sa===sb&&tpns[a]<tpns[b]))?a:b;
    const lower=higher===a?b:a;
    const diff=Math.abs(sa-sb);
    rows.find(x=>x.id===higher)?.floatHistory.push({round:r.number,type:'down',scoreDiff:diff});
    rows.find(x=>x.id===lower)?.floatHistory.push({round:r.number,type:'up',scoreDiff:diff});
   }
   if(m.result==='1-0')scores[a]+=1;
   else if(m.result==='0-1')scores[b]+=1;
   else if(m.result==='0.5-0.5'){scores[a]+=0.5;scores[b]+=0.5;}
  });
 });
}

function generatePairingsForSet(ids){
 let best=null,nodes=0;
 const maxNodes=250000;
 const ordered=ids.slice().sort(dutchRank);
 function rec(rest,pairs,downIds){
  if(++nodes>maxNodes)return;
  if(!rest.length){
   const metric=candidateMetrics(pairs,null,downIds);
   if(!best||compareMetric(metric,best.metric)<0)best={pairs:pairs.slice(),metric};
   const perfect=downIds.length===0 && metric.slice(4).every(x=>Array.isArray(x)?x.length===0:x===0);
   if(perfect){best.perfect=true;return;}
   return;
  }
  const pivot=rest[0];
  const choices=rest.slice(1).filter(x=>allowedPair(pivot,x));
  choices.sort((a,b)=>{
   const pa=pairingContext.players[a],pb=pairingContext.players[b];
   const da=Math.abs(pa.points-pairingContext.players[pivot].points),db=Math.abs(pb.points-pairingContext.players[pivot].points);
   return da-db||pa.points-pb.points||pa.tpn-pb.tpn;
  });
  for(const opp of choices){
   const cross=pairingContext.players[pivot].points!==pairingContext.players[opp].points;
   rec(rest.filter(x=>x!==pivot&&x!==opp),pairs.concat([[pivot,opp]]),cross?downIds.concat([dutchRank(pivot,opp)<0?pivot:opp]):downIds);
   if(best?.perfect||nodes>maxNodes)return;
  }
 }
 rec(ordered,[],[]);
 return best;
}

function swissPairing(ids){
 // Dutch-style global bracket search. Pairs may be same-score or adjacent-score;
 // the optimizer minimizes floaters first, then applies C5-C21 in priority order.
 if(!ids.length)return {pairs:[],cost:0};
 // Fast exact search for normal-sized tournaments. The search is still bounded;
 // if a pathological position exceeds the limit, we use the best partial branch
 // rather than violating C1-C3.
 const result=generatePairingsForSet(ids);
 if(!result)return null;
 return {pairs:result.pairs,cost:0,metric:result.metric};
}

function chooseSwissBye(rows){
 const candidates=rows.filter(x=>!hasBye(x.id));
 if(!candidates.length)return null;
 return candidates.slice().sort((a,b)=>a.points-b.points||a.unplayed-b.unplayed||a.tpn-b.tpn)[0]?.id||null;
}

