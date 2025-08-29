
import ProductCard, { Product } from "@/components/product-card";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default async function Home() {
  const res = await fetch(`${API_BASE}/products`, { cache: "no-store" });
  const products: Product[] = await res.json();

  return (
    <main className="bg-white min-h-screen container mx-auto px-48 py-8">
      <h1 className="mb-6 text-2xl font-bold">Products</h1>
      <div className="flex flex-wrap gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
