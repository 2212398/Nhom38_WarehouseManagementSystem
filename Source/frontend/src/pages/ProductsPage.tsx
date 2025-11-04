import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import { RootState, AppDispatch } from '../store';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { productService } from '../services/productService';

export const ProductsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    unit_price: '',
    unit_cost: '',
    weight: '',
  });
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(
      fetchProducts({
        pagination: { page: page + 1, pageSize: rowsPerPage },
        filters: { search },
      })
    );
  }, [dispatch, page, rowsPerPage, search]);

  const handleChangePage = (event: unknown, newPage: number) => {
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
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      sku: '',
      name: '',
      description: '',
      unit_price: '',
      unit_cost: '',
      weight: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProduct = async () => {
    try {
      setSaveError('');
      const productData = {
        ...formData,
        unit_price: parseFloat(formData.unit_price) || 0,
        unit_cost: parseFloat(formData.unit_cost) || 0,
        weight: parseFloat(formData.weight) || 0,
        is_active: true,
      };

      await productService.createProduct(productData);
      setSaveSuccess(true);
      setTimeout(() => {
        handleCloseDialog();
        dispatch(
          fetchProducts({
            pagination: { page: page + 1, pageSize: rowsPerPage },
            filters: { search },
          })
        );
      }, 1000);
    } catch (error: any) {
      setSaveError(error.response?.data?.message || 'Failed to create product');
    }
  };

  if (loading && items.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
          Add Product
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No products found. This is a demo - backend API endpoints need to be implemented.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">{product.quantity}</TableCell>
                  <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.status}
                      color={product.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small">Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
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

      {/* Add Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          {saveError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {saveError}
            </Alert>
          )}
          {saveSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Product created successfully!
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SKU *"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Unit Price"
                name="unit_price"
                type="number"
                value={formData.unit_price}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Unit Cost"
                name="unit_cost"
                type="number"
                value={formData.unit_cost}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveProduct} 
            variant="contained"
            disabled={!formData.sku || !formData.name || saveSuccess}
          >
            Save Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
