import { randomUUID } from 'node:crypto';
import { transaction, pool } from './db.js';
import { hashPassword, validateCredentials } from './security.js';
const [username,password,nickname]=process.argv.slice(2);const input=validateCredentials({username,password,nickname});if(!input.nickname)throw new Error('Укажите ник организатора третьим аргументом.');const id=randomUUID();
try{await transaction(async client=>{await client.query("INSERT INTO users (id,username,password_hash,role,privacy_accepted_at) VALUES ($1,$2,$3,'organizer',NOW())",[id,input.username,await hashPassword(password)]);await client.query('INSERT INTO players (id,nickname) VALUES ($1,$2)',[id,input.nickname]);});console.log(`Создан аккаунт организатора: ${input.username}`)}finally{await pool.end()}

