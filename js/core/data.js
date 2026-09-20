// LOVE CHESS — shared data persistence and migrations

function rebuildCompletedTournamentHistory(){
  const tournaments=Array.isArray(db.tournaments)?db.tournaments:[];
  Object.keys(db.players||{}).forEach(id=>{
    const p=db.players[id];
    if(!p)return;
    const aliases=new Set([id,String(p.nickname||'').trim()].filter(Boolean));
    p.tournaments=tournaments
      .filter(t=>{
        if(!t)return false;
        const completed=t.status==='Завершён' || (Number(t.currentRound||0)>0 && Number(t.rounds||0)>0 && Number(t.currentRound)>=Number(t.rounds) && (t.roundData||[]).length>=Number(t.rounds) && (t.roundData||[]).every(r=>r.completed));
        if(!completed)return false;
        return Array.isArray(t.players) && t.players.some(pid=>{
          if(aliases.has(pid))return true;
          const other=db.players[pid];
          return !!other && aliases.has(String(other.nickname||'').trim());
        });
      })
      .sort((a,b)=>(a.date||'').localeCompare(b.date||'') || String(a.id).localeCompare(String(b.id)))
      .map(t=>({id:t.id,name:t.name,date:t.date}));
  });
}

function save(){rebuildCompletedTournamentHistory();localStorage.setItem(KEY,JSON.stringify(db))}

