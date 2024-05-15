import {AssetTag} from "@bloomreach/react-banana-ui";

export const AppliedFacetCategory = ({ facet, value, onClear }) => {
  function getCategoryName(id) {
    const category = facet.value.find((val) => val.cat_id === id);
    return category ? category.cat_name : `ID: ${id}`;
  }

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {value.map((val) => (
        <AssetTag
          className="applied-facet-tag"
          dismissible
          key={val}
          onDismiss={() => onClear(val)}
        >
          {getCategoryName(val)}
        </AssetTag>
      ))}
    </div>
  );
};
