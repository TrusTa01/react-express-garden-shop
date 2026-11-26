import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getJson } from '../../config/api';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await getJson('/categories/all');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  { condition: (_, { getState }) => getState().categories.status !== 'loading' },
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Could not load categories';
      });
  },
});

export default categoriesSlice.reducer;
