import { ChevronDownIcon, ChevronRightIcon } from "@bloomreach/react-banana-ui";

export const Nav = ({ items, active, onSelect }) => {
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
              <a
                onClick={() => onSelect(item.cat_id)}
                className={`
                                block
                                cursor-pointer 
                                text-sm 
                                items-center
                                ${isActive ? "font-semibold" : ""}
                                ${!hasChildren ? "pl-6" : ""}
                                `}
              >
                {item.cat_name} ({item.count})
              </a>
            </div>
            {isActive && hasChildren ? (
              <div className="my-2 px-4">
                <Nav
                  items={item.children}
                  active={active}
                  onSelect={onSelect}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
