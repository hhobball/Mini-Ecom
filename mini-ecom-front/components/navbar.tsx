"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="border-b border-gray-300 bg-white">
      <div className="container mx-auto h-14 px-32 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight text-black">
          Mini Ecom
        </Link>

        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
          <Link href="/" className="text-lg tracking-tight text-black">Shop</Link>
          {isAdmin && (
            <Link
              href="/admin/create-product"
              className="text-lg tracking-tight text-black"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-10 pr-4">
          <Link href="/cart" aria-label="Cart" className="relative text-black">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 text-[10px] px-1 rounded-full bg-black text-white">
              {itemCount}
            </span>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 text-sm text-black"
                aria-haspopup="true"
                aria-expanded={open}
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Account</span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      logout().then(() => router.push("/"));
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm border border-black text-black rounded-md px-3 py-1 hover:bg-gray-100"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}