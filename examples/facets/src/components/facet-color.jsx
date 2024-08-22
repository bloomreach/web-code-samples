import { CheckboxGroup } from "./checkbox-group";

export const FacetColor = ({ facet, value, onChange }) => {
  const options = facet.value.map((val) => ({
    label: (
      <div className="flex gap-2 items-center">
        <div
          className="w-5 h-5 rounded-full border border-gray-100"
          style={{ backgroundColor: val.name }}
        ></div>
        {" "}
        {val.name}
      </div>
    ),
    value: val.name,
    count: val.count,
  }));

  return <CheckboxGroup options={options} value={value} onChange={onChange} />;
};
