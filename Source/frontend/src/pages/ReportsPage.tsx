import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { dashboardService } from '../services/dashboardService';
import { DashboardStats } from '../types';

export const ReportsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (reportType: string) => {
    // Mock download functionality
    const data = {
      reportType,
      timeRange,
      generatedAt: new Date().toISOString(),
      data: reportType === 'inventory' ? inventoryMovementData : orderTrendData,
    };
    
    // Create a Blob and download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert(`Downloading ${reportType} report...`);
  };

  // Generate inventory movement data for chart
  const inventoryMovementData = [
    { month: 'Jan', inbound: 450, outbound: 380, net: 70 },
    { month: 'Feb', inbound: 520, outbound: 420, net: 100 },
    { month: 'Mar', inbound: 480, outbound: 510, net: -30 },
    { month: 'Apr', inbound: 600, outbound: 480, net: 120 },
    { month: 'May', inbound: 550, outbound: 570, net: -20 },
    { month: 'Jun', inbound: 680, outbound: 520, net: 160 },
  ];

  // Generate order trend data
  const orderTrendData = [
    { week: 'W1', orders: 45 },
    { week: 'W2', orders: 52 },
    { week: 'W3', orders: 48 },
    { week: 'W4', orders: 61 },
    { week: 'W5', orders: 55 },
    { week: 'W6', orders: 67 },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return <Alert severity="error">Failed to load reports data</Alert>;
  }

  const kpiCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Pending Shipments',
      value: stats.pendingShipments,
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      trend: '-5%',
      trendUp: false,
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      trend: '-15%',
      trendUp: false,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Reports & Analytics
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="quarter">Last Quarter</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpiCards.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ color: kpi.color }}>{kpi.icon}</Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {kpi.trendUp ? (
                      <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5 }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5 }} />
                    )}
                    <Typography
                      variant="body2"
                      sx={{ color: kpi.trendUp ? 'success.main' : 'error.main' }}
                    >
                      {kpi.trend}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {kpi.value.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {kpi.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Inventory Movement Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Inventory Movement (Last 6 Months)
              </Typography>
              <Button 
                size="small" 
                startIcon={<DownloadIcon />}
                onClick={() => handleDownloadReport('inventory')}
              >
                Download
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryMovementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inbound" fill="#2e7d32" name="Inbound" />
                <Bar dataKey="outbound" fill="#d32f2f" name="Outbound" />
                <Bar dataKey="net" fill="#1976d2" name="Net Change" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Order Trend Chart */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Order Trends (Last 6 Weeks)
              </Typography>
              <Button 
                size="small" 
                startIcon={<DownloadIcon />}
                onClick={() => handleDownloadReport('orders')}
              >
                Download
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#1976d2"
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Warehouse Utilization */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Warehouse Utilization
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                { name: 'Hanoi Main Warehouse', utilization: 85 },
                { name: 'HCMC Distribution Center', utilization: 72 },
                { name: 'Danang Regional Hub', utilization: 68 },
              ].map((warehouse, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{warehouse.name}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {warehouse.utilization}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${warehouse.utilization}%`,
                        height: '100%',
                        bgcolor:
                          warehouse.utilization > 80
                            ? 'error.main'
                            : warehouse.utilization > 60
                            ? 'warning.main'
                            : 'success.main',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Moving Products
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                { name: 'Product A', moves: 450 },
                { name: 'Product B', moves: 380 },
                { name: 'Product C', moves: 325 },
                { name: 'Product D', moves: 290 },
                { name: 'Product E', moves: 245 },
              ].map((product, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: index < 4 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2">{product.name}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {product.moves} moves
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
