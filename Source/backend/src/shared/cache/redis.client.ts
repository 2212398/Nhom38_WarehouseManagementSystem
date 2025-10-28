import Redis from 'ioredis';
import { logger } from '../utils/logger';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('error', (error) => {
  logger.error('Redis client error:', error);
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

// Cache helper functions
export const cacheHelper = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },

  async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    try {
      await redisClient.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  },

  async del(key: string): Promise<boolean> {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  },

  async flush(): Promise<boolean> {
    try {
      await redisClient.flushdb();
      return true;
    } catch (error) {
      logger.error('Cache flush error:', error);
      return false;
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  },
};

export { redisClient };
export default redisClient;
