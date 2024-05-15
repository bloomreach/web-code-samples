import { useState, useEffect } from "react";
import { Button } from "@bloomreach/react-banana-ui";

export const RangeInput = ({ value, onChange }) => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  const handleChange = () => {
    onChange([min, max]);
  };

  useEffect(() => {
    const [valueMin, valueMax] = value;
    setMin(valueMin);
    setMax(valueMax);
  }, [value]);

  return (
    <div className="px-4 py-2 flex flex-row gap-2 items-center">
      <input
        className="text-sm border p-2 w-24"
        type="number"
        value={min}
        onChange={(e) => setMin(e.target.value)}
      />
      to
      <input
        className="text-sm border p-2 w-24"
        type="number"
        value={max}
        onChange={(e) => setMax(e.target.value)}
      />
      <Button onClick={handleChange}>Go</Button>
    </div>
  );
};
