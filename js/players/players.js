// LOVE CHESS — players

function player(id){return db.players[id]||db.deletedPlayers?.[id]||(db.players[id]={rating:1000,games:0,w:0,d:0,l:0,tournaments:[],history:[1000],avatar:'pawn'})}

function displayName(id){const p=db.players[id]||db.deletedPlayers?.[id];return p&&p.nickname?p.nickname:id}

function findPlayerByName(value){const q=String(value||'').trim().toLowerCase();if(!q)return '';const direct=Object.keys(db.players).find(id=>id.toLowerCase()===q);if(direct)return direct;return Object.keys(db.players).find(id=>(db.players[id].nickname||'').trim().toLowerCase()===q)||''}

function nextPlayerId(){let n=1001;const used=new Set(Object.keys(db.players));while(used.has('LC-'+n))n++;return 'LC-'+n}

function ensurePlayerNicknames(){let changed=false;Object.keys(db.players).forEach(id=>{const p=db.players[id];if(p&&!p.nickname){p.nickname=id;changed=true}});if(changed)save()}
ensurePlayerNicknames()
Object.keys(db.players).forEach(id=>{if(!db.players[id].avatar)db.players[id].avatar='pawn'}); save()

