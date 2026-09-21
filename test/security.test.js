import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, validateCredentials, createSessionToken, hashToken } from '../server/security.js';

test('passwords are salted and verify only their original value', async () => {
  const hash = await hashPassword('correct-horse-battery');
  assert.match(hash, /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
  assert.equal(await verifyPassword('correct-horse-battery', hash), true);
  assert.equal(await verifyPassword('wrong-password', hash), false);
});

test('credentials are normalized and constrained', () => {
  assert.deepEqual(validateCredentials({ username:'  Player_1 ', password:'long-enough-password', nickname:'  Knight  ' }), { username:'player_1', nickname:'Knight' });
  assert.throws(() => validateCredentials({ username:'no', password:'long-enough-password' }));
  assert.throws(() => validateCredentials({ username:'valid', password:'short' }));
});

test('session tokens are opaque and only their digest is persisted', () => {
  const token=createSessionToken();
  assert.match(token,/^[A-Za-z0-9_-]{43}$/);
  assert.match(hashToken(token),/^[a-f0-9]{64}$/);
});

