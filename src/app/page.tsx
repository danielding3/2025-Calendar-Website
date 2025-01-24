'use client';

import { useState } from 'react';
import ProductCard from '../components/ProductCard';

import { PRODUCT_DATA } from '../config/product';
import { Header } from '@/components/Header';

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Header isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      <main className="min-h-screen">
        <ProductCard {...PRODUCT_DATA} onAddToCart={() => setIsDrawerOpen(true)}/>
      </main>
    </>
  );
}
