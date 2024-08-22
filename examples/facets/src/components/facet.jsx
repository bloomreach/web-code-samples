import {
  Accordion,
  AccordionHeader,
  AccordionContent
} from "@bloomreach/react-banana-ui";
import { FacetMultiSelect } from "./facet-multi-select";
import { FacetNumberStats } from "./facet-number-stats";
import { FacetCategory } from "./facet-category";
import { FacetNumberRange } from "./facet-number-range";
import { FacetColor } from "./facet-color";

export const Facet = ({ facet, value, onChange }) => {
  if (facet.value && !(facet.type === "text" && !facet.value.length)) {
    return (
      <Accordion value={facet.name}>
        <AccordionHeader>
          <span className="grow text-sm uppercase">{facet.name}</span>
        </AccordionHeader>
        <AccordionContent>
          <FacetInner facet={facet} value={value} onChange={onChange} />
        </AccordionContent>
      </Accordion>
    );
  } else {
    return null;
  }
};

export const FacetInner = ({ facet, value, onChange }) => {
  if (facet.name === "category") {
    return <FacetCategory facet={facet} value={value} onChange={onChange} />;
  }

  if (facet.name.toLowerCase().includes("color")) {
    return <FacetColor facet={facet} value={value} onChange={onChange} />;
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
