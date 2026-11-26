CREATE TABLE IF NOT EXISTS categories (
  id         INTEGER PRIMARY KEY,
  title      TEXT    NOT NULL,
  image      TEXT    NOT NULL,
  created_at TEXT    NOT NULL,
  updated_at TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id             INTEGER PRIMARY KEY,
  category_id    INTEGER NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
  title          TEXT    NOT NULL,
  price          REAL    NOT NULL CHECK (price >= 0),
  discount_price REAL    CHECK (discount_price IS NULL OR (discount_price >= 0 AND discount_price <= price)),
  description    TEXT    NOT NULL,
  image          TEXT    NOT NULL,
  created_at     TEXT    NOT NULL,
  updated_at     TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS products_category_id_idx ON products (category_id);
