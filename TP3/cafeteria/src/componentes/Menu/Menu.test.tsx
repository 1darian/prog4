
import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';

// Si no existe o esta vacio el test falla (ROJO)
import { Menu } from './Menu'; 

describe('HU1: Visualización inicial del menú', () => {
  test('🔴 debe mostrar el listado de productos después de cargarlos de la API', async () => {
    
    render(<Menu />);

    expect(screen.getByText(/Cargando menú.../i)).toBeInTheDocument();

    //esta linea deberia fallar
    expect(await screen.findByText('Espresso', { timeout: 3000 })).toBeInTheDocument(); 

    expect(screen.queryByText(/Cargando menú.../i)).not.toBeInTheDocument();
  });
});
