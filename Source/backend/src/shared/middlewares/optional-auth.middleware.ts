import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

/**
 * Optional Authentication Middleware
 * Validates JWT token if provided, but doesn't block request if missing
 * Attaches user info to request if token is valid
 */
export const optionalAuthMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided - continue without user info
      next();
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      (req as any).user = decoded;
      logger.info(`Authenticated user: ${decoded.email || decoded.username}`);
    } catch (error) {
      // Invalid token - log but continue
      logger.warn('Invalid token provided, continuing without auth');
    }

    next();
  } catch (error) {
    logger.error('Error in optional auth middleware:', error);
    next();
  }
};
