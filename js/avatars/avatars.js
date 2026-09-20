// LOVE CHESS — avatars and player status

function avatarKey(id){const a=db.players[id]?.avatar;return a&&AVATARS[a]?a:'neutral'}

function avatarMarkup(id,cls='profile-avatar'){
 const p=db.players[id]||{};
 if(p.avatarCustom)return `<div class="${cls} custom-avatar" aria-label="Загруженный аватар"><img src="${p.avatarCustom}" alt="Аватар игрока"></div>`;
 const key=avatarKey(id),file=AVATAR_FILES[key];
 return `<div class="${cls}" aria-label="${AVATARS[key]}"><img src="avatars/${file}.jpg" alt="${AVATARS[key]}"></div>`;
}

function avatarPicker(id){
 const p=db.players[id]||{};
 const current=avatarKey(id),customSelected=!!p.avatarCustom;
 const options=AVATAR_ORDER.map(key=>`<button type="button" class="avatar-option ${!customSelected&&current===key?'selected':''}" onclick="setAvatar('${id}','${key}')" aria-label="${AVATARS[key]}"><img src="avatars/${AVATAR_FILES[key]}.jpg" alt="${AVATARS[key]}"><small>${AVATARS[key]}</small></button>`).join('');
 return `<div class="avatar-picker" id="avatarPicker"><div class="avatar-picker-title">Выберите аватар</div><div class="avatar-options">${options}</div><div class="avatar-upload-row"><label class="avatar-upload ${customSelected?'selected':''}"><input id="customAvatarInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onchange="uploadCustomAvatar('${id}',this.files[0])"><span>＋</span><b>${customSelected?'Изменить свою картинку':'Загрузить свою картинку'}</b><small>JPG, PNG, WEBP · до 2 МБ</small></label>${customSelected?`<button type="button" class="ghost avatar-reset" onclick="removeCustomAvatar('${id}')">Убрать свою картинку</button>`:''}</div></div>`;
}

function canEditPlayerProfile(id){return !!id && (isOrganizer() || getCurrentPlayer()===id)}

function setAvatar(id,key){
 if(!canEditPlayerProfile(id)){alert('Вы можете менять аватар только в своём профиле.');return;}
 if(!db.players[id]||!AVATARS[key])return;
 db.players[id].avatar=key;delete db.players[id].avatarCustom;save();profile(id);
}

function uploadCustomAvatar(id,file){
 if(!canEditPlayerProfile(id)){alert('Вы можете менять аватар только в своём профиле.');return;}
 if(!file)return;
 if(file.size>2*1024*1024){alert('Картинка слишком большая. Максимальный размер — 2 МБ.');return;}
 if(!/^image\/(png|jpe?g|webp|gif)$/i.test(file.type)){alert('Можно загрузить JPG, PNG, WEBP или GIF.');return;}
 const reader=new FileReader();
 reader.onload=()=>{const img=new Image();img.onload=()=>{const size=256,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d');ctx.fillStyle='#151515';ctx.fillRect(0,0,size,size);const scale=Math.max(size/img.width,size/img.height),w=img.width*scale,h=img.height*scale;ctx.drawImage(img,(size-w)/2,(size-h)/2,w,h);db.players[id].avatarCustom=canvas.toDataURL('image/jpeg',0.86);db.players[id].avatar='custom';save();profile(id)};img.src=reader.result};
 reader.readAsDataURL(file);
}

function removeCustomAvatar(id){
 if(!canEditPlayerProfile(id)){alert('Вы можете менять аватар только в своём профиле.');return;}
 delete db.players[id].avatarCustom;db.players[id].avatar='neutral';save();profile(id);
}

function playerStatus(id){
 const count=awardStats(id).tournaments;
 if(count<=0)return {icon:'♙',title:'Старт',count,next:1,nextLabel:'До Пешки',to:1,progress:0};
 const levels=[
  {icon:'♙',title:'Пешка',from:1,to:9,next:10,nextLabel:'До Коня'},
  {icon:'♘',title:'Конь',from:10,to:29,next:30,nextLabel:'До Слона'},
  {icon:'♗',title:'Слон',from:30,to:59,next:60,nextLabel:'До Ферзя'},
  {icon:'♕',title:'Ферзь',from:60,to:99,next:100,nextLabel:'До Короля'},
  {icon:'♔',title:'Король',from:100,to:Infinity,next:null,nextLabel:'Максимальный статус'}
 ];
 const level=levels.find(x=>count>=x.from&&count<=x.to)||levels[levels.length-1];
 const span=level.to===Infinity?1:level.to-level.from+1;
 const progress=level.to===Infinity?100:Math.max(0,Math.min(100,Math.round(((count-level.from+1)/span)*100)));
 return {...level,count,progress};
}

function statusMarkup(id){
 const s=playerStatus(id),target=s.next;
 const progressText=s.to===Infinity?`${s.count} турниров`:`${s.count} / ${s.to}`;
 const diff=target?target-s.count:0;
 const nextText=target?`${s.nextLabel}: ${diff} ${diff===1?'турнир':'турниров'}`:'Максимальный статус';
 return `<div class="player-status"><div class="status-top"><span class="status-icon">${s.icon}</span><div><div class="status-kicker">СТАТУС ИГРОКА</div><strong>${s.title}</strong></div></div><div class="status-progress"><span style="width:${s.progress}%"></span></div><div class="status-meta"><span>${progressText}</span><span>${nextText}</span></div></div>`;
}

