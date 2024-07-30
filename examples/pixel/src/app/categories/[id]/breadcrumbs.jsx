import Link from 'next/link';
import { ChevronRightIcon } from '@bloomreach/react-banana-ui';

export function Breadcrumbs({ items, active }) {
  if (!active || active.length === 0) {
    return null;
  }

  const crumbs = active.map((id) => {
    return items.find((item) => item.cat_id === id);
  });

  return (
    <div className="flex flex-row gap-2 py-2">
      {crumbs.map((crumb, index) => {
        return (
          <div className="flex flex-row items-center gap-2" key={crumb.cat_id}>
            <Link
              href={`/categories/${crumb.cat_id}`}
              className="cursor-pointer text-sm"
            >
              {crumb.cat_name}
            </Link>
            {index < crumbs.length - 1 ? (
              <span>
                <ChevronRightIcon />
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
