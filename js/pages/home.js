// LOVE CHESS вЂ” public pages and home

let photoIndex=0;let photoAutoTimer=null;function renderPhotos(){const track=document.getElementById('photoTrack'),dots=document.getElementById('photoDots');if(!track||!dots)return;const slides=track.children;if(!slides.length)return;photoIndex=(photoIndex+slides.length)%slides.length;[...slides].forEach((slide,i)=>{slide.classList.toggle('photo-active',i===photoIndex);slide.setAttribute('aria-hidden',i===photoIndex?'false':'true')});track.style.transform='none';dots.innerHTML=[...slides].map((_,i)=>`<button class="dot ${i===photoIndex?'active':''}" onclick="photoGo(${i})" aria-label="Р¤РѕС‚Рѕ ${i+1}"></button>`).join('')}function stopPhotoAuto(){if(photoAutoTimer){clearInterval(photoAutoTimer);photoAutoTimer=null}}function startPhotoAuto(){stopPhotoAuto();const track=document.getElementById('photoTrack');if(!track||track.children.length<2)return;photoAutoTimer=setInterval(()=>{if(document.hidden)return;photoNext()},5000)}function photoGo(i){photoIndex=i;renderPhotos();startPhotoAuto()}function photoNext(){photoIndex++;renderPhotos()}function photoPrev(){photoIndex--;renderPhotos();startPhotoAuto()}

function privacyPolicy(){layout(`<section class="hero"><div class="eyebrow">LOVE CHESS</div><h1>РџРѕР»РёС‚РёРєР° РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё</h1><p>Р”Р°С‚Р° СЂРµРґР°РєС†РёРё: 21 СЃРµРЅС‚СЏР±СЂСЏ 2026 РіРѕРґР°.</p></section><section class="section"><article class="card"><h2>РљР°РєРёРµ РґР°РЅРЅС‹Рµ РјС‹ РѕР±СЂР°Р±Р°С‚С‹РІР°РµРј</h2><p>Р›РѕРіРёРЅ, РєСЂРёРїС‚РѕРіСЂР°С„РёС‡РµСЃРєРёР№ С…СЌС€ РїР°СЂРѕР»СЏ, РЅРёРє, СЂРµР№С‚РёРЅРі, СЃС‚Р°С‚РёСЃС‚РёРєСѓ РїР°СЂС‚РёР№ Рё С‚РµС…РЅРёС‡РµСЃРєРёРµ РґР°РЅРЅС‹Рµ СЃРµСЃСЃРёРё. Р­С‚Рѕ РЅРµРѕР±С…РѕРґРёРјРѕ РґР»СЏ СЂР°Р±РѕС‚С‹ Р°РєРєР°СѓРЅС‚Р°, С‚СѓСЂРЅРёСЂРѕРІ Рё СЂРµР№С‚РёРЅРіР°.</p><h2>Р§С‚Рѕ РїСѓР±Р»РёРєСѓРµС‚СЃСЏ</h2><p>Р’ РїСѓР±Р»РёС‡РЅРѕРј СЂРµР№С‚РёРЅРіРµ РѕС‚РѕР±СЂР°Р¶Р°СЋС‚СЃСЏ С‚РѕР»СЊРєРѕ РЅРёРє, СЂРµР№С‚РёРЅРі Рё РёРіСЂРѕРІР°СЏ СЃС‚Р°С‚РёСЃС‚РёРєР°. РџР°СЂРѕР»Рё, e-mail, С‚РµР»РµС„РѕРЅС‹ Рё РґСЂСѓРіРёРµ РєРѕРЅС‚Р°РєС‚РЅС‹Рµ РґР°РЅРЅС‹Рµ РЅРµ РїСѓР±Р»РёРєСѓСЋС‚СЃСЏ.</p><h2>РџСЂР°РІР° РёРіСЂРѕРєР°</h2><p>РРіСЂРѕРє РјРѕР¶РµС‚ Р·Р°РїСЂРѕСЃРёС‚СЊ РёСЃРїСЂР°РІР»РµРЅРёРµ, СЃРєСЂС‹С‚РёРµ РїСѓР±Р»РёС‡РЅРѕРіРѕ РїСЂРѕС„РёР»СЏ РёР»Рё СѓРґР°Р»РµРЅРёРµ Р°РєРєР°СѓРЅС‚Р° Сѓ РѕСЂРіР°РЅРёР·Р°С‚РѕСЂР° РєР»СѓР±Р°. РџРѕР»РЅС‹Рµ СЃРІРµРґРµРЅРёСЏ РѕР± РѕРїРµСЂР°С‚РѕСЂРµ РґР°РЅРЅС‹С…, СЃСЂРѕРєР°С… С…СЂР°РЅРµРЅРёСЏ Рё С…РѕСЃС‚РёРЅРіРµ Р±СѓРґСѓС‚ РѕРїСѓР±Р»РёРєРѕРІР°РЅС‹ РґРѕ Р·Р°РїСѓСЃРєР° СЂРµРіРёСЃС‚СЂР°С†РёРё.</p><p class="muted">Р­С‚РѕС‚ С‚РµРєСЃС‚ вЂ” СЂР°Р±РѕС‡Р°СЏ РІРµСЂСЃРёСЏ. РџРµСЂРµРґ РїСѓР±Р»РёРєР°С†РёРµР№ РѕСЂРіР°РЅРёР·Р°С‚РѕСЂ РѕР±СЏР·Р°РЅ Р·Р°РїРѕР»РЅРёС‚СЊ РєРѕРЅС‚Р°РєС‚С‹ РѕРїРµСЂР°С‚РѕСЂР°, РїСЂРѕРІР°Р№РґРµСЂР° Рё СЃСЂРѕРєРё С…СЂР°РЅРµРЅРёСЏ РІ С„Р°Р№Р»Рµ privacy-policy.md.</p></article></section>`,'privacy')}


function about(){
 layout(`<section class="about-page">
   <section class="about-hero">
     <div class="about-hero-copy">
       <div class="eyebrow">LOVE CHESS</div>
       <h1>Рћ РЅР°СЃ</h1>
       <p>LOVE CHESS вЂ” С€Р°С…РјР°С‚РЅРѕРµ СЃРѕРѕР±С‰РµСЃС‚РІРѕ РёР· РќРѕРІРѕСЃРёР±РёСЂСЃРєР°. РњС‹ РґРµР»Р°РµРј С€Р°С…РјР°С‚С‹ С‡Р°СЃС‚СЊСЋ РіРѕСЂРѕРґСЃРєРѕР№ Р¶РёР·РЅРё: РїСЂРѕРІРѕРґРёРј С‚СѓСЂРЅРёСЂС‹ РІ Р±Р°СЂР°С…, РєРѕС„РµР№РЅСЏС… Рё РѕР±С‰РµСЃС‚РІРµРЅРЅС‹С… РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІР°С…, СЃРѕР·РґР°С‘Рј СЂРµРіСѓР»СЏСЂРЅС‹Рµ С„РѕСЂРјР°С‚С‹ Рё СЂР°Р·РІРёРІР°РµРј СЃРѕР±СЃС‚РІРµРЅРЅСѓСЋ СЃРёСЃС‚РµРјСѓ СЂРµР№С‚РёРЅРіР°.</p>
       <div class="about-actions"><button class="primary" onclick="route('schedule')">Р‘Р»РёР¶Р°Р№С€РёРµ С‚СѓСЂРЅРёСЂС‹</button><button class="ghost" onclick="route('rating')">Р РµР№С‚РёРЅРі РёРіСЂРѕРєРѕРІ</button></div>
     </div>
     <div class="about-hero-mark"><img src="photos/about-hero.jpg" alt="LOVE CHESS вЂ” С€Р°С…РјР°С‚РЅРѕРµ СЃРѕР±С‹С‚РёРµ" loading="eager"></div>
   </section>

   <section class="about-section">
     <div class="section-kicker">Р§С‚Рѕ РјС‹ РґРµР»Р°РµРј</div>
     <div class="about-grid about-grid-3">
       <article class="about-card"><img class="about-card-photo" src="photos/about-evenings.jpg" alt="РЁР°С…РјР°С‚РЅС‹Р№ РІРµС‡РµСЂ LOVE CHESS" loading="lazy"><div class="about-icon">в™џ</div><h3>РЁР°С…РјР°С‚РЅС‹Рµ РІРµС‡РµСЂР°</h3><p>РЁР°С…РјР°С‚РЅС‹Рµ РІРµС‡РµСЂР° РґР»СЏ РІСЃРµС… Р¶РµР»Р°СЋС‰РёС… РІРЅРµ Р·Р°РІРёСЃРёРјРѕСЃС‚Рё СѓСЂРѕРІРЅСЏ РёРіСЂС‹, РІ Р±Р°СЂР°С…, РєРѕС„РµР№РЅСЏС…, С„СѓРґ-РєРѕСЂС‚Р°С… Рё РіРѕСЂРѕРґСЃРєРёС… РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІР°С…. Р¤РѕСЂРјР°С‚ СЃС‚СЂРѕРёС‚СЃСЏ РІРѕРєСЂСѓРі РёРіСЂС‹, РЅРѕРІС‹С… Р·РЅР°РєРѕРјСЃС‚РІ Рё РѕР±С‰РµРЅРёСЏ. РЎРѕР±СЃС‚РІРµРЅРЅР°СЏ СЂРµР№С‚РёРЅРіРѕРІР°СЏ СЃРёСЃС‚РµРјР°, РєРѕС‚РѕСЂР°СЏ СЃРѕС…СЂР°РЅСЏРµС‚ РёСЃС‚РѕСЂРёСЋ РёРіСЂРѕРєР°.</p></article>
       <article class="about-card"><img class="about-card-photo" src="photos/about-fshr.jpg" alt="РўСѓСЂРЅРёСЂ Р¤РЁР  LOVE CHESS" loading="lazy"><div class="about-icon">в™њ</div><h3>РўСѓСЂРЅРёСЂС‹ Р¤РЁР </h3><p>РћС„РёС†РёР°Р»СЊРЅС‹Рµ С‚СѓСЂРЅРёСЂС‹ СЃ РѕР±СЃС‡РµС‚РѕРј СЂРµР№С‚РёРЅРіР° Р¤РЁР .</p></article>
       <article class="about-card"><img class="about-card-photo" src="photos/about-learning.jpg" alt="РћР±СѓС‡РµРЅРёРµ С€Р°С…РјР°С‚Р°Рј LOVE CHESS" loading="lazy"><div class="about-icon">в™ќ</div><h3>РћР±СѓС‡РµРЅРёРµ РґР»СЏ РґРµС‚РµР№ Рё РІР·СЂРѕСЃР»С‹С…</h3><p>РћР±СѓС‡Р°РµРј РёРіСЂРµ РІ С€Р°С…РјР°С‚С‹ РґРµС‚РµР№ Рё РІР·СЂРѕСЃР»С‹С…, РЅРѕРІРёС‡РєРѕРІ Рё Р»СЋР±РёС‚РµР»РµР№</p></article>
     </div>
   </section>

   <section class="about-section about-projects">
     <div class="section-kicker">РќР°С€Рё РїСЂРѕРµРєС‚С‹</div>
     <div class="project-list">
       <article class="project-card"><div class="project-num">01</div><div><h3>LOVE CHESS Rating</h3><p>РЎРѕР±СЃС‚РІРµРЅРЅР°СЏ СЃРёСЃС‚РµРјР° СЂРµР№С‚РёРЅРіР° Рё СЃС‚Р°С‚РёСЃС‚РёРєРё РёРіСЂРѕРєРѕРІ: РїР°СЂС‚РёРё, РїРѕР±РµРґС‹, РЅРёС‡СЊРё, РїРѕСЂР°Р¶РµРЅРёСЏ, РёСЃС‚РѕСЂРёСЏ СЂРµР№С‚РёРЅРіР° Рё РґРѕСЃС‚РёР¶РµРЅРёСЏ.</p></div></article>
       <article class="project-card"><div class="project-num">02</div><div><h3>РћС„РёС†РёР°Р»СЊРЅС‹Рµ С‚СѓСЂРЅРёСЂС‹</h3><p>РўСѓСЂРЅРёСЂС‹ СЃ СЂРµРіР»Р°РјРµРЅС‚РѕРј Рё СЂРµР№С‚РёРЅРіРѕРј Р¤РЁР , РІРєР»СЋС‡Р°СЏ С€РІРµР№С†Р°СЂСЃРєСѓСЋ Р¶РµСЂРµР±СЊС‘РІРєСѓ, РЅРµСЃРєРѕР»СЊРєРѕ С‚СѓСЂРѕРІ Рё РёС‚РѕРіРѕРІСѓСЋ С‚Р°Р±Р»РёС†Сѓ.</p></div></article>
       <article class="project-card"><div class="project-num">03</div><div><h3>Р“РѕСЂРѕРґСЃРєРёРµ С€Р°С…РјР°С‚РЅС‹Рµ РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІР°</h3><p>РњРѕР±РёР»СЊРЅС‹Рµ С€Р°С…РјР°С‚РЅС‹Рµ Р·РѕРЅС‹ РґР»СЏ С„РµСЃС‚РёРІР°Р»РµР№ Рё РіРѕСЂРѕРґСЃРєРёС… РјРµСЂРѕРїСЂРёСЏС‚РёР№ вЂ” СЃС‚РѕР»С‹, РёРіСЂРѕРІС‹Рµ РјРµСЃС‚Р° Рё РїРѕРЅСЏС‚РЅС‹Р№ СЃС†РµРЅР°СЂРёР№ РґР»СЏ РїРѕСЃРµС‚РёС‚РµР»РµР№.</p></div></article>
       <article class="project-card"><div class="project-num">04</div><div><h3>РЁР°С…РјР°С‚С‹ + РіРѕСЂРѕРґ</h3><p>РљРѕР»Р»Р°Р±РѕСЂР°С†РёРё СЃ Р·Р°РІРµРґРµРЅРёСЏРјРё Рё Р±СЂРµРЅРґР°РјРё: СЂРµРіСѓР»СЏСЂРЅС‹Рµ С‚СѓСЂРЅРёСЂС‹, СЃРїРµС†РёР°Р»СЊРЅС‹Рµ СЃРѕР±С‹С‚РёСЏ, РїСЂРёР·РѕРІС‹Рµ С„РѕРЅРґС‹ Рё РёРЅС‚РµРіСЂР°С†РёРё РїР°СЂС‚РЅС‘СЂРѕРІ.</p></div></article>
     </div>
   </section>

   <section class="about-section">
     <div class="section-kicker">РљРµР№СЃС‹</div>
     <div class="case-grid">
       <article class="case-card"><img class="case-photo" src="photos/case-gastrokort.jpg" alt="LOVE CHESS РІ Р“РђРЎРўР РћРљРћР Рў" loading="lazy"><div class="case-body"><div class="case-label">Р“РђРЎРўР РћРљРћР Рў</div><h3>Р РµРіСѓР»СЏСЂРЅС‹Рµ С‚СѓСЂРЅРёСЂС‹</h3><p>РџРѕСЃС‚РѕСЏРЅРЅР°СЏ РїР»РѕС‰Р°РґРєР° РґР»СЏ С€Р°С…РјР°С‚РЅС‹С… С‚СѓСЂРЅРёСЂРѕРІ Рё РѕС‚РґРµР»СЊРЅС‹С… С„РѕСЂРјР°С‚РѕРІ. Р’ РїСЂРѕРіСЂР°РјРјСѓ РІС…РѕРґСЏС‚ СЂРµРіСѓР»СЏСЂРЅС‹Рµ РїСЏС‚РЅРёС‡РЅС‹Рµ СЃРѕР±С‹С‚РёСЏ Рё С‚РµРјР°С‚РёС‡РµСЃРєРёРµ С‚СѓСЂРЅРёСЂС‹.</p></div></article>
       <article class="case-card"><img class="case-photo" src="photos/case-zhilfond.jpg" alt="LOVE CHESS Рё Р–РР›Р¤РћРќР”" loading="lazy"><div class="case-body"><div class="case-label">Р–РР›Р¤РћРќР”</div><h3>Р‘РѕР»СЊС€РѕР№ РѕС‚РєСЂС‹С‚С‹Р№ С‚СѓСЂРЅРёСЂ</h3><p>РџР°СЂС‚РЅС‘СЂСЃРєРёР№ С‚СѓСЂРЅРёСЂ СЃ РїСЂРёР·РѕРІС‹Рј С„РѕРЅРґРѕРј 50 000 в‚Ѕ, РѕС‚РґРµР»СЊРЅС‹РјРё РЅРѕРјРёРЅР°С†РёСЏРјРё Рё С„РѕСЂРјР°С‚РѕРј, СЂР°СЃСЃС‡РёС‚Р°РЅРЅС‹Рј РЅР° С€РёСЂРѕРєСѓСЋ Р°СѓРґРёС‚РѕСЂРёСЋ.</p></div></article>
       <article class="case-card"><img class="case-photo" src="photos/case-city.jpg" alt="LOVE CHESS РЅР° РіРѕСЂРѕРґСЃРєРѕРј СЃРѕР±С‹С‚РёРё" loading="lazy"><div class="case-body"><div class="case-label">Р“РћР РћР”РЎРљРР• РЎРћР‘Р«РўРРЇ</div><h3>РЁР°С…РјР°С‚РЅР°СЏ РёРЅС‚РµСЂР°РєС‚РёРІРЅР°СЏ С‚РѕС‡РєР°</h3><p>РљРѕРЅС†РµРїС†РёСЏ РѕС‚РєСЂС‹С‚РѕР№ С€Р°С…РјР°С‚РЅРѕР№ Р·РѕРЅС‹ РґР»СЏ РіРѕСЂРѕРґСЃРєРѕРіРѕ С„РµСЃС‚РёРІР°Р»СЏ: РЅРµСЃРєРѕР»СЊРєРѕ РёРіСЂРѕРІС‹С… СЃС‚РѕР»РѕРІ, РїРѕСЃР°РґРѕС‡РЅС‹Рµ РјРµСЃС‚Р° Рё РѕСЂРіР°РЅРёР·Р°С†РёСЏ РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІР° Р±РµР· СЃР»РѕР¶РЅРѕР№ РёРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂС‹.</p></div></article>
       <article class="case-card"><img class="case-photo" src="photos/case-other-cities.jpg" alt="LOVE CHESS РІ РґСЂСѓРіРёС… РіРѕСЂРѕРґР°С…" loading="lazy"><div class="case-body"><div class="case-label">Р”Р РЈР“РР• Р“РћР РћР”Рђ</div><h3>LOVE CHESS Р·Р° РїСЂРµРґРµР»Р°РјРё РќРѕРІРѕСЃРёР±РёСЂСЃРєР°</h3><p>Р Р°Р·РІРёРІР°РµРј РїСЂРѕРµРєС‚ РІ РґСЂСѓРіРёС… РіРѕСЂРѕРґР°С… Рё РѕС‚РєСЂС‹С‚С‹ Рє Р·Р°РїСѓСЃРєСѓ РЅРѕРІС‹С… РїР»РѕС‰Р°РґРѕРє Рё С„РёР»РёР°Р»РѕРІ LOVE CHESS.</p></div></article>
     </div>
   </section>


   <section class="about-section about-contact">
     <div class="about-contact-copy"><div class="section-kicker">РљРѕРЅС‚Р°РєС‚С‹</div><h2>Р”Р°РІР°Р№С‚Рµ СЃРґРµР»Р°РµРј С€Р°С…РјР°С‚РЅРѕРµ СЃРѕР±С‹С‚РёРµ</h2><p>РћС‚РєСЂС‹С‚С‹ Рє СЃРѕС‚СЂСѓРґРЅРёС‡РµСЃС‚РІСѓ СЃ РїР»РѕС‰Р°РґРєР°РјРё, Р±СЂРµРЅРґР°РјРё, РіРѕСЂРѕРґСЃРєРёРјРё РїСЂРѕРµРєС‚Р°РјРё Рё РєРѕРјР°РЅРґР°РјРё, РєРѕС‚РѕСЂС‹Рµ С…РѕС‚СЏС‚ РґРѕР±Р°РІРёС‚СЊ С€Р°С…РјР°С‚С‹ РІ СЃРІРѕРё СЃРѕР±С‹С‚РёСЏ.</p></div>
     <div class="contact-list">
       <a class="contact-item" href="https://vk.ru/lovechessnsk" target="_blank" rel="noopener"><span>Р’РєРѕРЅС‚Р°РєС‚Рµ</span><b>vk.ru/lovechessnsk в†—</b></a>
       <a class="contact-item" href="https://t.me/LoveChessNSK" target="_blank" rel="noopener"><span>Telegram</span><b>t.me/LoveChessNSK в†—</b></a>
       <a class="contact-item" href="tel:+79134796344"><span>Р РѕРјР°РЅ РљР°СѓСЂРѕРІ (РѕСЃРЅРѕРІР°С‚РµР»СЊ LOVE CHESS)</span><b>+7 913 479-63-44</b></a>
     </div>
   </section>
 </section>`,`about`)
}

function schedule(){
  photoIndex=0;
  let ts=db.tournaments.slice().sort((a,b)=>a.date.localeCompare(b.date));
  layout(`<section class="hero home-hero">
    <div class="hero-copy">
      <div class="eyebrow">РЁР°С…РјР°С‚РЅРѕРµ СЃРѕРѕР±С‰РµСЃС‚РІРѕ</div>
      <h1>LOVE CHESS</h1>
      <p>LOVE CHESS вЂ” С€Р°С…РјР°С‚РЅРѕРµ СЃРѕРѕР±С‰РµСЃС‚РІРѕ, РєРѕС‚РѕСЂРѕРµ РѕР±СЉРµРґРёРЅСЏРµС‚ Р»СЋРґРµР№ С‡РµСЂРµР· РёРіСЂСѓ, С‚СѓСЂРЅРёСЂС‹ Рё Р¶РёРІРѕРµ РѕР±С‰РµРЅРёРµ. Р—РґРµСЃСЊ РјС‹ РїСЂРѕРІРѕРґРёРј СЂРµРіСѓР»СЏСЂРЅС‹Рµ С‚СѓСЂРЅРёСЂС‹, Р·РЅР°РєРѕРјРёРјСЃСЏ, РёРіСЂР°РµРј Рё СЃР»РµРґРёРј Р·Р° СЃРІРѕРёРј РїСЂРѕРіСЂРµСЃСЃРѕРј.</p>
      <div class="home-hero-actions">
        <button class="primary" onclick="document.getElementById('upcoming-tournaments')?.scrollIntoView({behavior:'smooth',block:'start'})">Р‘Р»РёР¶Р°Р№С€РёРµ С‚СѓСЂРЅРёСЂС‹ <span>в†’</span></button>
        <button class="ghost home-about-btn" onclick="route('about')">Рћ РєР»СѓР±Рµ</button>
      </div>
    </div>
    <section class="photo-section">
      <div class="photo-head"><div><div class="eyebrow">LOVE CHESS</div><h2>РљР°Рє СЌС‚Рѕ РїСЂРѕРёСЃС…РѕРґРёС‚</h2></div><div class="photo-controls"><button class="photo-btn" onclick="photoPrev()">в†ђ</button><button class="photo-btn" onclick="photoNext()">в†’</button></div></div>
      <div class="photo-gallery"><button class="photo-arrow left" onclick="photoPrev()">вЂ№</button><div class="photo-track" id="photoTrack"><div class="photo-slide"><img src="photos/love-chess-01.webp" alt="LOVE CHESS вЂ” С„РѕС‚Рѕ СЃ С‚СѓСЂРЅРёСЂР°" loading="eager"></div><div class="photo-slide"><img src="photos/love-chess-02.webp" alt="LOVE CHESS вЂ” С„РѕС‚Рѕ СЃ С‚СѓСЂРЅРёСЂР°" loading="eager"></div><div class="photo-slide"><img src="photos/love-chess-03.webp" alt="LOVE CHESS вЂ” С„РѕС‚Рѕ СЃ С‚СѓСЂРЅРёСЂР°" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-04.webp" alt="LOVE CHESS вЂ” С„РѕС‚Рѕ СЃ С‚СѓСЂРЅРёСЂР°" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-05.webp" alt="LOVE CHESS вЂ” С„РѕС‚Рѕ СЃ С‚СѓСЂРЅРёСЂР°" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-06.webp" alt="LOVE CHESS вЂ” С„РѕС‚Рѕ СЃ С‚СѓСЂРЅРёСЂР°" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-07.webp" alt="LOVE CHESS вЂ” С„РѕС‚Рѕ СЃ С‚СѓСЂРЅРёСЂР°" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-08.webp" alt="LOVE CHESS вЂ” С„РѕС‚Рѕ СЃ С‚СѓСЂРЅРёСЂР°" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-09.webp" alt="LOVE CHESS вЂ” С„РѕС‚Рѕ СЃ С‚СѓСЂРЅРёСЂР°" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-10.webp" alt="LOVE CHESS вЂ” С„РѕС‚Рѕ СЃ С‚СѓСЂРЅРёСЂР°" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-11.webp" alt="LOVE CHESS вЂ” С„РѕС‚Рѕ СЃ С‚СѓСЂРЅРёСЂР°" loading="lazy"></div></div><button class="photo-arrow right" onclick="photoNext()">вЂє</button></div><div class="photo-dots" id="photoDots"></div>
    </section>
  </section>
  <section class="section home-upcoming" id="upcoming-tournaments">
    <div class="row home-section-head"><h2>Р‘Р»РёР¶Р°Р№С€РёРµ С‚СѓСЂРЅРёСЂС‹</h2><span class="home-all-tournaments">Р’СЃРµ С‚СѓСЂРЅРёСЂС‹&nbsp; в†’</span></div>
    <div class="grid tournament-grid">${ts.map(t=>`<article class="card tournament"><div><span class="tag">${esc(t.status)}</span><div class="title">${esc(t.name)}</div><div class="meta">${fmt(t.date)} В· ${esc(t.time)}</div><div class="meta">${esc(t.place)} В· ${esc(t.format)} В· ${esc(t.control)}</div></div><div class="row"><span class="meta">${t.rounds} С‚СѓСЂРѕРІ В· ${t.players.length} РёРіСЂРѕРєРѕРІ</span><div class="settings-actions">${t.status==='Р РµРіРёСЃС‚СЂР°С†РёСЏ'?`<button class="primary" onclick="tournament('${t.id}')">Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ</button>`:''}<button class="ghost" onclick="tournament('${t.id}')">РџРѕРґСЂРѕР±РЅРµРµ в†’</button></div></div></article>`).join('')}</div>
  </section>`,`schedule`)
}


function rating(){let rows=Object.entries(db.players).sort((a,b)=>b[1].rating-a[1].rating);layout(`<section class="hero"><div class="eyebrow">LOVE CHESS RATING</div><h1>Р РµР№С‚РёРЅРі РёРіСЂРѕРєРѕРІ</h1><p>Р РµР№С‚РёРЅРі СЃРѕС…СЂР°РЅСЏРµС‚СЃСЏ РјРµР¶РґСѓ С‚СѓСЂРЅРёСЂР°РјРё Рё РјРµРЅСЏРµС‚СЃСЏ РїРѕСЃР»Рµ СЃС‹РіСЂР°РЅРЅС‹С… РїР°СЂС‚РёР№.</p></section><section class="section"><table class="table"><thead><tr><th>#</th><th>РРіСЂРѕРє</th><th>Р РµР№С‚РёРЅРі</th><th>РџР°СЂС‚РёРё</th><th>Рџ / Рџ / Рќ</th></tr></thead><tbody>${rows.map(([id,p],i)=>`<tr><td>${i+1}</td><td><button class="ghost" onclick="profile('${id}')">${esc(displayName(id))}</button></td><td><b>${p.rating}</b></td><td>${p.games}</td><td>${p.w} / ${p.l} / ${p.d}</td></tr>`).join('')}</tbody></table></section>`,`rating`)}

