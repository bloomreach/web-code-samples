import Link from 'next/link';
import { Badge } from '@bloomreach/react-banana-ui';
import useCart from '../hooks/useCart';
import { SearchBar } from '../components/SearchBar';

export function Header() {
  const { cartCount } = useCart();

  return (
    <>
      <div className="flex gap-2 items-center mt-4 mb-8">
        <div className="flex gap-2 items-center grow">
          <Link href="/">
            <img src="/br-logo-primary.svg" alt="" width={150} />
          </Link>
          <span>✨</span>
          <div className="text-lg font-semibold text-[#002840]">
            Pixel
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div>
            <Link href="/user" className="flex gap-2">User</Link>
          </div>
          <div>
            <Link href="/cart" className="flex gap-2">
              <Badge
                content={cartCount}
              >
                <span className="pr-2">Cart</span>
              </Badge>

            </Link>
          </div>
        </div>
      </div>
      <SearchBar />

    </>
  );
}
