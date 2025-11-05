import React from 'react';
import { Producto } from '../../tipos/producto'; 

interface ItemMenuProps {
    producto: Producto;
    // La función onAgregar la necesitaremos para la HU2
    onAgregar: (producto: Producto) => void; 
}

export const ItemMenu: React.FC<ItemMenuProps> = ({ producto, onAgregar }) => (
    <li key={producto.id} role="listitem">
        <h3>{producto.nombre}</h3>
        <p>Precio: ${producto.precio.toFixed(2)}</p>
        <button onClick={() => onAgregar(producto)} aria-label={`Agregar ${producto.nombre}`}>
            Agregar
        </button> 
    </li>
);