import React from 'react';
import { usarMenu } from '../../hooks/usarMenu'; 
import { ItemMenu } from '../ItemMenu/ItemMenu'; 
import { usarPedido } from '../../contexto/PedidoContexto';

export const Menu: React.FC = () => {
    const { productos, cargando, error } = usarMenu();
    const { agregarProducto } = usarPedido();

    // Función placeholder para la HU2 (Agregar)
    const handleAgregar = () => {
        console.log("Se intentó agregar un producto.");
    };

    if (cargando) {
        return <div>Cargando menú...</div>; 
    }

    if (error) {
        return <div role="alert" style={{ color: 'red' }}>{error}</div>;
    }
    
    if (productos.length === 0) {
        return <div>No hay productos disponibles.</div>;
    }

    return (
        <section aria-label="Menú de la cafetería">
            <h2>Productos Disponibles</h2>
            <ul role="list">
                {productos.map((producto) => (
                    <ItemMenu 
                        key={producto.id} 
                        producto={producto} 
                        onAgregar={agregarProducto}
                    />
                ))}
            </ul>
        </section>
    );
};