import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes';
import { initializeDatabase } from './config/database';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', orderRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Pizzería funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  
  // Inicializar la base de datos
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
});

export default app;