// Column order and aliases follow the public JSON contract of the API.
// `discont_price` (sic) is the field name the storefront reads, so the alias keeps it.
const PRODUCT_COLUMNS = `
  id,
  title,
  price,
  discount_price AS discont_price,
  description,
  image,
  created_at AS createdAt,
  updated_at AS updatedAt,
  category_id AS categoryId`;

export function createProductsRepository(db) {
  const findAllStatement = db.prepare(`SELECT ${PRODUCT_COLUMNS} FROM products ORDER BY id`);
  const findByIdStatement = db.prepare(`SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = ?`);
  const findByCategoryStatement = db.prepare(
    `SELECT ${PRODUCT_COLUMNS} FROM products WHERE category_id = ? ORDER BY id`,
  );

  return {
    findAll: () => findAllStatement.all(),
    findById: (id) => findByIdStatement.get(id),
    findByCategoryId: (categoryId) => findByCategoryStatement.all(categoryId),
  };
}
