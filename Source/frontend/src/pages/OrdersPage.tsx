import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { orderService, Order } from '../services/orderService';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [tabValue, page, rowsPerPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const type = tabValue === 0 ? undefined : tabValue === 1 ? 'outbound' : 'inbound';
      const response = await orderService.getOrders(page + 1, rowsPerPage, type);
      setOrders(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
  };

  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.customer && order.customer.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (order.supplier && order.supplier.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
      case 'confirmed':
        return 'info';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading && orders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Orders Management
      </Typography>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All Orders" />
          <Tab label="Outbound (Sales)" />
          <Tab label="Inbound (Purchase)" />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by order number, customer, or supplier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Customer/Supplier</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Expected Date</TableCell>
              <TableCell align="right">Items</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Warehouse</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {order.orderNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.type === 'outbound' ? 'SALES' : 'PURCHASE'}
                    color={order.type === 'outbound' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{order.customer || order.supplier || 'N/A'}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{new Date(order.expectedDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell align="right">{order.totalItems}</TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(order.totalAmount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status.toUpperCase()}
                    color={getStatusColor(order.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{order.warehouse}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};
