export const generateAccessToken = (userId: string, email: string, role: string): string => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const generateRefreshToken = (userId: string): string => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

export const verifyAccessToken = (token: string): any => {
  const jwt = require('jsonwebtoken');
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): any => {
  const jwt = require('jsonwebtoken');
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh-secret');
  } catch (error) {
    return null;
  }
};
