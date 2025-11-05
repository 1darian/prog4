
import React, { useState, useEffect } from 'react';
import { Producto } from '../../tipos/producto'; 

export const Menu: React.FC = () => {

    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerMenu = async () => {
            try {
                const respuesta = await fetch('/api/menu'); 
                
                if (!respuesta.ok) {
                    throw new Error('Error al cargar el menú');
                }
                
                const datos: Producto[] = await respuesta.json();
                setProductos(datos);
            } catch (error) {
                console.error("Fallo la carga del menú", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerMenu();
    }, []); 


    if (cargando) {
        return <div>Cargando menú...</div>; 
    }

    return (
        <section aria-label="Menú de la cafetería">
            <h2>Productos Disponibles</h2>
            <ul role="list">
                {productos.map((producto) => (
                    <li key={producto.id} role="listitem"> 
                        <h3>{producto.nombre}</h3>
                        <p>Precio: ${producto.precio.toFixed(2)}</p>
                        <button>Agregar</button> 
                    </li>
                ))}
            </ul>
        </section>
    );
};