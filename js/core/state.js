// LOVE CHESS — application state
// This file contains only shared state and immutable configuration.
const KEY='lovechess_mvp_v2';
const seed={tournaments:[{id:'t1',name:'LOVE CHESS BLITZ',date:'2026-09-18',time:'18:00',place:'GASTROKORT',format:'Blitz',control:'5+3',rounds:9,fee:0,status:'Регистрация',players:['LC-1001','LC-1002','LC-1003','LC-1004'],currentRound:0,roundData:[]}],players:{'LC-1001':{rating:1420,games:28,w:17,d:4,l:7,history:[1350,1380,1402,1420]},'LC-1002':{rating:1368,games:31,w:14,d:7,l:10,history:[1300,1325,1348,1368]},'LC-1003':{rating:1287,games:19,w:9,d:5,l:5,history:[1200,1240,1265,1287]},'LC-1004':{rating:1510,games:35,w:22,d:5,history:[1450,1470,1492,1510]}}};
let db=JSON.parse(localStorage.getItem(KEY)||'null')||seed;
db.deletedPlayers=db.deletedPlayers||{};
let pairingContext={players:{},previousByes:new Set(),round:0,totalRounds:0,finalRound:false};
let clockState={left:300000,right:300000,inc:3000,active:null,running:false,lastTick:0,interval:null,base:300000,fullscreen:false};

const AVATARS={
 boy:'Парень',girl:'Девушка',man:'Парень 2',girl2:'Девушка 2',man2:'Парень 3',girl3:'Девушка 3',
 king:'Король',queen:'Ферзь',rook:'Ладья',bishop:'Слон',knight:'Конь',pawn:'Пешка',
 panda:'Панда',dog:'Собака',cat:'Кот',ghost:'Привидение',girl4:'Девушка 4',man3:'Парень 4',
 lion:'Лев',girl5:'Девушка 5',man4:'Парень 5',neutral:'Нейтральный',shadow:'Тень',skeletonKing:'Король 2'
};
const AVATAR_ORDER=Object.keys(AVATARS);
const AVATAR_FILES={boy:'boy',girl:'girl',man:'man',girl2:'girl2',man2:'man2',girl3:'girl3',king:'king',queen:'queen',rook:'rook',bishop:'bishop',knight:'knight',pawn:'pawn',panda:'panda',dog:'dog',cat:'cat',ghost:'ghost',girl4:'girl4',man3:'man3',lion:'lion',girl5:'girl5',man4:'man4',neutral:'neutral',shadow:'shadow',skeletonKing:'skeleton-king'};
