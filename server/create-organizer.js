import { randomUUID } from 'node:crypto';
import { transaction, pool } from './db.js';
import { hashPassword, validateCredentials } from './security.js';
const [username,password,nickname]=process.argv.slice(2);const input=validateCredentials({username,password,nickname});if(!input.nickname)throw new Error('РЈРєР°Р¶РёС‚Рµ РЅРёРє РѕСЂРіР°РЅРёР·Р°С‚РѕСЂР° С‚СЂРµС‚СЊРёРј Р°СЂРіСѓРјРµРЅС‚РѕРј.');const id=randomUUID();
try{await transaction(async client=>{await client.query("INSERT INTO users (id,username,password_hash,role,privacy_accepted_at) VALUES ($1,$2,$3,'organizer',NOW())",[id,input.username,await hashPassword(password)]);await client.query('INSERT INTO players (id,nickname) VALUES ($1,$2)',[id,input.nickname]);});console.log(`РЎРѕР·РґР°РЅ Р°РєРєР°СѓРЅС‚ РѕСЂРіР°РЅРёР·Р°С‚РѕСЂР°: ${input.username}`)}finally{await pool.end()}

