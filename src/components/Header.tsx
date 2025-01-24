'use client';

import { CartButton } from "./CartButton";
import { CartDrawer } from "./CartDrawer";
import { useState } from "react";

interface HeaderProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
}
export function Header({ isDrawerOpen, setIsDrawerOpen }: HeaderProps) {
  return (
    <>
      <div className="sticky w-full bg-black top-0 z-[100]">
        <div className="mix-blend-difference">
          <header className="flex flex-row justify-between text-white pt-3 pb-2 px-6">
            <div className="text-white">
              <h2 className="text-lg font-normal">2025 Risograph Calendar Poster</h2>
            </div>
            <div className="flex justify-end items-start">
              <CartButton onOpenDrawer={() => setIsDrawerOpen(true)} />
            </div>
          </header>
        </div>
      </div>
      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}