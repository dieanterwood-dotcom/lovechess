import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { pool, transaction } from './db.js';
import { createSessionToken, hashPassword, hashToken, validateCredentials, verifyPassword } from './security.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp' };
const json = (res, status, body) => { res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' }); res.end(JSON.stringify(body)); };
const cookieValue = (request, name) => {
  const item = (request.headers.cookie || '').split(';').map(value => value.trim()).find(value => value.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : undefined;
};
const readJson = async (request) => new Promise((resolve, reject) => { let body=''; request.on('data', chunk => { body += chunk; if (body.length > 32_000) reject(new Error('Request too large')); }); request.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('Invalid JSON')); } }); request.on('error', reject); });
const sessionCookie = (token) => `lovechess_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${config.sessionTtlDays * 86400}${config.isProduction ? '; Secure' : ''}`;
const expiredCookie = 'lovechess_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';

async function currentUser(request) {
  const token = cookieValue(request, 'lovechess_session');
  if (!token) return null;
  const { rows } = await pool.query(`SELECT u.id, u.username, u.role, p.nickname, p.rating, p.is_public FROM sessions s JOIN users u ON u.id=s.user_id JOIN players p ON p.id=u.id WHERE s.token_hash=$1 AND s.expires_at>NOW() AND u.deleted_at IS NULL`, [hashToken(token)]);
  return rows[0] || null;
}

async function handleApi(request, response, url) {
  if (request.method === 'GET' && url.pathname === '/api/auth/me') return json(response, 200, { user: await currentUser(request) });
  if (request.method === 'POST' && url.pathname === '/api/auth/register') {
    const input = await readJson(request);
    if (input.acceptPrivacy !== true) return json(response, 400, { error:'РќСѓР¶РЅРѕ РїСЂРёРЅСЏС‚СЊ РїРѕР»РёС‚РёРєСѓ РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё.' });
    const { username, nickname } = validateCredentials(input);
    if (!nickname) return json(response, 400, { error:'РЈРєР°Р¶РёС‚Рµ РЅРёРє.' });
    const id=randomUUID(), passwordHash=await hashPassword(input.password);
    try {
      await transaction(async client => { await client.query('INSERT INTO users (id, username, password_hash, privacy_accepted_at) VALUES ($1,$2,$3,NOW())', [id,username,passwordHash]); await client.query('INSERT INTO players (id,nickname) VALUES ($1,$2)', [id,nickname]); });
    } catch (error) { if (error.code === '23505') return json(response,409,{error:'Р­С‚РѕС‚ Р»РѕРіРёРЅ РёР»Рё РЅРёРє СѓР¶Рµ Р·Р°РЅСЏС‚.'}); throw error; }
    const token=createSessionToken(); await pool.query("INSERT INTO sessions (token_hash,user_id,expires_at) VALUES ($1,$2,NOW()+($3 || ' days')::interval)",[hashToken(token),id,String(config.sessionTtlDays)]);
    response.setHeader('Set-Cookie', sessionCookie(token)); return json(response,201,{user:await currentUser({headers:{cookie:`lovechess_session=${token}`}})});
  }
  if (request.method === 'POST' && url.pathname === '/api/auth/login') {
    const input=await readJson(request), username=String(input.username||'').trim().toLowerCase();
    const { rows }=await pool.query('SELECT id,password_hash FROM users WHERE username=$1 AND deleted_at IS NULL',[username]);
    if (!rows[0] || !await verifyPassword(String(input.password||''),rows[0].password_hash)) return json(response,401,{error:'РќРµРІРµСЂРЅС‹Р№ Р»РѕРіРёРЅ РёР»Рё РїР°СЂРѕР»СЊ.'});
    const token=createSessionToken(); await pool.query("INSERT INTO sessions (token_hash,user_id,expires_at) VALUES ($1,$2,NOW()+($3 || ' days')::interval)",[hashToken(token),rows[0].id,String(config.sessionTtlDays)]);
    response.setHeader('Set-Cookie',sessionCookie(token)); return json(response,200,{user:await currentUser({headers:{cookie:`lovechess_session=${token}`}})});
  }
  if (request.method === 'POST' && url.pathname === '/api/auth/logout') { const token=cookieValue(request,'lovechess_session'); if(token) await pool.query('DELETE FROM sessions WHERE token_hash=$1',[hashToken(token)]); response.setHeader('Set-Cookie',expiredCookie); return json(response,204,{}); }
  if (request.method === 'GET' && url.pathname === '/api/players') { const { rows }=await pool.query('SELECT id,nickname,rating,games,wins,draws,losses FROM players WHERE is_public=TRUE ORDER BY rating DESC,nickname'); return json(response,200,{players:rows}); }
  return json(response,404,{error:'Not found'});
}

const server=http.createServer(async (request,response) => { try { const url=new URL(request.url,`http://${request.headers.host}`); if(url.pathname.startsWith('/api/')) return await handleApi(request,response,url); const path=normalize(url.pathname === '/' ? '/index.html' : url.pathname).replace(/^([/\\])+/, ''); const file=join(root,path); if(!file.startsWith(root)) return response.end(); const data=await readFile(file); response.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'}); response.end(data); } catch(error) { if(error.code==='ENOENT') return json(response,404,{error:'Not found'}); console.error(error); return json(response,500,{error:'Internal server error'}); } });
server.listen(config.port,()=>console.log(`LOVE CHESS listening on http://localhost:${config.port}`));

