'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { ChevronRight, ChevronLeft } from '@geist-ui/icons';

import Image from 'next/image';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Variant {
  title: string;
  price_id: string;
  price: number;
  images: string[];
}

interface ProductCardProps {
  name: string;
  description: string;
  printedInfo: string;
  variants: Variant[];
  onAddToCart: () => void;
}

export default function ProductCard({ name, description, variants, printedInfo, onAddToCart }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { state, dispatch } = useCart();

  // Check if current variant is in cart
  const isInCart = state.items.some(item => item.price_id === selectedVariant.price_id);

  // Reset "Added to Cart" state when variant changes
  useEffect(() => {
    setIsAddingToCart(false);
    console.log('setAddingToCart');
  }, [selectedVariant, state.items]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const handleAddToCart = async () => {
    if (isInCart) {
      // If already in cart, proceed directly to checkout
      handleCheckout();
      return;
    }

    setIsAddingToCart(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        price_id: selectedVariant.price_id,
        title: selectedVariant.title,
        price: selectedVariant.price,
        quantity: quantity,
        image: selectedVariant.images[0]
      }
    });
    
    // Reset quantity after adding to cart
    setQuantity(1);
    onAddToCart();
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Get all items from cart context
      const cartItems = state.items.map(item => ({
        price_id: item.price_id,
        quantity: item.quantity
      }));

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (!stripe) throw new Error('Stripe failed to initialize');

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === selectedVariant.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedVariant.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-2">
      <div className="grid grid-cols-1 md:grid-cols-[2fr,2fr] gap-16">
        {/* Left Column - Product Image */}
        <div className="order-1 md:order-1">
          <div className="relative aspect-[2/3] bg-black object-contain bg-none max-w-full">
            {selectedVariant.images && selectedVariant.images.length > 0 ? (
              <>
                <Image
                  src={selectedVariant.images[currentImageIndex]}
                  alt={`${name} - ${selectedVariant.title}`}
                  className="object-contain w-full h-full"
                  width={2000}
                  height={2000}
                />
                {selectedVariant.images.length > 1 && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute -left-10 z-10 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg text-white/80 hover:text-white"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute -right-10 z-10 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg text-white/80 hover:text-white"
                    >
                      <ChevronRight />
                    </button>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedVariant.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-1 border-1 border-black rounded-full ${
                            currentImageIndex === index ? 'bg-white w-12' : 'bg-white/30 w-6'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="flex flex-col justify-start order-2 md:order-2 text-white max-w-full md:max-w-[435px] tracking-[-0.04em]">
          {/* <h1 className="xl:text-[240px] xl:leading-[186px] xl:tracking-[-0.06em] lg:text-[200px] lg:leading-[150px] lg:tracking-[-0.05em] md:text-[160px] md:leading-[120px] md:tracking-[-0.04em] text-6xl leading-tighter tracking-tight text-white mb-4">{name}</h1> */}
          <div className="font-oracle font-light mb-10">
            <h3 className=" mb-4">Specifications</h3>
            <p className="mb-8 whitespace-pre leading-tight">{description}</p>
            <p className="leading-[1.25]">{printedInfo}</p>
          </div>
          
          {/* Variant Selection */}
          <div className="mb-10">
            {/* <label className="block text-sm font-medium text-white mb-2">
              Select Colour
            </label> */}
            <select 
              className="w-full p-2 border bg-black text-white"
              onChange={(e) => {
                const variant = variants.find(v => v.title === e.target.value);
                if (variant) {
                  setSelectedVariant(variant);
                  setCurrentImageIndex(0);
                }
              }}
              value={selectedVariant.title}
            > 
              {variants.map((variant) => (
                <option key={variant.title} value={variant.title}>
                  {variant.title} - {formatPrice(variant.price)}
                </option>
              ))}
            </select>
          </div>
            
          <div className='flex flex-row justify-between mb-10'>

            {/* Quantity Controls */}
            <div className="-mt-[2px]">
              {/* <label className="block text-sm font-medium text-white mb-2">
                Quantity
              </label> */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1"
                >
                  -
                </button>
                <span className="w-12 text-white text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-1"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base text-white text-right">
                  TOTAL &nbsp; &nbsp; {formatPrice(selectedVariant.price * quantity)}
                </div>
                <p className="text-sm text-white opacity-40">Shipping will be calculated at checkout</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart && !isInCart}
              className={`w-full relative py-2 px-6 text-lg font-semibold transition-all duration-300 
                ${isInCart 
                  ? 'bg-white text-black border-2 border-white hover:bg-black hover:text-white' 
                  : 'bg-white text-black border-2 border-white hover:bg-gray-100'}`}
            >
              <span className={`transition-opacity duration-300 ${isAddingToCart && !isInCart ? 'opacity-0' : 'opacity-100'}`}>
                {isInCart ? 'Proceed to Checkout' : 'Add to Cart'}
              </span>
              {/* Spinner */}
              {isAddingToCart && !isInCart && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          </div>
        </div>


      </div>
    </div>
  );
} 