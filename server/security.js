import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export function validateCredentials({ username, password, nickname }) {
  const normalizedUsername = String(username || '').trim().toLowerCase();
  const normalizedNickname = String(nickname || '').trim();
  if (!/^[a-z0-9._-]{3,32}$/.test(normalizedUsername)) {
    throw new Error('Логин: от 3 до 32 символов, латиница, цифры, точка, дефис или _.');
  }
  if (typeof password !== 'string' || password.length < 10 || password.length > 128) {
    throw new Error('Пароль должен содержать от 10 до 128 символов.');
  }
  if (normalizedNickname && (normalizedNickname.length < 2 || normalizedNickname.length > 40)) {
    throw new Error('Ник должен содержать от 2 до 40 символов.');
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

