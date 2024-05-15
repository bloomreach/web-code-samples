import {AssetTag} from "@bloomreach/react-banana-ui";

export const AppliedFacetNumberStats = ({ value, onClear }) => {
  const val = value[0];
  return (
    <div className="flex flex-col gap-2">
      <AssetTag
        className="applied-facet-tag"
        dismissible
        key={val}
        onDismiss={() => onClear(val)}
      >
        {val.slice(1, -1).split(" TO ").join(" - ")}
      </AssetTag>
    </div>
  );
};
