import get from 'lodash.get';
import {api} from 'services';

const extractArray = (response) => {
  const payload = get(response, 'data', response);
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(get(payload, 'result.data'))) {
    return get(payload, 'result.data');
  }
  if (Array.isArray(get(payload, 'content'))) {
    return get(payload, 'content');
  }
  return [];
};

export const fetchCategoryTree = async () => {
  const [catalogRes, categoryRes, subCategoryRes] = await Promise.all([
    api.request.get('/api/v1/catalog/all'),
    api.request.get('/api/v1/category/all', {params: {page: 0, size: 1000}}),
    api.request.get('/api/v1/sub-category/all', {params: {page: 0, size: 1000}})
  ]);

  const catalogs = extractArray(catalogRes);
  const categories = extractArray(categoryRes);
  const subCategories = extractArray(subCategoryRes);

  return catalogs.map(catalog => {
    const catalogId = get(catalog, 'id');
    const catalogName = get(catalog, 'nameRu') || get(catalog, 'nameUz') || get(catalog, 'nameEn');

    const catalogCategories = categories
      .filter(category => get(category, 'catalog.id') === catalogId)
      .map(category => {
        const categoryId = get(category, 'id');
        const categoryName = get(category, 'nameRu') || get(category, 'nameUz') || get(category, 'nameEn');
        const subCats = subCategories
          .filter(subCategory => get(subCategory, 'parentCategoryId') === categoryId)
          .map(subCategory => ({
            id: get(subCategory, 'id'),
            name: get(subCategory, 'nameRu') || get(subCategory, 'nameUz') || get(subCategory, 'nameEn'),
            sub_categories: []
          }));

        return {
          id: categoryId,
          name: categoryName,
          sub_categories: subCats
        };
      });

    return {
      id: catalogId,
      name: catalogName,
      sub_categories: catalogCategories
    };
  }).filter(item => item.sub_categories && item.sub_categories.length);
};
