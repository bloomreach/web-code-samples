import { Tag } from "@bloomreach/limitless-ui-react";

export const AppliedFacetNumberStats = ({ value, onClear }) => {
  const val = value[0];
  return (
    <div className="flex flex-col gap-2">
      <Tag
        className="font-semibold leading-none"
        key={val}
        onDismiss={() => onClear(val)}
      >
        {val.slice(1, -1).split(" TO ").join(" - ")}
      </Tag>
    </div>
  );
};
