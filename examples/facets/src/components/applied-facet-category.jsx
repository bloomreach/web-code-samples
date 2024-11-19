import { Tag } from "@bloomreach/limitless-ui-react";

export const AppliedFacetCategory = ({ facet, value, onClear }) => {
  function getCategoryName(id) {
    const category = facet.value.find((val) => val.cat_id === id);
    return category ? category.cat_name : `ID: ${id}`;
  }

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {value.map((val) => (
        <Tag
          className="font-semibold leading-none"
          key={val}
          onDismiss={() => onClear(val)}
        >
          {getCategoryName(val)}
        </Tag>
      ))}
    </div>
  );
};
