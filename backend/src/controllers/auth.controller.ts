import { Response } from 'express';
import { AuthenticatedRequest, catchAsync } from '@/middleware/auth';
import { AppError } from '@/utils/error-handler';
import prisma from '@/config/database';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt';

export const register = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { email, username, password, fullName } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      throw new AppError(400, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        fullName: fullName || username,
      },
    });

    await prisma.leaderboard.create({
      data: {
        userId: user.id,
        rank: 1,
      },
    });

    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  }
);

export const login = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError(401, 'Invalid email or password');
    }

    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        forcePasswordChange: user.forcePasswordChange,
      },
    });
  }
);

export const refreshToken = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw new AppError(400, 'Refresh token required');
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      throw new AppError(401, 'Invalid refresh token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError(401, 'User not found');
    }

    const accessToken = generateAccessToken(user.id, user.email, user.role);

    res.json({ accessToken });
  }
);

export const getMe = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      forcePasswordChange: user.forcePasswordChange,
    });
  }
);
