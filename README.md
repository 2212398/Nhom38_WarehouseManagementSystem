# Hệ Thống Quản Lý Kho Hàng (WMS - Warehouse Management System)

## 🎯 Tổng quan

Hệ thống quản lý kho hàng chuyên nghiệp với đầy đủ các tính năng từ nhập kho, lưu kho, xuất kho đến báo cáo và tích hợp thiết bị.

## � Cấu trúc Thư mục Project

```
Nhom38_HeThongQuanLyKhoHang/
├── Source/                    # 📦 MÃ NGUỒN CHƯƠNG TRÌNH
│   ├── backend/              #    Backend API (Node.js + TypeScript)
│   │   ├── src/              #    - Source code
│   │   │   ├── modules/      #    - Business modules
│   │   │   ├── shared/       #    - Shared utilities
│   │   │   └── server.ts     #    - Entry point
│   │   ├── prisma/           #    - Prisma ORM schema
│   │   ├── dist/             #    - Compiled JavaScript
│   │   └── package.json      #    - Dependencies
│   │
│   └── frontend/             #    Frontend (Coming soon)
│       └── README.md
│
├── Database/                  # 🗄️ DỮ LIỆU VÀ SCRIPTS
│   ├── Schema/               #    - Database schema files
│   │   ├── schema.prisma     #    - Prisma schema
│   │   └── *.sql             #    - SQL schema scripts
│   ├── Seeds/                #    - Seed data scripts
│   │   ├── 01_seed_users_roles.sql
│   │   └── 02_seed_master_data.sql
│   ├── Migrations/           #    - Migration history
│   └── Backup/               #    - Database backups
│
└── [Documentation Files]      # 📚 TÀI LIỆU
    ├── README.md             #    - File này
    ├── ARCHITECTURE.md       #    - Kiến trúc hệ thống
    ├── DATABASE_SCHEMA.md    #    - Chi tiết database
    ├── INSTALLATION.md       #    - Hướng dẫn cài đặt
    ├── PROJECT_SUMMARY.md    #    - Tóm tắt project
    └── CHANGELOG.md          #    - Lịch sử thay đổi
```

**Chi tiết thư mục:**

- **Source/**: Chứa toàn bộ mã nguồn chương trình
  - `backend/`: API server (Express + TypeScript + Prisma)
  - `frontend/`: Web UI (sẽ được phát triển)
  
- **Database/**: Chứa mọi thứ liên quan đến database
  - `Schema/`: Định nghĩa cấu trúc bảng
  - `Seeds/`: Dữ liệu mẫu khởi tạo
  - `Migrations/`: Lịch sử thay đổi schema
  - `Backup/`: Scripts và file backup

## �📋 Mục lục

- [Cấu trúc Thư mục](#cấu-trúc-thư-mục-project)
- [Sơ đồ Module](#sơ-đồ-module)
- [Kiến trúc Hệ thống](#kiến-trúc-hệ-thống)
- [Công nghệ Sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt](#cài-đặt)
- [API Documentation](#api-documentation)

## 🗺️ Sơ đồ Module

```
┌─────────────────────────────────────────────────────────────┐
│                    WMS - WAREHOUSE MANAGEMENT SYSTEM         │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌─────▼─────┐        ┌─────▼─────┐
   │  WEB    │          │  MOBILE   │        │   API     │
   │ PORTAL  │          │    APP    │        │  SERVICE  │
   └────┬────┘          └─────┬─────┘        └─────┬─────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
┌───────▼────────┐                         ┌────────▼───────┐
│   DATABASE     │                         │  INTEGRATION   │
│  PostgreSQL    │                         │  Layer (API)   │
└────────────────┘                         └────────────────┘
        │                                           │
        │                                           │
┌───────▼────────────────────────────────┐         │
│  EXTERNAL SYSTEMS                      │◄────────┘
│  - ERP Systems                         │
│  - eCommerce Platforms                 │
│  - 3PL Partners                        │
│  - Barcode/RFID Devices               │
│  - Label Printers (ZPL/PDF)           │
└────────────────────────────────────────┘
```

## 🏗️ Kiến trúc Module Chi tiết

### A. DANH MỤC (MASTER DATA)
```
Master Data Module
├── Products (Sản phẩm)
│   ├── SKU Management
│   ├── UoM (Unit of Measure) & Conversion
│   ├── Dimensions & Weight
│   ├── Product Images
│   └── HS Code
├── Warehouse & Location
│   ├── Warehouse Management
│   ├── Location Hierarchy (Zone → Aisle → Rack → Bin)
│   ├── Location Types (Normal/Cold/Hazardous)
│   └── Capacity Management
├── Business Partners
│   ├── Suppliers
│   ├── Customers
│   └── Carriers
├── Configuration Rules
│   ├── Stock Strategy (FIFO/FEFO/LIFO)
│   ├── ABC Analysis
│   └── Min-Max Levels
└── Barcode & Labels
    ├── Barcode Standards (EAN-13/Code128/QR)
    └── Label Templates
```

### B. NHẬP KHO (INBOUND)
```
Inbound Module
├── Purchase Orders (PO)
│   └── Advanced Shipping Notice (ASN)
├── Receiving
│   ├── Barcode Scanning
│   ├── Count Verification
│   └── Overage/Shortage/Damage Recording
├── Quality Control (QC)
│   ├── Inspection
│   └── Quarantine Management
└── Putaway
    ├── Auto Location Suggestion
    ├── Rule-based Assignment
    └── Zone/Capacity Optimization
```

### C. LƯU KHO & TỒN (INVENTORY)
```
Inventory Module
├── Stock Management
│   ├── Multi-level Tracking (Warehouse/Location/Lot/Serial/Expiry)
│   └── Real-time Inventory
├── Internal Transfers
│   ├── Bin-to-Bin Transfer
│   └── Warehouse-to-Warehouse Transfer
├── Stock Adjustment
├── Replenishment
│   ├── Bulk to Pick-face
│   └── Reorder Point
├── Cycle Count
│   ├── Periodic Counting
│   └── Location Locking
└── Kitting/Assembly
    └── Simple BOM
```

### D. XUẤT KHO (OUTBOUND)
```
Outbound Module
├── Sales Orders (SO) / Delivery Orders (DO)
├── Wave Management
│   ├── Wave Planning
│   ├── Batch Picking
│   └── Zone Picking
├── Picking
│   ├── FEFO/FIFO Strategy
│   ├── Lot/Serial Tracking
│   └── Pick Task Assignment
├── Packing
│   ├── Package Creation
│   ├── Label Printing
│   └── Split/Consolidation
├── Shipping
│   ├── Shipping Documents
│   ├── Carrier Assignment
│   ├── CoD (Cash on Delivery)
│   └── Proof of Delivery
└── Returns (RMA)
    ├── Return Authorization
    └── QC & Re-stocking
```

### E. TÍCH HỢP & THIẾT BỊ (INTEGRATION)
```
Integration Module
├── Mobile Applications
│   ├── Android App
│   ├── iOS App
│   └── Features:
│       ├── Receiving
│       ├── Putaway
│       ├── Picking
│       └── Packing
├── Hardware Integration
│   ├── Barcode Scanners
│   ├── RFID Readers
│   ├── Electronic Scales
│   └── Label Printers (ZPL/PDF)
└── External Systems
    ├── REST API
    ├── EDI (EDIFACT)
    └── CSV Import/Export
    └── Integrations:
        ├── ERP Systems
        ├── eCommerce Platforms
        └── 3PL Partners
```

### F. BÁO CÁO & KPI (REPORTING)
```
Reporting Module
├── Inventory Reports
│   ├── Real-time Stock
│   ├── Stock Aging
│   ├── Inventory Turnover
│   └── Slow-moving/Obsolete Stock
├── Performance KPIs
│   ├── OTIF (On-Time In-Full)
│   ├── Pick Accuracy
│   ├── Pick Rate
│   └── Inbound/Outbound Lead Time
├── Quality Reports
│   ├── Cycle Count Variance
│   └── QC Error Statistics
└── Dashboards
    ├── Executive Dashboard
    ├── Operations Dashboard
    └── Analytics Dashboard
```

### G. QUẢN TRỊ HỆ THỐNG (ADMINISTRATION)
```
Administration Module
├── User Management
│   ├── User Accounts
│   ├── Roles & Permissions
│   └── Menu & Action Authorization
├── Audit & Compliance
│   ├── Audit Trail
│   ├── Document Versioning
│   └── Period Locking
├── System Configuration
│   ├── Multi-language Support
│   ├── Multi-currency
│   ├── Timezone Settings
│   ├── Backup & Restore
│   └── SSO/OAuth2
└── Alerts & SLA
    ├── Expiry Alerts
    ├── Capacity Warnings
    ├── Stock-out Alerts
    └── SLA Monitoring
```

## 🎨 Menu Structure (Full)

```
┌─ DASHBOARD
│
├─ MASTER DATA
│  ├─ Products
│  │  ├─ Product List
│  │  ├─ Add/Edit Product
│  │  ├─ UoM Management
│  │  ├─ Product Categories
│  │  └─ Barcode Configuration
│  ├─ Warehouse
│  │  ├─ Warehouse List
│  │  ├─ Location Map
│  │  ├─ Zone Management
│  │  ├─ Aisle Management
│  │  ├─ Rack Management
│  │  └─ Bin Management
│  ├─ Business Partners
│  │  ├─ Suppliers
│  │  ├─ Customers
│  │  └─ Carriers
│  └─ Configuration
│     ├─ Stock Rules (FIFO/FEFO/LIFO)
│     ├─ ABC Analysis
│     ├─ Min-Max Levels
│     └─ Label Templates
│
├─ INBOUND
│  ├─ Purchase Orders
│  │  ├─ PO List
│  │  ├─ Create PO
│  │  └─ ASN Management
│  ├─ Receiving
│  │  ├─ Receive Shipment
│  │  ├─ Receiving History
│  │  └─ Discrepancy Report
│  ├─ Quality Control
│  │  ├─ QC Queue
│  │  ├─ Inspection
│  │  └─ Quarantine Management
│  └─ Putaway
│     ├─ Putaway Tasks
│     ├─ Location Suggestion
│     └─ Putaway History
│
├─ INVENTORY
│  ├─ Stock Overview
│  │  ├─ Current Stock
│  │  ├─ Stock by Location
│  │  ├─ Stock by Lot
│  │  └─ Stock by Serial
│  ├─ Transfers
│  │  ├─ Bin-to-Bin Transfer
│  │  ├─ Warehouse Transfer
│  │  └─ Transfer History
│  ├─ Adjustments
│  │  ├─ Stock Adjustment
│  │  └─ Adjustment History
│  ├─ Replenishment
│  │  ├─ Replenishment Tasks
│  │  ├─ Reorder Point
│  │  └─ Auto-replenishment
│  ├─ Cycle Count
│  │  ├─ Count Schedule
│  │  ├─ Counting Tasks
│  │  └─ Variance Report
│  └─ Kitting
│     ├─ BOM Management
│     └─ Assembly Orders
│
├─ OUTBOUND
│  ├─ Sales Orders
│  │  ├─ SO List
│  │  ├─ Create SO/DO
│  │  └─ Order Status
│  ├─ Wave Management
│  │  ├─ Create Wave
│  │  ├─ Wave Planning
│  │  └─ Wave History
│  ├─ Picking
│  │  ├─ Pick Tasks
│  │  ├─ Batch Picking
│  │  ├─ Zone Picking
│  │  └─ Pick History
│  ├─ Packing
│  │  ├─ Pack Tasks
│  │  ├─ Package Management
│  │  └─ Label Printing
│  ├─ Shipping
│  │  ├─ Ship Orders
│  │  ├─ Shipping Documents
│  │  ├─ Carrier Assignment
│  │  └─ Proof of Delivery
│  └─ Returns
│     ├─ RMA List
│     ├─ Create Return
│     ├─ Return QC
│     └─ Re-stocking
│
├─ REPORTS & ANALYTICS
│  ├─ Inventory Reports
│  │  ├─ Stock Report
│  │  ├─ Stock Aging
│  │  ├─ Turnover Analysis
│  │  ├─ Slow-moving Stock
│  │  └─ ABC Analysis
│  ├─ Operations Reports
│  │  ├─ Inbound Performance
│  │  ├─ Outbound Performance
│  │  ├─ OTIF Report
│  │  ├─ Pick Accuracy
│  │  └─ Lead Time Analysis
│  ├─ Quality Reports
│  │  ├─ QC Statistics
│  │  └─ Cycle Count Variance
│  └─ Dashboards
│     ├─ Executive Dashboard
│     ├─ Operations Dashboard
│     └─ Custom Reports
│
├─ INTEGRATION
│  ├─ API Management
│  │  ├─ API Keys
│  │  ├─ Webhooks
│  │  └─ API Logs
│  ├─ EDI Configuration
│  ├─ Import/Export
│  │  ├─ Data Import
│  │  └─ Data Export
│  └─ Device Management
│     ├─ Barcode Scanners
│     ├─ RFID Readers
│     ├─ Scales
│     └─ Printers
│
└─ ADMINISTRATION
   ├─ User Management
   │  ├─ Users
   │  ├─ Roles
   │  └─ Permissions
   ├─ System Settings
   │  ├─ General Settings
   │  ├─ Localization
   │  ├─ Currency
   │  └─ Timezone
   ├─ Security
   │  ├─ Audit Trail
   │  ├─ Login History
   │  └─ SSO/OAuth2
   ├─ Alerts & Notifications
   │  ├─ Alert Rules
   │  ├─ Notification Templates
   │  └─ SLA Configuration
   └─ System Maintenance
      ├─ Backup & Restore
      ├─ Database Maintenance
      └─ Period Closing
```

## 🛠️ Công nghệ Sử dụng

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **ORM**: Prisma / TypeORM
- **Authentication**: JWT + OAuth2
- **Real-time**: Socket.io
- **Queue**: Bull (Redis-based)
- **File Storage**: AWS S3 / MinIO
- **API Documentation**: Swagger/OpenAPI

### Frontend Web
- **Framework**: React 18+
- **Language**: TypeScript
- **UI Library**: Material-UI / Ant Design
- **State Management**: Redux Toolkit / Zustand
- **Charts**: Recharts / Chart.js
- **Forms**: React Hook Form + Yup
- **HTTP Client**: Axios

### Mobile
- **Framework**: React Native
- **Navigation**: React Navigation
- **Barcode**: react-native-camera / Vision Camera
- **State**: Redux Toolkit

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose / Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana

## 📦 Cấu trúc Dự án

```
Nhom38_HeThongQuanLyKhoHang/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── master-data/
│   │   │   ├── inbound/
│   │   │   ├── inventory/
│   │   │   ├── outbound/
│   │   │   ├── reporting/
│   │   │   └── admin/
│   │   ├── shared/
│   │   ├── config/
│   │   └── app.ts
│   ├── prisma/
│   └── package.json
├── frontend/                   # Web Application
│   ├── src/
│   │   ├── modules/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
├── mobile/                     # Mobile App
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   └── App.tsx
│   └── package.json
├── docs/                       # Documentation
│   ├── api/
│   ├── architecture/
│   └── user-guide/
├── docker/                     # Docker configs
└── docker-compose.yml
```

## 🚀 Cài đặt

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker (optional)

### 1. Database Setup
```bash
# Tạo database
cd Database/Schema
psql -U postgres -f 01_create_database.sql

# Import seed data
cd ../Seeds
psql -U postgres -d wms_db -f 01_seed_users_roles.sql
psql -U postgres -d wms_db -f 02_seed_master_data.sql
```

### 2. Backend Setup
```bash
cd Source/backend
npm install

# Cấu hình môi trường
cp .env.example .env
# Chỉnh sửa .env với thông tin database của bạn

# Chạy Prisma migrations
npm run prisma:migrate

# Khởi động development server
npm run dev
```

### 3. Frontend Setup (Coming soon)
```bash
cd Source/frontend
npm install
cp .env.example .env
npm start
```

### 4. Docker Setup (Alternative)
```bash
# Từ thư mục Source
cd Source
docker-compose up -d
```

**Tài khoản mẫu (All passwords: `Pass@123`):**

| Role | Email | Tên | Chức năng |
|------|-------|-----|-----------|
| **SUPER_ADMIN** | `admin@email.com` | System Administrator | Toàn quyền hệ thống |
| **WAREHOUSE_MANAGER** | `manager.hcm@email.com` | Nguyen Van Minh | Quản lý kho HCM |
| **WAREHOUSE_MANAGER** | `manager.hn@email.com` | Tran Thi Lan | Quản lý kho Hanoi |
| **WAREHOUSE_STAFF** | `staff.receiving@email.com` | Le Van Hung | Nhân viên nhập kho |
| **WAREHOUSE_STAFF** | `staff.picking@email.com` | Pham Thi Hoa | Nhân viên picking |
| **WAREHOUSE_STAFF** | `staff.packing@email.com` | Hoang Van Nam | Nhân viên đóng gói |
| **ACCOUNTANT** | `accountant@email.com` | Vo Thi Mai | Kế toán |
| **VIEWER** | `viewer@email.com` | Dang Van Khanh | Chỉ xem báo cáo |

⚠️ **Lưu ý:** Đổi mật khẩu sau lần đăng nhập đầu tiên!

## 📖 API Documentation

API documentation is available at: `http://localhost:3000/api-docs`

## 📊 Database Schema

Xem chi tiết tại: [Database Schema](./docs/database-schema.md)

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- API rate limiting
- Data encryption at rest and in transit
- Audit logging

## 📝 License

MIT License

## 👥 Team

Nhóm 38 - Hệ Thống Quản Lý Kho Hàng

---

**Version**: 1.0.0  
**Last Updated**: October 2025
