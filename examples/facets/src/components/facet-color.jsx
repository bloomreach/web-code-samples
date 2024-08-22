import { CheckboxGroup } from "./checkbox-group";
import RustImg from "../assets/rust.png";
import NaturalImg from "../assets/natural.png";
import {capitalize} from "lodash";

const colorMapping = {
  acorn: 'brown',
  cream: '#f7f5ca',
};

const componentMapping = {
  metallic: <div
    className="w-5 h-5 rounded-full border border-gray-100 bg-gradient-to-r from-slate-400 to-gray-50"></div>,
  rust: <img src={RustImg} alt="Rust preview" className="w-5 h-5 rounded-full border border-gray-100"/>,
  natural: <img src={NaturalImg} alt="Rust preview" className="w-5 h-5 rounded-full border border-gray-100"/>,
}

function getPreview(value) {
  if (componentMapping[value]) {
    return componentMapping[value];
  }

  const color = colorMapping[value] || value;
  return <div
    className="w-5 h-5 rounded-full border border-gray-100"
    style={{backgroundColor: color}}
  ></div>
}

export const FacetColor = ({facet, value, onChange}) => {
  const options = facet.value.map((val) => ({
    label: (
      <div className="flex gap-2 items-center">
        {getPreview(val.name)}
        {" "}
        {capitalize(val.name)}
      </div>
    ),
    value: val.name,
    count: val.count,
  }));

  return <CheckboxGroup options={options} value={value} onChange={onChange} />;
};
