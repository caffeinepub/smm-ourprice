import { createContext, useContext, useState, ReactNode } from 'react';
import type { Service } from '../backend';

interface CartItem {
  service: Service;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (service: Service, quantity: number) => void;
  removeFromCart: (serviceId: bigint) => void;
  updateQuantity: (serviceId: bigint, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (service: Service, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.service.id === service.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.service.id === service.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { service, quantity }];
    });
  };

  const removeFromCart = (serviceId: bigint) => {
    setItems((prevItems) => prevItems.filter((item) => item.service.id !== serviceId));
  };

  const updateQuantity = (serviceId: bigint, quantity: number) => {
    if (quantity < 1) return;
    setItems((prevItems) =>
      prevItems.map((item) => (item.service.id === serviceId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      const unitPrice = Number(item.service.baseUnitPriceDh);
      const totalPrice = (unitPrice * item.quantity) / 1000; // Price is per 1000 units
      return total + totalPrice;
    }, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
