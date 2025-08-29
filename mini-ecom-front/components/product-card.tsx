"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

export type Product = {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const stockLabel = product.stock > 5 ? "In stock" : `${product.stock} Available`;
  return (
    <Card className="relative w-64 overflow-hidden p-0 gap-0">
      {product.stock === 0 && (
        <span className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
          Out of stock
        </span>
      )}
      <Image
        src="/placeholder.svg"
        alt=""
        width={256}
        height={160}
        className="h-40 w-full object-cover"
      />
      <CardContent className="p-4 flex flex-col gap-2">
        <CardTitle className="text-base">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
        <div className="flex justify-between items-center">
          <span className="text-sm">{stockLabel}</span>
          <span className="font-semibold">${product.price.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button
          disabled={product.stock === 0}
          onClick={() => addItem(product)}
        >
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}