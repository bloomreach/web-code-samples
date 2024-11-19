import { AssetTag } from "@bloomreach/react-banana-ui";
import { Tag } from "@bloomreach/limitless-ui-react";
import {capitalize} from "lodash";

export const AppliedFacetMultiSelect = ({ value, onClear }) => {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {value.map((val) => (
        <Tag
          className="font-semibold leading-none"
          key={val}
          onDismiss={() => onClear(val)}
        >
          {capitalize(val)}
        </Tag>
      ))}
    </div>
  );
};
