import { pool } from "./connection";

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Conexión exitosa:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Error al conectar:", (err as Error).message);
  } finally {
    await pool.end();
  }
})();
