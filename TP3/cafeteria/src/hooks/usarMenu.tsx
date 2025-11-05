import { useState, useEffect } from "react";
import type { Producto } from "../tipos/producto";

interface UseMenuResult {
  productos: Producto[];
  cargando: boolean;
  error: string | null;
}

export const useMenu = (): UseMenuResult => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerMenu = async () => {
      try {
        setCargando(true);
        setError(null);

        const respuesta = await fetch("/api/menu");

        if (!respuesta.ok) {
          switch (respuesta.status) {
            case 404:
              throw new Error("No encontrado");
            case 500:
              throw new Error("Error del servidor. Intente mas tarde.");
            default:
              throw new Error("Error al cargar el menu. Intente mas tarde.");
          }
        }

        const datos: Producto[] = await respuesta.json();
        setProductos(datos);
      } catch (err) {
        console.error("Error al obtener menu:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al cargar el menu. Intente mas tarde.");
        }
        setProductos([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerMenu();
  }, []);

  return { productos, cargando, error };
};
