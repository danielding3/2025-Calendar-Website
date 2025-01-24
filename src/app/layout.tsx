
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
// import { Header } from "@/components/Header";
// import { CartButton } from "@/components/CartButton";
// import { useState } from "react";
// import { CartDrawer } from "@/components/CartDrawer";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jennifer Lee  |  2025 Calendar",
  description: "Risograph print of Jennifer Yejin Lee's 2025 calendar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-oracle mb-8">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
