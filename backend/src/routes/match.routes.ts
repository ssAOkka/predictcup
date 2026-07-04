import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import { catchAsync } from '@/utils/error-handler';
import prisma from '@/config/database';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';

const router = Router();

// Get all matches
router.get(
  '/',
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const matches = await prisma.match.findMany({
      include: { tournament: true },
      orderBy: { matchDate: 'asc' },
      take: 50,
    });
    res.json(matches);
  })
);

// Get upcoming matches
router.get(
  '/upcoming',
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const matches = await prisma.match.findMany({
      where: {
        status: 'scheduled',
        matchDate: { gte: new Date() },
      },
      orderBy: { matchDate: 'asc' },
    });
    res.json(matches);
  })
);

// Get match by ID
router.get(
  '/:id',
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const match = await prisma.match.findUnique({
      where: { id: req.params.id },
      include: { tournament: true },
    });
    res.json(match);
  })
);

export default router;
