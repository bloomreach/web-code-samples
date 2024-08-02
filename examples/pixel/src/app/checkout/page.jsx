'use client';

import { useState } from 'react';
import { Button } from '@bloomreach/react-banana-ui';
import { nanoid } from 'nanoid';
import useCart from '../../hooks/useCart';
import useAnalytics from '../../hooks/useAnalytics';

export default function Page() {
  const { cart, cartCount, cartTotal, clearCart } = useCart();
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);
  const { trackEvent } = useAnalytics();

  const onConversion = () => {
    trackEvent({
      event: 'view_conversion',
      cartTotal,
      orderId: nanoid(),
      cart,
    });
    clearCart();
    setIsPurchaseComplete(true);
  };

  if (isPurchaseComplete) {
    return (
      <div className="container py-4">
        <h1 className="text-2xl font-bold">Purchase complete!</h1>
        <p className="text-gray-500 dark:text-gray-400">
          and conversion event sent.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
        {
          cart.length > 0
            ? (
              <div className="flex flex-col gap-4">
                <div className="text-lg opacity-50">
                  Items (
                  {cartCount}
                  )
                </div>
                <div className="flex flex-row gap-2 flex-wrap">
                  {cart.map((item) => (
                    <img
                      src={item.image}
                      alt={item.title}
                      key={item.id}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                  ))}
                </div>
                <div className="grid gap-1 mt-2">
                  <p className="text-2xl font-bold">
                    Collect payment and shipping here
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Once you click complete purchase, the conversion event is triggered
                  </p>

                </div>
                <div>
                  <Button type="primary" className="ml-auto" onClick={onConversion}>Complete purchase</Button>
                </div>
              </div>
            )
            : <div className="p-4 text-center text-xl opacity-50">No items in cart</div>
        }
      </div>
    </div>
  );
}
