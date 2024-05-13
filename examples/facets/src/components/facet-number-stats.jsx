import { useState, useEffect } from "react";
import { RangeInput } from "./range-input";

export const FacetNumberStats = ({ facet, value, onChange }) => {
  const [min, setMin] = useState(facet.value.start);
  const [max, setMax] = useState(facet.value.end);

  useEffect(() => {
    const parsedValue = value
      ? value[0]
          .slice(1, -1)
          .split(" TO ")
          .map((fragment) => parseFloat(fragment))
      : [];

    setMin(parsedValue[0] || facet.value.start);
    setMax(parsedValue[1] || facet.value.end);
  }, [facet, value]);

  const handleChange = (value) => {
    if (value[0] !== facet.value.start || value[1] !== facet.value.start) {
      onChange([`[${value[0]} TO ${value[1]}]`]);
    } else {
      onChange();
    }
  };

  return <RangeInput value={[min, max]} onChange={handleChange} />;
};
