// LOVE CHESS — public pages and home

let photoIndex=0;let photoAutoTimer=null;function renderPhotos(){const track=document.getElementById('photoTrack'),dots=document.getElementById('photoDots');if(!track||!dots)return;const slides=track.children;if(!slides.length)return;photoIndex=(photoIndex+slides.length)%slides.length;[...slides].forEach((slide,i)=>{slide.classList.toggle('photo-active',i===photoIndex);slide.setAttribute('aria-hidden',i===photoIndex?'false':'true')});track.style.transform='none';dots.innerHTML=[...slides].map((_,i)=>`<button class="dot ${i===photoIndex?'active':''}" onclick="photoGo(${i})" aria-label="Фото ${i+1}"></button>`).join('')}function stopPhotoAuto(){if(photoAutoTimer){clearInterval(photoAutoTimer);photoAutoTimer=null}}function startPhotoAuto(){stopPhotoAuto();const track=document.getElementById('photoTrack');if(!track||track.children.length<2)return;photoAutoTimer=setInterval(()=>{if(document.hidden)return;photoNext()},5000)}function photoGo(i){photoIndex=i;renderPhotos();startPhotoAuto()}function photoNext(){photoIndex++;renderPhotos()}function photoPrev(){photoIndex--;renderPhotos();startPhotoAuto()}


function about(){
 layout(`<section class="about-page">
   <section class="about-hero">
     <div class="about-hero-copy">
       <div class="eyebrow">LOVE CHESS</div>
       <h1>О нас</h1>
       <p>LOVE CHESS — шахматное сообщество из Новосибирска. Мы делаем шахматы частью городской жизни: проводим турниры в барах, кофейнях и общественных пространствах, создаём регулярные форматы и развиваем собственную систему рейтинга.</p>
       <div class="about-actions"><button class="primary" onclick="route('schedule')">Ближайшие турниры</button><button class="ghost" onclick="route('rating')">Рейтинг игроков</button></div>
     </div>
     <div class="about-hero-mark"><img src="photos/about-hero.jpg" alt="LOVE CHESS — шахматное событие" loading="eager"></div>
   </section>

   <section class="about-section">
     <div class="section-kicker">Что мы делаем</div>
     <div class="about-grid about-grid-3">
       <article class="about-card"><img class="about-card-photo" src="photos/about-evenings.jpg" alt="Шахматный вечер LOVE CHESS" loading="lazy"><div class="about-icon">♟</div><h3>Шахматные вечера</h3><p>Шахматные вечера для всех желающих вне зависимости уровня игры, в барах, кофейнях, фуд-кортах и городских пространствах. Формат строится вокруг игры, новых знакомств и общения. Собственная рейтинговая система, которая сохраняет историю игрока.</p></article>
       <article class="about-card"><img class="about-card-photo" src="photos/about-fshr.jpg" alt="Турнир ФШР LOVE CHESS" loading="lazy"><div class="about-icon">♜</div><h3>Турниры ФШР</h3><p>Официальные турниры с обсчетом рейтинга ФШР.</p></article>
       <article class="about-card"><img class="about-card-photo" src="photos/about-learning.jpg" alt="Обучение шахматам LOVE CHESS" loading="lazy"><div class="about-icon">♝</div><h3>Обучение для детей и взрослых</h3><p>Обучаем игре в шахматы детей и взрослых, новичков и любителей</p></article>
     </div>
   </section>

   <section class="about-section about-projects">
     <div class="section-kicker">Наши проекты</div>
     <div class="project-list">
       <article class="project-card"><div class="project-num">01</div><div><h3>LOVE CHESS Rating</h3><p>Собственная система рейтинга и статистики игроков: партии, победы, ничьи, поражения, история рейтинга и достижения.</p></div></article>
       <article class="project-card"><div class="project-num">02</div><div><h3>Официальные турниры</h3><p>Турниры с регламентом и рейтингом ФШР, включая швейцарскую жеребьёвку, несколько туров и итоговую таблицу.</p></div></article>
       <article class="project-card"><div class="project-num">03</div><div><h3>Городские шахматные пространства</h3><p>Мобильные шахматные зоны для фестивалей и городских мероприятий — столы, игровые места и понятный сценарий для посетителей.</p></div></article>
       <article class="project-card"><div class="project-num">04</div><div><h3>Шахматы + город</h3><p>Коллаборации с заведениями и брендами: регулярные турниры, специальные события, призовые фонды и интеграции партнёров.</p></div></article>
     </div>
   </section>

   <section class="about-section">
     <div class="section-kicker">Кейсы</div>
     <div class="case-grid">
       <article class="case-card"><img class="case-photo" src="photos/case-gastrokort.jpg" alt="LOVE CHESS в ГАСТРОКОРТ" loading="lazy"><div class="case-body"><div class="case-label">ГАСТРОКОРТ</div><h3>Регулярные турниры</h3><p>Постоянная площадка для шахматных турниров и отдельных форматов. В программу входят регулярные пятничные события и тематические турниры.</p></div></article>
       <article class="case-card"><img class="case-photo" src="photos/case-zhilfond.jpg" alt="LOVE CHESS и ЖИЛФОНД" loading="lazy"><div class="case-body"><div class="case-label">ЖИЛФОНД</div><h3>Большой открытый турнир</h3><p>Партнёрский турнир с призовым фондом 50 000 ₽, отдельными номинациями и форматом, рассчитанным на широкую аудиторию.</p></div></article>
       <article class="case-card"><img class="case-photo" src="photos/case-city.jpg" alt="LOVE CHESS на городском событии" loading="lazy"><div class="case-body"><div class="case-label">ГОРОДСКИЕ СОБЫТИЯ</div><h3>Шахматная интерактивная точка</h3><p>Концепция открытой шахматной зоны для городского фестиваля: несколько игровых столов, посадочные места и организация пространства без сложной инфраструктуры.</p></div></article>
       <article class="case-card"><img class="case-photo" src="photos/case-other-cities.jpg" alt="LOVE CHESS в других городах" loading="lazy"><div class="case-body"><div class="case-label">ДРУГИЕ ГОРОДА</div><h3>LOVE CHESS за пределами Новосибирска</h3><p>Развиваем проект в других городах и открыты к запуску новых площадок и филиалов LOVE CHESS.</p></div></article>
     </div>
   </section>


   <section class="about-section about-contact">
     <div class="about-contact-copy"><div class="section-kicker">Контакты</div><h2>Давайте сделаем шахматное событие</h2><p>Открыты к сотрудничеству с площадками, брендами, городскими проектами и командами, которые хотят добавить шахматы в свои события.</p></div>
     <div class="contact-list">
       <a class="contact-item" href="https://vk.ru/lovechessnsk" target="_blank" rel="noopener"><span>Вконтакте</span><b>vk.ru/lovechessnsk ↗</b></a>
       <a class="contact-item" href="https://t.me/LoveChessNSK" target="_blank" rel="noopener"><span>Telegram</span><b>t.me/LoveChessNSK ↗</b></a>
       <a class="contact-item" href="tel:+79134796344"><span>Роман Кауров (основатель LOVE CHESS)</span><b>+7 913 479-63-44</b></a>
     </div>
   </section>
 </section>`,`about`)
}

function schedule(){
  photoIndex=0;
  let ts=db.tournaments.slice().sort((a,b)=>a.date.localeCompare(b.date));
  layout(`<section class="hero home-hero">
    <div class="hero-copy">
      <div class="eyebrow">Шахматное сообщество</div>
      <h1>LOVE CHESS</h1>
      <p>LOVE CHESS — шахматное сообщество, которое объединяет людей через игру, турниры и живое общение. Здесь мы проводим регулярные турниры, знакомимся, играем и следим за своим прогрессом.</p>
      <div class="home-hero-actions">
        <button class="primary" onclick="document.getElementById('upcoming-tournaments')?.scrollIntoView({behavior:'smooth',block:'start'})">Ближайшие турниры <span>→</span></button>
        <button class="ghost home-about-btn" onclick="route('about')">О клубе</button>
      </div>
    </div>
    <section class="photo-section">
      <div class="photo-head"><div><div class="eyebrow">LOVE CHESS</div><h2>Как это происходит</h2></div><div class="photo-controls"><button class="photo-btn" onclick="photoPrev()">←</button><button class="photo-btn" onclick="photoNext()">→</button></div></div>
      <div class="photo-gallery"><button class="photo-arrow left" onclick="photoPrev()">‹</button><div class="photo-track" id="photoTrack"><div class="photo-slide"><img src="photos/love-chess-01.webp" alt="LOVE CHESS — фото с турнира" loading="eager"></div><div class="photo-slide"><img src="photos/love-chess-02.webp" alt="LOVE CHESS — фото с турнира" loading="eager"></div><div class="photo-slide"><img src="photos/love-chess-03.webp" alt="LOVE CHESS — фото с турнира" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-04.webp" alt="LOVE CHESS — фото с турнира" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-05.webp" alt="LOVE CHESS — фото с турнира" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-06.webp" alt="LOVE CHESS — фото с турнира" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-07.webp" alt="LOVE CHESS — фото с турнира" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-08.webp" alt="LOVE CHESS — фото с турнира" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-09.webp" alt="LOVE CHESS — фото с турнира" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-10.webp" alt="LOVE CHESS — фото с турнира" loading="lazy"></div><div class="photo-slide"><img src="photos/love-chess-11.webp" alt="LOVE CHESS — фото с турнира" loading="lazy"></div></div><button class="photo-arrow right" onclick="photoNext()">›</button></div><div class="photo-dots" id="photoDots"></div>
    </section>
  </section>
  <section class="section home-upcoming" id="upcoming-tournaments">
    <div class="row home-section-head"><h2>Ближайшие турниры</h2><span class="home-all-tournaments">Все турниры&nbsp; →</span></div>
    <div class="grid tournament-grid">${ts.map(t=>`<article class="card tournament"><div><span class="tag">${esc(t.status)}</span><div class="title">${esc(t.name)}</div><div class="meta">${fmt(t.date)} · ${esc(t.time)}</div><div class="meta">${esc(t.place)} · ${esc(t.format)} · ${esc(t.control)}</div></div><div class="row"><span class="meta">${t.rounds} туров · ${t.players.length} игроков</span><div class="settings-actions">${t.status==='Регистрация'?`<button class="primary" onclick="tournament('${t.id}')">Зарегистрироваться</button>`:''}<button class="ghost" onclick="tournament('${t.id}')">Подробнее →</button></div></div></article>`).join('')}</div>
  </section>`,`schedule`)
}


function rating(){let rows=Object.entries(db.players).sort((a,b)=>b[1].rating-a[1].rating);layout(`<section class="hero"><div class="eyebrow">LOVE CHESS RATING</div><h1>Рейтинг игроков</h1><p>Рейтинг сохраняется между турнирами и меняется после сыгранных партий.</p></section><section class="section"><table class="table"><thead><tr><th>#</th><th>Игрок</th><th>Рейтинг</th><th>Партии</th><th>П / П / Н</th></tr></thead><tbody>${rows.map(([id,p],i)=>`<tr><td>${i+1}</td><td><button class="ghost" onclick="profile('${id}')">${esc(displayName(id))}</button></td><td><b>${p.rating}</b></td><td>${p.games}</td><td>${p.w} / ${p.l} / ${p.d}</td></tr>`).join('')}</tbody></table></section>`,`rating`)}

