// LOVE CHESS — authentication

function getCurrentPlayer(){
  const username=sessionStorage.getItem('lovechess_player_session')||'';
  const account=db?.accounts?.[username];
  if(account&&db.players[account.playerId]) return account.playerId;
  const legacy=localStorage.getItem('lovechess_current_player')||'';
  return legacy&&db.players[legacy]?legacy:'';
}

function logoutPlayer(){sessionStorage.removeItem('lovechess_player_session');localStorage.removeItem('lovechess_current_player');location.hash='profile';}

function bytesToHex(buf){return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('')}

function randomHex(bytes=16){const a=new Uint8Array(bytes);crypto.getRandomValues(a);return bytesToHex(a)}

async function hashPassword(password,salt){
  const enc=new TextEncoder();
  const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:120000,hash:'SHA-256'},key,256);
  return bytesToHex(bits);
}

async function createPlayerAccount(playerId,username,password){
  db.accounts=db.accounts||{};
  username=String(username||'').trim().toLowerCase();
  if(!/^[a-z0-9._-]{3,32}$/.test(username)) throw new Error('Логин: 3–32 символа, только латиница, цифры, точка, дефис или _.');
  if(!password||password.length<6) throw new Error('Пароль должен содержать минимум 6 символов.');
  const owner=Object.entries(db.accounts).find(([u,a])=>u===username||a.playerId===playerId);
  if(owner&&owner[0]!==username) delete db.accounts[owner[0]];
  if(db.accounts[username]&&db.accounts[username].playerId!==playerId) throw new Error('Этот логин уже занят.');
  const salt=randomHex(16);
  db.accounts[username]={playerId,salt,hash:await hashPassword(password,salt),createdAt:db.accounts[username]?.createdAt||new Date().toISOString()};
  save();
  return username;
}

async function loginPlayer(username,password){
  username=String(username||'').trim().toLowerCase();
  const a=db.accounts?.[username];
  if(!a){alert('Неверный логин или пароль.');return;}
  const hash=await hashPassword(password||'',a.salt);
  if(hash!==a.hash){alert('Неверный логин или пароль.');return;}
  if(!db.players[a.playerId]){alert('Профиль игрока не найден. Обратитесь к организатору.');return;}
  sessionStorage.setItem('lovechess_player_session',username);
  location.hash='profile/'+a.playerId;
}

function auth(){route('profile');}
