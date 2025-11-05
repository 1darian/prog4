import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./mocks/server";

// Hooks de Vitest para gestionar MSW
beforeAll(() => server.listen()); // Iniciar el servidor de MSW antes de todas las pruebas
afterEach(() => server.resetHandlers()); // Resetear los handlers después de cada prueba
afterAll(() => server.close()); // Cerrar el servidor de MSW cuando todas las pruebas terminan
