export function createProductsController(productsService) {
  return {
    list(req, res) {
      res.json(productsService.listProducts());
    },

    /** The contract returns a single product wrapped in an array: `[Product]`. */
    getById(req, res) {
      res.json([productsService.getProduct(req.valid.params.id)]);
    },
  };
}
