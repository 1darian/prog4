import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import App from "../../App";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";

describe("Flujo de pedido", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("carga menu, agrega items, calcula total, envia pedido y resetea interfaz", async () => {
    // Capturar la peticion enviada al backend
    let capturedRequest: unknown = null;

    server.use(
      http.post("/api/orders", async ({ request }) => {
        capturedRequest = await request.json();
        return HttpResponse.json({ orderId: "ORD-1", status: "confirmed" }, { status: 201 });
      })
    );

    render(<App />);

    // Esperar que el menu cargue
    await waitFor(() => {
      expect(screen.getByText("Productos Disponibles")).toBeInTheDocument();
    });

    // Agregar Espresso
    const agregarEspresso = screen.getByRole("button", { name: /agregar espresso/i });
    fireEvent.click(agregarEspresso);

    // Agregar Capuchino
    const agregarCapuchino = screen.getByRole("button", { name: /agregar capuchino/i });
    fireEvent.click(agregarCapuchino);

    // Verificar items en el resumen
    await waitFor(() => {
      expect(screen.getByText("1 x Espresso - $2.50")).toBeInTheDocument();
      expect(screen.getByText("1 x Capuchino - $3.50")).toBeInTheDocument();
    });

    // Verificar total
    expect(screen.getByText("Total: $6.00")).toBeInTheDocument();

    // Enviar pedido
    const enviarButton = screen.getByRole("button", { name: /enviar pedido/i });
    fireEvent.click(enviarButton);

    // Esperar confirmacion
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Pedido confirmado");
    });

    // Verificar que la interfaz se reinicio
    expect(screen.getByText("El pedido esta vacio")).toBeInTheDocument();
    expect(screen.getByText("Total: $0.00")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /enviar pedido/i })).not.toBeInTheDocument();

    // Verificar que se envio la peticion con los datos correctos
    expect(capturedRequest).toEqual({
      items: [
        { id: "1", name: "Espresso", price: 2.5, quantity: 1 },
        { id: "2", name: "Capuchino", price: 3.5, quantity: 1 },
      ],
      total: 6.0,
    });
  });
});
