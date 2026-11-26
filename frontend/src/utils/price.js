const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** Single price format for the whole app: 12.1 -> "$12.10". */
export const formatPrice = (value) => formatter.format(Number(value) || 0);

/** A product is on sale when it has a positive discount price lower than the price. */
export const isOnSale = (product) =>
  product?.discont_price != null && product.discont_price > 0 && product.discont_price < product.price;

/** The price the customer actually pays. */
export const getEffectivePrice = (product) => (isOnSale(product) ? product.discont_price : product.price);

/** Discount in whole percent, or 0. */
export const getDiscountPercent = (product) =>
  isOnSale(product) ? Math.round(((product.price - product.discont_price) / product.price) * 100) : 0;
