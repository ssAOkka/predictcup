import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import { catchAsync, AppError } from '@/utils/error-handler';
import { validateRequest } from '@/middleware/validate-request';
import { createPredictionSchema } from '@/utils/validation-schemas';
import prisma from '@/config/database';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';

const router = Router();

// Create prediction
router.post(
  '/',
  authenticateToken,
  validateRequest(createPredictionSchema),
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { matchId, predictedHomeScore, predictedAwayScore, predictedResult } =
      req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, 'User not authenticated');
    }

    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) {
      throw new AppError(404, 'Match not found');
    }

    if (match.matchDate < new Date()) {
      throw new AppError(400, 'Cannot predict on past matches');
    }

    const existingPrediction = await prisma.prediction.findUnique({
      where: { userId_matchId: { userId, matchId } },
    });

    if (existingPrediction) {
      throw new AppError(400, 'You already made a prediction for this match');
    }

    const prediction = await prisma.prediction.create({
      data: {
        userId,
        matchId,
        predictedHomeScore,
        predictedAwayScore,
        predictedResult,
      },
    });

    res.status(201).json(prediction);
  })
);

// Get user predictions
router.get(
  '/',
  authenticateToken,
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, 'User not authenticated');
    }

    const predictions = await prisma.prediction.findMany({
      where: { userId },
      include: { match: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(predictions);
  })
);

// Get prediction by ID
router.get(
  '/:id',
  authenticateToken,
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const prediction = await prisma.prediction.findUnique({
      where: { id: req.params.id },
      include: { match: true },
    });

    if (!prediction) {
      throw new AppError(404, 'Prediction not found');
    }

    res.json(prediction);
  })
);

// Update prediction
router.put(
  '/:id',
  authenticateToken,
  validateRequest(createPredictionSchema),
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { predictedHomeScore, predictedAwayScore, predictedResult } =
      req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, 'User not authenticated');
    }

    const prediction = await prisma.prediction.findUnique({
      where: { id: req.params.id },
      include: { match: true },
    });

    if (!prediction) {
      throw new AppError(404, 'Prediction not found');
    }

    if (prediction.userId !== userId) {
      throw new AppError(403, 'Unauthorized to update this prediction');
    }

    if (prediction.match.matchDate < new Date()) {
      throw new AppError(400, 'Cannot update prediction for past matches');
    }

    const updated = await prisma.prediction.update({
      where: { id: req.params.id },
      data: {
        predictedHomeScore,
        predictedAwayScore,
        predictedResult,
      },
    });

    res.json(updated);
  })
);

export default router;
