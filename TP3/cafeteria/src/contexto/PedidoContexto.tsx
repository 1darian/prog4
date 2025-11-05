import React, { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { ItemPedido, Producto } from "../tipos/producto";

interface PedidoContextoType {
  items: ItemPedido[];
  total: number;
  agregarProducto: (producto: Producto) => void;
  eliminarProducto: (idProducto: string) => void;
  enviarPedido: () => Promise<void>;
  estadoEnvio: "idle" | "enviando" | "confirmado" | "error";
  mensajeError?: string;
}

const PedidoContexto = createContext<PedidoContextoType | undefined>(undefined);

interface PedidoProviderProps {
  children: ReactNode;
}

export const PedidoProvider: React.FC<PedidoProviderProps> = ({ children }) => {
  const [items, setItems] = useState<ItemPedido[]>([]);
  const [estadoEnvio, setEstadoEnvio] = useState<
    "idle" | "enviando" | "confirmado" | "error"
  >("idle");
  const [mensajeError, setMensajeError] = useState<string | undefined>(
    undefined
  );

  const agregarProducto = (producto: Producto) => {
    setItems((prevItems) => {
      const itemExistente = prevItems.find((item) => item.id === producto.id);
      if (itemExistente) {
        return prevItems.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
          },
        ];
      }
    });
  };

  const eliminarProducto = (idProducto: string) => {
    setItems((prevItems) => {
      const itemExistente = prevItems.find((item) => item.id === idProducto);

      if (!itemExistente) {
        return prevItems;
      }

      if (itemExistente.cantidad > 1) {
        return prevItems.map((item) =>
          item.id === idProducto
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        );
      } else {
        return prevItems.filter((item) => item.id !== idProducto);
      }
    });
  };

  const enviarPedido = async () => {
    if (items.length === 0) {
      setMensajeError("No hay items en el pedido");
      setEstadoEnvio("error");
      return;
    }

    setEstadoEnvio("enviando");
    setMensajeError(undefined);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.nombre,
            price: item.precio,
            quantity: item.cantidad,
          })),
          total: total,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el pedido");
      }

      const data = await response.json();
      console.log("Pedido confirmado:", data);

      setEstadoEnvio("confirmado");
      setItems([]);

      setTimeout(() => {
        setEstadoEnvio("idle");
      }, 3000);
    } catch (error) {
      console.error("Error al enviar pedido:", error);
      setMensajeError(
        error instanceof Error ? error.message : "Error desconocido"
      );
      setEstadoEnvio("error");
    }
  };

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }, [items]);

  const contextValue: PedidoContextoType = {
    items,
    total,
    agregarProducto,
    eliminarProducto,
    enviarPedido,
    estadoEnvio,
    mensajeError,
  };

  return (
    <PedidoContexto.Provider value={contextValue}>
      {children}
    </PedidoContexto.Provider>
  );
};

export const usePedido = () => {
  const context = useContext(PedidoContexto);
  if (context === undefined) {
    throw new Error("usePedido debe ser usado dentro de un PedidoProvider");
  }
  return context;
};
