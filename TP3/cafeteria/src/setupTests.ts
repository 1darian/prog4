
import '@testing-library/jest-dom';
import { server } from './mocks/server'; // Asegúrate de crear y exportar 'server' aquí

//hooks de Vitest para gestionar MSW
beforeAll(() => server.listen()); // Iniciar el servidor de MSW antes de todas las pruebas
afterEach(() => server.resetHandlers()); // Resetear los handlers después de cada prueba
afterAll(() => server.close()); // Cerrar el servidor de MSW cuando todas las pruebas terminan