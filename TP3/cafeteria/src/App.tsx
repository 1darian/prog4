import React from 'react';
import { PedidoProvider } from './contexto/PedidoContexto';
import { Menu } from './componentes/Menu/Menu';
import { ResumenPedido } from './componentes/ResumenPedido/ResumenPedido';

const App: React.FC = () => {
    return (
        <PedidoProvider>
            <h1>Cafetería TDD</h1>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <section style={{ flex: 1 }}>
                    <Menu />
                </section>
                <section style={{ flex: 1 }}>
                    <ResumenPedido />
                </section>
            </div>
        </PedidoProvider>
    );
};
export default App;