import { useState, useEffect } from "react";
import { Range, Currency } from "@bloomreach/limitless-ui-react";

export const FacetNumberStats = ({ facet, value, onChange }) => {
  const [rangeValue, setRangeValue] = useState([facet.value.start, facet.value.end]);

  useEffect(() => {
    const parsedValue = value
      ? value[0]
          .slice(1, -1)
          .split(" TO ")
          .map((fragment) => parseFloat(fragment))
      : [];

    const _min = parsedValue[0] || facet.value.start;
    const _max = parsedValue[1] || facet.value.end;
    setRangeValue([_min, _max]);
  }, [facet, value]);

  const handleChange = (value) => {
    if (value[0] !== facet.value.start || value[1] !== facet.value.start) {
      onChange([`[${value[0]} TO ${value[1]}]`]);
    } else {
      onChange();
    }
  };

  return (
    <div className="py-4">
      <Range.Root autoUpdate={false} min={facet.value.start} max={facet.value.end} step={0.01} value={rangeValue} onChange={(newValue) => {handleChange(newValue)}}>
        <Range.Slider />
        <Range.Inputs>
          {facet.name.includes("price") && <Currency />}
          <Range.MinInput />
          <Range.Separator />
          {facet.name.includes("price") && <Currency />}
          <Range.MaxInput />
        </Range.Inputs>
        <Range.UpdateButton>Update</Range.UpdateButton>
      </Range.Root>
    </div>
  );
};
