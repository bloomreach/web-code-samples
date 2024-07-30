import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

function useCart() {
  const [cart, setCart] = useLocalStorage('BrPixelDemoCart', []);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    setCartCount(cart.reduce((total, item) => total + item.count, 0));
    setCartTotal(cart.reduce((total, item) => total + item.price * item.count, 0).toFixed(2));
  }, [cart]);

  const incrementItem = (id, count = 1) => {
    const newCart = cart.map((cItem) => {
      if (cItem.id === id) {
        return { ...cItem, ...{ count: cItem.count + count } };
      }
      return cItem;
    });

    setCart(newCart);
  };

  const addItem = (item, count = 1) => {
    const itemInCart = cart.find((cItem) => cItem.id === item.id);

    if (itemInCart) {
      incrementItem(item.id, count);
    } else {
      const newCart = [...[{ ...item, ...{ count } }], ...cart];
      setCart(newCart);
    }
  };

  const removeItem = (id) => {
    const newCart = cart.filter((cItem) => cItem.id !== id);
    setCart(newCart);
  };

  const decrementItem = (id, count = 1) => {
    const newCart = cart.map((cItem) => {
      if (cItem.id === id) {
        return { ...cItem, ...{ count: cItem.count - count } };
      }
      return cItem;
    });

    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    cartCount,
    cartTotal,
    addItem,
    removeItem,
    incrementItem,
    decrementItem,
    clearCart,
  };
}
export default useCart;
