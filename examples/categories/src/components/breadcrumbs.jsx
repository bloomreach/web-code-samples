import { ChevronRightIcon } from "@bloomreach/react-banana-ui";

export const Breadcrumbs = ({ items, active, onSelect }) => {
  if (!active || active.length === 0) {
    return null;
  }

  const crumbs = active.map((id) => {
    return items.find((item) => item.cat_id === id);
  });

  return (
    <div className="flex flex-row gap-2 border-b py-2">
      {crumbs.map((crumb, index) => {
        return (
          <div className="flex flex-row items-center gap-2" key={crumb.cat_id}>
            <a
              onClick={() => onSelect(crumb.cat_id)}
              className="cursor-pointer text-sm"
            >
              {crumb.cat_name}
            </a>
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
};
