import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- Logic: Add to Cart ---
  const addToCart = (product, selectedSize, selectedColor) => {
    setCart((prevCart) => {
      // Check if this exact item (same ID, Size, and Color) is already in the cart
      const existingItem = prevCart.find(
        (item) => 
          item.id === product.id && 
          item.size === selectedSize && 
          item.color === selectedColor
      );

      if (existingItem) {
        // If it exists, just increase the quantity
        return prevCart.map((item) =>
          item === existingItem ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      // If it's new, add it with quantity 1
      return [...prevCart, { ...product, size: selectedSize, color: selectedColor, quantity: 1 }];
    });
    
    // Automatically open the side-drawer when an item is added
    setIsCartOpen(true);
  };

  // --- Logic: Remove from Cart ---
  const removeFromCart = (itemId, size, color) => {
    setCart(cart.filter(item => !(item.id === itemId && item.size === size && item.color === color)));
  };

  // --- Logic: Calculate Total Price ---
  const cartTotal = cart.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);
  
  // --- Logic: Calculate Total Item Count ---
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      cartTotal, 
      cartCount, 
      isCartOpen, 
      setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to make using the cart easier in other files
export const useCart = () => useContext(CartContext);