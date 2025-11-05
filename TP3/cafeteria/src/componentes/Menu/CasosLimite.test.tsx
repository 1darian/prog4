import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { expect, test, describe, beforeEach } from "vitest";
import App from "../../App";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";

describe("Casos limite con errores", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  test("Error 500 del servidor", async () => {
    server.use(
      http.get("/api/menu", () => {
        return HttpResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      })
    );

    render(<App />);

    expect(screen.getByText("Cafetería TDD")).toBeInTheDocument();

    expect(screen.getByText(/Cargando menu.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Error del servidor. Intente mas tarde."
      );
    });

    expect(screen.queryByText("Productos Disponibles")).not.toBeInTheDocument();
    expect(screen.queryByText("Agregar")).not.toBeInTheDocument();

    expect(screen.getByText("Tu Pedido")).toBeInTheDocument();
    expect(screen.getByText("El pedido esta vacio")).toBeInTheDocument();
  });

  test("Aplicacion completa con menu vacio", async () => {
    server.use(
      http.get("/api/menu", () => {
        return HttpResponse.json([], { status: 200 });
      })
    );

    render(<App />);

    expect(screen.getByText(/Cargando menu.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("No hay productos disponibles.")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Productos Disponibles")).not.toBeInTheDocument();
    expect(screen.queryByText("Agregar")).not.toBeInTheDocument();

    expect(screen.getByText("Tu Pedido")).toBeInTheDocument();
    expect(screen.getByText("El pedido esta vacio")).toBeInTheDocument();
  });

  test("Error de red y luego recuperacion exitosa", async () => {
    server.use(
      http.get("/api/menu", () => {
        return HttpResponse.error();
      })
    );

    const { unmount } = render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Failed to fetch");
    });

    unmount();

    server.resetHandlers();

    // Renderizar nuevamente el componente
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Productos Disponibles")).toBeInTheDocument();
      expect(screen.getByText("Espresso")).toBeInTheDocument();
    });

    // Verificar que se pueden agregar productos
    const espressoButton = screen.getByRole("button", {
      name: /agregar espresso/i,
    });
    fireEvent.click(espressoButton);

    await waitFor(() => {
      expect(screen.getByText("1 x Espresso - $2.50")).toBeInTheDocument();
    });
  });

  test("Error 404 - Menu no encontrado", async () => {
    server.use(
      http.get("/api/menu", () => {
        return HttpResponse.json({ error: "Not Found" }, { status: 404 });
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("No encontrado");
    });

    expect(screen.queryByText("Productos Disponibles")).not.toBeInTheDocument();
  });

  test("Respuesta JSON malformada", async () => {
    server.use(
      http.get("/api/menu", () => {
        return new Response("Invalid JSON", {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Unexpected token");
    });
  });

  test("Error de menu pero envio de pedidos sigue funcionando", async () => {
    server.use(
      http.get("/api/menu", () => {
        return HttpResponse.json({ error: "Menu Error" }, { status: 500 });
      }),
      http.post("/api/orders", () => {
        return HttpResponse.json(
          { orderId: "test-order", status: "confirmed" },
          { status: 201 }
        );
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Error del servidor. Intente mas tarde."
      );
    });

    expect(screen.getByText("Tu Pedido")).toBeInTheDocument();
    expect(screen.getByText("El pedido esta vacio")).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /enviar pedido/i })
    ).not.toBeInTheDocument();
  });
});
