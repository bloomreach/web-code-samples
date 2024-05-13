import { CheckboxGroup } from "./checkbox-group";

export const FacetMultiSelect = ({ facet, value, onChange }) => {
  const options = facet.value.map((val) => ({
    label: val.name,
    value: val.name,
    count: val.count,
  }));

  return <CheckboxGroup options={options} value={value} onChange={onChange} />;
};
