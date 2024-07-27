"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {Button, MinusIcon, PlusIcon, TrashIcon} from "@bloomreach/react-banana-ui";
import useCart from "../../hooks/useCart";

export default function Page() {
  const router = useRouter();
  const { cart, incrementItem, decrementItem, removeItem, cartCount, cartTotal } = useCart();

  return (
    <div>
      <div className="container py-4">
        <div className="grid gap-8">
          <h1 className="text-2xl font-bold">Cart</h1>
          {
            cart.length > 0 ?
              <>
                <div className="grid gap-6">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[100px_1fr_auto] items-center gap-4 border-b border-slate-200 pb-4"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                      <div className="grid gap-1">
                        <Link href={`/products/${item.id}`}>
                          <h3 className="font-medium">{item.title}</h3>
                        </Link>
                        <p
                          className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => decrementItem(item.id)}
                            disabled={item.count === 1}
                            type="tertiary"
                          >
                            <MinusIcon className="h-4 w-4"/>
                          </Button>
                          <span>{item.count}</span>
                          <Button type="tertiary" onClick={() => incrementItem(item.id)}>
                            <PlusIcon className="h-4 w-4"/>
                          </Button>
                        </div>
                        <div className="flex gap-2 text-right items-center">
                          <p className="font-medium">${item.price.toFixed(2)}</p>
                          <Button type="tertiary" color="danger"
                                  onClick={() => removeItem(item.id)}>
                            <TrashIcon className="h-4 w-4"/>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="grid gap-1">
                    <p className="text-gray-500 dark:text-gray-400">
                      Subtotal ({cartCount} items)
                    </p>
                    <p className="text-2xl font-bold">
                      ${cartTotal}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button type="primary" onClick={() => router.push('/checkout')}>
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </>
              : <div className="p-4 text-center text-xl opacity-50">No items in cart</div>
          }
        </div>
      </div>
    </div>
  );
}
