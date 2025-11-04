# 🏭 Warehouse Management System (WMS)

> Hệ thống quản lý kho hiện đại với Node.js + TypeScript + PostgreSQL + Redis + Docker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

---

## 📋 Giới thiệu

Warehouse Management System (WMS) là hệ thống quản lý kho toàn diện, giúp tự động hóa và tối ưu hóa các quy trình:
- 📦 Nhập hàng (Inbound): PO, ASN, Receiving, Putaway, QC
- 📤 Xuất hàng (Outbound): SO, Picking, Packing, Shipping, Returns
- 📊 Quản lý tồn kho (Inventory): Stock, Adjustment, Transfer, Cycle Count
- 🏢 Dữ liệu chính (Master Data): Products, Locations, Warehouses, Suppliers, Customers
- 📈 Báo cáo (Reporting): Dashboard, KPI, Operations, Inventory Reports
- 👥 Quản trị (Admin): Users, Roles, Permissions, Audit Logs

---

## ✨ Tính năng chính

### 🎯 Core Features
- ✅ Multi-warehouse support
- ✅ Location-based inventory tracking
- ✅ Purchase Order & Sales Order management
- ✅ Real-time stock updates
- ✅ Barcode/QR scanning ready
- ✅ Quality Control (QC) workflow
- ✅ Wave picking optimization
- ✅ Return merchandise authorization (RMA)
- ✅ Cycle counting & inventory adjustment
- ✅ Inter-warehouse transfers

### 🔐 Security
- ✅ JWT authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Password encryption (bcrypt)
- ✅ Rate limiting & DDoS protection
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Audit logging

### ⚡ Performance
- ✅ Redis caching
- ✅ Database indexing
- ✅ Query optimization with Prisma
- ✅ Compression middleware
- ✅ Connection pooling
- ✅ Pagination support

### 🛠️ Developer Experience
- ✅ TypeScript for type safety
- ✅ Prisma ORM for database
- ✅ RESTful API design
- ✅ Swagger/OpenAPI documentation
- ✅ Docker containerization
- ✅ Environment-based configuration
- ✅ Structured logging (Winston)
- ✅ Hot-reload development

---

## 🏗️ Kiến trúc

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────────────┐
│              Nginx Reverse Proxy                         │
└──────────┬──────────────────────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────┐   ┌─────────────────────────────────┐
│Frontend│   │   Backend API (Express.js)       │
│ (SPA)  │   │   - TypeScript                   │
│        │   │   - RESTful API                  │
└────────┘   │   - Socket.IO (Real-time)        │
             └──────────┬──────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐  ┌──────────┐  ┌──────────┐
│  PostgreSQL  │  │  Redis   │  │  MinIO   │
│  (Database)  │  │ (Cache)  │  │ (S3-like)│
└──────────────┘  └──────────┘  └──────────┘
```

### Tech Stack

**Backend:**
- Node.js 18+ & TypeScript 5.3+
- Express.js (Web framework)
- Prisma (ORM)
- PostgreSQL (Database)
- Redis (Cache & Session)
- Socket.IO (Real-time)
- JWT (Authentication)
- Winston (Logging)
- Zod (Validation)

**Frontend:**
- React / Vue / Angular (TBD)
- Nginx (Web server)

**DevOps:**
- Docker & Docker Compose
- MinIO (Object storage)
- Nginx (Reverse proxy)

---

## 🚀 Quick Start

### Yêu cầu
- Node.js 18+
- Docker Desktop (khuyên dùng)
- PostgreSQL 14+ (nếu không dùng Docker)
- Redis 7+ (optional)

### Chạy với Docker (Khuyên dùng)

```powershell
# 1. Copy environment file
cd backend
Copy-Item .env.example .env

# 2. Chạy tất cả services
cd ..
docker-compose up --build

# 3. Truy cập
# Frontend: http://localhost:3001
# Backend: http://localhost:3000/api/v1
# API Docs: http://localhost:3000/api-docs
```

### Chạy local (Development)

```powershell
# 1. Backend setup
cd backend
Copy-Item .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 2. Chạy backend
npm run dev

# 3. Frontend setup (trong terminal khác)
cd ../frontend
npm install
npm run dev
```

**Chi tiết đầy đủ**: Xem file [SETUP_GUIDE.md](./SETUP_GUIDE.md)

**Quick start**: Xem file [QUICKSTART.md](./QUICKSTART.md)

---

## 📁 Cấu trúc thư mục

```
Source/
├── backend/                    # Backend API
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── src/
│   │   ├── server.ts          # Entry point
│   │   ├── config/            # Configurations
│   │   ├── modules/           # Business logic modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── inbound/       # Inbound operations
│   │   │   ├── outbound/      # Outbound operations
│   │   │   ├── inventory/     # Inventory management
│   │   │   ├── master-data/   # Master data
│   │   │   ├── reporting/     # Reports & analytics
│   │   │   └── admin/         # Admin functions
│   │   ├── routes/            # API routes
│   │   └── shared/            # Shared utilities
│   │       ├── database/      # Prisma client
│   │       ├── cache/         # Redis client
│   │       ├── middlewares/   # Express middlewares
│   │       └── utils/         # Helper functions
│   ├── logs/                  # Application logs
│   ├── uploads/               # File uploads
│   ├── .env.example           # Environment template
│   ├── Dockerfile             # Docker image
│   ├── package.json           # Dependencies
│   └── tsconfig.json          # TypeScript config
│
├── frontend/                   # Frontend application
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── nginx/                      # Nginx reverse proxy config
│   └── nginx.conf
│
├── docker-compose.yml          # Docker orchestration
├── SETUP_GUIDE.md             # Setup hướng dẫn chi tiết
├── QUICKSTART.md              # Quick start guide
├── OPTIMIZATION_GUIDE.md      # Tối ưu hướng dẫn
└── README.md                  # File này
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/login          # Login
POST   /api/v1/auth/register       # Register
POST   /api/v1/auth/refresh        # Refresh token
POST   /api/v1/auth/logout         # Logout
```

### Inbound
```
GET    /api/v1/inbound/po          # List purchase orders
POST   /api/v1/inbound/po          # Create PO
GET    /api/v1/inbound/po/:id      # Get PO details
PUT    /api/v1/inbound/po/:id      # Update PO
DELETE /api/v1/inbound/po/:id      # Delete PO

POST   /api/v1/inbound/receiving   # Receive goods
POST   /api/v1/inbound/putaway     # Putaway to locations
POST   /api/v1/inbound/qc          # Quality check
```

### Outbound
```
GET    /api/v1/outbound/so         # List sales orders
POST   /api/v1/outbound/so         # Create SO
POST   /api/v1/outbound/pick       # Create picking tasks
POST   /api/v1/outbound/pack       # Pack items
POST   /api/v1/outbound/shipping   # Ship orders
POST   /api/v1/outbound/returns    # Process returns
```

### Inventory
```
GET    /api/v1/inventory/stock                # View stock
POST   /api/v1/inventory/adjustment          # Adjust inventory
POST   /api/v1/inventory/transfer            # Transfer stock
POST   /api/v1/inventory/cycle-count         # Cycle counting
GET    /api/v1/inventory/stock/location/:id  # Stock by location
```

### Master Data
```
GET    /api/v1/master-data/products    # Products
GET    /api/v1/master-data/warehouses  # Warehouses
GET    /api/v1/master-data/locations   # Locations
GET    /api/v1/master-data/suppliers   # Suppliers
GET    /api/v1/master-data/customers   # Customers
GET    /api/v1/master-data/carriers    # Carriers
```

### Reporting
```
GET    /api/v1/reporting/dashboard           # Dashboard metrics
GET    /api/v1/reporting/inventory-report    # Inventory reports
GET    /api/v1/reporting/kpi-report          # KPI reports
GET    /api/v1/reporting/operations-report   # Operations reports
```

### Admin
```
GET    /api/v1/admin/users          # User management
GET    /api/v1/admin/roles          # Role management
GET    /api/v1/admin/permissions    # Permission management
GET    /api/v1/admin/audit-logs     # Audit logs
GET    /api/v1/admin/settings       # System settings
```

**Full API Documentation**: http://localhost:3000/api-docs

---

## 🗄️ Database Schema

### Core Tables

**Master Data:**
- `users`, `roles`, `permissions`, `role_permissions`, `user_roles`
- `warehouses`, `locations`, `zones`
- `products`, `product_variants`, `units_of_measure`
- `suppliers`, `customers`, `carriers`

**Inbound:**
- `purchase_orders`, `purchase_order_items`
- `advance_ship_notices`, `asn_items`
- `receiving_records`, `receiving_items`
- `putaway_tasks`, `qc_inspections`

**Outbound:**
- `sales_orders`, `sales_order_items`
- `picking_tasks`, `picking_items`
- `packing_records`, `packing_items`
- `shipments`, `shipment_items`
- `returns`, `return_items`
- `waves`

**Inventory:**
- `stocks`, `stock_movements`
- `adjustments`, `adjustment_items`
- `cycle_counts`, `cycle_count_items`
- `transfers`, `transfer_items`
- `replenishments`, `kitting`

**System:**
- `audit_logs`, `alerts`, `settings`
- `notifications`, `files`

---

## 🧪 Testing

```powershell
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 📊 Monitoring & Logs

### Logs
```powershell
# Xem logs (Docker)
docker-compose logs -f backend

# Xem log files (local)
tail -f backend/logs/app.log
tail -f backend/logs/error.log
```

### Health Check
```powershell
curl http://localhost:3000/health
```

### Prisma Studio (Database GUI)
```powershell
cd backend
npm run prisma:studio
# Open: http://localhost:5555
```

---

## 🔧 Configuration

### Environment Variables

Xem file `.env.example` để biết tất cả biến môi trường:

**Core:**
- `NODE_ENV` - Environment (development/production)
- `PORT` - API port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_HOST`, `REDIS_PORT` - Redis configuration

**Security:**
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Token expiration
- `CORS_ORIGIN` - Allowed origins

**Features:**
- `MAX_FILE_SIZE` - Upload size limit
- `DEFAULT_PAGE_SIZE` - Pagination size
- `LOW_STOCK_THRESHOLD` - Stock alert threshold

---

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Hướng dẫn cài đặt chi tiết
- [Quick Start](./QUICKSTART.md) - Bắt đầu nhanh
- [Optimization Guide](./OPTIMIZATION_GUIDE.md) - Tối ưu kích thước
- [API Docs](http://localhost:3000/api-docs) - Swagger/OpenAPI (khi chạy)
- [Defense Questions](../DEFENSE_QUESTIONS.md) - Câu hỏi vấn đáp

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Scripts

### Development
```powershell
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
```

### Database
```powershell
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed sample data
```

### Code Quality
```powershell
npm run lint             # Lint code
npm run lint:fix         # Fix lint issues
npm run format           # Format code
npm test                 # Run tests
```

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```powershell
# Đổi PORT trong .env
PORT=3001
```

**Database connection failed:**
```powershell
# Kiểm tra PostgreSQL đang chạy
docker ps | findstr postgres

# Kiểm tra DATABASE_URL trong .env
```

**Redis connection failed:**
```powershell
# Redis là optional - không ảnh hưởng hệ thống
# Hoặc kiểm tra Redis đang chạy
docker ps | findstr redis
```

**npm install errors:**
```powershell
# Xóa và cài lại
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

## 👥 Team

**Nhóm 38 - Warehouse Management System**

- [Danh sách thành viên]
- Giảng viên hướng dẫn: [Tên giảng viên]
- Môn học: [Tên môn học]
- Năm học: 2024-2025

---

## 🙏 Acknowledgments

- [Prisma](https://www.prisma.io/) - Amazing ORM
- [Express.js](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Docker](https://www.docker.com/) - Containerization

---

## 📞 Support

Nếu có vấn đề, tạo issue trên GitHub hoặc liên hệ:
- GitHub Issues: [Link to issues]
- Email: [team email]

---

**⭐ Nếu project hữu ích, hãy star repo này!**

**Made with ❤️ by Nhóm 38**
