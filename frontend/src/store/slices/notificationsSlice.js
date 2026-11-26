import { createSlice, nanoid } from '@reduxjs/toolkit';

const MAX_VISIBLE = 3;

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: [] },
  reducers: {
    notify: {
      reducer(state, action) {
        state.items.push(action.payload);
        if (state.items.length > MAX_VISIBLE) state.items.shift();
      },
      prepare(message, type = 'success') {
        return { payload: { id: nanoid(), message, type } };
      },
    },
    dismissNotification(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { notify, dismissNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
