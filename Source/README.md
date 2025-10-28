# Source Code Documentation

## 📁 Cấu trúc thư mục

```
Source/
└── backend/              # Backend API (Node.js + Express + TypeScript)
    ├── src/
    │   ├── modules/     # Business modules
    │   │   ├── auth/           # Authentication & Authorization
    │   │   ├── master-data/    # Master data management
    │   │   ├── inbound/        # Inbound operations
    │   │   ├── inventory/      # Inventory management
    │   │   ├── outbound/       # Outbound operations
    │   │   ├── reporting/      # Reports & Analytics
    │   │   └── admin/          # System administration
    │   ├── shared/      # Shared utilities
    │   │   ├── cache/          # Redis cache client
    │   │   ├── database/       # Prisma client
    │   │   ├── middlewares/    # Express middlewares
    │   │   └── utils/          # Utility functions
    │   ├── routes/      # API routes
    │   ├── config/      # Configuration files
    │   └── server.ts    # Application entry point
    ├── prisma/          # Prisma schema
    ├── dist/            # Compiled JavaScript (generated)
    └── node_modules/    # Dependencies
```

## 🚀 Backend API

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Language**: TypeScript 5.3+
- **Database ORM**: Prisma 5.6+
- **Cache**: Redis (ioredis)
- **Authentication**: JWT
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Real-time**: Socket.io
- **Logging**: Winston

### Setup Instructions

#### 1. Install Dependencies
```bash
cd Source/backend
npm install
```

#### 2. Environment Configuration
```bash
cp .env.example .env
```

Cấu hình file `.env`:
```env
# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wms_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3001
```

#### 3. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed data (optional)
npm run prisma:seed
```

#### 4. Start Development Server
```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

### Available Scripts

```json
{
  "dev": "nodemon --exec ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:studio": "prisma studio",
  "test": "jest",
  "lint": "eslint src --ext .ts",
  "lint:fix": "eslint src --ext .ts --fix"
}
```

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Đăng ký user mới
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Đăng xuất
- `GET /api/v1/auth/me` - Lấy thông tin user hiện tại

#### Master Data
- `GET /api/v1/master-data/products` - Danh sách sản phẩm
- `POST /api/v1/master-data/products` - Tạo sản phẩm mới
- `GET /api/v1/master-data/warehouses` - Danh sách kho
- `GET /api/v1/master-data/suppliers` - Danh sách nhà cung cấp
- `GET /api/v1/master-data/customers` - Danh sách khách hàng

#### Inbound
- `GET /api/v1/inbound/po` - Purchase Orders
- `GET /api/v1/inbound/asn` - Advanced Shipping Notice
- `GET /api/v1/inbound/receiving` - Receiving operations
- `GET /api/v1/inbound/qc` - Quality Control
- `GET /api/v1/inbound/putaway` - Putaway tasks

#### Inventory
- `GET /api/v1/inventory/stock` - Stock levels
- `GET /api/v1/inventory/transfer` - Stock transfers
- `GET /api/v1/inventory/adjustment` - Stock adjustments
- `GET /api/v1/inventory/cycle-count` - Cycle counting
- `GET /api/v1/inventory/replenishment` - Replenishment

#### Outbound
- `GET /api/v1/outbound/so` - Sales Orders
- `GET /api/v1/outbound/wave` - Wave management
- `GET /api/v1/outbound/pick` - Picking operations
- `GET /api/v1/outbound/pack` - Packing operations
- `GET /api/v1/outbound/shipping` - Shipping operations

#### Reporting
- `GET /api/v1/reports/inventory-report` - Inventory reports
- `GET /api/v1/reports/operations-report` - Operations reports
- `GET /api/v1/reports/kpi-report` - KPI reports
- `GET /api/v1/reports/dashboard` - Dashboard data

#### Administration
- `GET /api/v1/admin/users` - User management
- `GET /api/v1/admin/roles` - Role management
- `GET /api/v1/admin/permissions` - Permission management
- `GET /api/v1/admin/audit-logs` - Audit logs
- `GET /api/v1/admin/settings` - System settings

### API Documentation
Swagger UI available at: `http://localhost:3000/api-docs`

### Health Check
`GET /health` - Returns server health status

### Module Structure

Mỗi module tuân theo cấu trúc:
```
module-name/
├── module-name.routes.ts    # Main route file
├── routes/                  # Sub-routes
│   ├── entity1.routes.ts
│   └── entity2.routes.ts
├── controllers/             # Request handlers (to be implemented)
├── services/                # Business logic (to be implemented)
└── validators/              # Input validation (to be implemented)
```

### Middleware Stack

1. **helmet** - Security headers
2. **cors** - Cross-origin resource sharing
3. **compression** - Response compression
4. **express.json** - Body parsing
5. **rateLimiter** - Rate limiting
6. **requestLogger** - Request logging
7. **authMiddleware** - JWT authentication (protected routes)
8. **errorHandler** - Centralized error handling

### Authentication Flow

```
1. User → POST /api/v1/auth/login
2. Server validates credentials
3. Server generates JWT access token + refresh token
4. Client stores tokens
5. Client sends access token in Authorization header
6. Server validates token via authMiddleware
7. Request proceeds to route handler
```

### Error Handling

Sử dụng `AppError` class:
```typescript
throw new AppError('Resource not found', 404);
```

Errors được xử lý bởi `errorHandler` middleware và trả về:
```json
{
  "success": false,
  "message": "Error message",
  "stack": "..." // Only in development
}
```

### Logging

Winston logger với 3 levels:
- `logger.info()` - Informational messages
- `logger.warn()` - Warnings
- `logger.error()` - Errors

Logs được lưu tại:
- `logs/combined.log` - All logs
- `logs/error.log` - Errors only

### Caching Strategy

Redis được sử dụng cho:
- Session management
- Rate limiting
- Temporary data storage

Helper functions:
```typescript
cacheHelper.get(key)
cacheHelper.set(key, value, ttl)
cacheHelper.del(key)
cacheHelper.exists(key)
```

## 🔒 Security

### Implemented
- ✅ Helmet.js for security headers
- ✅ CORS protection
- ✅ Rate limiting
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation
- ✅ SQL injection prevention (Prisma)
- ✅ Audit logging

### To Implement
- ⏳ OAuth2 integration
- ⏳ Two-factor authentication (2FA)
- ⏳ API key management
- ⏳ CSRF protection
- ⏳ Content Security Policy

## 📝 Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Naming Conventions
- Files: `kebab-case.ts`
- Classes: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature

# Create Pull Request
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:coverage
```

## 📦 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables
Đảm bảo set đúng biến môi trường trong production:
- `NODE_ENV=production`
- `DATABASE_URL` - Production database
- `JWT_SECRET` - Strong secret key
- `REDIS_URL` - Production Redis

## 🔄 Database Migrations

### Create Migration
```bash
npx prisma migrate dev --name migration_name
```

### Apply Migrations (Production)
```bash
npx prisma migrate deploy
```

### Reset Database
```bash
npx prisma migrate reset
```

## 📊 Monitoring

### Recommended Tools
- **APM**: New Relic, DataDog
- **Logging**: ELK Stack, Splunk
- **Error Tracking**: Sentry
- **Uptime**: UptimeRobot, Pingdom

## 🚧 Current Implementation Status

### ✅ Completed
- Project structure
- Authentication & Authorization
- All route placeholders
- Middleware stack
- Error handling
- Logging system
- Database schema
- Prisma integration
- Redis integration
- Swagger documentation structure

### ⏳ To Implement
- Controller implementations
- Service layer
- Input validation schemas
- Unit tests
- Integration tests
- API documentation (Swagger annotations)
- File upload handling
- Email notifications
- Queue processing (Bull)
- Real-time features (Socket.io)

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
