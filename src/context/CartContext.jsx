import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const CartContext = createContext();

const WISHLIST_KEY = 'marangi_wishlist';

const loadWishlist = () => {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(loadWishlist);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = useCallback((item) => {
    setWishlistItems((prev) =>
      prev.some((existing) => existing.id === item.id)
        ? prev
        : [...prev, item]
    );
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const isInWishlist = useCallback((id) => {
    return wishlistItems.some((item) => item.id === id);
  }, [wishlistItems]);

  const toggleWishlist = useCallback(() => {
    setIsWishlistOpen((prev) => !prev);
  }, []);

  const closeWishlist = useCallback(() => {
    setIsWishlistOpen(false);
  }, []);

  return (
    <CartContext.Provider
      value={{
        wishlistItems,
        isWishlistOpen,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        closeWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
