"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Product = {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
};

export default function LowStockPage() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/admin/low-stock`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-xl">Low Stock Items</h1>
      <table className="min-w-full border text-left">
        <thead>
          <tr>
            <th className="border px-2">Name</th>
            <th className="border px-2">Description</th>
            <th className="border px-2">Stock</th>
            <th className="border px-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border px-2">{p.name}</td>
              <td className="border px-2">{p.description}</td>
              <td className="border px-2">{p.stock}</td>
              <td className="border px-2">{p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}