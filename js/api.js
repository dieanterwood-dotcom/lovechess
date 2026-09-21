// Server API client. The site and API must be served from the same domain.
let apiCurrentUser=null;
async function apiRequest(path,options={}){const response=await fetch(path,{credentials:'same-origin',headers:{'Content-Type':'application/json',...(options.headers||{})},...options});const body=response.status===204?{}:await response.json().catch(()=>({}));if(!response.ok)throw new Error(body.error||'РЎРµСЂРІРµСЂ РІСЂРµРјРµРЅРЅРѕ РЅРµРґРѕСЃС‚СѓРїРµРЅ.');return body}
function syncApiPlayer(p){if(!p||!p.id)return;db.players[p.id]={...(db.players[p.id]||{}),nickname:p.nickname,rating:p.rating,games:p.games||0,w:p.wins||0,d:p.draws||0,l:p.losses||0,history:db.players[p.id]?.history||[p.rating],avatar:db.players[p.id]?.avatar||'pawn'}}
async function hydrateAuthSession(){const {user}=await apiRequest('/api/auth/me');apiCurrentUser=user||null;if(apiCurrentUser)syncApiPlayer(apiCurrentUser);return apiCurrentUser}
async function refreshPublicPlayers(){const {players}=await apiRequest('/api/players');players.forEach(syncApiPlayer);return players}
async function apiLogin(username,password){const {user}=await apiRequest('/api/auth/login',{method:'POST',body:JSON.stringify({username,password})});apiCurrentUser=user;syncApiPlayer(user);return user}
async function apiRegister(username,password,nickname,acceptPrivacy){const {user}=await apiRequest('/api/auth/register',{method:'POST',body:JSON.stringify({username,password,nickname,acceptPrivacy})});apiCurrentUser=user;syncApiPlayer(user);return user}
async function apiLogout(){await apiRequest('/api/auth/logout',{method:'POST'});apiCurrentUser=null}

