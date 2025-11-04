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
import { inventoryService, InventoryItem } from '../services/inventoryService';

export const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentData, setAdjustmentData] = useState({
    quantity: '',
    type: 'add',
    reason: '',
  });
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line
  }, [page, rowsPerPage, search]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getInventory(page + 1, rowsPerPage, search);
      setInventory(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleOpenAdjustDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setOpenDialog(true);
    setSaveError('');
    setSaveSuccess(false);
    setAdjustmentData({
      quantity: '',
      type: 'add',
      reason: '',
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdjustmentData({
      ...adjustmentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveAdjustment = async () => {
    try {
      setSaveError('');
      
      // Calculate new quantity
      const currentQty = selectedItem?.quantity_on_hand || 0;
      const adjustQty = parseInt(adjustmentData.quantity) || 0;
      const newQty = adjustmentData.type === 'add' ? currentQty + adjustQty : currentQty - adjustQty;
      
      // Mock API call - in real app, call backend API
      console.log('Adjusting inventory:', {
        itemId: selectedItem?.id,
        product: selectedItem?.product_name,
        oldQuantity: currentQty,
        adjustment: adjustQty,
        type: adjustmentData.type,
        newQuantity: newQty,
        reason: adjustmentData.reason,
      });
      
      alert(`✅ Inventory Adjusted Successfully!\n\nProduct: ${selectedItem?.product_name}\nOld Quantity: ${currentQty}\nAdjustment: ${adjustmentData.type === 'add' ? '+' : '-'}${adjustQty}\nNew Quantity: ${newQty}\nReason: ${adjustmentData.reason || 'N/A'}\n\n(Note: This is a demo - changes are not persisted to database)`);
      
      setSaveSuccess(true);
      setTimeout(() => {
        handleCloseDialog();
        fetchInventory();
      }, 500);
    } catch (error: any) {
      setSaveError(error.response?.data?.message || 'Failed to adjust inventory');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'success';
      case 'low-stock':
        return 'warning';
      case 'out-of-stock':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && inventory.length === 0) {
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
          Inventory Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => alert('Cycle Count feature coming soon')}>
            Cycle Count
          </Button>
          <Button variant="outlined" onClick={() => alert('Transfer Stock feature coming soon')}>
            Transfer Stock
          </Button>
          <Button 
            variant="contained" 
            onClick={() => inventory.length > 0 && handleOpenAdjustDialog(inventory[0])}
          >
            Adjust Inventory
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by product name, SKU, or location..."
          value={search}
          onChange={handleSearchChange}
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
              <TableCell>SKU</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">On Hand</TableCell>
              <TableCell align="right">Reserved</TableCell>
              <TableCell align="right">Available</TableCell>
              <TableCell align="right">Reorder Point</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {item.sku}
                  </Typography>
                </TableCell>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.warehouse}</TableCell>
                <TableCell>
                  <Chip label={item.location} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">{item.quantityOnHand}</TableCell>
                <TableCell align="right">{item.quantityReserved}</TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    color={item.quantityAvailable <= item.reorderPoint ? 'error' : 'inherit'}
                  >
                    {item.quantityAvailable}
                  </Typography>
                </TableCell>
                <TableCell align="right">{item.reorderPoint}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status.toUpperCase()}
                    color={getStatusColor(item.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenAdjustDialog(item)}
                  >
                    Adjust
                  </Button>
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

      {/* Adjust Inventory Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Adjust Inventory - {selectedItem?.productName}</DialogTitle>
        <DialogContent>
          {saveError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {saveError}
            </Alert>
          )}
          {saveSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Inventory adjusted successfully!
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Current Quantity: {selectedItem?.quantityOnHand || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SKU: {selectedItem?.sku}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {selectedItem?.location}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Adjustment Type"
                name="type"
                value={adjustmentData.type}
                onChange={handleInputChange}
              >
                <MenuItem value="add">Add Stock</MenuItem>
                <MenuItem value="remove">Remove Stock</MenuItem>
                <MenuItem value="set">Set Quantity</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={adjustmentData.quantity}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                name="reason"
                value={adjustmentData.reason}
                onChange={handleInputChange}
                multiline
                rows={3}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveAdjustment}
            variant="contained"
            disabled={!adjustmentData.quantity || !adjustmentData.reason || saveSuccess}
          >
            Save Adjustment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
