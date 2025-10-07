import { pool } from "./connection";

const createOrdersTable = `
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  items JSONB NOT NULL,
  address TEXT NOT NULL,
  status TEXT DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

export async function initDatabase(): Promise<void> {
  console.log("🟡 Iniciando configuración de la base de datos...");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Crear tabla de órdenes
    await client.query(createOrdersTable);
    console.log("✅ Tabla 'orders' creada o verificada correctamente.");

    await client.query("COMMIT");
    console.log("🎉 Base de datos inicializada correctamente.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error durante la inicialización de la base de datos:", error);
  } finally {
    client.release();
  }
}

// Permite ejecutar el script directamente desde consola
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log("🚀 Script de inicialización completado.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error al ejecutar initDatabase:", err);
      process.exit(1);
    });
}
