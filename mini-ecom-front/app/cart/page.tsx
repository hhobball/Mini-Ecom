"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const overlay =
    status !== "idle" && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="flex flex-col items-center rounded-md bg-white p-6">
          {status === "loading" ? (
            <>
              <Loader2 className="mb-2 h-8 w-8 animate-spin" />
              <p>Placing order...</p>
            </>
          ) : (
            <>
              <CheckCircle className="mb-2 h-8 w-8 text-green-500" />
              <p>Order placed successfully!</p>
            </>
          )}
        </div>
      </div>
    );

  async function handlePlaceOrder() {
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }

    setStatus("loading");
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
        })),
      }),
    });

    if (res.ok) {
      setStatus("success");
      clear();
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setStatus("idle");
      const data = await res.json().catch(() => ({}));
      alert(data.message || "Insufficient amount of that item");
    }
  }
  if (items.length === 0) {
    return (
      <>
        {overlay}
        <div className="container mx-auto px-32 py-8">
          <h1 className="mb-6 text-2xl font-semibold">My Cart</h1>
          <p>Your cart is empty.</p>
        </div>
      </>
    );
  }

  return (
      <>
      {overlay}
      <div className="container mx-auto px-32 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr className="text-sm">
                <th className="py-2">Product Details</th>
                <th className="py-2">Price</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ product, quantity }) => (
                <tr key={product.id} className="border-b">
                  <td className="py-4 flex gap-4">
                    <Image
                      src="/placeholder.svg"
                      alt=""
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-sm text-orange-500"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                  <td className="py-4">${product.price.toFixed(2)}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-6 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="py-4">${(product.price * quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-100 p-4 rounded-md h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between py-1 text-sm">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full mt-4 bg-yellow-400 text-black hover:bg-yellow-500"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}