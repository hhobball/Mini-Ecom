"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/cart") return null;
  return (
    <footer className="bg-gray-200 border-t border-gray-300">
      <div className="container mx-auto px-32 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        <div>
          <h2 className="text-xl font-bold">
            <span className="text-black-500 text-black">Mini Ecom</span>
          </h2>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry&apos;s standard dummy text ever since
            the 1500s.
          </p>
        </div>

        <div className="pl-30">
          <h3 className="text-md font-semibold mb-4 text-black">Company</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About us</Link></li>
            <li><Link href="/privacy">Privacy policy</Link></li>
          </ul>
        </div>

        <div className="pl-30">
          <h3 className="text-md font-semibold mb-4 text-black">Contact us</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>phone number</li>
            <li>email</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-300 py-4">
        <p className="text-center text-xs text-gray-500">
          Copyright 2025 © All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
