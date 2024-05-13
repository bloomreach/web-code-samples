import { Button, ClearFillIcon } from "@bloomreach/react-banana-ui";

export const AppliedFacetMultiSelect = ({ value, onClear }) => {
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
          {val}
        </Button>
      ))}
    </div>
  );
};
