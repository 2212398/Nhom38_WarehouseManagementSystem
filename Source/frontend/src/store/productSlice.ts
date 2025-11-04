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
        // Backend returns { data: [...], pagination: {...} }
        const response = action.payload as any;
        state.items = response.data || response.items || [];
        state.total = response.pagination?.total || response.total || 0;
        state.page = response.pagination?.page || response.page || 1;
        state.pageSize = response.pagination?.pageSize || response.pageSize || 10;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export default productSlice.reducer;
