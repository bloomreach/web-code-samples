import { Tag } from "@bloomreach/limitless-ui-react";

export const AppliedFacetNumberRange = ({ value, onClear }) => {
  return (
    <div className="flex flex-col gap-2">
      {value.map((val) => (
        <Tag
          className="font-semibold leading-none"
          key={val}
          onDismiss={() => onClear(val)}
        >
          {val.slice(1, -1).split(" TO ").join(" - ")}
        </Tag>
      ))}
    </div>
  );
};
