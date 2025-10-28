import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import { prisma } from '../database/prisma.client';

interface JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        roles: string[];
        permissions: string[];
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JwtPayload;

    // Get user from database
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      include: {
        user_roles: {
          include: {
            roles: {
              include: {
                role_permissions: {
                  include: {
                    permissions: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.is_active) {
      throw new AppError('User not found or inactive', 401);
    }

    // Extract roles and permissions
    const roles = user.user_roles.map((ur) => ur.roles.code);
    const permissions = user.user_roles.flatMap((ur) =>
      ur.roles.role_permissions.map((rp) => rp.permissions.code)
    );

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      roles,
      permissions,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const authorize = (...requiredPermissions: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const hasPermission = requiredPermissions.some((permission) =>
      req.user!.permissions.includes(permission)
    );

    if (!hasPermission) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

export default authMiddleware;
