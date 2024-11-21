'use client';

import Link from 'next/link';
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
      <div className="flex flex-col gap-1 py-4 items-center ">
        <img src="/conversion.png" alt="Purchase complete" className="w-full max-w-xl" />
        <h1 className="text-2xl font-semibold">Thanks for your purchase!</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your order has been confirmed and we will email you when your product is on the way.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      {
        cart.length > 0
          ? (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-4 md:w-1/2">
                <div className="flex gap-2 items-center">
                  <div className="text-lg opacity-50">
                    Items (
                    {cartCount}
                    )
                  </div>
                  &middot;
                  <Link href="/cart" className="text-blue-400 hover:underline inline-flex flex-row gap-2 items-center">
                    Edit Cart
                  </Link>
                </div>
                <div className="flex flex-col">
                  {cart.map((item) => (
                    <div key={item.id} className="flex flex-row">
                      <div className="relative w-1/3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="rounded-md object-cover w-full"
                        />

                      </div>
                      <div className="flex flex-col w-full p-2">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-600">
                          {item.subtitle}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price:
                          {' '}
                          $
                          {item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty:
                          {' '}
                          {item.count}
                        </p>
                        <p className="text-sm text-gray-600">
                          Item total:
                          {' '}
                          $
                          {(item.price * item.count).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col md:w-1/2">
                <div className="grid gap-1 mt-2">
                  <div className="text-2xl font-bold px-4">
                    Payment &amp; shipping
                  </div>
                  <img src="/payment.png" alt="Payment form" className="w-full max-w-xl" />
                </div>
                <Button type="primary" className="mx-4" onClick={onConversion}>
                  Pay $
                  {cartTotal}
                </Button>
              </div>
            </div>
          )
          : <div className="p-4 text-center text-xl opacity-50">No items in cart</div>
      }
    </div>
  );
}
