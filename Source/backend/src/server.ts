import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

// Load environment variables
dotenv.config();

// Import configurations
import { logger } from './shared/utils/logger';
import { errorHandler } from './shared/middlewares/error.middleware';
import { rateLimiter } from './shared/middlewares/rate-limiter.middleware';
import { requestLogger } from './shared/middlewares/request-logger.middleware';

// Import routes
import routes from './routes';

// Import database
import { prisma } from './shared/database/prisma.client';

// Import Redis
import { redisClient } from './shared/cache/redis.client';

class App {
  public app: Application;
  public httpServer;
  public io: SocketServer;
  private port: number;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketServer(this.httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || '*',
        credentials: true,
      },
    });
    this.port = parseInt(process.env.PORT || '3000', 10);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocketIO();
  }

  private initializeMiddlewares(): void {
    // Security
    this.app.use(helmet());
    
    // CORS
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN?.split(',') || '*',
        credentials: true,
      })
    );

    // Compression
    this.app.use(compression());

    // Body parser
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use(requestLogger);

    // Rate limiting
    this.app.use(rateLimiter);

    // Health check
    this.app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
      });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api', routes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private initializeSocketIO(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });

      // Join room for specific warehouse
      socket.on('join:warehouse', (warehouseId: string) => {
        socket.join(`warehouse:${warehouseId}`);
        logger.info(`Socket ${socket.id} joined warehouse:${warehouseId}`);
      });

      // Real-time stock updates
      socket.on('stock:update', (data) => {
        this.io.to(`warehouse:${data.warehouseId}`).emit('stock:updated', data);
      });
    });
  }

  private async connectDatabase(): Promise<void> {
    try {
      await prisma.$connect();
      logger.info('✅ Database connected successfully');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  private async connectRedis(): Promise<void> {
    try {
      await redisClient.ping();
      logger.info('✅ Redis connected successfully');
    } catch (error) {
      logger.error('❌ Redis connection failed:', error);
      // Don't exit - Redis is optional
    }
  }

  public async listen(): Promise<void> {
    await this.connectDatabase();
    await this.connectRedis();

    this.httpServer.listen(this.port, () => {
      logger.info(`
        ╔════════════════════════════════════════════════════════╗
        ║                                                        ║
        ║   🏭 WMS - Warehouse Management System                ║
        ║                                                        ║
        ║   Server is running!                                  ║
        ║   Port: ${this.port}                                         ║
        ║   Environment: ${process.env.NODE_ENV}                       ║
        ║   API: http://localhost:${this.port}/api/${process.env.API_VERSION}      ║
        ║   Docs: http://localhost:${this.port}/api-docs               ║
        ║                                                        ║
        ╚════════════════════════════════════════════════════════╝
      `);
    });
  }

  public async close(): Promise<void> {
    await prisma.$disconnect();
    await redisClient.quit();
    this.httpServer.close();
    logger.info('Server closed');
  }
}

// Start server
const app = new App();
app.listen();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await app.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await app.close();
  process.exit(0);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app;
