import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product, PaginatedResponse, PaginationParams, TableFilters } from '../types';
import { productService } from '../services/productService';

interface ProductState {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ pagination, filters }: { pagination: PaginationParams; filters?: TableFilters }) => {
    const response = await productService.getProducts(pagination, filters);
    return response;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export default productSlice.reducer;
