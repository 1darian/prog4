import { useState, useEffect } from 'react';
import { Producto } from '../tipos/producto'; 

interface UseMenuResult {
    productos: Producto[];
    cargando: boolean;
    error: string | null;
}

export const usarMenu = (): UseMenuResult => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const obtenerMenu = async () => {
            try {
                const respuesta = await fetch('/api/menu');
                
                if (!respuesta.ok) {
                    throw new Error('No se pudo obtener el menú.');
                }
                
                const datos: Producto[] = await respuesta.json();
                setProductos(datos);
            } catch (err) {
                // Capturamos el error de la red o de parseo
                setError('Error al cargar el menú. Intente más tarde.');
            } finally {
                setCargando(false);
            }
        };

        obtenerMenu();
    }, []);

    return { productos, cargando, error };
};