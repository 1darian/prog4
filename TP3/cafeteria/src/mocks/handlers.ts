import { http, HttpResponse } from "msw";
import { mockProductos } from "./data";

export const handlers = [
  http.get("/api/menu", () => {
    return HttpResponse.json(mockProductos, { status: 200 });
  }),

  http.post("/api/orders", async ({ request }) => {
    const body = await request.json();
    console.log("Pedido recibido:", body);

    return HttpResponse.json(
      { orderId: "ORD-" + Date.now(), status: "confirmed" },
      { status: 201 }
    );
  }),
];
