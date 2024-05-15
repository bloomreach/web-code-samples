import {AssetTag} from "@bloomreach/react-banana-ui";

export const AppliedFacetNumberRange = ({ value, onClear }) => {
  return (
    <div className="flex flex-col gap-2">
      {value.map((val) => (
        <AssetTag
          className="applied-facet-tag"
          dismissible
          key={val}
          onDismiss={() => onClear(val)}
        >
          {val.slice(1, -1).split(" TO ").join(" - ")}
        </AssetTag>
      ))}
    </div>
  );
};
