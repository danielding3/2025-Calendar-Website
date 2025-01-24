'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@/context/CartContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CartProps {
  onCheckoutComplete?: () => void;
}

export function Cart({ onCheckoutComplete }: CartProps) {
  const { state, dispatch } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items.map(item => ({
            price_id: item.price_id,
            quantity: item.quantity
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (!stripe) throw new Error('Stripe failed to initialize');

      onCheckoutComplete?.();
      
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Stripe Checkout Error:', error);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (priceId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: priceId });
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { price_id: priceId, quantity: newQuantity }
      });
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {state.items.map((item) => (
          <div key={item.price_id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-gray-500">{formatPrice(item.price)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.price_id, item.quantity - 1)}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.price_id, item.quantity + 1)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
              <button
                onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.price_id })}
                className="ml-4 text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <div className="text-xl font-bold">
          Total: {formatPrice(state.total)}
        </div>
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="bg-black text-white px-6 py-2 hover:bg-white hover:text-black border-black border-2 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
} 