// LOVE CHESS — player profiles and achievements

function clearCurrentPlayer(){logoutPlayer()}

function profileHome(){
 const current=getCurrentPlayer();
 if(current && db.players[current]) return profile(current);
 layout(`<section class="profile-login-page"><div class="eyebrow">LOVE CHESS</div><h1>Вход в профиль</h1><p>Войдите по логину и паролю, которые вы получили от организатора клуба.</p>
 <div class="card profile-login-card"><div class="profile-login-avatar">♙</div><div class="field"><label for="playerLogin">Логин</label><input id="playerLogin" autocomplete="username" placeholder="Ваш логин"></div><div class="field"><label for="playerPassword">Пароль</label><input id="playerPassword" type="password" autocomplete="current-password" placeholder="Ваш пароль" onkeydown="if(event.key==='Enter')submitPlayerLogin()"></div><div class="actions"><button class="primary" onclick="submitPlayerLogin()">Войти</button><button class="ghost" onclick="route('rating')">Рейтинг</button></div><p class="muted profile-login-note">Если у вас ещё нет логина и пароля, обратитесь к организатору LOVE CHESS.</p></div></section>`,`profile`);
}

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
    if(tookPart&&t.status==='Завершён')played.push(t);
  });
  let firstPlaces=0,podiums=0;
  played.forEach(t=>{const rows=getStandings(t),idx=rows.findIndex(x=>x.id===id);if(idx===0)firstPlaces++;if(idx>=0&&idx<3)podiums++});
  let maxWinStreak=0,current=0;
  gameWins.forEach(w=>{if(w){current++;maxWinStreak=Math.max(maxWinStreak,current)}else current=0});
  const p=player(id);
  return {tournaments:played.length,wins:p.w||0,games:p.games||0,rating:p.rating||1000,firstPlaces,podiums,maxWinStreak};
}

function awardCatalog(){return [
  {cat:'Участие',icon:'○',items:[['first-tournament','Первый турнир',1,'tournaments','Сыграть первый турнир'],['10-tournaments','10 турниров',10,'tournaments','Сыграть 10 турниров'],['25-tournaments','25 турниров',25,'tournaments','Сыграть 25 турниров'],['50-tournaments','50 турниров',50,'tournaments','Сыграть 50 турниров']]},
  {cat:'Победы',icon:'✦',items:[['first-win','Первая победа',1,'wins','Одержать первую победу'],['10-wins','10 побед',10,'wins','Одержать 10 побед'],['25-wins','25 побед',25,'wins','Одержать 25 побед'],['50-wins','50 побед',50,'wins','Одержать 50 побед']]},
  {cat:'Места',icon:'♛',items:[['first-place','Победитель',1,'firstPlaces','Занять 1 место в турнире'],['3-podiums','3 пьедестала',3,'podiums','Три раза войти в топ-3'],['5-first-places','5 победных турниров',5,'firstPlaces','Выиграть 5 турниров'],['10-first-places','10 победных турниров',10,'firstPlaces','Выиграть 10 турниров']]},
  {cat:'Рейтинг',icon:'↗',items:[['1200-rating','Рейтинг 1200',1200,'rating','Достичь рейтинга 1200'],['1400-rating','Рейтинг 1400',1400,'rating','Достичь рейтинга 1400'],['1600-rating','Рейтинг 1600',1600,'rating','Достичь рейтинга 1600'],['1800-rating','Рейтинг 1800',1800,'rating','Достичь рейтинга 1800'],['2000-rating','Рейтинг 2000',2000,'rating','Достичь рейтинга 2000']]},
  {cat:'Серии',icon:'≡',items:[['3-win-streak','Серия 3',3,'maxWinStreak','Выиграть 3 партии подряд'],['5-win-streak','Серия 5',5,'maxWinStreak','Выиграть 5 партий подряд'],['10-win-streak','Серия 10',10,'maxWinStreak','Выиграть 10 партий подряд'],['15-win-streak','Серия 15',15,'maxWinStreak','Выиграть 15 партий подряд']]},
  {cat:'Количество партий',icon:'♟',items:[['10-games','10 партий',10,'games','Сыграть 10 партий'],['50-games','50 партий',50,'games','Сыграть 50 партий'],['100-games','100 партий',100,'games','Сыграть 100 партий'],['250-games','250 партий',250,'games','Сыграть 250 партий'],['500-games','500 партий',500,'games','Сыграть 500 партий']]}
]}

function awardsSection(id){
  const st=awardStats(id), groups=awardCatalog(), total=groups.reduce((n,g)=>n+g.items.length,0), unlockedCount=groups.reduce((n,g)=>n+g.items.filter(x=>(st[x[3]]||0)>=x[2]).length,0);
  return `<section class="section awards-section"><div class="row"><div><div class="eyebrow">LOVE CHESS</div><h2>Награды</h2><p class="muted">Достижения открываются автоматически по мере игры.</p></div><span class="tag">${unlockedCount} / ${total}</span></div>${groups.map(g=>`<div class="award-group"><h3><span class="award-group-icon">${g.icon}</span>${g.cat}</h3><div class="awards-grid">${g.items.map(x=>{const [key,title,target,metric,desc]=x;const value=st[metric]||0,unlocked=value>=target,progress=Math.min(100,Math.round(value/target*100));return `<div class="award-card ${unlocked?'unlocked':'locked'}"><div class="award-icon">${unlocked?'✓':'○'}</div><div class="award-body"><strong>${esc(title)}</strong><div class="muted">${esc(desc)}</div>${unlocked?'<div class="award-complete">Получено</div>':`<div class="award-progress"><div class="award-progress-bar"><span style="width:${progress}%"></span></div><small>${Math.min(value,target)} / ${target}</small></div>`}</div></div>`}).join('')}</div></div>`).join('')}</section>`;
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
 const upcoming=db.tournaments.filter(t=>t.players.includes(id)&&t.currentRound===0&&t.status==='Регистрация'&&new Date(t.date+'T12:00:00')>=today).sort((a,b)=>a.date.localeCompare(b.date));
 const currentTournament=db.tournaments.filter(t=>t.players.includes(id)&&t.status==='Идёт').sort((a,b)=>a.date.localeCompare(b.date))[0];
 const emptyUpcoming=!currentTournament&&!upcoming.length?'<div class="card empty-profile"><strong>Нет предстоящих турниров</strong><p class="muted">Зарегистрируйтесь на ближайший турнир в разделе «Расписание».</p><button class="ghost" onclick="route(\'schedule\')">Открыть расписание →</button></div>':'';
 const upcomingHtml=`<section class="section"><div class="row"><div><div class="eyebrow">Мои турниры</div><h2>Предстоящие</h2></div><span class="tag">${upcoming.length+(currentTournament?1:0)}</span></div>${currentTournament?`<button class="profile-tournament-row active" onclick="tournament('${currentTournament.id}')"><div><strong>${esc(currentTournament.name)}</strong><span>Идёт · ${fmt(currentTournament.date)} · ${esc(currentTournament.time)}</span></div><b>Открыть →</b></button>`:''}${upcoming.map(t=>`<button class="profile-tournament-row" onclick="tournament('${t.id}')"><div><strong>${esc(t.name)}</strong><span>${fmt(t.date)} · ${esc(t.time)} · ${esc(t.place)}</span></div><b>Открыть →</b></button>`).join('')}${emptyUpcoming}</section>`;
 const ownProfile=getCurrentPlayer()===id;
 const canEdit=canEditPlayerProfile(id);
 layout(`<section class="profile-hero profile-hero-new"><div class="profile-main"><div class="profile-avatar-wrap">${avatarMarkup(id)}${canEdit?`<button class="avatar-edit" onclick="document.getElementById('avatarPicker').classList.toggle('open')">Изменить аватар</button>`:''}</div>${statusMarkup(id)}<div class="profile-identity"><div class="eyebrow">${ownProfile?'Мой профиль':'Профиль игрока'}</div><div class="profile-nick">${esc(nickname)}</div><div class="profile-rating">${p.rating}</div><div class="muted">LOVE CHESS Rating</div></div></div><div class="profile-actions"><button class="ghost" onclick="route('rating')">← Рейтинг</button>${ownProfile?`<button class="ghost" onclick="logoutPlayer()">Выйти</button>`:''}${isOrganizer()?`<button class="ghost" onclick="editNickname('${id}')">Сменить ник</button><button class="danger danger-outline" onclick="deletePlayer('${id}')">Удалить профиль игрока</button>`:''}</div></section>
 ${canEdit?`<div class="profile-avatar-picker-wrap">${avatarPicker(id)}</div>`:''}

 <section class="section"><div class="profile-stats profile-stats-5"><div class="stat-card"><div class="muted">Турниры</div><strong>${p.tournaments.length}</strong></div><div class="stat-card"><div class="muted">Партии</div><strong>${p.games||0}</strong></div><div class="stat-card"><div class="muted">Победы</div><strong>${wins}</strong></div><div class="stat-card"><div class="muted">Ничьи</div><strong>${draws}</strong></div><div class="stat-card"><div class="muted">Поражения</div><strong>${losses}</strong></div></div></section>
 ${upcomingHtml}
 <section class="section"><div class="card chart-card"><div class="row"><div><h2>Рост рейтинга</h2><p class="muted">Изменение LOVE CHESS Rating по партиям.</p></div><span class="tag">${hist[0]} → ${p.rating}</span></div><svg class="rating-chart" viewBox="0 0 500 210" role="img" aria-label="График изменения рейтинга"><line x1="20" y1="180" x2="480" y2="180" class="chart-axis"/><line x1="20" y1="40" x2="20" y2="180" class="chart-axis"/><polyline points="${points}" class="chart-line"/>${circles}<text x="25" y="34" class="chart-label">${hi}</text><text x="25" y="198" class="chart-label">${lo}</text></svg></div></section>
 ${awardsSection(id)}
 <section class="section"><div class="card"><h2>Завершённые турниры</h2>${p.tournaments.length?p.tournaments.slice().reverse().map(t=>`<div class="history-row"><div><b>${esc(t.name)}</b><div class="muted">${t.date?fmt(t.date):''}</div></div><span class="tag">Участник</span></div>`).join(''):'<p class="muted">Турниров пока нет.</p>'}</div></section>`,`profile`);
}

function editNickname(id){
  if(!requireOrganizer())return;
  const p=db.players[id];
  if(!p)return;
  const current=displayName(id);
  const value=prompt('Новый ник игрока',current);
  if(value===null)return;
  const nickname=value.trim().slice(0,40);
  if(!nickname){alert('Ник не может быть пустым.');return;}
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
  const activeUsedIn=usedIn.filter(t=>t.status!=='Завершён' && Number(t.currentRound||0)<Number(t.rounds||0));
  let message='Удалить профиль игрока '+nickname+'?\n\nПрофиль исчезнет из рейтинга и списка игроков. Результаты уже завершённых турниров сохранятся, а игрок будет убран из будущих турниров.';
  if(activeUsedIn.length){
    message+='\n\nАктивных турниров: '+activeUsedIn.length+'. Игрок будет автоматически удалён из них без необходимости делать это вручную.';
  }
  if(!confirm(message))return;

  // Сохраняем минимальный снимок для исторических результатов завершённых турниров.
  // Сам профиль удаляется из активного списка игроков.
  db.deletedPlayers=db.deletedPlayers||{};
  db.deletedPlayers[id]={...p,nickname:p.nickname||id,deletedAt:new Date().toISOString()};
  delete db.players[id];

  // Из незавершённых/будущих турниров игрок удаляется автоматически.
  db.tournaments.forEach(t=>{
    const started=Number(t.currentRound||0)>0 || t.status==='Идёт';
    if(!started && Array.isArray(t.players)) t.players=t.players.filter(pid=>pid!==id);
  });

  if(localStorage.getItem('lovechess_current_player')===id) localStorage.removeItem('lovechess_current_player');
  save();
  route('rating');
  alert('Профиль игрока удалён. Результаты завершённых турниров сохранены.');
}

