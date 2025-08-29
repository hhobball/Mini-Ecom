"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Product = {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
};

export default function CreateProductPage() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [addStock, setAddStock] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => {});
  }, []);

  async function addProduct() {
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name,
        description,
        stock: Number(stock),
        price: Number(price),
      }),
    });
    if (res.ok) {
      const prod = await res.json();
      setProducts((prev) => [...prev, prod]);
      setName("");
      setDescription("");
      setStock("");
      setPrice("");
    } else if (res.status === 409) {
      alert("Product name must be unique");
    } else {
      alert("Failed to add product");
    }
  }

  async function updateStock() {
    const res = await fetch(`${API_BASE}/products/${selectedId}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ quantity: Number(addStock) }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setSelectedId("");
      setAddStock("");
    } else {
      alert("Failed to update stock");
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Button onClick={addProduct}>Add</Button>
      </div>
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
      <h2 className="mt-6 mb-2 font-bold">Update Stock</h2>
      <div className="mb-4 flex gap-2">
        <select
          className="border p-2"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Amount"
          value={addStock}
          onChange={(e) => setAddStock(e.target.value)}
        />
        <Button onClick={updateStock}>Update</Button>
      </div>
    </div>
  );
}