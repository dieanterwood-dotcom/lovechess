// LOVE CHESS вЂ” UI shell

function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

function nav(active){return `<nav class="nav"><div class="shell navin"><button class="brand-logo" onclick="route('schedule')" aria-label="LOVE CHESS"><div class="brand-wordmark">LOVE CHESS</div></button><div class="links"><button class="${active==='schedule'?'active':''}" onclick="route('schedule')">Р Р°СЃРїРёСЃР°РЅРёРµ</button><button class="${active==='rating'?'active':''}" onclick="route('rating')">Р РµР№С‚РёРЅРі</button><button class="${active==='profile'?'active':''}" onclick="route('profile')">РњРѕР№ РїСЂРѕС„РёР»СЊ</button><button class="${active==='clock'?'active':''}" onclick="route('clock')">Р§Р°СЃС‹</button><button class="${active==='about'?'active':''}" onclick="route('about')">Рћ РЅР°СЃ</button><button class="${active==='organizer'?'active':''}" onclick="route('organizer')">РћСЂРіР°РЅРёР·Р°С‚РѕСЂ</button></div></div></nav>`}

function layout(content,active){document.getElementById('app').innerHTML=nav(active)+`<main class="shell">${content}</main><footer class="shell muted" style="padding:32px 0 48px"><button class="ghost" onclick="route('privacy')">РџРѕР»РёС‚РёРєР° РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё</button></footer>`;if(active==='schedule'){setTimeout(()=>{renderPhotos();startPhotoAuto();},0)}else{stopPhotoAuto()}}

function fmt(d){return new Date(d+'T12:00:00').toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'})}

