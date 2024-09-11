import Link from 'next/link';
import Highlighter from 'react-highlight-words';
import { Price } from './Price';

export function ProductCard({ product, highlight, href, onClick }) {
  return (
    <article className="flex flex-col gap-2 shadow-md rounded-md border border-slate-100">
      <Link href={href} {...{ onClick }}>
        <figure
          className="rounded-t-md"
        >
          <img
            src={product.thumb_image}
            alt={product.title}
            className="rounded-t-md w-full object-cover object-top max-h-56"
          />
        </figure>
      </Link>
      <div className="flex flex-col px-2 gap-1 grow">
        {product.brand ? <div className="uppercase opacity-50 text-xs">{product.brand}</div> : null}
        <Link href={href} {...{ onClick }}>
          <Highlighter
            highlightClassName="bg-amber-300 rounded"
            className="w-full text-sm font-bold"
            searchWords={[highlight]}
            textToHighlight={product.title}
          />
        </Link>
        {product.variants?.length > 1 ? (
          <p className="text-sm opacity-50">
            {product.variants.length}
            {' '}
            variants
          </p>
        ) : null}
      </div>
      <Price className="p-2 text-sm" product={product} />
    </article>
  );
}
