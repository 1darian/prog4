import React from "react";
import { useMenu } from "../../hooks/usarMenu";
import { ItemMenu } from "../ItemMenu/ItemMenu";
import { usePedido } from "../../contexto/PedidoContexto";

export const Menu: React.FC = () => {
  const { productos, cargando, error } = useMenu();
  const { agregarProducto } = usePedido();

  if (cargando) {
    return (
      <div role="status" aria-live="polite">
        Cargando menu...
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        style={{
          color: "red",
          padding: "1rem",
          borderRadius: "4px",
          backgroundColor: "#ffebee",
        }}
      >
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div
        role="status"
        style={{ padding: "1rem", textAlign: "center", color: "#666" }}
      >
        No hay productos disponibles.
      </div>
    );
  }

  return (
    <section aria-label="Menu de la cafetería">
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
