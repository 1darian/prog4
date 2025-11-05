import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { ResumenPedido } from "./ResumenPedido";
import { PedidoProvider, usePedido } from "../../contexto/PedidoContexto";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";

const TestComponent = () => {
  const { agregarProducto } = usePedido();

  const agregarProductos = () => {
    agregarProducto({
      id: "1",
      nombre: "Espresso",
      precio: 2.5,
      tipo: "Bebida",
    });
    agregarProducto({
      id: "2",
      nombre: "Capuchino",
      precio: 3.5,
      tipo: "Bebida",
    });
  };

  return (
    <div>
      <button onClick={agregarProductos}>Agregar Productos</button>
      <ResumenPedido />
    </div>
  );
};

const TestWrapper = () => (
  <PedidoProvider>
    <TestComponent />
  </PedidoProvider>
);

describe("ResumenPedido - Envio de pedidos", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("debe mostrar el boton de enviar despues de agregar items", async () => {
    render(<TestWrapper />);

    fireEvent.click(screen.getByText("Agregar Productos"));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /enviar pedido/i })
      ).toBeInTheDocument();
    });
  });

  it("debe enviar el pedido y mostrar confirmacion", async () => {
    render(<TestWrapper />);

    fireEvent.click(screen.getByText("Agregar Productos"));

    const enviarButton = await waitFor(() =>
      screen.getByRole("button", { name: /enviar pedido/i })
    );
    fireEvent.click(enviarButton);

    await waitFor(
      () => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Pedido confirmado"
        );
      },
      { timeout: 5000 }
    );
  });

  it("debe manejar errores en el envío", async () => {
    server.use(
      http.post("/api/orders", () => {
        return HttpResponse.json(
          { error: "Error del servidor" },
          { status: 500 }
        );
      })
    );

    render(<TestWrapper />);

    fireEvent.click(screen.getByText("Agregar Productos"));

    const enviarButton = await waitFor(() =>
      screen.getByRole("button", { name: /enviar pedido/i })
    );
    fireEvent.click(enviarButton);

    await waitFor(
      () => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Error al enviar el pedido"
        );
      },
      { timeout: 5000 }
    );
  });

  it("debe enviar datos correctos al servidor", async () => {
    let capturedRequest: unknown = null;

    server.use(
      http.post("/api/orders", async ({ request }) => {
        capturedRequest = await request.json();
        return HttpResponse.json(
          { orderId: "test-123", status: "confirmed" },
          { status: 201 }
        );
      })
    );

    render(<TestWrapper />);

    fireEvent.click(screen.getByText("Agregar Productos"));

    const enviarButton = await waitFor(() =>
      screen.getByRole("button", { name: /enviar pedido/i })
    );
    fireEvent.click(enviarButton);

    await waitFor(
      () => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Pedido confirmado"
        );
      },
      { timeout: 5000 }
    );

    expect(capturedRequest).toEqual({
      items: [
        { id: "1", name: "Espresso", price: 2.5, quantity: 1 },
        { id: "2", name: "Capuchino", price: 3.5, quantity: 1 },
      ],
      total: 6.0,
    });
  });
});
