import { CheckboxGroup } from "./checkbox-group";

export const FacetNumberRange = ({ facet, value, onChange }) => {
  const options = facet.value.map((val) => ({
    label: `${val.start} - ${val.end}`,
    value: `[${val.start} TO ${val.end}]`,
    count: val.count,
  }));

  return <CheckboxGroup options={options} value={value} onChange={onChange} />;
};
