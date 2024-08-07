export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export function Price({ product, className }) {
  const hasDiscount = product.price !== product.sale_price;

  if (!hasDiscount) {
    return <p className={className}>{formatPrice(product.sale_price)}</p>;
  }

  return (
    <p className={className}>
      {formatPrice(product.sale_price)}
      <span className="line-through ml-2 opacity-50">{formatPrice(product.price)}</span>
    </p>
  );
}
