export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const Price = ({ product, className }) => {
  const salePrice = product.sale_price || product.price;
  const price = product.price;
  const hasDiscount = product.price !== product.sale_price;

  if (!hasDiscount) {
    return <p className={className}>{formatPrice(product.sale_price)}</p>;
  }

  return (
    <p className={className}>
      {formatPrice(product.sale_price)}
      <span className="line-through ml-2">{formatPrice(product.price)}</span>
    </p>
  );
};
