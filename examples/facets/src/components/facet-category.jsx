import _ from "lodash";
import { CheckboxGroup } from "./checkbox-group";

export const buildCategoryHierarchy = (categories) => {
  if (!categories) {
    return [];
  }

  const categoriesClone = _.cloneDeep(categories);
  const categoryMap = _.keyBy(categoriesClone, "cat_id");

  categoriesClone.forEach((category) => {
    if (category.parent) {
      const parent = categoryMap[category.parent];
      parent.children = parent.children || [];
      parent.children.push(category);
    }
  });

  const roots = _.values(categoryMap).filter((val) => !val.parent);
  return roots;
};

export const FacetCategory = ({ facet, value, onChange }) => {
  const categories = buildCategoryHierarchy(facet.value);
  const options = categories.map((category) => ({
    label: category.cat_name,
    value: category.cat_id,
    count: category.count,
  }));

  return <CheckboxGroup options={options} value={value} onChange={onChange} />;
};
