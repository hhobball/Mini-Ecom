"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type OrderItem = {
  id: number;
  product: { id: number; name: string };
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  user: { email: string };
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/admin/orders`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl px-20 py-8">
      <h1 className="mb-4 text-xl">Orders</h1>
      <div className="divide-y">
        {orders.map((order) => (
          <div key={order.id} className="grid grid-cols-4 items-center py-4">
            <div>
              <ul className="text-sm">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.product.name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
            <div className="truncate">{order.user.email}</div>
            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
            <div className="text-right font-semibold">
              ${order.totalPrice.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}