import { useEffect, useState } from "react";
import { Button } from "@bloomreach/react-banana-ui";

export const CheckboxGroup = ({ options, value, onChange }) => {
  const DEFAULT_DISPLAYED_OPTIONS = 5;
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (event) => {
    let newSelected;
    if (event.target.checked) {
      newSelected = [...[], ...(selected || []), event.target.value];
    } else {
      newSelected = selected.filter((item) => item !== event.target.value);
    }
    onChange(newSelected);
  };

  const displayedOptions = expanded
    ? options
    : options.slice(0, DEFAULT_DISPLAYED_OPTIONS);

  return (
    <div className="py-2 px-4">
      <div className="py-2 flex flex-col gap-2">
        {displayedOptions.map((opt) => (
          <label className="text-sm flex gap-2" key={opt.value}>
            <input
              type="checkbox"
              value={opt.value}
              onChange={handleChange}
              checked={selected ? selected.includes(opt.value) : false}
            />
            <span className="grow">{opt.label}</span>
            <span className="px-2 bg-slate-200 rounded">{opt.count}</span>
          </label>
        ))}
      </div>
      {!expanded && options.length > DEFAULT_DISPLAYED_OPTIONS ? (
        <Button
          type="secondary"
          className="py-1 px-2 mt-2 text-xs h-auto"
          onClick={() => setExpanded(true)}
        >
          + View all ({options.length})
        </Button>
      ) : null}
    </div>
  );
};
