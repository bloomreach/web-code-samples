import { Button, ClearFillIcon } from "@bloomreach/react-banana-ui";

export const AppliedFacetCategory = ({ facet, value, onClear }) => {
  function getCategoryName(id) {
    const category = facet.value.find((val) => val.cat_id === id);
    return category ? category.cat_name : `ID: ${id}`;
  }

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {value.map((val) => (
        <Button
          className="text-xs px-2 py-1 h-auto"
          type="primary"
          key={val}
          endIcon={<ClearFillIcon size={12} />}
          onClick={() => onClear(val)}
        >
          {getCategoryName(val)}
        </Button>
      ))}
    </div>
  );
};
