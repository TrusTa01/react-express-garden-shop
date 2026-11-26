import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getJson } from '../../config/api';

// The catalogue is small (tens of products), so the storefront loads it once
// and derives category, sale and product pages from the same list.
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await getJson('/products/all');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  { condition: (_, { getState }) => getState().products.status !== 'loading' },
);

const productsSlice = createSlice({
  name: 'products',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Could not load products';
      });
  },
});

export default productsSlice.reducer;
