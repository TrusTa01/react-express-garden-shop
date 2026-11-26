export function createOrdersController(ordersService) {
  return {
    submitOrder(req, res) {
      res.json(ordersService.submitOrder(req.valid.body));
    },

    submitSaleRequest(req, res) {
      res.json(ordersService.submitSaleRequest(req.valid.body));
    },
  };
}
