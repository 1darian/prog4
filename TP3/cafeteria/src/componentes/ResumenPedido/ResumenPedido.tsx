import React from "react";
import { usePedido } from "../../contexto/PedidoContexto";

export const ResumenPedido: React.FC = () => {
  const {
    items,
    total,
    eliminarProducto,
    enviarPedido,
    estadoEnvio,
    mensajeError,
  } = usePedido();

  return (
    <aside aria-label="Resumen del Pedido">
      <h2>Tu Pedido</h2>
      <ul role="list">
        {items.length === 0 ? (
          <li role="listitem">El pedido esta vacio</li>
        ) : (
          items.map((item) => (
            <li key={item.id} role="listitem">
              {item.cantidad} x {item.nombre} - $
              {(item.precio * item.cantidad).toFixed(2)}
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

      {estadoEnvio === "confirmado" && (
        <div role="alert" style={{ color: "green", marginBottom: "1rem" }}>
          Pedido confirmado
        </div>
      )}

      {estadoEnvio === "error" && mensajeError && (
        <div role="alert" style={{ color: "red", marginBottom: "1rem" }}>
          {mensajeError}
        </div>
      )}

      {items.length > 0 && (
        <button
          onClick={enviarPedido}
          disabled={estadoEnvio === "enviando"}
          aria-label="Enviar pedido"
        >
          {estadoEnvio === "enviando" ? "Enviando..." : "Enviar Pedido"}
        </button>
      )}
    </aside>
  );
};
