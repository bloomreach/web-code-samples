import { formatPrice } from '@bloomreach/limitless-ui-react'

export function Price({ product, className }) {
  const hasDiscount = product.price && product.sale_price && product.price !== product.sale_price;

  if (!hasDiscount) {
    return <p className={className}>{formatPrice(product.sale_price)}</p>;
  }

  return (
    <p className={className}>
      {product.price ? <span className="line-through mr-2 opacity-50">{formatPrice(product.price)}</span> : null}
      <span className="text-rose-500">{formatPrice(product.sale_price)}</span>
    </p>
  );
}
