// LOVE CHESS — chess clock

function clockFmt(ms){ms=Math.max(0,Math.ceil(ms/1000));const m=Math.floor(ms/60),s=ms%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}

function clockRender(){
 const ids=[['clockLeft','left'],['clockRight','right'],['clockFsLeft','left'],['clockFsRight','right']];
 ids.forEach(([id,side])=>{const el=document.getElementById(id);if(el)el.textContent=clockFmt(clockState[side])});
 ['left','right'].forEach(side=>{
   const el=document.getElementById(side==='left'?'clockLeft':'clockRight');
   if(el){el.classList.toggle('clock-active',clockState.active===side);el.classList.toggle('clock-zero',clockState[side]<=0)}
   const fs=document.getElementById(side==='left'?'clockFsLeft':'clockFsRight');
   if(fs){fs.classList.toggle('clock-active',clockState.active===side);fs.classList.toggle('clock-zero',clockState[side]<=0)}
 });
 const st=document.getElementById('clockStatus');if(st)st.textContent=clockState.running?'Идёт игра':'Пауза';
 const fsst=document.getElementById('clockFsStatus');if(fsst)fsst.textContent=clockState.running?'Идёт игра':'Пауза';
}

function clockTick(){if(!clockState.running||!clockState.active)return;const now=performance.now(),delta=Math.min(now-clockState.lastTick,1000);clockState.lastTick=now;clockState[clockState.active]-=delta;if(clockState[clockState.active]<=0){clockState[clockState.active]=0;clockState.running=false;clockState.active=null}clockRender()}

function clockStart(){if(clockState.left<=0||clockState.right<=0)return;if(!clockState.active)clockState.active='left';clockState.running=!clockState.running;clockState.lastTick=performance.now();clockRender()}

function clockPress(side){if(clockState[side]<=0)return;if(clockState.running&&clockState.active===side){clockState[side]+=clockState.inc;clockState.active=side==='left'?'right':'left';clockState.lastTick=performance.now();clockRender();return}if(!clockState.running){clockState.active=side==='left'?'right':'left';clockState.lastTick=performance.now();clockState.running=true;clockRender()}}

function clockReset(){clockState.running=false;clockState.active=null;clockState.left=clockState.base;clockState.right=clockState.base;clockRender()}

function clockPreset(min,inc){clockState.base=min*60000;clockState.inc=inc*1000;clockReset();const p=document.getElementById('clockPreset');if(p)p.value=min+'+'+inc;const m=document.getElementById('clockMin');const i=document.getElementById('clockInc');if(m)m.value=min;if(i)i.value=inc}

function clockCustom(){const m=Math.max(1,Math.min(180,parseInt(document.getElementById('clockMin').value,10)||5));const inc=Math.max(0,Math.min(60,parseInt(document.getElementById('clockInc').value,10)||0));clockPreset(m,inc)}

function clockSwap(){const a=clockState.left;clockState.left=clockState.right;clockState.right=a;const s=clockState.active;if(s)clockState.active=s==='left'?'right':'left';clockRender()}

function clockToggleSettings(){const p=document.getElementById('clockFsSettings');if(p)p.classList.toggle('open')}

function clockExitFullscreen(){
 const fs=document.getElementById('clockFullscreen');if(fs)fs.remove();
 document.body.classList.remove('clock-lock');clockState.fullscreen=false;
 if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});
 clockRender();
}

function clockEnterFullscreen(){
 if(clockState.fullscreen)return;
 clockState.fullscreen=true;document.body.classList.add('clock-lock');
 const el=document.createElement('div');el.id='clockFullscreen';el.className='clock-fullscreen';
 el.innerHTML=`
   <button class="clock-fs-side clock-fs-top" onpointerdown="clockPress('right');event.preventDefault()" aria-label="Верхние часы"><strong id="clockFsRight">05:00</strong></button>
   <button class="clock-fs-side clock-fs-bottom" onpointerdown="clockPress('left');event.preventDefault()" aria-label="Нижние часы"><strong id="clockFsLeft">05:00</strong></button>
   <div class="clock-fs-center">
     <button class="clock-fs-icon" onclick="clockStart()" aria-label="Старт или пауза"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6L19 12 8 5.2Z" fill="currentColor"/></svg></button>
     <button class="clock-fs-icon" onclick="clockReset()" aria-label="Сбросить"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.8-4.2L3 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 4.5V9h4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 13a8 8 0 0 0 14.8 4.2L21 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 19.5V15h-4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
     <button class="clock-fs-icon" onclick="clockToggleSettings()" aria-label="Настройки"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m19.2 13.4 1.2 1-.9 1.6-1.5-.5a7.8 7.8 0 0 1-1.8 1l-.3 1.6h-1.9l-.3-1.6a7.8 7.8 0 0 1-1.8-1l-1.5.5-.9-1.6 1.2-1a7.5 7.5 0 0 1 0-2.8l-1.2-1 .9-1.6 1.5.5a7.8 7.8 0 0 1 1.8-1l.3-1.6h1.9l.3 1.6a7.8 7.8 0 0 1 1.8 1l1.5-.5.9 1.6-1.2 1a7.5 7.5 0 0 1 0 2.8Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></button>
     <button class="clock-fs-icon" onclick="clockExitFullscreen();route('schedule')" aria-label="Домой"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-9Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg></button>
   </div>
   <div class="clock-fs-status" id="clockFsStatus">Пауза</div>
   <div class="clock-fs-settings" id="clockFsSettings">
     <div class="clock-fs-settings-head"><b>Настройки часов</b><button class="clock-fs-close" onclick="clockToggleSettings()">×</button></div>
     <div class="clock-fs-presets"><button onclick="clockPreset(3,2);clockToggleSettings()">3+2</button><button onclick="clockPreset(5,3);clockToggleSettings()">5+3</button><button onclick="clockPreset(10,0);clockToggleSettings()">10+0</button><button onclick="clockPreset(15,10);clockToggleSettings()">15+10</button></div>
     <div class="clock-fs-custom"><input id="clockFsMin" type="number" min="1" max="180" value="5"><span>+</span><input id="clockFsInc" type="number" min="0" max="60" value="3"><span>сек</span><button onclick="clockFsCustom();clockToggleSettings()">Установить</button></div>
     <button class="clock-fs-swap" onclick="clockSwap();clockToggleSettings()">Поменять местами</button>
   </div>`;
 document.body.appendChild(el);clockRender();
 if(el.requestFullscreen){el.requestFullscreen().catch(()=>{})}
}

function clockFsCustom(){const m=Math.max(1,Math.min(180,parseInt(document.getElementById('clockFsMin').value,10)||5));const inc=Math.max(0,Math.min(60,parseInt(document.getElementById('clockFsInc').value,10)||0));clockPreset(m,inc)}

function chessClock(){
 if(clockState.interval)clearInterval(clockState.interval);
 if(!clockState.base)clockState.base=300000;
 layout(`<section class="hero"><div class="eyebrow">LOVE CHESS</div><h1>Шахматные часы</h1><p>Два цифровых таймера с добавлением времени после хода.</p></section>
 <section class="section"><div class="clock-wrap">
   <div class="clock-toolbar"><div class="clock-presets"><button class="ghost" onclick="clockPreset(3,2)">3+2</button><button class="ghost" onclick="clockPreset(5,3)">5+3</button><button class="ghost" onclick="clockPreset(10,0)">10+0</button><button class="ghost" onclick="clockPreset(15,10)">15+10</button></div><div class="clock-custom"><input id="clockMin" type="number" min="1" max="180" value="5" aria-label="Минуты"><span>+</span><input id="clockInc" type="number" min="0" max="60" value="3" aria-label="Добавление секунд"><span>сек</span><button class="primary" onclick="clockCustom()">Установить</button></div></div>
   <div class="clock-board"><button class="clock-side" onpointerdown="clockPress('left');event.preventDefault()" aria-label="Левые часы"><strong id="clockLeft">05:00</strong></button><button class="clock-side" onpointerdown="clockPress('right');event.preventDefault()" aria-label="Правые часы"><strong id="clockRight">05:00</strong></button></div>
   <div class="clock-actions"><button class="primary" onclick="clockStart()">Старт / Пауза</button><button class="ghost" onclick="clockReset()">Сбросить</button><button class="ghost" onclick="clockSwap()">Поменять местами</button><button class="ghost clock-fullscreen-open" onclick="clockEnterFullscreen()">На весь экран</button></div><div id="clockStatus" class="clock-status" aria-live="polite">Пауза</div>
 </div></section>`,'clock');
 clockRender();
 clockState.interval=setInterval(clockTick,50);
 // На странице часов сразу открываем полноэкранный интерфейс. На iPhone/iPad
 // CSS-overlay работает даже там, где браузер не разрешает API fullscreen.
 setTimeout(()=>{if(!clockState.fullscreen && location.hash.replace(/^#/,'')==='clock')clockEnterFullscreen()},0);
}
window.addEventListener('hashchange',()=>{ const r=location.hash.replace(/^#/, '')||'schedule'; route(r); });
schedule();

