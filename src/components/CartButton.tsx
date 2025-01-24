'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { CartDrawer } from './CartDrawer';

interface CartButtonProps {
  onOpenDrawer: () => void;
}

export function CartButton({ onOpenDrawer }: CartButtonProps) {
  const { state } = useCart();

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <div>
        <button
          onClick={onOpenDrawer}
          className="relative p-2 hover:bg-gray-100 hover:text-black rounded-md transition-colors"
        >
          <span className="sr-only">Open cart</span>
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
} 