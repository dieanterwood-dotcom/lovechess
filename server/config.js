const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const config = {
  databaseUrl: required('DATABASE_URL'),
  port: Number(process.env.PORT || 3000),
  isProduction: process.env.NODE_ENV === 'production',
  sessionTtlDays: Number(process.env.SESSION_TTL_DAYS || 30),
};

if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
  throw new Error('PORT must be a valid TCP port.');
}
if (!Number.isInteger(config.sessionTtlDays) || config.sessionTtlDays < 1 || config.sessionTtlDays > 365) {
  throw new Error('SESSION_TTL_DAYS must be between 1 and 365.');
}

