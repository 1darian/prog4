import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import App from './App'; 

describe('Flujo de Pedido Completo (HU2 y HU3)', () => {

    test('🟢 HU2/HU3: Debe agregar un producto y calcular el total correctamente', async () => {
        
        render(<App />);

        
        const botonAgregarEspresso = await screen.findByRole('button', { name: /Agregar Espresso/i }); 
        
        fireEvent.click(botonAgregarEspresso);

        const botonAgregarCroissant = screen.getByRole('button', { name: /Agregar Croissant/i }); 
        fireEvent.click(botonAgregarCroissant);

        fireEvent.click(botonAgregarEspresso);
        
        expect(screen.getByText(/2 x Espresso/i)).toBeInTheDocument();
        expect(screen.getByText(/1 x Croissant/i)).toBeInTheDocument();

        expect(screen.getByText('Total: $7.00')).toBeInTheDocument(); 
    });



});