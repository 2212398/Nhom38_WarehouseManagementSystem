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
  Button,
  Stack,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { shippingService, Shipment } from '../services/shippingService';

export const ShippingPage: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [shipmentData, setShipmentData] = useState({
    orderNumber: '',
    customer: '',
    carrier: '',
    destination: '',
    weight: '',
  });
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchShipments();
    // eslint-disable-next-line
  }, [page, rowsPerPage]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await shippingService.getShipments(page + 1, rowsPerPage);
      setShipments(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setSaveError('');
    setSaveSuccess(false);
    setShipmentData({
      orderNumber: '',
      customer: '',
      carrier: '',
      destination: '',
      weight: '',
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipmentData({
      ...shipmentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateShipment = async () => {
    try {
      setSaveError('');
      // Mock API call - in real app, call backend API
      console.log('Creating shipment:', shipmentData);
      
      setSaveSuccess(true);
      setTimeout(() => {
        handleCloseDialog();
        fetchShipments();
      }, 1000);
    } catch (error: any) {
      setSaveError(error.response?.data?.message || 'Failed to create shipment');
    }
  };

  const handlePrintLabels = () => {
    alert('Print Labels feature: This will generate shipping labels for selected shipments');
  };

  const filteredShipments = shipments.filter((shipment) =>
    shipment.shipmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'in-transit':
        return 'info';
      case 'pending':
        return 'warning';
      case 'delayed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && shipments.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Shipping & Tracking
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<LocalShippingIcon />}
            onClick={handlePrintLabels}
          >
            Print Labels
          </Button>
          <Button variant="contained" onClick={handleOpenDialog}>
            Create Shipment
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by shipment number, tracking number, or customer..."
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
              <TableCell>Shipment #</TableCell>
              <TableCell>Order #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Carrier</TableCell>
              <TableCell>Tracking Number</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Ship Date</TableCell>
              <TableCell>Expected Delivery</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredShipments.map((shipment) => (
              <TableRow key={shipment.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {shipment.shipmentNumber}
                  </Typography>
                </TableCell>
                <TableCell>{shipment.orderNumber}</TableCell>
                <TableCell>{shipment.customer}</TableCell>
                <TableCell>
                  <Chip label={shipment.carrier} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {shipment.trackingNumber}
                  </Typography>
                </TableCell>
                <TableCell>{shipment.origin}</TableCell>
                <TableCell>{shipment.destination}</TableCell>
                <TableCell>{new Date(shipment.shipDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{new Date(shipment.expectedDelivery).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <Chip
                    label={shipment.status.toUpperCase()}
                    color={getStatusColor(shipment.status) as any}
                    size="small"
                  />
                </TableCell>
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

      {/* Create Shipment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Shipment</DialogTitle>
        <DialogContent>
          {saveError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {saveError}
            </Alert>
          )}
          {saveSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Shipment created successfully!
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Order Number *"
                name="orderNumber"
                value={shipmentData.orderNumber}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name *"
                name="customer"
                value={shipmentData.customer}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Carrier *"
                name="carrier"
                value={shipmentData.carrier}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="DHL">DHL Express</MenuItem>
                <MenuItem value="FedEx">FedEx</MenuItem>
                <MenuItem value="UPS">UPS</MenuItem>
                <MenuItem value="Vietnam Post">Vietnam Post</MenuItem>
                <MenuItem value="Viettel Post">Viettel Post</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Destination Address *"
                name="destination"
                value={shipmentData.destination}
                onChange={handleInputChange}
                multiline
                rows={2}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                value={shipmentData.weight}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleCreateShipment}
            variant="contained"
            disabled={!shipmentData.orderNumber || !shipmentData.customer || !shipmentData.carrier || !shipmentData.destination || saveSuccess}
          >
            Create Shipment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
