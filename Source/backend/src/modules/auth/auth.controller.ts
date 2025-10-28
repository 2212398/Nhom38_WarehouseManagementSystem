import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../shared/database/prisma.client';
import { AppError } from '../../shared/middlewares/error.middleware';
import { logger } from '../../shared/utils/logger';

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.users.create({
      data: {
        username,
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
      },
    });

    // Assign default role (e.g., 'USER')
    const defaultRole = await prisma.roles.findFirst({
      where: { code: 'USER' },
    });

    if (defaultRole) {
      await prisma.user_roles.create({
        data: {
          user_id: user.id,
          role_id: defaultRole.id,
        },
      });
    }

    logger.info(`User registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!user || !user.is_active) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';
    const refreshExpiresIn = (process.env.REFRESH_TOKEN_EXPIRES_IN || '30d') as any;

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      refreshSecret,
      { expiresIn: refreshExpiresIn }
    );

    // Update last login
    await prisma.users.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          roles: user.user_roles.map((ur) => ur.roles.code),
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret'
    ) as { userId: string; email: string };

    // Generate new access token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;
    
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    res.json({
      success: true,
      message: 'Token refreshed',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid refresh token', 401));
    } else {
      next(error);
    }
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // In a real application, you would invalidate the token here
    // For example, add it to a blacklist in Redis

    logger.info(`User logged out: ${req.user?.email}`);

    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        is_active: true,
        created_at: true,
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

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const roles = user.user_roles.map((ur) => ur.roles.code);
    const permissions = user.user_roles.flatMap((ur) =>
      ur.roles.role_permissions.map((rp) => rp.permissions.code)
    );

    res.json({
      success: true,
      data: {
        ...user,
        roles,
        permissions,
      },
    });
  } catch (error) {
    next(error);
  }
};
