import { useState } from "react";
import { Button, PlusIcon, MinusIcon } from "@bloomreach/react-banana-ui";
import { FacetMultiSelect } from "./facet-multi-select";
import { FacetNumberStats } from "./facet-number-stats";
import { FacetCategory } from "./facet-category";
import { FacetNumberRange } from "./facet-number-range";

export const Facet = ({ facet, value, onChange }) => {
  const [expanded, setExpanded] = useState(!!value);
  if (facet.value && !(facet.type === "text" && !facet.value.length)) {
    return (
      <div className="border-b">
        <Button
          className="facet-label flex py-6 w-full border-0"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="grow text-left uppercase">{facet.name}</span>
          {expanded ? <MinusIcon /> : <PlusIcon />}
        </Button>
        {expanded ? (
          <FacetInner facet={facet} value={value} onChange={onChange} />
        ) : null}
      </div>
    );
  } else {
    return null;
  }
};

export const FacetInner = ({ facet, value, onChange }) => {
  if (facet.name === "category") {
    return <FacetCategory facet={facet} value={value} onChange={onChange} />;
  }

  if (facet.type === "text" || facet.type === "number") {
    return <FacetMultiSelect facet={facet} value={value} onChange={onChange} />;
  }

  if (facet.type === "number_stats") {
    return <FacetNumberStats facet={facet} value={value} onChange={onChange} />;
  }

  if (facet.type === "number_range") {
    return <FacetNumberRange facet={facet} value={value} onChange={onChange} />;
  }

  return <div className="text-sm">Unknown facet type: {facet.type}</div>;
};
