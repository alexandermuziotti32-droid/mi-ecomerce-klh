"use client";
import { useState } from "react";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "./CartDrawer";
import { SearchBar } from "./SearchBar";

const CATEGORIES = [
  { href: "/hombres", label: "Hombres" },
  { href: "/mujeres", label: "Mujeres" },
  { href: "/accesorios", label: "Accesorios" },
  { href: "/", label: "Ver Todo" },
];

export const Navbar = () => {
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="text-2xl font-bold tracking-tighter">
            <Link href="/">KLH</Link>
          </div>
        </div>

        <div className="hidden md:flex space-x-6 text-sm uppercase font-medium">
          <ul className="flex gap-6">
            {CATEGORIES.map((cat) => (
              <li key={cat.href} className="hover:underline">
                <Link href={cat.href}>{cat.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-5">
          <SearchBar />
          <Link href="/account">
            <User className="w-5 h-5 cursor-pointer hover:text-gray-500" />
          </Link>

          <div
            onClick={() => setIsCartOpen(true)}
            className="relative cursor-pointer group"
          >
            <ShoppingCart className="w-5 h-5 group-hover:text-gray-500 transition-colors" />
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
              {totalItems}
            </span>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-8 py-4">
          <ul className="flex flex-col gap-4 text-sm uppercase font-medium">
            {CATEGORIES.map((cat) => (
              <li key={cat.href}>
                <Link
                  href={cat.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
