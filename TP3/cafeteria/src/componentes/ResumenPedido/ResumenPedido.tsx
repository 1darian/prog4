import React from 'react';
import { usarPedido } from '../../contexto/PedidoContexto';

export const ResumenPedido: React.FC = () => {
    const { items, total, eliminarProducto } = usarPedido(); 

    return (
        <aside aria-label="Resumen del Pedido">
            <h2>Tu Pedido</h2>
            <ul role="list">
                {items.length === 0 ? (
                    <li role="listitem">El pedido está vacío.</li>
                ) : (
                    items.map(item => (
                        <li key={item.id} role="listitem">
                            {item.cantidad} x {item.nombre} - ${ (item.precio * item.cantidad).toFixed(2) }
                            
                            <button 
                                onClick={() => eliminarProducto(item.id)}
                                aria-label={`Eliminar ${item.nombre}`}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))
                )}
            </ul>
            
            <p>Total: ${total.toFixed(2)}</p>
            
            {items.length > 0 && (
                <button>Enviar Pedido</button>
            )}
        </aside>
    );
};