import { Button, ClearFillIcon } from "@bloomreach/react-banana-ui";

export const AppliedFacetNumberRange = ({ value, onClear }) => {
  return (
    <div className="flex flex-col gap-2">
      {value.map((val) => (
        <Button
          className="text-xs px-2 py-1 h-auto"
          type="primary"
          endIcon={<ClearFillIcon size={12} />}
          onClick={() => onClear(val)}
        >
          {val.slice(1, -1).split(" TO ").join(" - ")}
        </Button>
      ))}
    </div>
  );
};
