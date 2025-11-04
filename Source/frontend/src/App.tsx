
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './store';
import { MainLayout } from './components/layout/MainLayout';
import { PrivateRoute } from './components/common/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { InventoryPage } from './pages/InventoryPage';
import { OrdersPage } from './pages/OrdersPage';
import { ShippingPage } from './pages/ShippingPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <ProductsPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <InventoryPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <OrdersPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/shipping"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <ShippingPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <ReportsPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
