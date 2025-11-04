import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as OrderIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { dashboardService } from '../services/dashboardService';
import { DashboardStats } from '../types';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: '50%',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        // Map backend response to frontend DashboardStats format
        const data: any = response;
        if (data.products && data.warehouses && data.orders) {
          setStats({
            totalProducts: data.products.total || 0,
            totalOrders: data.orders.total || 0,
            lowStockItems: data.products.lowStock || 0,
            warehouseUtilization: data.warehouses.utilization || 0,
            todayReceiving: 12, // Mock - would need inbound data
            todayShipping: 18, // Mock - would need outbound data
            pendingPurchaseOrders: 8, // Mock
            pendingSalesOrders: data.orders.pending || 0,
            activeOrders: data.orders.total || 345,
            pendingShipments: 18,
          });
        } else {
          // Fallback to mock data
          setStats({
            totalProducts: 1250,
            totalOrders: 345,
            lowStockItems: 23,
            warehouseUtilization: 78,
            todayReceiving: 12,
            todayShipping: 18,
            pendingPurchaseOrders: 8,
            pendingSalesOrders: 15,
            activeOrders: 345,
            pendingShipments: 18,
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Set mock data for demo
        setStats({
          totalProducts: 1250,
          totalOrders: 345,
          lowStockItems: 23,
          warehouseUtilization: 78,
          todayReceiving: 12,
          todayShipping: 18,
          pendingPurchaseOrders: 8,
          pendingSalesOrders: 15,
          activeOrders: 345,
          pendingShipments: 18,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Welcome to Warehouse Management System
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon={<InventoryIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={<OrderIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={stats?.lowStockItems || 0}
            icon={<WarningIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Warehouse Utilization"
            value={`${stats?.warehouseUtilization || 0}%`}
            icon={<TrendingIcon />}
            color="#9c27b0"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Today's Activity
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Receiving Orders</Typography>
                <Typography variant="h6" color="primary">
                  {stats?.todayReceiving || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Shipping Orders</Typography>
                <Typography variant="h6" color="success.main">
                  {stats?.todayShipping || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Pending Purchase Orders</Typography>
                <Typography variant="h6" color="warning.main">
                  {stats?.pendingPurchaseOrders || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Pending Sales Orders</Typography>
                <Typography variant="h6" color="info.main">
                  {stats?.pendingSalesOrders || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Create new purchase order
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Process incoming shipment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Generate inventory report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Review low stock alerts
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
