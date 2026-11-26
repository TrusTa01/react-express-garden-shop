// Orders and coupon requests are accepted but not stored yet: the storefront only
// needs the acknowledgement. Persistence or notifications would plug in here.
const ACCEPTED = Object.freeze({ status: 'OK', message: 'request processed' });

export function createOrdersService() {
  return {
    submitOrder() {
      return { ...ACCEPTED };
    },

    submitSaleRequest() {
      return { ...ACCEPTED };
    },
  };
}
