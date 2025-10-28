# WMS Frontend - Web Application

## 🎨 Tổng Quan

Ứng dụng web quản lý kho hàng được xây dựng với React + TypeScript + Material-UI.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm start
```

Application will run at: `http://localhost:3001`

## 📁 Project Structure

```
src/
├── modules/              # Feature modules
│   ├── auth/            # Authentication
│   ├── master-data/     # Master data management
│   ├── inbound/         # Inbound operations
│   ├── inventory/       # Inventory management
│   ├── outbound/        # Outbound operations
│   ├── reporting/       # Reports & dashboards
│   └── admin/           # System administration
├── components/          # Shared components
│   ├── common/         # Common UI components
│   ├── layout/         # Layout components
│   └── forms/          # Form components
├── layouts/            # Page layouts
├── hooks/              # Custom React hooks
├── services/           # API services
│   ├── api/           # API client
│   └── socket/        # WebSocket client
├── store/             # Redux store
│   ├── slices/        # Redux slices
│   └── store.ts       # Store configuration
├── utils/             # Utility functions
├── constants/         # Constants & enums
├── types/             # TypeScript types
├── App.tsx            # Root component
└── index.tsx          # Entry point
```

## 🛠️ Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint errors
npm run format     # Format with Prettier
```

## 🎨 Features

### Dashboard
- Real-time metrics
- Charts & graphs
- Quick actions
- Recent activities

### Master Data
- Product management
- Warehouse & location management
- Supplier/Customer/Carrier management
- Configuration management

### Inbound Operations
- Purchase order management
- Receiving management
- QC inspection
- Putaway tasks

### Inventory Management
- Stock overview
- Transfers
- Adjustments
- Cycle count
- Kitting/Assembly

### Outbound Operations
- Sales order management
- Wave planning
- Picking tasks
- Packing
- Shipping

### Reporting
- Inventory reports
- Operations reports
- KPI dashboards
- Custom reports

### Administration
- User management
- Role & permission management
- System settings
- Audit logs
- Alerts & notifications

## 🔧 Configuration

### Environment Variables (.env)

```env
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_SOCKET_URL=http://localhost:3000
REACT_APP_ENV=development
REACT_APP_DEFAULT_LANGUAGE=en
REACT_APP_DEFAULT_CURRENCY=USD
```

## 📦 Dependencies

### Core
- React 18.2+
- TypeScript 5.3+
- Material-UI 5.15+

### State Management
- Redux Toolkit
- React Redux

### Routing
- React Router DOM v6

### Forms
- React Hook Form
- Yup validation

### Charts
- Recharts
- Chart.js

### HTTP Client
- Axios

### Real-time
- Socket.io Client

## 🎨 UI Components

### Material-UI Components
- Data Grid
- Date Pickers
- Dialogs
- Tooltips
- Tabs
- Cards
- Tables

### Custom Components
- DataTable with pagination
- SearchBar
- FileUpload
- BarcodeScanner
- ConfirmDialog
- LoadingSpinner
- ErrorBoundary

## 🔐 Authentication

- JWT-based authentication
- Token stored in localStorage
- Automatic token refresh
- Route guards
- Permission-based rendering

## 📱 Responsive Design

- Mobile-friendly
- Tablet optimized
- Desktop-first
- Flexible layouts

## 🌐 Internationalization

- Multi-language support (i18n)
- Language switcher
- RTL support ready

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🏗️ Build & Deployment

```bash
# Build for production
npm run build

# Preview build
npx serve -s build

# Build with custom env
REACT_APP_ENV=production npm run build
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Find and kill process on port 3001
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

### Dependencies issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 📚 Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

## 📄 License

MIT License
