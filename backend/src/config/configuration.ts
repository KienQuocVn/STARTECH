function readBooleanEnv(name: string, fallback = false) {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(rawValue.trim().toLowerCase());
}

function validateJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!secret) {
    if (isProduction) {
      throw new Error(
        'CRITICAL: JWT_SECRET environment variable must be set in production. ' + 'This is a required security parameter and cannot have a fallback.',
      );
    }

    console.warn('WARNING: Development mode is using the default JWT secret. Never use this in production.');
    return 'startech-dev-secret';
  }

  if (secret.length < 32) {
    console.warn('WARNING: JWT_SECRET should be at least 32 characters long for production-grade security.');
  }

  return secret;
}

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction = nodeEnv === 'production';

export const appConfiguration = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv,
  isProduction,
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwtSecret: validateJwtSecret(),
  swagger: {
    enabled: readBooleanEnv('ENABLE_SWAGGER', !isProduction),
    allowInProduction: readBooleanEnv('ALLOW_PRODUCTION_SWAGGER', false),
    path: process.env.SWAGGER_PATH?.trim() || 'api/docs',
  },
};

export type AppConfiguration = typeof appConfiguration;
