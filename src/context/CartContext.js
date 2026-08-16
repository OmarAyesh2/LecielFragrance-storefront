'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { supabase } from '../lib/supabase';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  // Load initial cart
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // Fetch from DB
        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select(`
              id,
              product_id,
              variant_id,
              quantity,
              products (
                name_en,
                name_ar,
                image_url,
                base_price,
                sale_price
              )
            `)
            .eq('user_id', user.id);

          if (!error && data) {
            // Map data to local state format
            const dbCart = data.map(item => ({
              cartItemId: item.id,
              productId: item.product_id,
              variantId: item.variant_id,
              quantity: item.quantity,
              name_en: item.products.name_en,
              name_ar: item.products.name_ar,
              image_url: item.products.image_url,
              price: item.products.sale_price || item.products.base_price,
            }));

            // Merge local cart if exists
            const saved = localStorage.getItem('leciel-cart');
            if (saved) {
              try {
                const localCart = JSON.parse(saved);
                if (localCart.length > 0) {
                  for (const localItem of localCart) {
                    const existing = dbCart.find(i => i.productId === localItem.productId && i.variantId === localItem.variantId);
                    if (existing) {
                      // Update DB quantity
                      const newQty = existing.quantity + localItem.quantity;
                      await supabase.from('cart_items').update({ quantity: newQty }).eq('id', existing.cartItemId);
                      existing.quantity = newQty;
                    } else {
                      // Insert new to DB
                      const { data: newDbItem } = await supabase.from('cart_items').insert({
                        user_id: user.id,
                        product_id: localItem.productId,
                        variant_id: localItem.variantId,
                        quantity: localItem.quantity,
                        price: localItem.price
                      }).select().single();
                      
                      if (newDbItem) {
                        dbCart.push({
                          ...localItem,
                          cartItemId: newDbItem.id
                        });
                      }
                    }
                  }
                  // Clear local cart
                  localStorage.removeItem('leciel-cart');
                }
              } catch (e) {
                console.error('Error merging local cart', e);
              }
            }
            setCartItems(dbCart);
          }
        } catch (err) {
          console.error("Failed to load DB cart", err);
        }
      } else {
        // Load from local storage
        const saved = localStorage.getItem('leciel-cart');
        if (saved) {
          try { setCartItems(JSON.parse(saved)); } catch (e) {}
        }
      }
      setIsInitialized(true);
    };

    loadCart();
  }, [user]);

  // Save to local storage for guests ONLY
  useEffect(() => {
    if (isInitialized && !user) {
      localStorage.setItem('leciel-cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized, user]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const addToCart = async (newItem) => {
    if (user) {
      // DB Mutation
      const existing = cartItems.find(item => item.productId === newItem.productId && item.variantId === newItem.variantId);
      if (existing) {
        const newQty = existing.quantity + (newItem.quantity || 1);
        const { error } = await supabase.from('cart_items').update({ quantity: newQty }).eq('id', existing.cartItemId);
        
        if (error) {
          addToast("Database Error: " + error.message, 'error');
          return;
        }
        setCartItems(prev => prev.map(i => i.cartItemId === existing.cartItemId ? { ...i, quantity: newQty } : i));
      } else {
        const { data, error } = await supabase.from('cart_items').insert({
          user_id: user.id,
          product_id: newItem.productId,
          variant_id: newItem.variantId || null,
          quantity: newItem.quantity || 1,
          price: newItem.price
        }).select().single();
        
        if (error) {
          addToast("Database Error: " + error.message, 'error');
          return;
        }
        if (data) {
          setCartItems(prev => [...prev, { ...newItem, quantity: newItem.quantity || 1, cartItemId: data.id }]);
        }
      }
    } else {
      // Local State
      setCartItems(prev => {
        const existingIndex = prev.findIndex(item => 
          item.productId === newItem.productId && item.variantId === newItem.variantId
        );
        if (existingIndex > -1) {
          const copy = [...prev];
          copy[existingIndex].quantity += newItem.quantity || 1;
          return copy;
        }
        return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
      });
    }
  };

  const removeFromCart = async (productId, variantId) => {
    if (user) {
      const existing = cartItems.find(i => i.productId === productId && i.variantId === variantId);
      if (existing && existing.cartItemId) {
        await supabase.from('cart_items').delete().eq('id', existing.cartItemId);
      }
    }
    setCartItems(prev => prev.filter(item => 
      !(item.productId === productId && item.variantId === variantId)
    ));
  };

  const updateQuantity = async (productId, variantId, qty) => {
    if (qty < 1) return removeFromCart(productId, variantId);
    
    if (user) {
      const existing = cartItems.find(i => i.productId === productId && i.variantId === variantId);
      if (existing && existing.cartItemId) {
        await supabase.from('cart_items').update({ quantity: qty }).eq('id', existing.cartItemId);
      }
    }
    setCartItems(prev => prev.map(item => 
      (item.productId === productId && item.variantId === variantId) ? { ...item, quantity: qty } : item
    ));
  };

  const clearCart = async () => {
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    }
    setCartItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{ 
      cartItems, cartCount, cartSubtotal, 
      addToCart, removeFromCart, updateQuantity, clearCart, 
      isCartOpen, openCart, closeCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
