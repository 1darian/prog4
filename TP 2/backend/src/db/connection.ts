import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config(); // Carga variables desde .env

// Configuración de la conexión
export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "pizzeria_user",
  password: process.env.DB_PASSWORD || "pizzeria_pass",
  database: process.env.DB_NAME || "pizzeria",
});

// Test opcional al iniciar
pool.connect()
  .then(client => {
    return client
      .query("SELECT NOW()")
      .then(res => {
        console.log("🟢 Conectado a PostgreSQL:", res.rows[0].now);
        client.release();
      })
      .catch(err => {
        client.release();
        console.error("🔴 Error al probar conexión con PostgreSQL:", err.message);
      });
  })
  .catch(err => console.error("❌ Error al conectar con PostgreSQL:", err.message));
