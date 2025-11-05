import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import { Menu } from './Menu'; 
import { PedidoProvider } from '../../contexto/PedidoContexto'; 

describe('HU1 y HU2: Interacción del Menú', () => {

    test('✓ HU1: Debe mostrar el listado de productos después de cargarlos de la API', async () => {
        render(<PedidoProvider><Menu /></PedidoProvider>);

        expect(screen.getByText(/Cargando menú.../i)).toBeInTheDocument();
        expect(await screen.findByRole('heading', { name: /Espresso/i })).toBeInTheDocument(); 
        expect(screen.queryByText(/Cargando menú.../i)).not.toBeInTheDocument();
    });

    test('🔴 HU2: Debe agregar un producto al pedido al hacer clic en "Agregar"', async () => {
        render(<PedidoProvider><Menu /></PedidoProvider>);

        const botonAgregar = await screen.findByRole('button', { name: /Agregar Espresso/i }); 
        
        fireEvent.click(botonAgregar);

        expect(screen.getByText(/1 x Espresso/i)).toBeInTheDocument(); 

        expect(screen.getByText('Total: $2.50')).toBeInTheDocument(); 
    });
});