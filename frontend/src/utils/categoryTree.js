export const flattenCategoryTree = (tree = []) => {
  const rows = [];
  tree.forEach((parent) => {
    rows.push({
      ...parent,
      isChild: false,
      parentName: null,
    });
    (parent.children || []).forEach((child) => {
      rows.push({
        ...child,
        isChild: true,
        parentName: parent.name,
      });
    });
  });
  return rows;
};

export const buildCategoryOptions = (tree = []) =>
  tree.flatMap((parent) => {
    const parentOption = {
      id: parent.id,
      slug: parent.slug,
      name: parent.name,
      displayName: parent.name,
      isChild: false,
    };
    const childOptions = (parent.children || []).map((child) => ({
      id: child.id,
      slug: child.slug,
      name: child.name,
      displayName: `${parent.name} / ${child.name}`,
      isChild: true,
    }));
    return [parentOption, ...childOptions];
  });

export const getParentOptions = (tree = []) =>
  tree.map((parent) => ({
    id: parent.id,
    name: parent.name,
    slug: parent.slug,
  }));

export const getChildSlugs = (parent = {}) =>
  (parent.children || []).map((child) => child.slug).filter(Boolean);

