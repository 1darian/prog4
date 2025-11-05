import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { ItemPedido, Producto } from '../tipos/producto';

interface PedidoContextoType {
    items: ItemPedido[];
    total: number;
    agregarProducto: (producto: Producto) => void;
}

const PedidoContexto = createContext<PedidoContextoType | undefined>(undefined);

interface PedidoProviderProps {
    children: ReactNode;
}

export const PedidoProvider: React.FC<PedidoProviderProps> = ({ children }) => {
    const [items, setItems] = useState<ItemPedido[]>([]);

    const agregarProducto = (producto: Producto) => {
        setItems(prevItems => {
            const itemExistente = prevItems.find(item => item.id === producto.id);
            if (itemExistente) {
                return prevItems.map(item =>
                    item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            } else {
                return [
                    ...prevItems,
                    { 
                        id: producto.id, 
                        nombre: producto.nombre, 
                        precio: producto.precio, 
                        cantidad: 1 
                    }
                ];
            }
        });
    };

    const total = useMemo(() => {
        return items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    }, [items]);

    const contextValue = {
        items,
        total,
        agregarProducto,
    };

    return (
        <PedidoContexto.Provider value={contextValue}>
            {children}
        </PedidoContexto.Provider>
    );
};

export const usarPedido = () => {
    const context = useContext(PedidoContexto);
    if (context === undefined) {
        throw new Error('usarPedido debe ser usado dentro de un PedidoProvider');
    }
    return context;
};