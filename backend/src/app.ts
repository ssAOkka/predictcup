import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config, initConfig } from '@/config/environment';
import { apiLimiter } from '@/middleware/rate-limit';
import { handleError, AppError } from '@/utils/error-handler';
import logger from '@/logger';
import authRoutes from '@/routes/auth.routes';
import matchRoutes from '@/routes/match.routes';
import predictionRoutes from '@/routes/prediction.routes';
import tournamentRoutes from '@/routes/tournament.routes';

const app: Express = express();

// Initialize config
initConfig();

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/tournaments', tournamentRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  throw new AppError(404, `Route ${req.originalUrl} not found`);
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    handleError(err, res);
  } else {
    logger.error(err);
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
});

export default app;
