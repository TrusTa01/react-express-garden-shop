export function createCategoriesController(categoriesService) {
  return {
    list(req, res) {
      res.json(categoriesService.listCategories());
    },

    /** Responds with `{ category, data: Product[] }`. */
    getWithProducts(req, res) {
      res.json(categoriesService.getCategoryWithProducts(req.valid.params.id));
    },
  };
}
