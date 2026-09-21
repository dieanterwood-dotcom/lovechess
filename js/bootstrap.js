// LOVE CHESS — application bootstrap

// Legacy data migrations / defaults. Kept here so every feature module is loaded first.
ensurePlayerNicknames();
Object.keys(db.players).forEach(id=>{if(!db.players[id].avatar)db.players[id].avatar='pawn'});
save();

window.addEventListener('hashchange',()=>{ const r=location.hash.replace(/^#/, '')||'schedule'; route(r); });
Promise.all([hydrateAuthSession().catch(()=>null),refreshPublicPlayers().catch(()=>null)]).finally(()=>{const r=location.hash.replace(/^#/,'')||'schedule';route(r)});

