import { Router } from 'express';
import { catchAsync } from '@/utils/error-handler';
import prisma from '@/config/database';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';

const router = Router();

// Get all tournaments
router.get(
  '/',
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { startDate: 'asc' },
    });
    res.json(tournaments);
  })
);

// Get tournament by ID
router.get(
  '/:id',
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: {
        matches: {
          orderBy: { matchDate: 'asc' },
        },
      },
    });
    res.json(tournament);
  })
);

// Get tournament matches
router.get(
  '/:id/matches',
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const matches = await prisma.match.findMany({
      where: { tournamentId: req.params.id },
      orderBy: { matchDate: 'asc' },
    });
    res.json(matches);
  })
);

export default router;
