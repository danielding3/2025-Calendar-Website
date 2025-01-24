'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

interface CartItem {
  price_id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { price_id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const CART_STORAGE_KEY = 'shopping-cart';

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.price_id === action.payload.price_id);
      
      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.price_id === action.payload.price_id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          total: state.total + (action.payload.price * action.payload.quantity)
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, action.payload],
          total: state.total + (action.payload.price * action.payload.quantity)
        };
      }
      break;
    }

    case 'REMOVE_ITEM': {
      const item = state.items.find(item => item.price_id === action.payload);
      newState = {
        ...state,
        items: state.items.filter(item => item.price_id !== action.payload),
        total: state.total - (item ? item.price * item.quantity : 0)
      };
      break;
    }

    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.price_id === action.payload.price_id);
      if (!item) return state;

      const quantityDiff = action.payload.quantity - item.quantity;

      newState = {
        ...state,
        items: state.items.map(item =>
          item.price_id === action.payload.price_id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff)
      };
      break;
    }

    case 'CLEAR_CART':
      newState = {
        items: [],
        total: 0
      };
      break;

    case 'LOAD_CART':
      newState = action.payload;
      break;

    default:
      return state;
  }

  // Save to localStorage after each action
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));
  }

  return newState;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 