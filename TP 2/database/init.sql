CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  items JSONB NOT NULL,
  direccion TEXT NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  precio NUMERIC(10,2) NOT NULL
);
