import { createSlice } from '@reduxjs/toolkit';
import { getEffectivePrice } from '../../utils/price';

const STORAGE_KEY = 'cart';
// The order API accepts at most 999 of one product.
export const MAX_QUANTITY = 999;

const emptyCart = () => ({ items: [], totalQuantity: 0, totalAmount: 0 });

const loadCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyCart();
    const cart = JSON.parse(saved);
    return {
      items: Array.isArray(cart.items) ? cart.items : [],
      totalQuantity: cart.totalQuantity || 0,
      totalAmount: cart.totalAmount || 0,
    };
  } catch {
    return emptyCart();
  }
};

const saveCart = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be full or disabled; the cart still works for this session.
  }
};

const recalc = (state) => {
  state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalAmount = state.items.reduce(
    (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
    0,
  );
  saveCart(state);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCart,
  reducers: {
    addItemToCart: {
      reducer(state, action) {
        const { product, quantity } = action.payload;
        const existing = state.items.find((item) => item.product.id === product.id);
        if (existing) {
          existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
        } else {
          state.items.push({ product, quantity: Math.min(quantity, MAX_QUANTITY) });
        }
        recalc(state);
      },
      prepare(product, quantity = 1) {
        return { payload: { product, quantity } };
      },
    },

    decreaseItemQuantity(state, action) {
      const existing = state.items.find((item) => item.product.id === action.payload);
      if (!existing) return;
      if (existing.quantity <= 1) {
        state.items = state.items.filter((item) => item.product.id !== action.payload);
      } else {
        existing.quantity -= 1;
      }
      recalc(state);
    },

    removeItemFromCart(state, action) {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
      recalc(state);
    },

    clearCart(state) {
      state.items = [];
      recalc(state);
    },
  },
});

export const { addItemToCart, decreaseItemQuantity, removeItemFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
