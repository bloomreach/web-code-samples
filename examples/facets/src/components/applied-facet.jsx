import { AppliedFacetMultiSelect } from "./applied-facet-multi-select";
import { AppliedFacetNumberStats } from "./applied-facets-number-stats";
import { AppliedFacetCategory } from "./applied-facet-category";
import { AppliedFacetNumberRange } from "./applied-facet-number-range";

export const AppliedFacet = ({ facet, value, onClear }) => {
  return (
    <div className="mb-4">
      <div className="text-xs font-semibold mb-2 uppercase">{facet.name}</div>
      <div className="flex flex-row flex-wrap gap-2">
        <AppliedFacetInner facet={facet} value={value} onClear={onClear} />
      </div>
    </div>
  );
};

export const AppliedFacetInner = ({ facet, value, onClear }) => {
  if (facet.name === "category") {
    return (
      <AppliedFacetCategory facet={facet} value={value} onClear={onClear} />
    );
  }

  if (facet.type === "text" || facet.type === "number") {
    return (
      <AppliedFacetMultiSelect facet={facet} value={value} onClear={onClear} />
    );
  }

  if (facet.type === "number_stats") {
    return (
      <AppliedFacetNumberStats facet={facet} value={value} onClear={onClear} />
    );
  }

  if (facet.type === "number_range") {
    return (
      <AppliedFacetNumberRange facet={facet} value={value} onClear={onClear} />
    );
  }

  return <div className="text-sm">Unknown facet type: {facet.type}</div>;
};
