import _ from "lodash";

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

export const getActiveCategories = (categories, activeCategoryId) => {
  if (!activeCategoryId) {
    return [];
  }
  const categoryMap = _.keyBy(categories, "cat_id");

  const activeCategories = [];

  let currentCategory = categoryMap[activeCategoryId];

  while (currentCategory) {
    activeCategories.unshift(currentCategory.cat_id);
    currentCategory = categoryMap[currentCategory.parent];
  }

  return activeCategories;
};
