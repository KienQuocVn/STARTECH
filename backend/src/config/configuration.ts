export const appConfiguration = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigins: process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://127.0.0.1:3000',
  jwtSecret: process.env.JWT_SECRET ?? 'startech-dev-secret',
};

export type AppConfiguration = typeof appConfiguration;
