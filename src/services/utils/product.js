import get from 'lodash.get';
import api from '../api';
import config from '../../config';

const isAbsoluteUrl = (value = '') => /^https?:\/\//i.test(value);

export const buildProductImageUrl = (image = {}) => {
  if (!image) {
    return '';
  }

  const id = get(image, 'id') || get(image, 'imageId');
  if (id && api?.productImages?.getImageUrl) {
    return api.productImages.getImageUrl(id);
  }

  const path = get(image, 'path') || get(image, 'image') || get(image, 'url') || get(image, 'name');
  if (path) {
    if (isAbsoluteUrl(path)) {
      return path;
    }
    if (path.startsWith('/api/')) {
      return api.buildApiUrl ? api.buildApiUrl(path) : path;
    }
    return `${config.FILE_ROOT || ''}${path}`;
  }

  return '';
};

export const normalizeProductImages = (rawProduct) => {
  const product = get(rawProduct, 'product') || rawProduct || {};
  const images = Array.isArray(get(product, 'images')) ? get(product, 'images') : [];
  const normalized = images
    .map((image, index) => {
      const src = buildProductImageUrl(image);
      if (!src) {
        return null;
      }
      return {
        id: get(image, 'id') || get(image, 'imageId') || get(image, 'uuid') || `image-${index}`,
        src,
        original: image
      };
    })
    .filter(Boolean);

  if (!normalized.length) {
    const mainImage = get(product, 'main_image') || get(product, 'mainImage');
    if (mainImage) {
      normalized.push({
        id: 'main-image',
        src: isAbsoluteUrl(mainImage) ? mainImage : `${config.FILE_ROOT || ''}${mainImage}`,
        original: {path: mainImage}
      });
    }
  }

  return normalized;
};

export const resolveProductImageUrls = (rawProduct) =>
  normalizeProductImages(rawProduct).map(item => item.src);

export const resolvePrimaryImageUrl = (rawProduct) => {
  const urls = resolveProductImageUrls(rawProduct);
  return urls.length ? urls[0] : '';
};

export const normalizeSummaryProducts = (items = []) => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(prod => ({
    ...prod,
    name: get(prod, 'nameRu') || get(prod, 'nameUz') || get(prod, 'nameEn') || get(prod, 'name'),
    price: get(prod, 'uzsPrice', get(prod, 'price')),
    images: Array.isArray(get(prod, 'images')) ? get(prod, 'images') : get(prod, 'productImages') || []
  }));
};

export const normalizeDetailedProduct = (product = {}) => ({
  ...product,
  name: get(product, 'nameRu') || get(product, 'nameUz') || get(product, 'nameEn') || get(product, 'name'),
  price: get(product, 'uzsPrice', get(product, 'price')),
  images: Array.isArray(get(product, 'images')) ? get(product, 'images') : get(product, 'productImages') || [],
  count: get(product, 'remainingStock', get(product, 'count'))
});
