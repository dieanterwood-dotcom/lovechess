// LOVE CHESS — UI shell

function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

function nav(active){return `<nav class="nav"><div class="shell navin"><button class="brand-logo" onclick="route('schedule')" aria-label="LOVE CHESS"><div class="brand-wordmark">LOVE CHESS</div></button><div class="links"><button class="${active==='schedule'?'active':''}" onclick="route('schedule')">Расписание</button><button class="${active==='rating'?'active':''}" onclick="route('rating')">Рейтинг</button><button class="${active==='profile'?'active':''}" onclick="route('profile')">Мой профиль</button><button class="${active==='clock'?'active':''}" onclick="route('clock')">Часы</button><button class="${active==='about'?'active':''}" onclick="route('about')">О нас</button><button class="${active==='organizer'?'active':''}" onclick="route('organizer')">Организатор</button></div></div></nav>`}

function layout(content,active){document.getElementById('app').innerHTML=nav(active)+`<main class="shell">${content}</main><footer class="shell muted" style="padding:32px 0 48px"><button class="ghost" onclick="route('privacy')">Политика конфиденциальности</button></footer>`;if(active==='schedule'){setTimeout(()=>{renderPhotos();startPhotoAuto();},0)}else{stopPhotoAuto()}}

function fmt(d){return new Date(d+'T12:00:00').toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'})}

