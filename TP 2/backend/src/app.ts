import express from "express";
import ordersRouter from "./routes/orders";

export function makeApp() {
  const app = express();
  
  // Middleware para parsear JSON
  app.use(express.json());
  
  // Middleware para CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    
    next();
  });
  
  // Rutas
  app.use("/api/orders", ordersRouter);
  
  // Ruta de prueba para verificar que la API está funcionando
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "API funcionando correctamente" });
  });
  
  // Manejo de rutas no encontradas
  app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
  });
  
  return app;
}
