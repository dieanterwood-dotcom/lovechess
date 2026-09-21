import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export function validateCredentials({ username, password, nickname }) {
  const normalizedUsername = String(username || '').trim().toLowerCase();
  const normalizedNickname = String(nickname || '').trim();
  if (!/^[a-z0-9._-]{3,32}$/.test(normalizedUsername)) {
    throw new Error('Р›РѕРіРёРЅ: РѕС‚ 3 РґРѕ 32 СЃРёРјРІРѕР»РѕРІ, Р»Р°С‚РёРЅРёС†Р°, С†РёС„СЂС‹, С‚РѕС‡РєР°, РґРµС„РёСЃ РёР»Рё _.');
  }
  if (typeof password !== 'string' || password.length < 10 || password.length > 128) {
    throw new Error('РџР°СЂРѕР»СЊ РґРѕР»Р¶РµРЅ СЃРѕРґРµСЂР¶Р°С‚СЊ РѕС‚ 10 РґРѕ 128 СЃРёРјРІРѕР»РѕРІ.');
  }
  if (normalizedNickname && (normalizedNickname.length < 2 || normalizedNickname.length > 40)) {
    throw new Error('РќРёРє РґРѕР»Р¶РµРЅ СЃРѕРґРµСЂР¶Р°С‚СЊ РѕС‚ 2 РґРѕ 40 СЃРёРјРІРѕР»РѕРІ.');
  }
  return { username: normalizedUsername, nickname: normalizedNickname };
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt$${salt}$${Buffer.from(derived).toString('hex')}`;
}

export async function verifyPassword(password, stored) {
  const [algorithm, salt, digest] = String(stored).split('$');
  if (algorithm !== 'scrypt' || !salt || !digest) return false;
  const derived = Buffer.from(await scrypt(password, salt, KEY_LENGTH));
  const expected = Buffer.from(digest, 'hex');
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export function createSessionToken() {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

