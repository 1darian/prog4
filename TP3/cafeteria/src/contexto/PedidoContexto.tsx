import React, { createContext, useContext, ReactNode } from 'react';
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
    
    return (
        <PedidoContexto.Provider value={{ items: [], total: 0, agregarProducto: () => {} }}>
            {children}
        </PedidoContexto.Provider>
    );
};

export const usarPedido = () => {
    const context = useContext(PedidoContexto);
    if (!context) {
        throw new Error('usarPedido debe ser usado dentro de un PedidoProvider');
    }
    return context;
};