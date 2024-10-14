import Link from 'next/link';
import Highlighter from 'react-highlight-words';
import { ProductCard as PC } from '@bloomreach/limitless-ui-react';

export function ProductCard({ product, highlight, href, onClick }) {
  return (
    <PC.Root>
      <PC.Header>
        <Link href={href} {...{ onClick }}>
          <PC.Image src={product.thumb_image} alt={product.title}  />
        </Link>
      </PC.Header>
      <PC.Body>
        <Link href={href} {...{ onClick }}>
          <Highlighter
            highlightClassName="bg-amber-300 rounded"
            className="w-full text-sm font-bold"
            searchWords={[highlight]}
            textToHighlight={product.title}
          />
        </Link>
        {product.variants?.length > 1 ? (
          <PC.SubTitle>{`${product.variants.length} variants`}</PC.SubTitle>
        ) : null}
      </PC.Body>
      <PC.Footer>
        <PC.Price price={product.price} salePrice={product.sale_price} />
      </PC.Footer>
    </PC.Root>
  );
}
