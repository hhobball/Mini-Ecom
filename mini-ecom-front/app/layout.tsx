import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-white">
      <body className="bg-white text-black antialiased min-h-screen">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main >{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}