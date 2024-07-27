import Link from 'next/link';
import { ChevronDownIcon, ChevronRightIcon } from '@bloomreach/react-banana-ui';

export function CategoryNav({ items, active }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = active.includes(item.cat_id);
        return (
          <div key={item.cat_id}>
            <div className="flex flex-row gap-2 items-center">
              {isActive && hasChildren ? <ChevronDownIcon /> : null}
              {!isActive && hasChildren ? <ChevronRightIcon /> : null}
              <Link
                href={`/categories/${item.cat_id}`}
                className={`
                                block
                                cursor-pointer
                                text-sm
                                items-center
                                ${isActive ? 'font-semibold' : ''}
                                ${!hasChildren ? 'pl-6' : ''}
                                `}
              >
                {item.cat_name}
                {' '}
                (
                {item.count}
                )
              </Link>
            </div>
            {isActive && hasChildren ? (
              <div className="my-2 px-4">
                <CategoryNav
                  items={item.children}
                  active={active}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
