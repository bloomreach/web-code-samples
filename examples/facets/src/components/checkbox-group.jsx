import { useEffect, useState } from "react";
import { CheckboxGroup as CG } from "@bloomreach/limitless-ui-react";

export const CheckboxGroup = ({ options, value, onChange }) => {
  const DEFAULT_DISPLAYED_OPTIONS = 5;
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected(value || []);
  }, [value]);

  const displayedOptions = options.slice(0, DEFAULT_DISPLAYED_OPTIONS);

  return (
    <CG.Root value={selected} onChange={onChange} className="py-2">
      {displayedOptions.map((opt) => (
        <CG.Item value={opt.value}>
          <span className="grow">{opt.label}</span>
          <span className="px-2 bg-slate-200 rounded-full">{opt.count}</span>
        </CG.Item>
      ))}
      {options.length > DEFAULT_DISPLAYED_OPTIONS ? (
        <CG.Overflow>
          <CG.OverflowContent>
            {options.slice(DEFAULT_DISPLAYED_OPTIONS).map((opt) => (
              <CG.Item value={opt.value}>
                <span className="grow">{opt.label}</span>
                <span className="px-2 bg-slate-200 rounded-full">{opt.count}</span>
              </CG.Item>
            ))}
          </CG.OverflowContent>
          <CG.OverflowTrigger />
        </CG.Overflow>
      ) : null}
    </CG.Root>
  );
};
