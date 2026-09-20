// LOVE CHESS — routing

function route(r){
  if(typeof r !== 'string') r='schedule';
  if(r==='about')return about();
  if(r==='organizer')return organizerLogin();
  if(r==='profile')return profileHome();
  const pm=r.match(/^profile\/(.+)$/);
  if(pm)return profile(pm[1]);
  if(r==='clock'){chessClock();return;}
  if(r==='schedule')return schedule();
  if(r==='rating')return rating();
  if(r==='admin')return admin();
  const tm=r.match(/^tournament\/(.+)$/);
  if(tm)return tournament(tm[1]);
  return schedule();
}


