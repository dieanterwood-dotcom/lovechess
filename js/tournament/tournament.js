// LOVE CHESS — tournament engine, results, rating history

function getStandings(t){
 const s={};
 const ensure=id=>{if(id&&!s[id])s[id]={id,points:0,buchholz:0,played:[],colors:[]};};
 (t.players||[]).forEach(ensure);
 (t.roundData||[]).filter(r=>r && r.completed).forEach(r=>(r.pairs||[]).forEach(m=>{ensure(m.white);ensure(m.black);if(m.bye){if(s[m.white]){s[m.white].points+=1}return}if(!s[m.white]||!s[m.black])return;s[m.white].played.push(m.black);s[m.black].played.push(m.white);s[m.white].colors.push('W');s[m.black].colors.push('B');if(m.result==='1-0')s[m.white].points+=1;if(m.result==='0-1')s[m.black].points+=1;if(m.result==='0.5-0.5'){s[m.white].points+=.5;s[m.black].points+=.5}}));
 Object.values(s).forEach(x=>x.buchholz=x.played.reduce((sum,opp)=>sum+(s[opp]?.points||0),0));
 const rows=Object.values(s).filter(x=>(t.players||[]).includes(x.id));
 // Личные встречи используются только после очков и Buchholz.
 // Для группы с одинаковыми очками и Buchholz считаем мини-таблицу
 // по партиям между игроками этой группы.
 rows.forEach(x=>{
  const group=rows.filter(y=>y.id!==x.id && y.points===x.points && y.buchholz===x.buchholz);
  x.headToHead=group.reduce((sum,opp)=>{
   const played= x.played.includes(opp.id);
   if(!played)return sum;
   const matches=(t.roundData||[]).flatMap(r=>r.pairs||[]);
   const m=matches.find(m=>!m.bye && ((m.white===x.id&&m.black===opp.id)||(m.white===opp.id&&m.black===x.id)));
   if(!m)return sum;
   if(m.white===x.id && m.result==='1-0')return sum+1;
   if(m.black===x.id && m.result==='0-1')return sum+1;
   if(m.result==='0.5-0.5')return sum+0.5;
   return sum;
  },0);
 });
 return rows.sort((a,b)=>b.points-a.points||b.buchholz-a.buchholz||(b.headToHead||0)-(a.headToHead||0)||player(b.id).rating-player(a.id).rating)
}

function standingsTable(rows){
 const t=arguments.length>1?arguments[1]:null;
 const rounds=t?.roundData||[];
 const statById={};
 rows.forEach(x=>statById[x.id]={w:0,d:0,l:0,results:[]});
 rounds.forEach(r=>(r.pairs||[]).forEach(m=>{
   if(!statById[m.white])return;
   if(m.bye){statById[m.white].results.push('BYE');return}
   if(!statById[m.black])return;
   const a=statById[m.white],b=statById[m.black];
   if(m.result==='1-0'){a.w++;b.l++;a.results.push('1');b.results.push('0')}
   else if(m.result==='0-1'){a.l++;b.w++;a.results.push('0');b.results.push('1')}
   else if(m.result==='0.5-0.5'){a.d++;b.d++;a.results.push('½');b.results.push('½')}
   else {a.results.push('—');b.results.push('—')}
 }));
 const completedRounds=rounds.length;
 return `<div class="standings-wrap"><table class="table standings-table"><thead><tr><th class="rank-col">#</th><th>Игрок</th><th>Рейтинг</th><th class="points-col">Очки</th><th>BH</th><th>ЛВ</th><th>П / Н / П</th>${completedRounds?`<th class="results-col">Результаты</th>`:''}</tr></thead><tbody>${rows.map((x,i)=>{const st=statById[x.id]||{w:0,d:0,l:0,results:[]};const leader=i===0&&x.points>0;return `<tr class="${leader?'leader-row':''}"><td class="rank-cell"><span class="rank-number">${i+1}</span></td><td><button class="ghost player-link" onclick="profile('${x.id}')">${esc(displayName(x.id))}</button></td><td class="rating-cell">${player(x.id).rating}</td><td class="points-cell"><b>${Number.isInteger(x.points)?x.points:x.points.toFixed(1)}</b></td><td>${x.buchholz.toFixed(1)}</td><td class="head-to-head-cell">${(x.headToHead||0).toFixed(1)}</td><td class="record-cell"><span class="win-count">${st.w}</span> / ${st.d} / <span class="loss-count">${st.l}</span></td>${completedRounds?`<td class="results-cell">${st.results.map((res,j)=>`<span class="round-result ${res==='1'?'win':res==='0'?'loss':res==='½'?'draw':res==='BYE'?'bye':''}" title="Тур ${j+1}">${res}</span>`).join('')}</td>`:''}</tr>`}).join('')}</tbody></table></div>`
}

function roundBlock(t,r,readonly=false){
  if(!r)return '';
  const ri=(t.roundData||[]).indexOf(r);
  const editingCompleted=!readonly && t.editingRound===ri && r.completed;
  const editableCurrent=!readonly && ri===t.currentRound-1 && !r.completed;
  const editable=editingCompleted||editableCurrent;
  const editNotice=editingCompleted?`<div class="edit-round-notice">Исправление результата. После сохранения рейтинг и статистика будут пересчитаны с этого тура до текущего.</div>`:'';
  return `<section class="section round-panel">
    <div class="row round-panel-head"><div><h2>Тур ${r.number}</h2><span class="tag">${editingCompleted?'Редактирование':r.completed?'Результаты внесены':'Внесите результаты'}</span></div></div>
    ${editNotice}
    <div class="matches">${(r.pairs||[]).map((m,i)=>`<div class="match card">
      ${m.bye?`<div class="readonly-match-content"><div class="readonly-board">Стол ${i+1}</div><div class="readonly-player white-player"><b>${esc(displayName(m.white))}</b></div><div class="readonly-score score-bye">BYE</div><div class="readonly-player black-player"><span class="muted">+1 очко</span></div></div>`:!editable?`<div class="readonly-match-content"><div class="readonly-board">Стол ${i+1}</div><div class="readonly-player white-player"><b>${esc(displayName(m.white))}</b></div><div class="readonly-score ${m.result==='1-0'?'score-win-white':m.result==='0-1'?'score-win-black':m.result==='0.5-0.5'?'score-draw':'score-empty'}">${m.result==='1-0'?'1–0':m.result==='0-1'?'0–1':m.result==='0.5-0.5'?'½–½':'—'}</div><div class="readonly-player black-player"><b>${esc(displayName(m.black))}</b></div></div>`:`<div><span class="board">Стол ${i+1}</span><b>${esc(displayName(m.white))}</b> <span class="muted">vs</span> <b>${esc(displayName(m.black))}</b></div>
      <select onchange="setResult('${t.id}',${ri},${i},this.value)"><option value="">Результат</option><option value="1-0" ${m.result==='1-0'?'selected':''}>1–0</option><option value="0-1" ${m.result==='0-1'?'selected':''}>0–1</option><option value="0.5-0.5" ${m.result==='0.5-0.5'?'selected':''}>½–½</option></select>`}
    </div>`).join('')}</div>
    ${editableCurrent?`<div class="actions"><button class="primary" onclick="finishRound('${t.id}')">Сохранить результаты тура</button></div>`:''}
    ${editingCompleted?`<div class="actions"><button class="primary" onclick="saveEditedRound('${t.id}')">Сохранить исправления</button><button class="ghost" onclick="cancelEditRound('${t.id}')">Отменить</button></div>`:''}
  </section>`;
}

function tournament(id, selectedRound){
  const t=db.tournaments.find(x=>x.id===id); if(!t)return;
  const rows=getStandings(t);
  const totalRounds=t.roundData?.length||0;
  const selectedIndex=Number.isInteger(selectedRound) ? Math.max(0,Math.min(selectedRound-1,totalRounds-1)) : Math.max(0,totalRounds-1);
  const r=t.roundData?.[selectedIndex];
  const undoButtons=t.currentRound>0?`<div class="round-tools"><button class="danger" onclick="deleteLastRound('${t.id}')">Удалить последний тур</button>${r?.completed&&isOrganizer()&&!Number.isInteger(t.editingRound)?`<button class="ghost" onclick="beginEditRound('${t.id}',${selectedIndex})">Изменить результаты тура ${r.number}</button>`:''}</div>`:'';
  const deleteBtn=isOrganizer()?`<button class="danger" onclick="deleteTournament('${t.id}')">Удалить турнир</button>`:'';
  const registrationOpen=t.currentRound===0 && t.status==='Регистрация';
  const current=getCurrentPlayer();
  const currentRegistered=!!current && t.players.includes(current) && isPlayerActive(t,current);
  const registrationBlock=registrationOpen?`<section class="section"><div class="card registration-card"><div class="row"><div><div class="eyebrow">Регистрация</div><h2>Участие в турнире</h2><p class="muted">Введите ник, который организатор уже добавил в систему. Зарегистрироваться могут только участники с действующим профилем LOVE CHESS.</p></div><span class="tag">${t.players.length} участников</span></div>${currentRegistered?`<div class="registration-confirmed"><div><strong>Вы зарегистрированы</strong><div class="muted">${esc(displayName(current))}</div></div><button class="danger danger-outline" onclick="cancelRegistration('${t.id}')">Отменить регистрацию</button></div>`:`<div class="registration-form"><div class="field"><label for="registrationNick">Ваш ник</label><input id="registrationNick" maxlength="40" placeholder="Введите свой ник" autocomplete="off" onkeydown="if(event.key==='Enter')registerTournament('${t.id}')"></div><button class="primary" onclick="registerTournament('${t.id}')">Зарегистрироваться</button></div><p class="muted registration-note">Если ник не найден, сначала оформите подписку на клуб и дождитесь, пока организатор добавит ваш профиль в систему.</p>`}</div></section>`:'';
  const content=`<section class="hero"><div class="eyebrow">Турнир</div><h1>${esc(t.name)}</h1><p>${fmt(t.date)} · ${esc(t.time)} · ${esc(t.place)}</p><p class="muted">Швейцарская жеребьёвка: без повторных встреч, с учётом очков, Buchholz, личных встреч, цветов и BYE.</p><div class="hero-actions"><button class="primary" onclick="startRound('${t.id}')">${t.currentRound===0?'Начать турнир':(t.status==='Завершён'?'Турнир завершён':'Сформировать следующий тур')}</button><button class="ghost" onclick="route('schedule')">← Расписание</button><button class="ghost" onclick="tournamentSettings('${t.id}')">⚙ Настройки турнира</button>${deleteBtn}</div>${undoButtons}</section>
  ${registrationBlock}
  <section class="section"><div class="grid"><div class="card"><div class="meta">Формат</div><div class="title">${esc(t.format)}</div><div class="meta">${esc(t.control)} · ${t.rounds} туров</div></div><div class="card"><div class="meta">Тур</div><div class="rating smallrating">${t.currentRound} / ${t.rounds}</div></div><div class="card"><div class="meta">Участников</div><div class="rating smallrating">${t.players.length}</div></div></div></section>
  ${t.currentRound>0?`<section class="section round-selector-section"><div class="round-selector-head"><div><div class="eyebrow">Туры</div><h2>Просмотр туров</h2></div><span class="muted round-selector-count">${totalRounds} из ${t.rounds}</span></div><div class="round-selector">${(t.roundData||[]).map((rr,i)=>`<button class="round-tab ${i===selectedIndex?'active':''}" onclick="tournament('${t.id}',${i+1})">Тур ${rr.number}</button>`).join('')}</div></section>${roundBlock(t,r)}`:`<section class="section"><div class="card"><h2>Участники</h2><div class="addrow"><input id="newPlayer" placeholder="Например RomaChess"><button class="primary" onclick="addPlayer('${t.id}')">Добавить</button></div>${standingsTable(rows,t)}</div></section>`}
  ${t.currentRound>0?`${isOrganizer()?tournamentParticipantControls(t):''}<section class="section"><div class="row standings-heading"><div><h2>Турнирная таблица</h2><p class="muted">Очки → Buchholz → личные встречи → рейтинг. Результаты по турам — справа.</p></div></div>${standingsTable(rows,t)}</section>`:''}`;
  layout(content,'schedule');
}


function reverseRoundRating(r){
 if(!r)return false;
 if(Array.isArray(r.ratingDeltas)&&r.ratingDeltas.length){
  r.ratingDeltas.forEach(d=>{const p=player(d.id);p.rating=d.beforeRating;p.games=d.beforeGames;p.w=d.beforeW;p.d=d.beforeD;p.l=d.beforeL;p.history=d.beforeHistory.slice()});
  return true;
 }
 return reverseRoundRatingLegacy(r);
}

// Для старых турниров, где ещё не были сохранены ratingDeltas.
// Восстанавливаем рейтинг до тура по обратному расчёту Elo, не удаляя следующий тур.

function reverseRoundRatingLegacy(r){
 if(!r||!Array.isArray(r.pairs))return false;
 const changed=[];
 for(const m of r.pairs){
  if(m.bye)continue;
  if(!m.result)return false;
  const a=player(m.white), b=player(m.black);
  const postA=Number(a.rating), postB=Number(b.rating);
  let found=null;
  for(let delta=-32;delta<=32;delta++){
   const preA=postA-delta, preB=postB+delta;
   if(preA<100||preB<100)continue;
   const sa=m.result==='1-0'?1:m.result==='0-1'?0:.5;
   const ea=1/(1+Math.pow(10,(preB-preA)/400));
   const expected=Math.round(32*(sa-ea));
   const outA=Math.max(100,preA+expected);
   const outB=Math.max(100,preB-expected);
   if(outA===postA&&outB===postB){found={preA,preB};break}
  }
  if(!found)return false;
  changed.push({m,a,b,preA:found.preA,preB:found.preB});
 }
 for(const x of changed){
  const {m,a,b,preA,preB}=x;
  a.rating=preA; b.rating=preB;
  a.games=Math.max(0,Number(a.games||0)-1);
  b.games=Math.max(0,Number(b.games||0)-1);
  if(m.result==='1-0'){a.w=Math.max(0,a.w-1);b.l=Math.max(0,b.l-1)}
  else if(m.result==='0-1'){a.l=Math.max(0,a.l-1);b.w=Math.max(0,b.w-1)}
  else if(m.result==='0.5-0.5'){a.d=Math.max(0,a.d-1);b.d=Math.max(0,b.d-1)}
  if(Array.isArray(a.history)&&a.history.length>1)a.history.pop();
  if(Array.isArray(b.history)&&b.history.length>1)b.history.pop();
 }
 return true;
}

function tournamentGameStats(t){
 const out={};
 (t.players||[]).forEach(id=>out[id]={games:0,w:0,d:0,l:0});
 (t.roundData||[]).forEach(r=>(r.pairs||[]).forEach(m=>{
   if(!m||m.bye)return;
   const a=out[m.white],b=out[m.black];
   if(!a||!b)return;
   a.games++;b.games++;
   if(m.result==='1-0'){a.w++;b.l++}
   else if(m.result==='0-1'){a.l++;b.w++}
   else if(m.result==='0.5-0.5'){a.d++;b.d++}
 }));
 return out;
}

function rebuildLegacyRoundDeltas(t){
 const stats=tournamentGameStats(t);
 const state={};
 for(const id of (t.players||[])){
   const p=db.players[id]; const st=stats[id]||{games:0,w:0,d:0,l:0};
   if(!p || !Array.isArray(p.history) || p.history.length!==Number(p.games||0)+1) return false;
   if(st.games>p.games) return false;
   const startIndex=p.history.length-st.games-1;
   if(startIndex<0)return false;
   const initialGames=p.games-st.games;
   const initialW=p.w-st.w, initialD=p.d-st.d, initialL=p.l-st.l;
   if(initialW<0||initialD<0||initialL<0||initialGames<0)return false;
   state[id]={rating:p.history[startIndex],games:initialGames,w:initialW,d:initialD,l:initialL,history:p.history.slice(0,startIndex+1)};
 }
 for(let ri=0;ri<t.currentRound;ri++){
   const r=t.roundData[ri];
   if(!r||!r.completed)return false;
   const deltas=[]; const seen=new Set();
   for(const m of (r.pairs||[])){
     if(m.bye)continue;
     const a=state[m.white],b=state[m.black];
     if(!a||!b||!m.result)return false;
     if(!seen.has(m.white)){deltas.push({id:m.white,beforeRating:a.rating,beforeGames:a.games,beforeW:a.w,beforeD:a.d,beforeL:a.l,beforeHistory:a.history.slice()});seen.add(m.white)}
     if(!seen.has(m.black)){deltas.push({id:m.black,beforeRating:b.rating,beforeGames:b.games,beforeW:b.w,beforeD:b.d,beforeL:b.l,beforeHistory:b.history.slice()});seen.add(m.black)}
     const sa=m.result==='1-0'?1:m.result==='0-1'?0:.5;
     const ea=1/(1+Math.pow(10,(b.rating-a.rating)/400));
     const da=Math.round(32*(sa-ea));
     a.rating=Math.max(100,a.rating+da); b.rating=Math.max(100,b.rating-da);
     a.games++;b.games++;
     if(sa===1){a.w++;b.l++}else if(sa===0){a.l++;b.w++}else{a.d++;b.d++}
     a.history.push(a.rating);b.history.push(b.rating);
   }
   r.ratingDeltas=deltas;
 }
 return true;
}

function completedRoundEnd(t){
 const total=Math.max(0,Number(t?.currentRound||0));
 if(!Array.isArray(t?.roundData)||!total)return 0;
 const last=t.roundData[total-1];
 return last && last.completed ? total : Math.max(0,total-1);
}

function allRoundDeltasAvailable(t,from=0){
 const start=Math.max(0,Number(from)||0);
 const end=completedRoundEnd(t);
 if(!Array.isArray(t?.roundData) || end>t.roundData.length)return false;
 for(let i=start;i<end;i++){
   const r=t.roundData[i];
   if(!r || !r.completed || !Array.isArray(r.ratingDeltas))return false;
 }
 return true;
}

function ensureRoundDeltas(t,from=0){
 if(allRoundDeltasAvailable(t,from))return true;
 if(!rebuildLegacyRoundDeltas(t))return false;
 return allRoundDeltasAvailable(t,from);
}

function deleteLastRound(id){if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===id);if(!t||!t.currentRound)return;
 const r=t.roundData[t.currentRound-1];
 if(!confirm(`Удалить тур ${r.number}? ${r.completed?'Результаты и изменения рейтинга этого тура будут отменены.':'Сформированные пары этого тура будут удалены.'}`))return;
 if(r.completed && !reverseRoundRating(r)){alert('Для этого старого тура нет сохранённого снимка рейтинга. Создайте тур заново в новой версии сайта, чтобы использовать откат.');return}
 t.roundData.pop();t.currentRound--;t.status=t.currentRound===0?'Регистрация':'Идёт';save();tournament(id);
}

function beginEditRound(id,ri){
 if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===id);if(!t||!t.currentRound)return;
 ri=Number(ri);
 const r=t.roundData?.[ri];
 if(!r||!r.completed)return;
 if(Number.isInteger(t.editingRound)){alert('Сначала завершите или отмените текущее исправление.');return}
 if(ri<t.currentRound-1&&!ensureRoundDeltas(t,ri)){
   alert('Не удалось безопасно подготовить пересчёт этого старого тура. Для этого турнира не хватает полной истории рейтинга одного или нескольких игроков.');
   return;
 }
 t.editingRound=ri;
 t.editingBackup=(r.pairs||[]).map(m=>m.result);
 save();
 tournament(id,ri+1);
}

function cancelEditRound(id){
 if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===id);if(!t||!Number.isInteger(t.editingRound))return;
 const r=t.roundData[t.editingRound];
 if(r&&Array.isArray(t.editingBackup))(r.pairs||[]).forEach((m,i)=>{m.result=t.editingBackup[i]??m.result});
 delete t.editingRound;delete t.editingBackup;
 save();
 tournament(id,r?Number(r.number):undefined);
}

function saveEditedRound(id){
 if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===id);if(!t||!Number.isInteger(t.editingRound))return;
 const from=t.editingRound;
 const target=t.roundData[from];
 if(!target)return;
 if((target.pairs||[]).some(m=>!m.bye&&!m.result)){alert('Внесите результаты всех партий.');return}
 const completedEnd=completedRoundEnd(t);
 if(from>=completedEnd){alert('Этот тур ещё не завершён.');return}
 if(!ensureRoundDeltas(t,from)){
   alert('Не удалось пересчитать рейтинг: в истории турнира не хватает данных. Изменения не сохранены.');
   return;
 }
 if(!confirm(`Изменить результат тура ${target.number}? Рейтинг, партии, победы/ничьи/поражения и история рейтинга будут пересчитаны с этого тура до последнего завершённого тура. Текущий незавершённый тур и его пары останутся без изменений.`))return;
 for(let i=completedEnd-1;i>=from;i--){
   if(!reverseRoundRating(t.roundData[i])){
     alert('Не удалось выполнить пересчёт. Изменения не сохранены.');
     return;
   }
 }
 for(let i=from;i<completedEnd;i++){
   const r=t.roundData[i];
   r.completed=true;
   applyRatings(t,r);
 }
 delete t.editingRound;delete t.editingBackup;
 t.status=t.currentRound>=t.rounds?'Завершён':'Идёт';
 save();
 tournament(id,from+1);
}

function editLastRound(id){
 const t=db.tournaments.find(x=>x.id===id);
 if(!t||!Number.isInteger(t.currentRound))return;
 beginEditRound(id,t.currentRound-1);
}

function startRound(id){if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===id);if(!t)return;
 if(!t.players||t.players.length<2){alert('Добавьте минимум двух игроков.');return}
 if(t.currentRound>0&&!t.roundData[t.currentRound-1].completed){alert('Сначала сохраните результаты текущего тура.');return}
 if(t.currentRound>=t.rounds){t.status='Завершён';save();tournament(id);return}
 const rows=getPairingRows(t);if(rows.length<2){alert('Для нового тура нужно минимум два активных игрока.');return}
 pairingContext={players:Object.fromEntries(rows.map((x,i)=>[x.id,{...x,tpn:t.players.indexOf(x.id)+1,unplayed:0}])),previousByes:new Set(),round:t.currentRound+1,totalRounds:t.rounds,finalRound:t.currentRound+1===t.rounds};
 buildDutchHistory(t,rows);
 rows.forEach(x=>{pairingContext.players[x.id].floatHistory=x.floatHistory||[]});
 (t.roundData||[]).forEach(r=>(r.pairs||[]).forEach(m=>{if(m.bye)pairingContext.previousByes.add(m.white)}));
 // Count previous unplayed rounds for C9.
 rows.forEach(x=>{pairingContext.players[x.id].unplayed=(t.roundData||[]).reduce((n,r)=>n+((r.pairs||[]).some(m=>m.bye&&m.white===x.id)?1:0),0)});
 let pool=rows.slice(),bye=null,result=null;
 if(pool.length%2){
  const byeCandidates=rows.filter(x=>!hasBye(x.id)).sort((a,b)=>a.points-b.points||a.unplayed-b.unplayed||a.tpn-b.tpn);
  for(const cand of byeCandidates){
   const rest=pool.filter(x=>x.id!==cand.id).map(x=>x.id);
   const r=swissPairing(rest);
   if(r){bye=cand.id;result=r;break;}
  }
 }else result=swissPairing(pool.map(x=>x.id));
 if(!result){alert('Не удалось сформировать корректную Dutch-жеребьёвку. Система не нарушает C1–C3 и не создаёт повторных встреч или повторный BYE. Проверьте состав участников и предыдущие результаты.');return}
 let pairs=result.pairs.map(([a,b])=>{const c=colourAllocation(a,b);return {white:c.white,black:c.black,result:''};});
 const rankMap=new Map(rows.map((x,i)=>[x.id,i]));
 pairs.sort((a,b)=>{
  const ap=Math.max(pairingContext.players[a.white]?.points||0,pairingContext.players[a.black]?.points||0),bp=Math.max(pairingContext.players[b.white]?.points||0,pairingContext.players[b.black]?.points||0);
  if(ap!==bp)return bp-ap;
  const al=Math.min(pairingContext.players[a.white]?.points||0,pairingContext.players[a.black]?.points||0),bl=Math.min(pairingContext.players[b.white]?.points||0,pairingContext.players[b.black]?.points||0);
  if(al!==bl)return bl-al;
  return Math.min(rankMap.get(a.white)??9999,rankMap.get(a.black)??9999)-Math.min(rankMap.get(b.white)??9999,rankMap.get(b.black)??9999);
 });
 if(bye)pairs.push({white:bye,black:null,bye:true,result:'BYE'});
 if(!t.roundData)t.roundData=[];
 t.roundData.push({number:t.currentRound+1,pairs,completed:false,pairingType:'dutch'});
 t.currentRound++;t.status='Идёт';save();tournament(id);
}


function isPlayerActive(t,id){return !t.playerStatus || !['inactive','removed'].includes(t.playerStatus[id])}

function getPairingRows(t){return getStandings(t).filter(x=>isPlayerActive(t,x.id))}


function tournamentParticipantControls(t){
 const rows=getStandings(t);
 return `<section class="section"><div class="card tournament-participants-card">
   <div class="row"><div><div class="eyebrow">Участники</div><h2>Управление участниками</h2><p class="muted">Изменения действуют на следующие туры. Сыгранные партии и результаты сохраняются.</p></div><span class="tag">${t.players.length} участников</span></div>
   <div class="tournament-participants-list">${rows.map(x=>{
     const status=t.playerStatus?.[x.id]||'active';
     const active=status!=='inactive'&&status!=='removed';
     const removed=status==='removed';
     return `<div class="tournament-participant-row ${removed?'is-removed':!active?'is-inactive':''}">
       <div class="tournament-participant-info"><button class="ghost player-link" onclick="profile('${x.id}')">${esc(displayName(x.id))}</button><span class="participant-rating">${player(x.id).rating}</span>${removed?'<span class="tag off">Удалён из турнира</span>':!active?'<span class="tag off">Не участвует в жеребьёвке</span>':''}</div>
       <div class="tournament-participant-actions">${removed?`<button class="ghost" onclick="restoreTournamentPlayer('${t.id}','${x.id}')">Вернуть в турнир</button>`:active?`<button class="ghost" onclick="togglePlayerFromTournament('${t.id}','${x.id}')">Не использовать в следующих турах</button><button class="danger danger-outline" onclick="removePlayerFromTournament('${t.id}','${x.id}')">Удалить из турнира</button>`:`<button class="ghost" onclick="togglePlayerFromTournament('${t.id}','${x.id}')">Вернуть в жеребьёвку</button><button class="danger danger-outline" onclick="removePlayerFromTournament('${t.id}','${x.id}')">Удалить из турнира</button>`}</div>
     </div>`;
   }).join('')}</div>
 </div></section>`;
}

function togglePlayerFromTournament(tid,id){if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===tid);if(!t)return;
 if(!t.playerStatus)t.playerStatus={};
 if(t.playerStatus[id]==='removed'){alert('Игрок удалён из турнира. Сначала верните его в турнир.');return}
 t.playerStatus[id]=isPlayerActive(t,id)?'inactive':'active';
 save();tournament(tid);
}

function removePlayerFromTournament(tid,id){if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===tid);if(!t||!t.players.includes(id))return;
 const played=playerHasPlayedInTournament(t,id);
 const currentRound=t.currentRound>0?t.roundData?.[t.currentRound-1]:null;
 const inCurrentRound=!!currentRound&&(currentRound.pairs||[]).some(m=>m.white===id||m.black===id);
 let msg=played
   ? `Удалить ${displayName(id)} из этого турнира? Сыгранные партии и результаты останутся в истории, а игрок не будет участвовать в следующих турах.`
   : `Удалить ${displayName(id)} из этого турнира?`;
 if(inCurrentRound&&!currentRound.completed) msg+=' Текущий незавершённый тур уже сформирован и не изменится.';
 if(!confirm(msg))return;
 if(!t.playerStatus)t.playerStatus={};
 t.playerStatus[id]='removed';
 save();tournament(tid);
}

function restoreTournamentPlayer(tid,id){if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===tid);if(!t)return;
 if(!t.playerStatus)t.playerStatus={};
 t.playerStatus[id]='active';
 save();tournament(tid);
}

function tournamentSettings(id){if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===id); if(!t)return;
 const rows=getStandings(t);
 layout(`<section class="hero"><div class="eyebrow">Турнир</div><h1>Настройки турнира</h1><p>${esc(t.name)} · управление участниками турнира.</p><div class="hero-actions"><button class="ghost" onclick="tournament('${t.id}')">← Вернуться к турниру</button></div></section>
 <section class="section"><div class="card"><h2>Добавить игрока</h2><p class="muted">Введите ник игрока. Технический ID хранится внутри системы и не показывается пользователю.</p>
 <div class="addrow"><input id="settingsPlayer" placeholder="Например RomaChess"><button class="primary" onclick="settingsAddPlayer('${t.id}')">Добавить игрока</button></div></div></section>
 <section class="section"><div class="card"><div class="row"><div><h2>Участники</h2><p class="muted">«Не использовать в жеребьёвке» оставляет игрока в турнире, но исключает его из следующих туров.</p></div><span class="tag">${t.players.length} участников</span></div>
 <table class="table"><thead><tr><th>Игрок</th><th>Рейтинг</th><th>Статус</th><th>Действия</th></tr></thead><tbody>
 ${rows.map(x=>{const active=isPlayerActive(t,x.id);const p=player(x.id);return `<tr><td><button class="ghost" onclick="profile('${x.id}')">${esc(displayName(x.id))}</button></td><td>${p.rating}</td><td>${active?'<span class="tag">Участвует</span>':'<span class="tag off">Не участвует</span>'}</td><td><div class="settings-actions"><button class="ghost" onclick="editNickname('${x.id}')">Сменить ник</button>${active?`<button class="ghost" onclick="togglePlayer('${t.id}','${x.id}')">Не использовать в жеребьёвке</button>`:`<button class="ghost" onclick="togglePlayer('${t.id}','${x.id}')">Вернуть в жеребьёвку</button>`}<button class="danger danger-outline" onclick="removePlayer('${t.id}','${x.id}')">Удалить из турнира</button><button class="danger danger-outline" onclick="deletePlayer('${x.id}')">Удалить профиль</button></div></td></tr>`}).join('')}
 </tbody></table></div></section>`,`schedule`);
}

function settingsAddPlayer(tid){
 if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===tid), el=document.getElementById('settingsPlayer');
 const nickname=(el?.value||'').trim().slice(0,40);
 if(!nickname){alert('Введите ник игрока.');return}
 const existing=findPlayerByName(nickname);
 const id=existing||nextPlayerId();
 if(t.players.includes(id)){alert('Этот игрок уже есть в турнире.');return}
 if(!db.players[id])db.players[id]={rating:1000,games:0,w:0,d:0,l:0,tournaments:[],history:[1000],nickname,avatar:'pawn'};
 else db.players[id].nickname=nickname;
 if(!t.playerStatus)t.playerStatus={};
 t.playerStatus[id]='active';
 t.players.push(id);
 save(); tournamentSettings(tid);
}

function togglePlayer(tid,id){if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===tid); if(!t)return;
 if(!t.playerStatus)t.playerStatus={};
 t.playerStatus[id]=isPlayerActive(t,id)?'inactive':'active';
 save(); tournamentSettings(tid);
}

function playerHasPlayedInTournament(t,id){
 return (t.roundData||[]).some(r=>r.pairs.some(m=>m.white===id||m.black===id));
}

function removePlayer(tid,id){if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===tid); if(!t||!t.players.includes(id))return;
 const played=playerHasPlayedInTournament(t,id);
 const msg=played
  ? `Игрок ${displayName(id)} уже участвовал в партиях этого турнира. Удалить его из участия? Сыгранные партии и результаты останутся в истории, а игрок не будет участвовать в следующих турах. Продолжить?`
  : `Удалить ${displayName(id)} из турнира?`;
 if(!confirm(msg))return;
 if(!t.playerStatus)t.playerStatus={};
 t.playerStatus[id]='removed';
 save(); tournamentSettings(tid);
}


function setResult(tid,ri,mi,val){
 if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===tid);if(!t)return;
 const r=t.roundData?.[ri];if(!r)return;
 if(r.completed && t.editingRound!==ri){alert('Сначала нажмите «Изменить результаты тура».');return}
 r.pairs[mi].result=val;
 if(t.editingRound===ri){tournament(tid,ri+1);return}
 save();
}

function finishRound(id){if(!requireOrganizer())return;const t=db.tournaments.find(x=>x.id===id),r=t.roundData[t.currentRound-1];if(r.pairs.some(m=>!m.bye&&!m.result)){alert('Внесите результаты всех партий.');return}if(r.completed)return;r.completed=true;applyRatings(t,r);if(t.currentRound>=t.rounds)t.status='Завершён';save();tournament(id)}

function applyRatings(t,r){
 r.ratingDeltas=[];
 const seen=new Set();
 r.pairs.forEach(m=>{
  if(m.bye)return;
  const a=player(m.white),b=player(m.black);
  for(const p of [a,b]){if(!seen.has(p)){r.ratingDeltas.push({id:Object.keys(db.players).find(id=>db.players[id]===p),beforeRating:p.rating,beforeGames:p.games,beforeW:p.w,beforeD:p.d,beforeL:p.l,beforeHistory:p.history.slice()});seen.add(p)}}
  const sa=m.result==='1-0'?1:m.result==='0-1'?0:.5,ea=1/(1+Math.pow(10,(b.rating-a.rating)/400)),da=Math.round(32*(sa-ea));
  a.rating=Math.max(100,a.rating+da);b.rating=Math.max(100,b.rating-da);a.games++;b.games++;
  if(sa===1){a.w++;b.l++}else if(sa===0){a.l++;b.w++}else{a.d++;b.d++}
  a.history.push(a.rating);b.history.push(b.rating)
 })
}


function registerTournament(tid){
  const t=db.tournaments.find(x=>x.id===tid);
  if(!t)return;
  if(t.currentRound>0 || t.status!=='Регистрация'){alert('Регистрация на этот турнир уже закрыта.');return}
  const el=document.getElementById('registrationNick');
  const nickname=(el?.value||'').trim().slice(0,40);
  if(!nickname){alert('Введите свой ник.');return}
  const id=findPlayerByName(nickname);
  if(!id){
    alert('Игрок с таким ником не найден в системе LOVE CHESS. Сначала оформите подписку на клуб и дождитесь, пока организатор добавит ваш профиль.');
    return;
  }
  if(t.players.includes(id)){alert('Вы уже зарегистрированы на этот турнир.');return}
  if(!t.playerStatus)t.playerStatus={};
  t.playerStatus[id]='active';
  t.players.push(id);
  localStorage.setItem('lovechess_current_player',id);
  save();
  tournament(tid);
}

function cancelRegistration(tid){
  const t=db.tournaments.find(x=>x.id===tid);
  const id=getCurrentPlayer();
  if(!t||!id||!t.players.includes(id))return;
  if(t.currentRound>0 || t.status!=='Регистрация'){alert('Отменить регистрацию уже нельзя.');return}
  if(!confirm('Отменить регистрацию на турнир?'))return;
  t.players=t.players.filter(x=>x!==id);
  if(t.playerStatus)delete t.playerStatus[id];
  save();
  tournament(tid);
}


function addPlayer(tid){
 if(!requireOrganizer())return;
 const t=db.tournaments.find(x=>x.id===tid);
 const nickname=(document.getElementById('newPlayer').value||'').trim().slice(0,40);
 if(!nickname)return;
 if(t.currentRound>0){alert('После начала турнира добавление игроков отключено.');return}
 const existing=findPlayerByName(nickname);
 const id=existing||nextPlayerId();
 if(t.players.includes(id)){alert('Этот игрок уже есть в турнире.');return}
 if(!db.players[id])db.players[id]={rating:1000,games:0,w:0,d:0,l:0,tournaments:[],history:[1000],nickname,avatar:'pawn'};
 else db.players[id].nickname=nickname;
 if(!t.playerStatus)t.playerStatus={};
 t.players.push(id);t.playerStatus[id]='active';save();tournament(tid);
}

