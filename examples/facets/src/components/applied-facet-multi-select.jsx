import { AssetTag } from "@bloomreach/react-banana-ui";

export const AppliedFacetMultiSelect = ({ value, onClear }) => {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {value.map((val) => (
        <AssetTag
          className="applied-facet-tag"
          dismissible
          key={val}
          onDismiss={() => onClear(val)}
        >
          {val}
        </AssetTag>
      ))}
    </div>
  );
};
