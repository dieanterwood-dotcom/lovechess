// LOVE CHESS — organizer

function isOrganizer(){return sessionStorage.getItem('lovechess_organizer')==='1'}

function requireOrganizer(){if(isOrganizer())return true; route('organizer'); return false}

function organizerLogin(){
  if(isOrganizer())return admin();
  layout(`<section class="hero"><div class="eyebrow">LOVE CHESS</div><h1>Вход организатора</h1><p>Раздел для создания и проведения турниров.</p></section>
  <section class="section"><div class="card form" style="max-width:520px">
    <div class="field"><label>Пароль организатора</label><input id="organizerPassword" type="password" placeholder="Введите пароль" autocomplete="current-password"></div>
    <div class="actions"><button class="primary" onclick="loginOrganizer()">Войти</button><button class="ghost" onclick="route('schedule')">Отмена</button></div>
    <p class="muted" style="margin-top:14px">Пароль нужен только для организатора. Игрокам пароль не требуется.</p>
  </div></section>`,'organizer')
}

function loginOrganizer(){
  const p=(document.getElementById('organizerPassword')?.value||'');
  if(p!=='LOVECHESS-ADMIN'){alert('Неверный пароль.');return}
  sessionStorage.setItem('lovechess_organizer','1');
  route('admin');
}

function logoutOrganizer(){sessionStorage.removeItem('lovechess_organizer');route('schedule')}

function admin(){
  if(!requireOrganizer())return;
  layout(`<section class="hero"><div class="eyebrow">Организатор</div><h1>Управление LOVE CHESS</h1><p>Создание и проведение турниров, участники и результаты.</p>
  <div class="hero-actions"><button class="primary" onclick="showCreateTournament()">+ Создать турнир</button><button class="ghost" onclick="logoutOrganizer()">Выйти</button></div></section>
  <section class="section"><div class="row"><h2>Турниры</h2></div><div class="grid">${db.tournaments.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(t=>`<article class="card tournament"><div><span class="tag">${esc(t.status)}</span><div class="title">${esc(t.name)}</div><div class="meta">${fmt(t.date)} · ${esc(t.time)}</div><div class="meta">${esc(t.place)} · ${esc(t.format)} · ${esc(t.control)}</div></div><div class="row"><span class="meta">${t.rounds} туров · ${t.players.length} игроков</span><button class="ghost" onclick="tournament('${t.id}')">Открыть →</button>${isOrganizer()?`<button class="danger danger-outline" onclick="deleteTournament('${t.id}')">Удалить</button>`:''}</div></article>`).join('')}</div></section>`,'admin');
}

function showCreateTournament(){
  if(!requireOrganizer())return;
  layout(`<section class="hero"><div class="eyebrow">Организатор</div><h1>Создать турнир</h1><p>Создайте турнир, добавьте игроков и проведите его по швейцарской системе.</p></section><section class="section"><form class="card form" onsubmit="createTournament(event)"><div class="field"><label>Название</label><input id="name" required placeholder="LOVE CHESS BLITZ"></div><div class="field"><label>Дата</label><input id="date" type="date" required></div><div class="field"><label>Время</label><input id="time" type="time" value="18:00" required></div><div class="field"><label>Место</label><input id="place" placeholder="GASTROKORT"></div><div class="grid"><div class="field"><label>Формат</label><select id="format"><option>Blitz</option><option>Rapid</option></select></div><div class="field"><label>Контроль</label><input id="control" value="5+3"></div><div class="field"><label>Туров</label><input id="rounds" type="number" value="9" min="1"></div></div><div class="actions"><button class="primary">Создать турнир</button><button type="button" class="ghost" onclick="route('admin')">Отмена</button></div></form></section>`,'admin');
}

function createTournament(e){if(!requireOrganizer())return;e.preventDefault();const t={id:'t'+Date.now(),name:document.getElementById('name').value,date:document.getElementById('date').value,time:document.getElementById('time').value,place:document.getElementById('place').value||'—',format:document.getElementById('format').value,control:document.getElementById('control').value,rounds:+document.getElementById('rounds').value,fee:0,status:'Регистрация',players:[],playerStatus:{},currentRound:0,roundData:[]};db.tournaments.push(t);save();tournament(t.id)}

function deleteTournament(id){
  if(!isOrganizer()) return;
  const t=db.tournaments.find(x=>x.id===id);
  if(!t) return;
  const label=(t.name||'Турнир')+' — '+(t.date||'');
  const message=t.status==='Идёт'
    ? 'Турнир сейчас идёт. Удалить его полностью? Это действие нельзя отменить.'
    : 'Удалить турнир «'+label+'»? Это действие нельзя отменить.';
  if(!confirm(message)) return;
  db.tournaments=db.tournaments.filter(x=>x.id!==id);
  save();
  route('admin');
  alert('Турнир удалён.');
}



function tournamentDeleteButton(id){
  return isOrganizer()
    ? '<button class="btn danger" onclick="event.stopPropagation();deleteTournament(\''+id+'\')">Удалить турнир</button>'
    : '';
}



