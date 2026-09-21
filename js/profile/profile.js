// LOVE CHESS вЂ” player profiles and achievements

function clearCurrentPlayer(){logoutPlayer()}

function profileHome(){
 const current=getCurrentPlayer();
 if(current && db.players[current]) return profile(current);
 layout(`<section class="profile-login-page"><div class="eyebrow">LOVE CHESS</div><h1>Р’С…РѕРґ РІ РїСЂРѕС„РёР»СЊ</h1><p>Р’РѕР№РґРёС‚Рµ РїРѕ Р»РѕРіРёРЅСѓ Рё РїР°СЂРѕР»СЋ, РєРѕС‚РѕСЂС‹Рµ РІС‹ РїРѕР»СѓС‡РёР»Рё РѕС‚ РѕСЂРіР°РЅРёР·Р°С‚РѕСЂР° РєР»СѓР±Р°.</p>
 <div class="card profile-login-card"><div class="profile-login-avatar">в™™</div><div class="field"><label for="playerLogin">Р›РѕРіРёРЅ</label><input id="playerLogin" autocomplete="username" placeholder="Р’Р°С€ Р»РѕРіРёРЅ"></div><div class="field"><label for="playerPassword">РџР°СЂРѕР»СЊ</label><input id="playerPassword" type="password" autocomplete="current-password" placeholder="Р’Р°С€ РїР°СЂРѕР»СЊ" onkeydown="if(event.key==='Enter')submitPlayerLogin()"></div><div class="actions"><button class="primary" onclick="submitPlayerLogin()">Р’РѕР№С‚Рё</button><button class="ghost" onclick="route('register')">РЎРѕР·РґР°С‚СЊ Р°РєРєР°СѓРЅС‚</button><button class="ghost" onclick="route('rating')">Р РµР№С‚РёРЅРі</button></div></div></section>`,`profile`);
}

function registerProfile(){layout(`<section class="profile-login-page"><div class="eyebrow">LOVE CHESS</div><h1>РЎРѕР·РґР°С‚СЊ Р°РєРєР°СѓРЅС‚</h1><p>Р”Р»СЏ РїСѓР±Р»РёРєР°С†РёРё РёРіСЂРѕРІРѕРіРѕ РїСЂРѕС„РёР»СЏ РЅСѓР¶РЅС‹ РЅРёРє, Р»РѕРіРёРЅ Рё РїР°СЂРѕР»СЊ.</p><div class="card profile-login-card"><div class="field"><label for="registerNickname">РќРёРє</label><input id="registerNickname" maxlength="40" placeholder="РќР°РїСЂРёРјРµСЂ RomaChess"></div><div class="field"><label for="registerLogin">Р›РѕРіРёРЅ</label><input id="registerLogin" autocomplete="username" placeholder="3вЂ“32 СЃРёРјРІРѕР»Р°, Р»Р°С‚РёРЅРёС†Р° Рё С†РёС„СЂС‹"></div><div class="field"><label for="registerPassword">РџР°СЂРѕР»СЊ</label><input id="registerPassword" type="password" minlength="10" autocomplete="new-password" placeholder="РќРµ РјРµРЅРµРµ 10 СЃРёРјРІРѕР»РѕРІ"></div><div class="field"><label><input id="privacyConsent" type="checkbox"> РЇ РїСЂРёРЅРёРјР°СЋ <button type="button" class="ghost" onclick="route('privacy')">РїРѕР»РёС‚РёРєСѓ РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё</button>.</label></div><div class="actions"><button class="primary" onclick="registerPlayer()">РЎРѕР·РґР°С‚СЊ Р°РєРєР°СѓРЅС‚</button><button class="ghost" onclick="route('profile')">РћС‚РјРµРЅР°</button></div></div></section>`,'profile')}

function submitPlayerLogin(){loginPlayer(document.getElementById('playerLogin')?.value,document.getElementById('playerPassword')?.value)}

function awardStats(id){
  const played=[]; const gameWins=[];
  db.tournaments.slice().sort((a,b)=>(a.date||'').localeCompare(b.date||'')).forEach(t=>{
    let tookPart=false;
    (t.roundData||[]).forEach(r=>{
      if(!r.completed)return;
      (r.pairs||[]).forEach(m=>{
        if(m.bye){if(m.white===id)tookPart=true;return}
        if(m.white!==id&&m.black!==id)return;
        tookPart=true;
        if(m.result==='1-0')gameWins.push(m.white===id);
        else if(m.result==='0-1')gameWins.push(m.black===id);
        else if(m.result==='0.5-0.5')gameWins.push(false);
      });
    });
    if(tookPart&&t.status==='Р—Р°РІРµСЂС€С‘РЅ')played.push(t);
  });
  let firstPlaces=0,podiums=0;
  played.forEach(t=>{const rows=getStandings(t),idx=rows.findIndex(x=>x.id===id);if(idx===0)firstPlaces++;if(idx>=0&&idx<3)podiums++});
  let maxWinStreak=0,current=0;
  gameWins.forEach(w=>{if(w){current++;maxWinStreak=Math.max(maxWinStreak,current)}else current=0});
  const p=player(id);
  return {tournaments:played.length,wins:p.w||0,games:p.games||0,rating:p.rating||1000,firstPlaces,podiums,maxWinStreak};
}

function awardCatalog(){return [
  {cat:'РЈС‡Р°СЃС‚РёРµ',icon:'в—‹',items:[['first-tournament','РџРµСЂРІС‹Р№ С‚СѓСЂРЅРёСЂ',1,'tournaments','РЎС‹РіСЂР°С‚СЊ РїРµСЂРІС‹Р№ С‚СѓСЂРЅРёСЂ'],['10-tournaments','10 С‚СѓСЂРЅРёСЂРѕРІ',10,'tournaments','РЎС‹РіСЂР°С‚СЊ 10 С‚СѓСЂРЅРёСЂРѕРІ'],['25-tournaments','25 С‚СѓСЂРЅРёСЂРѕРІ',25,'tournaments','РЎС‹РіСЂР°С‚СЊ 25 С‚СѓСЂРЅРёСЂРѕРІ'],['50-tournaments','50 С‚СѓСЂРЅРёСЂРѕРІ',50,'tournaments','РЎС‹РіСЂР°С‚СЊ 50 С‚СѓСЂРЅРёСЂРѕРІ']]},
  {cat:'РџРѕР±РµРґС‹',icon:'вњ¦',items:[['first-win','РџРµСЂРІР°СЏ РїРѕР±РµРґР°',1,'wins','РћРґРµСЂР¶Р°С‚СЊ РїРµСЂРІСѓСЋ РїРѕР±РµРґСѓ'],['10-wins','10 РїРѕР±РµРґ',10,'wins','РћРґРµСЂР¶Р°С‚СЊ 10 РїРѕР±РµРґ'],['25-wins','25 РїРѕР±РµРґ',25,'wins','РћРґРµСЂР¶Р°С‚СЊ 25 РїРѕР±РµРґ'],['50-wins','50 РїРѕР±РµРґ',50,'wins','РћРґРµСЂР¶Р°С‚СЊ 50 РїРѕР±РµРґ']]},
  {cat:'РњРµСЃС‚Р°',icon:'в™›',items:[['first-place','РџРѕР±РµРґРёС‚РµР»СЊ',1,'firstPlaces','Р—Р°РЅСЏС‚СЊ 1 РјРµСЃС‚Рѕ РІ С‚СѓСЂРЅРёСЂРµ'],['3-podiums','3 РїСЊРµРґРµСЃС‚Р°Р»Р°',3,'podiums','РўСЂРё СЂР°Р·Р° РІРѕР№С‚Рё РІ С‚РѕРї-3'],['5-first-places','5 РїРѕР±РµРґРЅС‹С… С‚СѓСЂРЅРёСЂРѕРІ',5,'firstPlaces','Р’С‹РёРіСЂР°С‚СЊ 5 С‚СѓСЂРЅРёСЂРѕРІ'],['10-first-places','10 РїРѕР±РµРґРЅС‹С… С‚СѓСЂРЅРёСЂРѕРІ',10,'firstPlaces','Р’С‹РёРіСЂР°С‚СЊ 10 С‚СѓСЂРЅРёСЂРѕРІ']]},
  {cat:'Р РµР№С‚РёРЅРі',icon:'в†—',items:[['1200-rating','Р РµР№С‚РёРЅРі 1200',1200,'rating','Р”РѕСЃС‚РёС‡СЊ СЂРµР№С‚РёРЅРіР° 1200'],['1400-rating','Р РµР№С‚РёРЅРі 1400',1400,'rating','Р”РѕСЃС‚РёС‡СЊ СЂРµР№С‚РёРЅРіР° 1400'],['1600-rating','Р РµР№С‚РёРЅРі 1600',1600,'rating','Р”РѕСЃС‚РёС‡СЊ СЂРµР№С‚РёРЅРіР° 1600'],['1800-rating','Р РµР№С‚РёРЅРі 1800',1800,'rating','Р”РѕСЃС‚РёС‡СЊ СЂРµР№С‚РёРЅРіР° 1800'],['2000-rating','Р РµР№С‚РёРЅРі 2000',2000,'rating','Р”РѕСЃС‚РёС‡СЊ СЂРµР№С‚РёРЅРіР° 2000']]},
  {cat:'РЎРµСЂРёРё',icon:'в‰Ў',items:[['3-win-streak','РЎРµСЂРёСЏ 3',3,'maxWinStreak','Р’С‹РёРіСЂР°С‚СЊ 3 РїР°СЂС‚РёРё РїРѕРґСЂСЏРґ'],['5-win-streak','РЎРµСЂРёСЏ 5',5,'maxWinStreak','Р’С‹РёРіСЂР°С‚СЊ 5 РїР°СЂС‚РёР№ РїРѕРґСЂСЏРґ'],['10-win-streak','РЎРµСЂРёСЏ 10',10,'maxWinStreak','Р’С‹РёРіСЂР°С‚СЊ 10 РїР°СЂС‚РёР№ РїРѕРґСЂСЏРґ'],['15-win-streak','РЎРµСЂРёСЏ 15',15,'maxWinStreak','Р’С‹РёРіСЂР°С‚СЊ 15 РїР°СЂС‚РёР№ РїРѕРґСЂСЏРґ']]},
  {cat:'РљРѕР»РёС‡РµСЃС‚РІРѕ РїР°СЂС‚РёР№',icon:'в™џ',items:[['10-games','10 РїР°СЂС‚РёР№',10,'games','РЎС‹РіСЂР°С‚СЊ 10 РїР°СЂС‚РёР№'],['50-games','50 РїР°СЂС‚РёР№',50,'games','РЎС‹РіСЂР°С‚СЊ 50 РїР°СЂС‚РёР№'],['100-games','100 РїР°СЂС‚РёР№',100,'games','РЎС‹РіСЂР°С‚СЊ 100 РїР°СЂС‚РёР№'],['250-games','250 РїР°СЂС‚РёР№',250,'games','РЎС‹РіСЂР°С‚СЊ 250 РїР°СЂС‚РёР№'],['500-games','500 РїР°СЂС‚РёР№',500,'games','РЎС‹РіСЂР°С‚СЊ 500 РїР°СЂС‚РёР№']]}
]}

function awardsSection(id){
  const st=awardStats(id), groups=awardCatalog(), total=groups.reduce((n,g)=>n+g.items.length,0), unlockedCount=groups.reduce((n,g)=>n+g.items.filter(x=>(st[x[3]]||0)>=x[2]).length,0);
  return `<section class="section awards-section"><div class="row"><div><div class="eyebrow">LOVE CHESS</div><h2>РќР°РіСЂР°РґС‹</h2><p class="muted">Р”РѕСЃС‚РёР¶РµРЅРёСЏ РѕС‚РєСЂС‹РІР°СЋС‚СЃСЏ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё РїРѕ РјРµСЂРµ РёРіСЂС‹.</p></div><span class="tag">${unlockedCount} / ${total}</span></div>${groups.map(g=>`<div class="award-group"><h3><span class="award-group-icon">${g.icon}</span>${g.cat}</h3><div class="awards-grid">${g.items.map(x=>{const [key,title,target,metric,desc]=x;const value=st[metric]||0,unlocked=value>=target,progress=Math.min(100,Math.round(value/target*100));return `<div class="award-card ${unlocked?'unlocked':'locked'}"><div class="award-icon">${unlocked?'вњ“':'в—‹'}</div><div class="award-body"><strong>${esc(title)}</strong><div class="muted">${esc(desc)}</div>${unlocked?'<div class="award-complete">РџРѕР»СѓС‡РµРЅРѕ</div>':`<div class="award-progress"><div class="award-progress-bar"><span style="width:${progress}%"></span></div><small>${Math.min(value,target)} / ${target}</small></div>`}</div></div>`}).join('')}</div></div>`).join('')}</section>`;
}

function profile(id){
 rebuildCompletedTournamentHistory();
 id=id||getCurrentPlayer(); if(!id||!db.players[id]){return profileHome();}
 const p=player(id); p.tournaments=p.tournaments||[];
 const nickname=displayName(id);
 const wins=p.w||0,draws=p.d||0,losses=p.l||0,total=wins+draws+losses;
 const hist=p.history&&p.history.length?p.history:[p.rating];
 const min=Math.min(...hist),max=Math.max(...hist);
 const pad=Math.max(20,Math.round((max-min)*.15)||20),lo=Math.max(0,min-pad),hi=max+pad;
 const points=hist.map((v,i)=>{const x=20+(i/(Math.max(1,hist.length-1)))*460;const y=180-((v-lo)/(hi-lo||1))*140;return `${x.toFixed(1)},${y.toFixed(1)}`}).join(' ');
 const circles=hist.map((v,i)=>{const x=20+(i/(Math.max(1,hist.length-1)))*460;const y=180-((v-lo)/(hi-lo||1))*140;return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" class="chart-point"><title>${v}</title></circle>`}).join('');
 const today=new Date(); today.setHours(0,0,0,0);
 const upcoming=db.tournaments.filter(t=>t.players.includes(id)&&t.currentRound===0&&t.status==='Р РµРіРёСЃС‚СЂР°С†РёСЏ'&&new Date(t.date+'T12:00:00')>=today).sort((a,b)=>a.date.localeCompare(b.date));
 const currentTournament=db.tournaments.filter(t=>t.players.includes(id)&&t.status==='РРґС‘С‚').sort((a,b)=>a.date.localeCompare(b.date))[0];
 const emptyUpcoming=!currentTournament&&!upcoming.length?'<div class="card empty-profile"><strong>РќРµС‚ РїСЂРµРґСЃС‚РѕСЏС‰РёС… С‚СѓСЂРЅРёСЂРѕРІ</strong><p class="muted">Р—Р°СЂРµРіРёСЃС‚СЂРёСЂСѓР№С‚РµСЃСЊ РЅР° Р±Р»РёР¶Р°Р№С€РёР№ С‚СѓСЂРЅРёСЂ РІ СЂР°Р·РґРµР»Рµ В«Р Р°СЃРїРёСЃР°РЅРёРµВ».</p><button class="ghost" onclick="route(\'schedule\')">РћС‚РєСЂС‹С‚СЊ СЂР°СЃРїРёСЃР°РЅРёРµ в†’</button></div>':'';
 const upcomingHtml=`<section class="section"><div class="row"><div><div class="eyebrow">РњРѕРё С‚СѓСЂРЅРёСЂС‹</div><h2>РџСЂРµРґСЃС‚РѕСЏС‰РёРµ</h2></div><span class="tag">${upcoming.length+(currentTournament?1:0)}</span></div>${currentTournament?`<button class="profile-tournament-row active" onclick="tournament('${currentTournament.id}')"><div><strong>${esc(currentTournament.name)}</strong><span>РРґС‘С‚ В· ${fmt(currentTournament.date)} В· ${esc(currentTournament.time)}</span></div><b>РћС‚РєСЂС‹С‚СЊ в†’</b></button>`:''}${upcoming.map(t=>`<button class="profile-tournament-row" onclick="tournament('${t.id}')"><div><strong>${esc(t.name)}</strong><span>${fmt(t.date)} В· ${esc(t.time)} В· ${esc(t.place)}</span></div><b>РћС‚РєСЂС‹С‚СЊ в†’</b></button>`).join('')}${emptyUpcoming}</section>`;
 const ownProfile=getCurrentPlayer()===id;
 const canEdit=canEditPlayerProfile(id);
 layout(`<section class="profile-hero profile-hero-new"><div class="profile-main"><div class="profile-avatar-wrap">${avatarMarkup(id)}${canEdit?`<button class="avatar-edit" onclick="document.getElementById('avatarPicker').classList.toggle('open')">РР·РјРµРЅРёС‚СЊ Р°РІР°С‚Р°СЂ</button>`:''}</div>${statusMarkup(id)}<div class="profile-identity"><div class="eyebrow">${ownProfile?'РњРѕР№ РїСЂРѕС„РёР»СЊ':'РџСЂРѕС„РёР»СЊ РёРіСЂРѕРєР°'}</div><div class="profile-nick">${esc(nickname)}</div><div class="profile-rating">${p.rating}</div><div class="muted">LOVE CHESS Rating</div></div></div><div class="profile-actions"><button class="ghost" onclick="route('rating')">в†ђ Р РµР№С‚РёРЅРі</button>${ownProfile?`<button class="ghost" onclick="logoutPlayer()">Р’С‹Р№С‚Рё</button>`:''}${isOrganizer()?`<button class="ghost" onclick="editNickname('${id}')">РЎРјРµРЅРёС‚СЊ РЅРёРє</button><button class="danger danger-outline" onclick="deletePlayer('${id}')">РЈРґР°Р»РёС‚СЊ РїСЂРѕС„РёР»СЊ РёРіСЂРѕРєР°</button>`:''}</div></section>
 ${canEdit?`<div class="profile-avatar-picker-wrap">${avatarPicker(id)}</div>`:''}

 <section class="section"><div class="profile-stats profile-stats-5"><div class="stat-card"><div class="muted">РўСѓСЂРЅРёСЂС‹</div><strong>${p.tournaments.length}</strong></div><div class="stat-card"><div class="muted">РџР°СЂС‚РёРё</div><strong>${p.games||0}</strong></div><div class="stat-card"><div class="muted">РџРѕР±РµРґС‹</div><strong>${wins}</strong></div><div class="stat-card"><div class="muted">РќРёС‡СЊРё</div><strong>${draws}</strong></div><div class="stat-card"><div class="muted">РџРѕСЂР°Р¶РµРЅРёСЏ</div><strong>${losses}</strong></div></div></section>
 ${upcomingHtml}
 <section class="section"><div class="card chart-card"><div class="row"><div><h2>Р РѕСЃС‚ СЂРµР№С‚РёРЅРіР°</h2><p class="muted">РР·РјРµРЅРµРЅРёРµ LOVE CHESS Rating РїРѕ РїР°СЂС‚РёСЏРј.</p></div><span class="tag">${hist[0]} в†’ ${p.rating}</span></div><svg class="rating-chart" viewBox="0 0 500 210" role="img" aria-label="Р“СЂР°С„РёРє РёР·РјРµРЅРµРЅРёСЏ СЂРµР№С‚РёРЅРіР°"><line x1="20" y1="180" x2="480" y2="180" class="chart-axis"/><line x1="20" y1="40" x2="20" y2="180" class="chart-axis"/><polyline points="${points}" class="chart-line"/>${circles}<text x="25" y="34" class="chart-label">${hi}</text><text x="25" y="198" class="chart-label">${lo}</text></svg></div></section>
 ${awardsSection(id)}
 <section class="section"><div class="card"><h2>Р—Р°РІРµСЂС€С‘РЅРЅС‹Рµ С‚СѓСЂРЅРёСЂС‹</h2>${p.tournaments.length?p.tournaments.slice().reverse().map(t=>`<div class="history-row"><div><b>${esc(t.name)}</b><div class="muted">${t.date?fmt(t.date):''}</div></div><span class="tag">РЈС‡Р°СЃС‚РЅРёРє</span></div>`).join(''):'<p class="muted">РўСѓСЂРЅРёСЂРѕРІ РїРѕРєР° РЅРµС‚.</p>'}</div></section>`,`profile`);
}

function editNickname(id){
  if(!requireOrganizer())return;
  const p=db.players[id];
  if(!p)return;
  const current=displayName(id);
  const value=prompt('РќРѕРІС‹Р№ РЅРёРє РёРіСЂРѕРєР°',current);
  if(value===null)return;
  const nickname=value.trim().slice(0,40);
  if(!nickname){alert('РќРёРє РЅРµ РјРѕР¶РµС‚ Р±С‹С‚СЊ РїСѓСЃС‚С‹Рј.');return;}
  p.nickname=nickname;
  save();
  const t=db.tournaments.find(x=>x.players.includes(id));
  if(t && isOrganizer()) tournamentSettings(t.id); else if(isOrganizer()) profile(id); else rating();
}

function deletePlayer(id){
  if(!requireOrganizer())return;
  const p=db.players[id];
  if(!p)return;
  const nickname=displayName(id);
  const usedIn=db.tournaments.filter(t=>Array.isArray(t.players)&&t.players.includes(id));
  const activeUsedIn=usedIn.filter(t=>t.status!=='Р—Р°РІРµСЂС€С‘РЅ' && Number(t.currentRound||0)<Number(t.rounds||0));
  let message='РЈРґР°Р»РёС‚СЊ РїСЂРѕС„РёР»СЊ РёРіСЂРѕРєР° '+nickname+'?\n\nРџСЂРѕС„РёР»СЊ РёСЃС‡РµР·РЅРµС‚ РёР· СЂРµР№С‚РёРЅРіР° Рё СЃРїРёСЃРєР° РёРіСЂРѕРєРѕРІ. Р РµР·СѓР»СЊС‚Р°С‚С‹ СѓР¶Рµ Р·Р°РІРµСЂС€С‘РЅРЅС‹С… С‚СѓСЂРЅРёСЂРѕРІ СЃРѕС…СЂР°РЅСЏС‚СЃСЏ, Р° РёРіСЂРѕРє Р±СѓРґРµС‚ СѓР±СЂР°РЅ РёР· Р±СѓРґСѓС‰РёС… С‚СѓСЂРЅРёСЂРѕРІ.';
  if(activeUsedIn.length){
    message+='\n\nРђРєС‚РёРІРЅС‹С… С‚СѓСЂРЅРёСЂРѕРІ: '+activeUsedIn.length+'. РРіСЂРѕРє Р±СѓРґРµС‚ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё СѓРґР°Р»С‘РЅ РёР· РЅРёС… Р±РµР· РЅРµРѕР±С…РѕРґРёРјРѕСЃС‚Рё РґРµР»Р°С‚СЊ СЌС‚Рѕ РІСЂСѓС‡РЅСѓСЋ.';
  }
  if(!confirm(message))return;

  // РЎРѕС…СЂР°РЅСЏРµРј РјРёРЅРёРјР°Р»СЊРЅС‹Р№ СЃРЅРёРјРѕРє РґР»СЏ РёСЃС‚РѕСЂРёС‡РµСЃРєРёС… СЂРµР·СѓР»СЊС‚Р°С‚РѕРІ Р·Р°РІРµСЂС€С‘РЅРЅС‹С… С‚СѓСЂРЅРёСЂРѕРІ.
  // РЎР°Рј РїСЂРѕС„РёР»СЊ СѓРґР°Р»СЏРµС‚СЃСЏ РёР· Р°РєС‚РёРІРЅРѕРіРѕ СЃРїРёСЃРєР° РёРіСЂРѕРєРѕРІ.
  db.deletedPlayers=db.deletedPlayers||{};
  db.deletedPlayers[id]={...p,nickname:p.nickname||id,deletedAt:new Date().toISOString()};
  delete db.players[id];

  // РР· РЅРµР·Р°РІРµСЂС€С‘РЅРЅС‹С…/Р±СѓРґСѓС‰РёС… С‚СѓСЂРЅРёСЂРѕРІ РёРіСЂРѕРє СѓРґР°Р»СЏРµС‚СЃСЏ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё.
  db.tournaments.forEach(t=>{
    const started=Number(t.currentRound||0)>0 || t.status==='РРґС‘С‚';
    if(!started && Array.isArray(t.players)) t.players=t.players.filter(pid=>pid!==id);
  });

  if(localStorage.getItem('lovechess_current_player')===id) localStorage.removeItem('lovechess_current_player');
  save();
  route('rating');
  alert('РџСЂРѕС„РёР»СЊ РёРіСЂРѕРєР° СѓРґР°Р»С‘РЅ. Р РµР·СѓР»СЊС‚Р°С‚С‹ Р·Р°РІРµСЂС€С‘РЅРЅС‹С… С‚СѓСЂРЅРёСЂРѕРІ СЃРѕС…СЂР°РЅРµРЅС‹.');
}

