// Column order and aliases follow the public JSON contract of the API.
const CATEGORY_COLUMNS = `
  id,
  title,
  image,
  created_at AS createdAt,
  updated_at AS updatedAt`;

export function createCategoriesRepository(db) {
  const findAllStatement = db.prepare(`SELECT ${CATEGORY_COLUMNS} FROM categories ORDER BY id`);
  const findByIdStatement = db.prepare(`SELECT ${CATEGORY_COLUMNS} FROM categories WHERE id = ?`);

  return {
    findAll: () => findAllStatement.all(),
    findById: (id) => findByIdStatement.get(id),
  };
}
