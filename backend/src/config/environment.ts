import logger from '@/logger';

export const initConfig = () => {
  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'JWT_SECRET',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    logger.error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
    process.exit(1);
  }

  logger.info('✅ All required environment variables are set');
};

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  footballApiProvider: process.env.FOOTBALL_API_PROVIDER || 'football-data.org',
  footballApiKey: process.env.FOOTBALL_API_KEY,
  emailProvider: process.env.EMAIL_PROVIDER || 'nodemailer',
  emailFrom: process.env.EMAIL_FROM || 'noreply@predictcup.dev',
};
