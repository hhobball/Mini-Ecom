"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (!isAdmin) {
      router.replace("/");
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r border-gray-200 p-4">
        <nav className="flex flex-col gap-4">
          <Link href="/admin/create-product" className="text-black">
            Create Product
          </Link>
          <Link href="/admin/orders" className="text-black">
            Orders
          </Link>
          <Link href="/admin/low-stock" className="text-black">
            Low Stock
          </Link>
        </nav>
      </aside>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}